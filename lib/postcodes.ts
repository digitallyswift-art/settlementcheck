export interface PostcodeLookup {
  postcode: string
  latitude: number
  longitude: number
  region: string | null
  admin_district: string
  country: string
}

// Format check — avoids hitting the API on obviously invalid input.
// Covers all valid UK postcode shapes: AN, ANN, AAN, AANN, ANA, AANA (outward)
// followed by NAA (inward). Case-insensitive. Spaces optional.
export function isPlausibleUkPostcode(raw: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(raw.trim())
}

// Normalise: uppercase, collapse whitespace, insert canonical space before inward code
export function normalisePostcode(raw: string): string {
  const stripped = raw.toUpperCase().replace(/\s+/g, '')
  if (stripped.length < 5) return raw.toUpperCase()
  return stripped.slice(0, stripped.length - 3) + ' ' + stripped.slice(stripped.length - 3)
}

// Fetch from postcodes.io. Returns null on 404 (invalid postcode) or network error.
export async function lookupPostcode(raw: string): Promise<PostcodeLookup | null> {
  const encoded = encodeURIComponent(raw.replace(/\s+/g, ''))
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encoded}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.status !== 200 || !data.result) return null
    const r = data.result
    return {
      postcode:      r.postcode,
      latitude:      r.latitude,
      longitude:     r.longitude,
      region:        r.region ?? null,
      admin_district: r.admin_district ?? '',
      country:       r.country ?? '',
    }
  } catch {
    return null
  }
}
