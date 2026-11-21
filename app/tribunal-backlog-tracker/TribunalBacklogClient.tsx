'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DataExportBox from '@/components/DataExportBox'
import PressCitationBox from '@/components/PressCitationBox'

export interface RegionalBacklogData {
  regionId: string
  regionName: string
  hearingCentre: string
  openSingleClaims: number
  daysToPreliminary: number
  daysToMerits: number
  typicalDefenceCostMin: number
  typicalDefenceCostMax: number
  pressureLevel: 'Critical' | 'Very High' | 'High' | 'Moderate'
  summaryNote: string
}

const REGIONAL_TRIBUNAL_DATA: RegionalBacklogData[] = [
  {
    regionId: 'london-central',
    regionName: 'London Central',
    hearingCentre: 'Victory House, Kingsway, London',
    openSingleClaims: 8420,
    daysToPreliminary: 210,
    daysToMerits: 540,
    typicalDefenceCostMin: 28000,
    typicalDefenceCostMax: 55000,
    pressureLevel: 'Critical',
    summaryNote: 'Longest wait times in Great Britain (~17.8 months to merits). High legal hourly rates (£450 to £700/hr) drive severe employer defence cost escalation.',
  },
  {
    regionId: 'london-south',
    regionName: 'London South',
    hearingCentre: 'Montague Court, Croydon',
    openSingleClaims: 6150,
    daysToPreliminary: 195,
    daysToMerits: 510,
    typicalDefenceCostMin: 25000,
    typicalDefenceCostMax: 50000,
    pressureLevel: 'Critical',
    summaryNote: 'Heavy case load covering South London, Surrey, Sussex, and Kent (~16.8 months wait time). Judicial capacity constraints cause frequent late listing shifts.',
  },
  {
    regionId: 'watford',
    regionName: 'South East (Watford)',
    hearingCentre: 'Radius House, Watford',
    openSingleClaims: 5730,
    daysToPreliminary: 185,
    daysToMerits: 490,
    typicalDefenceCostMin: 24000,
    typicalDefenceCostMax: 48000,
    pressureLevel: 'Very High',
    summaryNote: 'Covers Home Counties and Northern outer London (~16.1 months wait time). Substantial volume of commercial and technology sector redundancy disputes.',
  },
  {
    regionId: 'midlands-west',
    regionName: 'Midlands West (Birmingham)',
    hearingCentre: 'Centre City Tower, Birmingham',
    openSingleClaims: 4940,
    daysToPreliminary: 160,
    daysToMerits: 420,
    typicalDefenceCostMin: 20000,
    typicalDefenceCostMax: 42000,
    pressureLevel: 'High',
    summaryNote: 'One of the busiest provincial hearing centres (~13.8 months wait time). Significant case volume in automotive, logistics, and manufacturing redundancy.',
  },
  {
    regionId: 'bristol',
    regionName: 'South West (Bristol)',
    hearingCentre: 'Bristol Civil Justice Centre',
    openSingleClaims: 3410,
    daysToPreliminary: 150,
    daysToMerits: 395,
    typicalDefenceCostMin: 19000,
    typicalDefenceCostMax: 39000,
    pressureLevel: 'High',
    summaryNote: 'Regional hearing centre for Gloucestershire, Somerset, and wider South West (~13.0 months wait time). Moderate hearing listing flexibility.',
  },
  {
    regionId: 'manchester',
    regionName: 'North West (Manchester)',
    hearingCentre: 'Manchester Employment Tribunal, Alexandra House',
    openSingleClaims: 5210,
    daysToPreliminary: 145,
    daysToMerits: 380,
    typicalDefenceCostMin: 18000,
    typicalDefenceCostMax: 38000,
    pressureLevel: 'High',
    summaryNote: 'Hub for North West commercial claims (~12.5 months wait time). High concentration of corporate finance, media, and tech disputes.',
  },
  {
    regionId: 'leeds',
    regionName: 'North East (Leeds)',
    hearingCentre: 'City Exchange, Leeds',
    openSingleClaims: 4090,
    daysToPreliminary: 140,
    daysToMerits: 365,
    typicalDefenceCostMin: 18000,
    typicalDefenceCostMax: 36000,
    pressureLevel: 'Moderate',
    summaryNote: 'Covers Yorkshire and the Humber (~12.0 months wait time). Active listing management provides relatively predictable preliminary hearing scheduling.',
  },
  {
    regionId: 'cardiff',
    regionName: 'Wales (Cardiff)',
    hearingCentre: 'Cardiff Magistrates Court / Employment Tribunal',
    openSingleClaims: 2620,
    daysToPreliminary: 130,
    daysToMerits: 340,
    typicalDefenceCostMin: 16000,
    typicalDefenceCostMax: 34000,
    pressureLevel: 'Moderate',
    summaryNote: 'Covers all Welsh unitary authorities (~11.2 months wait time). Bilingual administration options with stable judicial hearing ratios.',
  },
  {
    regionId: 'newcastle',
    regionName: 'North East (Newcastle)',
    hearingCentre: 'Kings Court, Newcastle upon Tyne',
    openSingleClaims: 2130,
    daysToPreliminary: 125,
    daysToMerits: 330,
    typicalDefenceCostMin: 15000,
    typicalDefenceCostMax: 32000,
    pressureLevel: 'Moderate',
    summaryNote: 'Fastest listing in England (~10.8 months wait time). Lower regional backlog allows earlier case management discussions and conciliation windows.',
  },
  {
    regionId: 'scotland',
    regionName: 'Scotland (Glasgow & Edinburgh)',
    hearingCentre: 'The Eagle Building, Glasgow & George House, Edinburgh',
    openSingleClaims: 3820,
    daysToPreliminary: 115,
    daysToMerits: 310,
    typicalDefenceCostMin: 15000,
    typicalDefenceCostMax: 30000,
    pressureLevel: 'Moderate',
    summaryNote: 'Separate Scottish jurisdiction (~10.2 months wait time). Distinct procedural rules under Employment Tribunals (Scotland) Regulations with shorter lead times.',
  },
]

export default function TribunalBacklogClient() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('london-central')
  const [claimType, setClaimType] = useState<'unfair_dismissal' | 'discrimination' | 'redundancy'>('unfair_dismissal')
  const [tableSearch, setTableSearch] = useState<string>('')

  const selectedRegion = useMemo(() => {
    return REGIONAL_TRIBUNAL_DATA.find((r) => r.regionId === selectedRegionId) || REGIONAL_TRIBUNAL_DATA[0]
  }, [selectedRegionId])

  // Illustrative estimate of employer defence costs based on regional hearing wait times
  const exposureAnalysis = useMemo(() => {
    const days = selectedRegion.daysToMerits
    const months = (days / 30.4).toFixed(1)

    // Illustrative legal costs for preparing and defending a claim
    let baseMinCost = selectedRegion.typicalDefenceCostMin
    let baseMaxCost = selectedRegion.typicalDefenceCostMax

    if (claimType === 'discrimination') {
      baseMinCost = Math.round(baseMinCost * 1.35)
      baseMaxCost = Math.round(baseMaxCost * 1.5)
    } else if (claimType === 'redundancy') {
      baseMinCost = Math.round(baseMinCost * 0.85)
      baseMaxCost = Math.round(baseMaxCost * 0.9)
    }

    // Illustrative internal management and HR preparation time
    const execTimeCost = 6500

    // Total illustrative employer defence cost before any tribunal award
    const totalExposureLow = baseMinCost + execTimeCost
    const totalExposureHigh = baseMaxCost + execTimeCost

    return {
      days,
      months,
      baseMinCost,
      baseMaxCost,
      execTimeCost,
      totalExposureLow,
      totalExposureHigh,
    }
  }, [selectedRegion, claimType])

  // Filtered table rows
  const filteredTable = useMemo(() => {
    if (!tableSearch.trim()) return REGIONAL_TRIBUNAL_DATA
    const q = tableSearch.toLowerCase()
    return REGIONAL_TRIBUNAL_DATA.filter(
      (r) =>
        r.regionName.toLowerCase().includes(q) ||
        r.hearingCentre.toLowerCase().includes(q) ||
        r.pressureLevel.toLowerCase().includes(q)
    )
  }, [tableSearch])

  const totalNationalBacklog = useMemo(() => {
    return REGIONAL_TRIBUNAL_DATA.reduce((acc, curr) => acc + curr.openSingleClaims, 0)
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="bg-ink text-paper py-16 px-4 sm:px-6 lg:px-8 rounded-2xl relative overflow-hidden border border-ink/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-coral/20 text-coral border border-coral/30">
            <span>Ministry of Justice &amp; HMCTS Tribunal Statistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white tracking-tight leading-tight">
            UK Employment Tribunal Backlog &amp; Regional Wait Times
          </h1>
          <p className="text-lg text-paper/80 font-sans leading-relaxed">
            Explore open single claims and typical hearing wait times across 10 Great Britain hearing centres. See what regional delays mean for illustrative employer defence costs and your settlement agreement timeline.
          </p>

          {/* National Backlog Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-paper/10">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Tracked Single Claims</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-coral mt-1 block">{totalNationalBacklog.toLocaleString('en-GB')}</span>
              <span className="text-xs text-paper/70 mt-1 block">Across 10 main GB centres</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">London Central Wait</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 block">540 Days</span>
              <span className="text-xs text-paper/70 mt-1 block">~17.8 months to final hearing</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Illustrative Defence Cost</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 block">£15k to £55k</span>
              <span className="text-xs text-paper/70 mt-1 block">SettlementCheck estimate</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Backlog Data Source</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-paper mt-1 block">MoJ &amp; HMCTS</span>
              <span className="text-xs text-paper/70 mt-1 block">Quarterly stats (OGL v3.0)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Regional Tracker & Exposure Calculator */}
      <section className="bg-card p-6 sm:p-8 rounded-xl border border-rule space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-coral">Interactive Tool</span>
          <h2 className="text-2xl font-serif font-semibold text-ink mt-1">Regional Wait Times &amp; Employer Defence Cost Estimator</h2>
          <p className="sc-body mt-1">
            Choose your nearest Employment Tribunal hearing centre and claim type. You will see typical wait times to preliminary and final hearings, plus illustrative employer legal costs.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-paper rounded-xl border border-rule">
          <div>
            <label htmlFor="select-region" className="block text-xs font-semibold uppercase text-ink mb-2">1. Select Tribunal Region</label>
            <select
              id="select-region"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-rule bg-card text-ink font-medium focus:outline-none focus:ring-2 focus:ring-coral/50"
            >
              {REGIONAL_TRIBUNAL_DATA.map((r) => (
                <option key={r.regionId} value={r.regionId}>
                  {r.regionName} ({r.daysToMerits} days)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="select-claim" className="block text-xs font-semibold uppercase text-ink mb-2">2. Tribunal Claim Type</label>
            <select
              id="select-claim"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value as 'unfair_dismissal' | 'discrimination' | 'redundancy')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-rule bg-card text-ink font-medium focus:outline-none focus:ring-2 focus:ring-coral/50"
            >
              <option value="unfair_dismissal">Unfair Dismissal (ERA 1996 s.98)</option>
              <option value="discrimination">Discrimination / Whistleblowing (EqA 2010)</option>
              <option value="redundancy">Redundancy / Notice Pay Dispute</option>
            </select>
          </div>
        </div>

        {/* Calculated Regional Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main delay card */}
          <div className="bg-paper p-6 rounded-xl border border-rule space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted font-medium">Hearing Centre</span>
                <h3 className="text-xl font-serif font-bold text-ink">{selectedRegion.regionName}</h3>
                <p className="text-body text-muted mt-0.5">{selectedRegion.hearingCentre}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedRegion.pressureLevel === 'Critical'
                    ? 'bg-crimson/15 text-crimson border border-crimson/30'
                    : selectedRegion.pressureLevel === 'Very High'
                    ? 'bg-amber/20 text-amber border border-amber/30'
                    : 'bg-info/15 text-info border border-info/30'
                }`}
              >
                {selectedRegion.pressureLevel} Pressure
              </span>
            </div>

            <div className="space-y-3 pt-2 border-t border-rule">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Days to Preliminary Hearing:</span>
                <span className="font-mono font-semibold text-ink">{selectedRegion.daysToPreliminary} days (~{(selectedRegion.daysToPreliminary / 30.4).toFixed(1)} months)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Days to Final Hearing:</span>
                <span className="font-mono font-bold text-coral text-base">{selectedRegion.daysToMerits} days (~{exposureAnalysis.months} months)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Active Open Claims:</span>
                <span className="font-mono text-ink">{selectedRegion.openSingleClaims.toLocaleString('en-GB')} claims</span>
              </div>
            </div>

            <p className="sc-body pt-2 border-t border-rule">
              {selectedRegion.summaryNote}
            </p>
          </div>

          {/* Employer legal cost exposure card */}
          <div className="bg-paper p-6 rounded-xl border border-rule space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-coral font-medium">Illustrative Estimate</span>
              <h3 className="text-xl font-serif font-bold text-ink">Employer Defence Costs</h3>
              <p className="text-body text-muted mt-0.5">SettlementCheck illustrative market range</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-ink">
                £{exposureAnalysis.totalExposureLow.toLocaleString('en-GB')} to £{exposureAnalysis.totalExposureHigh.toLocaleString('en-GB')}
              </div>
              <p className="sc-body">
                Illustrative range covering external solicitor fees, barrister fees, and internal preparation time to defend a contested claim to a final hearing in {selectedRegion.regionName}. Actual costs vary by complexity and hearing length.
              </p>
            </div>

            <div className="p-3 bg-paper-2 rounded-lg border border-rule text-xs space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>External Solicitor &amp; Barrister Fees:</span>
                <span className="font-mono text-ink font-semibold">£{exposureAnalysis.baseMinCost.toLocaleString('en-GB')} to £{exposureAnalysis.baseMaxCost.toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span>Illustrative HR &amp; Management Time:</span>
                <span className="font-mono text-ink font-semibold">~£{exposureAnalysis.execTimeCost.toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tribunal Costs Recovery:</span>
                <span className="text-coral font-semibold">Rarely Awarded</span>
              </div>
            </div>

            <p className="text-body-sm text-muted">
              Unlike civil court claims, Employment Tribunals rarely order losing claimants to pay the employer&apos;s legal fees.
            </p>
          </div>

          {/* Commercial Context Card */}
          <div className="bg-paper p-6 rounded-xl border border-rule space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted font-medium">Commercial Context</span>
                <h3 className="text-xl font-serif font-bold text-ink">Why Delays Affect Settlement Talks</h3>
                <p className="text-body text-muted mt-0.5">General context to discuss with a solicitor</p>
              </div>

              <p className="sc-body">
                Defending a contested claim in {selectedRegion.regionName} typically involves a wait of around {exposureAnalysis.months} months and substantial unrecoverable legal fees.
              </p>
              <p className="sc-body">
                Many employers consider a settlement agreement under Section 203(3) ERA 1996 to gain certainty and limit legal spend. Every case depends on its own facts, qualifying service, and deadlines, so an independent solicitor can help you weigh your options.
              </p>
            </div>

            <div className="pt-3 border-t border-rule">
              <Link
                href="/calculator/"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg bg-ink text-white font-semibold text-xs hover:bg-ink-2 transition-colors"
              >
                Calculate my estimate →
              </Link>
            </div>
          </div>
        </div>

        {/* Mandatory Privilege & SRA Rule 5.1 Introducer Notice */}
        <div className="p-4 bg-paper-2 rounded-xl border border-rule text-body-sm text-muted">
          <strong className="text-ink">Important Information:</strong> SettlementCheck is an informational platform and introducer, not a regulated law firm. Regional wait times are based on published Ministry of Justice and HMCTS statistics. Employer defence cost figures are illustrative estimates only and do not assess the merits or value of any individual claim. <strong className="text-ink">Do not send unreviewed financial proposals directly to HR</strong>, as unreviewed correspondence can waive legal privilege or result in an offer being withdrawn. Speak with an independent SRA-regulated solicitor about your specific circumstances.
        </div>
      </section>

      {/* Full Regional Comparison Table */}
      <section className="bg-card p-6 sm:p-8 rounded-xl border border-rule space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-serif font-semibold text-ink">All Great Britain Hearing Centres Compared</h2>
            <p className="text-body-sm text-muted mt-0.5">MoJ and HMCTS open single claims and wait times, alongside SettlementCheck illustrative defence cost estimates</p>
          </div>
          <div className="w-full sm:w-64">
            <label htmlFor="search-hearing-centres" className="sr-only">Filter hearing centre</label>
            <input
              id="search-hearing-centres"
              type="text"
              placeholder="Search region or city"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-rule bg-paper focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-rule shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-2 text-ink text-xs uppercase font-semibold border-b border-rule">
              <tr>
                <th scope="col" className="py-3 px-4">Region</th>
                <th scope="col" className="py-3 px-4">Hearing Centre</th>
                <th scope="col" className="py-3 px-4">Open Claims (MoJ)</th>
                <th scope="col" className="py-3 px-4">Prelim Wait (MoJ)</th>
                <th scope="col" className="py-3 px-4">Final Hearing Wait (MoJ)</th>
                <th scope="col" className="py-3 px-4">Illustrative Defence Cost</th>
                <th scope="col" className="py-3 px-4">Pressure Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule font-sans">
              {filteredTable.map((row) => (
                <tr
                  key={row.regionId}
                  onClick={() => setSelectedRegionId(row.regionId)}
                  className={`cursor-pointer hover:bg-paper/50 transition-colors ${
                    row.regionId === selectedRegionId ? 'bg-coral/5 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-ink">
                    {row.regionName}
                    {row.regionId === selectedRegionId && (
                      <span className="ml-1.5 text-[10px] text-coral font-bold">(Selected)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted">{row.hearingCentre}</td>
                  <td className="py-3 px-4 font-mono text-ink">{row.openSingleClaims.toLocaleString('en-GB')}</td>
                  <td className="py-3 px-4 font-mono text-muted">{row.daysToPreliminary} d</td>
                  <td className="py-3 px-4 font-mono font-serif font-bold text-coral">{row.daysToMerits} d (~{(row.daysToMerits / 30.4).toFixed(1)} months)</td>
                  <td className="py-3 px-4 text-xs font-mono text-ink">£{row.typicalDefenceCostMin.toLocaleString('en-GB')} to £{row.typicalDefenceCostMax.toLocaleString('en-GB')}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.pressureLevel === 'Critical'
                          ? 'bg-crimson/15 text-crimson'
                          : row.pressureLevel === 'Very High'
                          ? 'bg-amber/20 text-amber'
                          : 'bg-info/15 text-info'
                      }`}
                    >
                      {row.pressureLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Strategic Implications for Settlement Negotiations */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">Rising Employer Defence Costs</h3>
          <p className="sc-body">
            Defending a contested tribunal claim is expensive. Depending on location and complexity, taking a multi-day case through disclosure, witness statements, and a final hearing can cost an employer tens of thousands of pounds in illustrative legal fees.
          </p>
          <p className="sc-body">
            Employment Tribunals rarely order losing claimants to pay the employer&apos;s costs, except in limited circumstances such as unreasonable conduct or no reasonable prospect of success under Rule 74 of the Employment Tribunal Procedure Rules 2024.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">Staff Turnover &amp; Fading Memories</h3>
          <p className="sc-body">
            With waits of around 17.8 months in London and 10 to 14 months elsewhere, key managers and HR staff often leave your employer before the final hearing arrives.
          </p>
          <p className="sc-body">
            Former managers are harder to coordinate as witnesses. Detailed recollection of performance reviews, grievance meetings, or redundancy scoring naturally fades over 12 to 18 months, weakening the employer&apos;s evidential position.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">Certainty &amp; Timing of Settlement</h3>
          <p className="sc-body">
            A settlement agreement provides an agreed sum now rather than waiting 12 to 18 months for an uncertain tribunal outcome. Qualifying termination payments can benefit from the £30,000 tax-free exemption under Section 403 ITEPA 2003, subject to Post-Employment Notice Pay (PENP) rules.
          </p>
          <p className="sc-body">
            Settling also avoids litigation risks, including Polkey reductions and the ordinary unfair dismissal compensatory cap (the lower of £123,543 or 52 weeks&apos; gross pay from April 2026 under Section 124(1ZA) ERA 1996, though discrimination and whistleblowing awards are uncapped). Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. Work beyond the cap or abortive fees remain subject to your solicitor&apos;s terms.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">Privacy &amp; Moving On</h3>
          <p className="sc-body">
            Waiting over a year for a hearing can prolong stress and delay your next career step. Preliminary hearings and document disclosure require ongoing time and energy.
          </p>
          <p className="sc-body">
            Tribunal judgments are published on the public GOV.UK register and indexed by search engines. Settlement agreements typically include mutual confidentiality clauses (which cannot restrict protected whistleblowing, reporting crimes to the police, regulatory disclosures, or seeking legal, medical, or tax advice) and let you negotiate an agreed reference.
          </p>
        </div>
      </section>

      {/* Legal & Acas Critical Reminders */}
      <section className="bg-paper p-6 sm:p-8 rounded-xl border border-rule space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-semibold text-ink">Essential Legal Rules &amp; Time Limits</h2>
          <p className="sc-body">
            Tribunal backlogs do not extend statutory deadlines. Employees must observe strict time limits to protect their legal position.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-card rounded-lg border border-rule space-y-2">
            <span className="font-semibold text-ink block">Strict Tribunal &amp; Acas Time Limits</span>
            <p className="sc-body">
              Private settlement talks or internal grievances do not pause statutory tribunal deadlines. For most unfair dismissal claims (Section 111(2) ERA 1996) and discrimination claims (Section 123(1) Equality Act 2010), you must start Acas Early Conciliation (Section 18A Employment Tribunals Act 1996) within 3 months less 1 day of the dismissal or act complained of. Statutory redundancy pay claims generally carry a 6-month limit (Section 164 ERA 1996). Missing a deadline will usually prevent a tribunal from hearing the claim.
            </p>
            <div className="pt-1">
              <Link
                href="/guides/settlement-agreement-time-limits/"
                className="text-body-sm font-semibold text-coral hover:underline"
              >
                Read our guide to settlement agreement time limits →
              </Link>
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-rule space-y-2">
            <span className="font-semibold text-ink block">Section 203(3) Independent Advice &amp; Fee Contributions</span>
            <p className="sc-body">
              Outside an Acas COT3 agreement, a settlement agreement is only legally binding if you receive advice from a qualified independent adviser (such as an SRA-regulated solicitor) under Section 203(3) and (3A) ERA 1996. Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. Advice beyond the agreed cap or abortive fees if you choose not to complete remain subject to your solicitor&apos;s engagement terms.
            </p>
            <div className="pt-1">
              <Link
                href="/settlement-agreement-review/"
                className="text-body-sm font-semibold text-coral hover:underline"
              >
                Connect with an independent solicitor →
              </Link>
            </div>
          </div>
        </div>

        {/* Source and OGL Attribution */}
        <div className="pt-4 border-t border-rule text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            Backlog &amp; Wait-Time Data: Ministry of Justice (MoJ) Tribunal Statistics Quarterly and HMCTS Management Information. Defence cost estimates and pressure ratings are illustrative figures prepared by SettlementCheck.
          </div>
          <div className="shrink-0">
            MoJ/HMCTS figures licensed under the{' '}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink font-semibold underline hover:text-coral"
            >
              Open Government Licence v3.0
            </a>
            .
          </div>
        </div>
      </section>

      {/* Dataset Export & Press Citation Section */}
      <section className="space-y-6">
        <DataExportBox
          title="Download MoJ Tribunal Backlog Data & Cost Estimates"
          description="Download regional wait times and open single claim counts from MoJ and HMCTS statistics, paired with SettlementCheck illustrative employer defence cost estimates across all 10 Great Britain hearing centres in CSV or JSON format."
          datasetName="moj-tribunal-backlog-2026"
          csvUrl="/data/moj-tribunal-backlog-2026.csv"
          jsonUrl="/data/moj-tribunal-backlog-2026.json"
          recordCount="10 GB Hearing Centres (46,510 Claims)"
          fileSizeEstimate={{ csv: '2.7 KB', json: '6.2 KB' }}
          lastUpdated="April 2026"
          licence="Open Government Licence v3.0 (MoJ/HMCTS figures)"
          licenceUrl="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          sourceAttribution="MoJ Tribunal Statistics Quarterly & HMCTS Management Information; illustrative defence costs by SettlementCheck"
          previewHeaders={['Hearing Centre', 'Open Claims (MoJ)', 'Prelim Wait (MoJ)', 'Final Hearing Wait (MoJ)', 'Illustrative Defence Cost', 'Pressure Rating']}
          previewRows={[
            ['London Central (Victory House)', '8,420', '210 days (~6.9 months)', '540 days (~17.8 months)', '£28k to £55k', 'Critical'],
            ['London South (Croydon)', '6,150', '195 days (~6.4 months)', '510 days (~16.8 months)', '£25k to £50k', 'Critical'],
            ['South East (Watford)', '5,730', '185 days (~6.1 months)', '490 days (~16.1 months)', '£24k to £48k', 'Very High'],
            ['Midlands West (Birmingham)', '4,940', '160 days (~5.3 months)', '420 days (~13.8 months)', '£20k to £42k', 'High'],
            ['North West (Manchester)', '5,210', '145 days (~4.8 months)', '380 days (~12.5 months)', '£18k to £38k', 'High'],
          ]}
        />

        <PressCitationBox
          title="UK Employment Tribunal Backlog Tracker & Regional Wait Times (2026)"
          url="https://settlementcheck.co.uk/tribunal-backlog-tracker/"
          datasetName="mojtribunalbacklog2026"
          author="SettlementCheck Research Desk"
          sourceAgency="Ministry of Justice Tribunal Statistics & HMCTS"
          license="Open Government Licence v3.0"
          year="2026"
        />
      </section>

      {/* Embedded Calculator Card */}
      <section className="pt-4">
        <EmbeddedCalculatorCard
          badge="Statutory Baseline Check"
          title="Compare Tribunal Wait Times Against Your Statutory Baseline"
          subtitle="Estimate your statutory redundancy baseline, notice pay, and illustrative settlement range under April 2026 UK rates."
          initialSalary={52000}
          initialYears={4}
          initialAge={40}
          ctaText="Check my offer now →"
        />
      </section>

      {/* Internal Cross-Linking Navigation */}
      <section className="bg-paper p-6 rounded-xl border border-rule space-y-4">
        <h3 className="text-base font-serif font-semibold text-ink">Related Employment Law Tools &amp; Data Guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Link
            href="/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Settlement Agreement Calculator</span>
            <span className="text-xs text-muted">Check your exit offer against April 2026 statutory rates</span>
          </Link>
          <Link
            href="/redundancy-calculator/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Redundancy Pay Calculator</span>
            <span className="text-xs text-muted">Calculate statutory redundancy under the £751/wk cap</span>
          </Link>
          <Link
            href="/unfair-dismissal-calculator/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Unfair Dismissal Calculator</span>
            <span className="text-xs text-muted">Calculate compensatory and basic awards</span>
          </Link>
          <Link
            href="/statutory-rates-history/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Statutory Rates History</span>
            <span className="text-xs text-muted">2000 to 2026 redundancy and unfair dismissal caps</span>
          </Link>
          <Link
            href="/guides/settlement-agreement-vs-tribunal-claim/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Settlement vs Tribunal</span>
            <span className="text-xs text-muted">Cost, risk, and timeline comparison guide</span>
          </Link>
          <Link
            href="/guides/how-to-negotiate-a-settlement-agreement/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Negotiation Guide</span>
            <span className="text-xs text-muted">Practical points to prepare before speaking with a solicitor</span>
          </Link>
          <Link
            href="/guides/employment-tribunal-average-awards-uk/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Average Tribunal Awards UK</span>
            <span className="text-xs text-muted">Official MoJ median awards and 2026 Vento bands</span>
          </Link>
          <Link
            href="/guides/acas-early-conciliation-timeline/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Acas Early Conciliation Timeline</span>
            <span className="text-xs text-muted">How s.18A pauses the 3-month tribunal limitation clock</span>
          </Link>
          <Link
            href="/reports/uk-settlement-index-2026/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">UK Settlement Index 2026</span>
            <span className="text-xs text-muted">8-sector settlement multiples and statutory benchmarks</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
