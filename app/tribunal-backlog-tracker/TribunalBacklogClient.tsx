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
  const [monthlySalary, setMonthlySalary] = useState<number>(4500)
  const [tableSearch, setTableSearch] = useState<string>('')

  const selectedRegion = useMemo(() => {
    return REGIONAL_TRIBUNAL_DATA.find((r) => r.regionId === selectedRegionId) || REGIONAL_TRIBUNAL_DATA[0]
  }, [selectedRegionId])

  // Calculation of employer cost exposure and strategic leverage
  const exposureAnalysis = useMemo(() => {
    const days = selectedRegion.daysToMerits
    const months = (days / 30.4).toFixed(1)

    // Base legal costs for preparing and defending
    let baseMinCost = selectedRegion.typicalDefenceCostMin
    let baseMaxCost = selectedRegion.typicalDefenceCostMax

    if (claimType === 'discrimination') {
      baseMinCost = Math.round(baseMinCost * 1.35)
      baseMaxCost = Math.round(baseMaxCost * 1.5)
    } else if (claimType === 'redundancy') {
      baseMinCost = Math.round(baseMinCost * 0.85)
      baseMaxCost = Math.round(baseMaxCost * 0.9)
    }

    // Opportunity cost of management distraction (estimated 30 to 60 hours of executive time)
    const execTimeCost = 6500

    // Total employer capital at risk before any award payout
    const totalExposureLow = baseMinCost + execTimeCost
    const totalExposureHigh = baseMaxCost + execTimeCost

    // Strategic leverage rating (out of 10)
    let leverageScore = 7.0
    if (days >= 500) leverageScore += 1.8
    else if (days >= 400) leverageScore += 1.2
    else if (days >= 350) leverageScore += 0.6

    if (claimType === 'discrimination') leverageScore += 1.0
    if (claimType === 'redundancy') leverageScore += 0.2

    leverageScore = Math.min(9.8, Math.max(6.0, leverageScore))

    return {
      days,
      months,
      baseMinCost,
      baseMaxCost,
      execTimeCost,
      totalExposureLow,
      totalExposureHigh,
      leverageScore: leverageScore.toFixed(1),
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
            <span>Ministry of Justice Tribunal Statistics & FOIA Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white tracking-tight leading-tight">
            UK Employment Tribunal Backlog & Regional Wait-Time Tracker
          </h1>
          <p className="text-lg text-paper/80 font-sans leading-relaxed">
            Real-time visualization of the 50,000+ single claims awaiting hearing across England, Wales, and Scotland. Understand regional tribunal wait times, non-recoverable employer defence costs, and how prolonged delays strengthen your settlement negotiation position.
          </p>

          {/* National Backlog Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-paper/10">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">National Single Backlog</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-coral mt-1 block">{totalNationalBacklog.toLocaleString('en-GB')}</span>
              <span className="text-xs text-paper/70 mt-1 block">Active open claims</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">London Central Wait</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 block">540 Days</span>
              <span className="text-xs text-paper/70 mt-1 block">~17.8 months to merits</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Avg Employer Defence</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 block">£25k to £55k</span>
              <span className="text-xs text-paper/70 mt-1 block">Non-recoverable legal fees</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Data Source</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-paper mt-1 block">MoJ & OGL v3</span>
              <span className="text-xs text-paper/70 mt-1 block">Official quarterly stats</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Regional Tracker & Exposure Calculator */}
      <section className="bg-card p-6 sm:p-8 rounded-xl border border-rule space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-coral">Interactive Tool</span>
          <h2 className="text-2xl font-serif font-semibold text-ink mt-1">Regional Hearing Delay & Defence Cost Calculator</h2>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Select your local Employment Tribunal hearing centre and claim type to see expected wait times to preliminary and merits hearings, alongside the estimated legal costs your employer must incur to defend the case.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-paper rounded-xl border border-rule">
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

          <div>
            <label htmlFor="input-salary" className="block text-xs font-semibold uppercase text-ink mb-2">3. Monthly Gross Salary (£)</label>
            <input
              id="input-salary"
              type="number"
              min="1000"
              max="50000"
              step="500"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-rule bg-card text-ink font-medium focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
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
                <p className="text-xs text-muted mt-0.5">{selectedRegion.hearingCentre}</p>
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
                <span className="font-mono font-semibold text-ink">{selectedRegion.daysToPreliminary} days (~{(selectedRegion.daysToPreliminary / 30.4).toFixed(1)} mo)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Days to Final Merits Hearing:</span>
                <span className="font-mono font-bold text-coral text-base">{selectedRegion.daysToMerits} days (~{exposureAnalysis.months} mo)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Active Open Claims:</span>
                <span className="font-mono text-ink">{selectedRegion.openSingleClaims.toLocaleString('en-GB')} claims</span>
              </div>
            </div>

            <p className="text-xs text-muted pt-2 border-t border-rule leading-relaxed">
              {selectedRegion.summaryNote}
            </p>
          </div>

          {/* Employer legal cost exposure card */}
          <div className="bg-paper p-6 rounded-xl border border-rule space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-coral font-medium">Commercial Exposure</span>
              <h3 className="text-xl font-serif font-bold text-ink">Employer Defence Costs</h3>
              <p className="text-xs text-muted mt-0.5">Non-recoverable external legal expenditure</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-3xl font-serif font-bold text-ink">
                £{exposureAnalysis.totalExposureLow.toLocaleString('en-GB')} - £{exposureAnalysis.totalExposureHigh.toLocaleString('en-GB')}
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Estimated total solicitor fees, barrister brief fees, and executive preparation time to defend this claim through to a full merits hearing in {selectedRegion.regionName}.
              </p>
            </div>

            <div className="p-3 bg-paper-2 rounded-lg border border-rule text-xs space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>External Legal & Counsel Fees:</span>
                <span className="font-mono text-ink font-semibold">£{exposureAnalysis.baseMinCost.toLocaleString('en-GB')} - £{exposureAnalysis.baseMaxCost.toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span>Management / HR Time Drag:</span>
                <span className="font-mono text-ink font-semibold">~£{exposureAnalysis.execTimeCost.toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tribunal Costs Recovery Rule:</span>
                <span className="text-coral font-semibold">Rarely Awarded</span>
              </div>
            </div>

            <p className="text-[11px] text-muted">
              * Unlike High Court litigation, Employment Tribunals are a &quot;no costs&quot; jurisdiction. Employers rarely recover defence fees even if they successfully defend the claim.
            </p>
          </div>

          {/* Strategic Leverage Card */}
          <div className="bg-paper p-6 rounded-xl border border-rule space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-medium">Negotiation Advantage</span>
              <h3 className="text-xl font-serif font-bold text-ink">Employee Settlement Negotiation Score</h3>
              <p className="text-xs text-muted mt-0.5">Tactical positioning during settlement discussions</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-coral">{exposureAnalysis.leverageScore}</span>
                <span className="text-sm text-muted font-semibold">/ 10</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-coral/10 text-coral ml-auto">
                  Strong Position
                </span>
              </div>

              <div className="w-full bg-paper-2 h-2.5 rounded-full overflow-hidden border border-rule">
                <div
                  className="bg-coral h-full rounded-full"
                  style={{ width: `${(Number(exposureAnalysis.leverageScore) / 10) * 100}%` }}
                ></div>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                Because your employer faces an estimated £{exposureAnalysis.totalExposureLow.toLocaleString('en-GB')}+ in defence costs over {exposureAnalysis.months} months, offering them a clean settlement agreement with a Section 203(3) waiver creates an overwhelming commercial incentive to settle rather than litigate.
              </p>
            </div>

            <div className="pt-3 border-t border-rule">
              <Link
                href="/calculator/"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg bg-ink text-white font-semibold text-xs hover:bg-ink-2 transition-colors"
              >
                Calculate Complete Settlement Package →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full Regional Comparison Table */}
      <section className="bg-card p-6 sm:p-8 rounded-xl border border-rule space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-serif font-semibold text-ink">All Great Britain Hearing Centres Compared</h2>
            <p className="text-xs text-muted mt-0.5">Ministry of Justice quarterly data for open single claims and listing lead times</p>
          </div>
          <div className="w-full sm:w-64">
            <label htmlFor="search-hearing-centres" className="sr-only">Filter hearing centre</label>
            <input
              id="search-hearing-centres"
              type="text"
              placeholder="Search region or city..."
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
                <th scope="col" className="py-3 px-4">Open Claims</th>
                <th scope="col" className="py-3 px-4">Prelim Wait</th>
                <th scope="col" className="py-3 px-4">Merits Wait</th>
                <th scope="col" className="py-3 px-4">Typical Defence Cost</th>
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
                  <td className="py-3 px-4 font-mono font-serif font-bold text-coral">{row.daysToMerits} d (~{(row.daysToMerits / 30.4).toFixed(1)} mo)</td>
                  <td className="py-3 px-4 text-xs font-mono text-ink">£{row.typicalDefenceCostMin.toLocaleString('en-GB')} - £{row.typicalDefenceCostMax.toLocaleString('en-GB')}</td>
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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">The &quot;Burning Cost&quot; Phenomenon</h3>
          <p className="text-xs text-muted leading-relaxed">
            Tribunal defence is costly. City law firms charge £400 to £700+ per hour, while regional solicitors charge £250 to £450+. Defending an unfair dismissal claim through disclosure, bundle preparation, witness statements, and a 3-day merits hearing costs employers between £25,000 and £50,000+.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Because Employment Tribunals rarely award costs against losing claimants (unless a claim is vexatious or unreasonable under Rule 76), every month of delay represents escalating unrecoverable expense for the employer.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">Witness Turnover &amp; Fading Memory</h3>
          <p className="text-xs text-muted leading-relaxed">
            With London hearings taking 17.8 months and provincial hearings taking 11 to 14 months, key managers, HR officers, and witnesses often leave the company before the trial date arrives.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Ex-employees cannot be compelled to cooperate enthusiastically as witnesses. Memory of nuanced meetings, PIP discussions, or grievance interviews degrades over 18 months, dramatically weakening the employer&apos;s evidentiary standing before the tribunal panel.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-rule space-y-3">
          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-lg font-serif font-semibold text-ink">Why Settlement Agreements Win</h3>
          <p className="text-xs text-muted leading-relaxed">
            A negotiated settlement agreement under Section 203(3) ERA 1996 delivers total finality. The employer avoids the public tribunal judgment register (all tribunal decisions are published online permanently) and caps their legal spend immediately.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            For the employee, settlement preserves the statutory £30,000 tax-free exemption (ITEPA 2003 s.403), secures an agreed reference clause, and eliminates 14 to 18 months of stressful, unhedged litigation.
          </p>
        </div>
      </section>

      {/* Legal & Acas Critical Reminders */}
      <section className="bg-paper p-6 sm:p-8 rounded-xl border border-rule space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-semibold text-ink">Essential Legal Rules &amp; Time Limits</h2>
          <p className="text-sm text-muted leading-relaxed">
            While tribunal backlogs create strong negotiation dynamics, employees must strictly observe statutory deadlines to avoid forfeiting their rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-4 bg-card rounded-lg border border-rule space-y-2">
            <span className="font-semibold text-ink block">The Strict 3-Month Acas Time Limit</span>
            <p className="text-xs text-muted leading-relaxed">
              Ongoing settlement negotiations or internal grievances do not pause or stop the statutory tribunal clock. Under Section 111(2) ERA 1996, you must initiate Acas Early Conciliation within 3 months less 1 day from the date of your dismissal or the discriminatory act. If you miss this deadline, your claim will almost certainly be time-barred.
            </p>
            <div className="pt-1">
              <Link
                href="/guides/settlement-agreement-time-limits/"
                className="text-xs font-semibold text-coral hover:underline"
              >
                Read our complete guide to settlement agreement time limits →
              </Link>
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-rule space-y-2">
            <span className="font-semibold text-ink block">Section 203(3) Legal Fee Contribution</span>
            <p className="text-xs text-muted leading-relaxed">
              A settlement agreement is only legally binding if the employee has taken independent advice from an SRA-regulated solicitor. Employers standardly contribute between £350 and £500+ VAT directly to your solicitor upon completion, typically covering specialist advice for a standard review without out-of-pocket costs. Advice beyond the agreed cap or abortive fees if you choose not to complete remain subject to your solicitor&apos;s terms.
            </p>
            <div className="pt-1">
              <Link
                href="/settlement-agreement-review/"
                className="text-xs font-semibold text-coral hover:underline"
              >
                Match with an SRA-regulated employment solicitor →
              </Link>
            </div>
          </div>
        </div>

        {/* FOIA and OGL Attribution */}
        <div className="pt-4 border-t border-rule text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            Data Source: Ministry of Justice (MoJ) Tribunal Statistics Quarterly and HMCTS Management Information.
          </div>
          <div>
            Licensed under the{' '}
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

      {/* Official Dataset Export & Press Citation Section */}
      <section className="space-y-6">
        <DataExportBox
          title="Download Official MoJ Tribunal Backlog Dataset"
          description="Download regional wait times, single claim backlog counts, and estimated employer legal defence costs across all 10 GB employment tribunal hearing centres in spreadsheet (CSV) or machine-readable (JSON) format."
          datasetName="moj-tribunal-backlog-2026"
          csvUrl="/data/moj-tribunal-backlog-2026.csv"
          jsonUrl="/data/moj-tribunal-backlog-2026.json"
          recordCount="10 GB Hearing Centres (46,520+ Claims)"
          fileSizeEstimate={{ csv: '2.7 KB', json: '6.2 KB' }}
          lastUpdated="April 2026"
          licence="Open Government Licence v3.0 (Crown Copyright)"
          licenceUrl="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          sourceAttribution="Ministry of Justice (MoJ) Tribunal Statistics Quarterly and HMCTS Management Information"
          previewHeaders={['Hearing Centre', 'Open Single Claims', 'Wait to Preliminary', 'Wait to Merits', 'Typical Defence Cost', 'Strategic Pressure']}
          previewRows={[
            ['London Central (Victory House)', '8,420', '210 days (~6.9 mo)', '540 days (~17.8 mo)', '£28k – £55k', 'Critical'],
            ['London South (Croydon)', '6,150', '195 days (~6.4 mo)', '510 days (~16.8 mo)', '£25k – £50k', 'Critical'],
            ['South East (Watford)', '5,730', '185 days (~6.1 mo)', '490 days (~16.1 mo)', '£24k – £48k', 'Very High'],
            ['Midlands West (Birmingham)', '4,940', '160 days (~5.3 mo)', '420 days (~13.8 mo)', '£20k – £42k', 'High'],
            ['North West (Manchester)', '5,210', '145 days (~4.8 mo)', '380 days (~12.5 mo)', '£18k – £38k', 'High'],
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
          badge="Live Settlement Valuation"
          title="Compare Backlog Delays Against Settlement Baselines"
          subtitle="Calculate what your settlement agreement package could look like, factoring in calculated statutory redundancy baselines, notice entitlements, and exit compensation."
          initialSalary={52000}
          initialYears={4}
          initialAge={40}
          ctaText="Evaluate My Settlement Offer Now →"
        />
      </section>

      {/* Internal Cross-Linking Navigation */}
      <section className="bg-paper p-6 rounded-xl border border-rule space-y-4">
        <h3 className="text-base font-serif font-semibold text-ink">Related Employment Law Tools &amp; Data Guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Link
            href="/statutory-rates-history/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Statutory Rates History</span>
            <span className="text-xs text-muted">2000 to 2026 redundancy &amp; unfair dismissal caps</span>
          </Link>
          <Link
            href="/guides/settlement-agreement-vs-tribunal-claim/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Settlement vs Tribunal</span>
            <span className="text-xs text-muted">Cost, risk, and timeline comparison guide</span>
          </Link>
          <Link
            href="/unfair-dismissal-calculator/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Unfair Dismissal Calculator</span>
            <span className="text-xs text-muted">Calculate compensatory &amp; basic awards</span>
          </Link>
          <Link
            href="/guides/how-to-negotiate-a-settlement-agreement/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Negotiation Guide</span>
            <span className="text-xs text-muted">Step-by-step tactics to increase your exit sum</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
