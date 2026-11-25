import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isPlausibleUkPostcode, lookupPostcode } from '@/lib/postcodes'
import { calculateDistanceMiles, extractOutwardCode } from '@/lib/agentic-engine/tools/territorial-tools'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'

export const dynamic = 'force-dynamic'

const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const DEMAND_RADIUS_MILES = 25
const DEMAND_WINDOW_DAYS = 30
const K_ANONYMITY_THRESHOLD = 3

interface LeadCoordRow {
  postcode_lat: number | string | null
  postcode_lng: number | string | null
}

interface PanelFirmRow {
  office_lat: number | string | null
  office_lng: number | string | null
  coverage_radius_miles: number | null
  exclusive_outward_codes: string[] | null
}

export async function GET(req: NextRequest) {
  try {
    // ── 1. Sliding-window IP Rate Limiter ──────────────────────────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'solicitor-demand',
      limit: RATE_LIMIT,
      windowMs: RATE_WINDOW_MS,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many postcode checks. Please try again shortly.' },
        {
          status: 429,
          headers: getRateLimitHeaders(RATE_LIMIT, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    // ── 2. Validate & Geocode UK Postcode via postcodes.io ─────────────────
    const rawPostcode = (req.nextUrl.searchParams.get('postcode') || '').trim()
    if (!rawPostcode || !isPlausibleUkPostcode(rawPostcode)) {
      return NextResponse.json(
        { error: 'Please enter a valid UK postcode format (e.g. SW1A 1AA or M1 1AE).' },
        { status: 400 }
      )
    }

    const geo = await lookupPostcode(rawPostcode)
    if (!geo) {
      return NextResponse.json(
        { error: 'Postcode not found. Please check the postcode and try again.' },
        { status: 404 }
      )
    }

    // ── 3. Query Consented Leads (last 30 days, coordinates only) ──────────
    const cutoffIso = new Date(
      Date.now() - DEMAND_WINDOW_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    const { data: leadRows, error: leadsError } = await supabase
      .from('leads')
      .select('postcode_lat, postcode_lng')
      .eq('consent', true)
      .gte('created_at', cutoffIso)
      .not('postcode_lat', 'is', null)
      .not('postcode_lng', 'is', null)

    if (leadsError) {
      console.error('solicitor-demand leads query error:', JSON.stringify(leadsError))
    }

    let nearbyLeadCount = 0
    if (Array.isArray(leadRows)) {
      for (const row of leadRows as LeadCoordRow[]) {
        const lat = Number(row.postcode_lat)
        const lng = Number(row.postcode_lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
        if (calculateDistanceMiles(geo.latitude, geo.longitude, lat, lng) <= DEMAND_RADIUS_MILES) {
          nearbyLeadCount += 1
        }
      }
    }

    // ── 4. Query Active Solicitor Panel Coverage ───────────────────────────
    const { data: panelRows, error: panelError } = await supabase
      .from('solicitor_panel')
      .select('office_lat, office_lng, coverage_radius_miles, exclusive_outward_codes')
      .eq('status', 'active')

    if (panelError) {
      console.error('solicitor-demand panel query error:', JSON.stringify(panelError))
    }

    const outwardCode = extractOutwardCode(geo.postcode)
    let activePanelCoverageCount = 0

    if (Array.isArray(panelRows)) {
      for (const firm of panelRows as PanelFirmRow[]) {
        const outwardCodes = Array.isArray(firm.exclusive_outward_codes)
          ? firm.exclusive_outward_codes
          : []

        if (outwardCodes.includes(outwardCode)) {
          activePanelCoverageCount += 1
          continue
        }

        const firmLat = Number(firm.office_lat)
        const firmLng = Number(firm.office_lng)
        if (Number.isFinite(firmLat) && Number.isFinite(firmLng)) {
          const radius = firm.coverage_radius_miles ?? DEMAND_RADIUS_MILES
          if (calculateDistanceMiles(geo.latitude, geo.longitude, firmLat, firmLng) <= radius) {
            activePanelCoverageCount += 1
          }
        }
      }
    }

    const territoryAvailable = activePanelCoverageCount === 0
    const statusMessage = territoryAvailable
      ? 'Territory open for exclusive allocation'
      : 'Regional panel active: applications open for specialist capacity'

    // ── 5. Strict k-Anonymity & Zero-PII Response ──────────────────────────
    // Only surface activeDemandCount when >= 3 to prevent small-area re-identification.
    // Never return avgOfferBand or individual lead attributes on an unauthenticated endpoint.
    return NextResponse.json(
      {
        postcode: geo.postcode,
        admin_district: geo.admin_district,
        region: geo.region,
        latitude: geo.latitude,
        longitude: geo.longitude,
        radiusMiles: DEMAND_RADIUS_MILES,
        territoryAvailable,
        statusMessage,
        ...(nearbyLeadCount >= K_ANONYMITY_THRESHOLD
          ? { activeDemandCount: nearbyLeadCount }
          : {}),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (err) {
    console.error('solicitor-demand error:', err)
    return NextResponse.json(
      { error: 'Unable to check postcode availability right now.' },
      { status: 500 }
    )
  }
}
