'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DataExportBox from '@/components/DataExportBox'
import PressCitationBox from '@/components/PressCitationBox'

export interface HistoricalRateRow {
  year: string
  effectiveDate: string
  weeklyCap: number
  maxBasicAward: number
  compensatoryCap: number
  statutoryInstrument: string
  cpiThresholdEquivalent: number
}

export interface VentoHistoricalRow {
  period: string
  guidance: string
  lowerBand: string
  middleBand: string
  upperBand: string
  exceptional: string
}

const HISTORICAL_DATA: HistoricalRateRow[] = [
  { year: '2026/27', effectiveDate: '6 April 2026', weeklyCap: 751, maxBasicAward: 22530, compensatoryCap: 123543, statutoryInstrument: 'SI 2026/310', cpiThresholdEquivalent: 92450 },
  { year: '2025/26', effectiveDate: '6 April 2025', weeklyCap: 719, maxBasicAward: 21570, compensatoryCap: 118223, statutoryInstrument: 'SI 2025/209', cpiThresholdEquivalent: 89800 },
  { year: '2024/25', effectiveDate: '6 April 2024', weeklyCap: 700, maxBasicAward: 21000, compensatoryCap: 115115, statutoryInstrument: 'SI 2024/252', cpiThresholdEquivalent: 87200 },
  { year: '2023/24', effectiveDate: '6 April 2023', weeklyCap: 643, maxBasicAward: 19290, compensatoryCap: 105707, statutoryInstrument: 'SI 2023/317', cpiThresholdEquivalent: 84600 },
  { year: '2022/23', effectiveDate: '6 April 2022', weeklyCap: 571, maxBasicAward: 17130, compensatoryCap: 93878, statutoryInstrument: 'SI 2022/182', cpiThresholdEquivalent: 76800 },
  { year: '2021/22', effectiveDate: '6 April 2021', weeklyCap: 544, maxBasicAward: 16320, compensatoryCap: 89493, statutoryInstrument: 'SI 2021/284', cpiThresholdEquivalent: 71200 },
  { year: '2020/21', effectiveDate: '6 April 2020', weeklyCap: 538, maxBasicAward: 16140, compensatoryCap: 88519, statutoryInstrument: 'SI 2020/205', cpiThresholdEquivalent: 70100 },
  { year: '2019/20', effectiveDate: '6 April 2019', weeklyCap: 525, maxBasicAward: 15750, compensatoryCap: 86444, statutoryInstrument: 'SI 2019/469', cpiThresholdEquivalent: 69100 },
  { year: '2018/19', effectiveDate: '6 April 2018', weeklyCap: 508, maxBasicAward: 15240, compensatoryCap: 83682, statutoryInstrument: 'SI 2018/252', cpiThresholdEquivalent: 67600 },
  { year: '2017/18', effectiveDate: '6 April 2017', weeklyCap: 489, maxBasicAward: 14670, compensatoryCap: 80541, statutoryInstrument: 'SI 2017/175', cpiThresholdEquivalent: 66000 },
  { year: '2016/17', effectiveDate: '6 April 2016', weeklyCap: 479, maxBasicAward: 14370, compensatoryCap: 78962, statutoryInstrument: 'SI 2016/288', cpiThresholdEquivalent: 64200 },
  { year: '2015/16', effectiveDate: '6 April 2015', weeklyCap: 475, maxBasicAward: 14250, compensatoryCap: 78335, statutoryInstrument: 'SI 2015/226', cpiThresholdEquivalent: 63800 },
  { year: '2014/15', effectiveDate: '6 April 2014', weeklyCap: 464, maxBasicAward: 13920, compensatoryCap: 76574, statutoryInstrument: 'SI 2014/382', cpiThresholdEquivalent: 63600 },
  { year: '2013/14', effectiveDate: '6 April 2013', weeklyCap: 450, maxBasicAward: 13500, compensatoryCap: 74200, statutoryInstrument: 'SI 2013/534', cpiThresholdEquivalent: 62100 },
  { year: '2012/13', effectiveDate: '6 April 2012', weeklyCap: 430, maxBasicAward: 12900, compensatoryCap: 72300, statutoryInstrument: 'SI 2012/388', cpiThresholdEquivalent: 60500 },
  { year: '2011/12', effectiveDate: '6 April 2011', weeklyCap: 400, maxBasicAward: 12000, compensatoryCap: 68400, statutoryInstrument: 'SI 2011/173', cpiThresholdEquivalent: 58800 },
  { year: '2010/11', effectiveDate: '6 April 2010', weeklyCap: 380, maxBasicAward: 11400, compensatoryCap: 65300, statutoryInstrument: 'SI 2009/2774', cpiThresholdEquivalent: 56300 },
  { year: '2009/10', effectiveDate: '6 April 2009', weeklyCap: 380, maxBasicAward: 11400, compensatoryCap: 66200, statutoryInstrument: 'SI 2008/3055', cpiThresholdEquivalent: 54400 },
  { year: '2008/09', effectiveDate: '6 April 2008', weeklyCap: 330, maxBasicAward: 9900, compensatoryCap: 63000, statutoryInstrument: 'SI 2007/3270', cpiThresholdEquivalent: 53100 },
  { year: '2007/08', effectiveDate: '6 April 2007', weeklyCap: 310, maxBasicAward: 9300, compensatoryCap: 61400, statutoryInstrument: 'SI 2006/3045', cpiThresholdEquivalent: 51200 },
  { year: '2006/07', effectiveDate: '6 April 2006', weeklyCap: 290, maxBasicAward: 8700, compensatoryCap: 58400, statutoryInstrument: 'SI 2005/3295', cpiThresholdEquivalent: 49900 },
  { year: '2005/06', effectiveDate: '6 April 2005', weeklyCap: 280, maxBasicAward: 8400, compensatoryCap: 56800, statutoryInstrument: 'SI 2004/3052', cpiThresholdEquivalent: 48600 },
  { year: '2004/05', effectiveDate: '6 April 2004', weeklyCap: 270, maxBasicAward: 8100, compensatoryCap: 55000, statutoryInstrument: 'SI 2003/3038', cpiThresholdEquivalent: 47600 },
  { year: '2003/04', effectiveDate: '6 April 2003', weeklyCap: 260, maxBasicAward: 7800, compensatoryCap: 53500, statutoryInstrument: 'SI 2002/2927', cpiThresholdEquivalent: 46900 },
  { year: '2002/03', effectiveDate: '6 April 2002', weeklyCap: 250, maxBasicAward: 7500, compensatoryCap: 52600, statutoryInstrument: 'SI 2001/3801', cpiThresholdEquivalent: 46200 },
  { year: '2001/02', effectiveDate: '6 April 2001', weeklyCap: 240, maxBasicAward: 7200, compensatoryCap: 51700, statutoryInstrument: 'SI 2000/3117', cpiThresholdEquivalent: 45600 },
  { year: '2000/01', effectiveDate: '6 April 2000', weeklyCap: 230, maxBasicAward: 6900, compensatoryCap: 50000, statutoryInstrument: 'SI 1999/3375', cpiThresholdEquivalent: 45000 },
]

const VENTO_HISTORY: VentoHistoricalRow[] = [
  { period: 'From 6 April 2026', guidance: 'Presidential Guidance 9th Addendum', lowerBand: '£1,300 to £12,600', middleBand: '£12,600 to £37,700', upperBand: '£37,700 to £62,900', exceptional: 'Over £62,900' },
  { period: '2025/26', guidance: 'Presidential Guidance 8th Addendum', lowerBand: '£1,200 to £12,000', middleBand: '£12,000 to £36,000', upperBand: '£36,000 to £60,000', exceptional: 'Over £60,000' },
  { period: '2024/25', guidance: 'Presidential Guidance 7th Addendum', lowerBand: '£1,170 to £11,700', middleBand: '£11,700 to £35,200', upperBand: '£35,200 to £58,700', exceptional: 'Over £58,700' },
  { period: '2023/24', guidance: 'Presidential Guidance 6th Addendum', lowerBand: '£1,100 to £11,200', middleBand: '£11,200 to £33,700', upperBand: '£33,700 to £56,200', exceptional: 'Over £56,200' },
  { period: '2022/23', guidance: 'Presidential Guidance 5th Addendum', lowerBand: '£990 to £9,900', middleBand: '£9,900 to £29,600', upperBand: '£29,600 to £49,300', exceptional: 'Over £49,300' },
  { period: '2021/22', guidance: 'Presidential Guidance 4th Addendum', lowerBand: '£900 to £9,100', middleBand: '£9,100 to £27,400', upperBand: '£27,400 to £45,600', exceptional: 'Over £45,600' },
  { period: '2020/21', guidance: 'Presidential Guidance 3rd Addendum', lowerBand: '£900 to £9,000', middleBand: '£9,000 to £27,000', upperBand: '£27,000 to £45,000', exceptional: 'Over £45,000' },
  { period: '2019/20', guidance: 'Presidential Guidance 2nd Addendum', lowerBand: '£900 to £8,800', middleBand: '£8,800 to £26,300', upperBand: '£26,300 to £43,800', exceptional: 'Over £43,800' },
  { period: '2018/19', guidance: 'Presidential Guidance 1st Addendum', lowerBand: '£900 to £8,600', middleBand: '£8,600 to £25,700', upperBand: '£25,700 to £42,900', exceptional: 'Over £42,900' },
  { period: '2017/18', guidance: 'First Presidential Guidance', lowerBand: '£800 to £8,400', middleBand: '£8,400 to £25,200', upperBand: '£25,200 to £42,000', exceptional: 'Over £42,000' },
  { period: '2009 to 2017', guidance: 'Da\'Bell v NSPCC [2009]', lowerBand: '£500 to £6,000', middleBand: '£6,000 to £18,000', upperBand: '£18,000 to £30,000', exceptional: 'Over £30,000' },
  { period: '2002 to 2009', guidance: 'Vento v Chief Constable [2002]', lowerBand: '£500 to £5,000', middleBand: '£5,000 to £15,000', upperBand: '£15,000 to £25,000', exceptional: 'Over £25,000' },
]

export default function StatutoryRatesHistoryClient() {
  const [activeTab, setActiveTab] = useState<'table' | 'compare' | 'vento' | 'inflation'>('table')
  const [searchFilter, setSearchFilter] = useState('')
  const [compareYearA, setCompareYearA] = useState('2026/27')
  const [compareYearB, setCompareYearB] = useState('2000/01')
  const [selectedExemptionYear, setSelectedExemptionYear] = useState('2026/27')

  // Filtered rows for table
  const filteredRows = useMemo(() => {
    if (!searchFilter.trim()) return HISTORICAL_DATA
    const query = searchFilter.toLowerCase()
    return HISTORICAL_DATA.filter(
      (r) =>
        r.year.toLowerCase().includes(query) ||
        r.statutoryInstrument.toLowerCase().includes(query) ||
        r.effectiveDate.toLowerCase().includes(query)
    )
  }, [searchFilter])

  // Comparison metrics
  const rowA = useMemo(() => HISTORICAL_DATA.find((r) => r.year === compareYearA) || HISTORICAL_DATA[0], [compareYearA])
  const rowB = useMemo(() => HISTORICAL_DATA.find((r) => r.year === compareYearB) || HISTORICAL_DATA[HISTORICAL_DATA.length - 1], [compareYearB])

  const weeklyDiff = rowA.weeklyCap - rowB.weeklyCap
  const weeklyPct = Math.round((weeklyDiff / rowB.weeklyCap) * 100)
  const compDiff = rowA.compensatoryCap - rowB.compensatoryCap
  const compPct = Math.round((compDiff / rowB.compensatoryCap) * 100)
  const basicDiff = rowA.maxBasicAward - rowB.maxBasicAward
  const basicPct = Math.round((basicDiff / rowB.maxBasicAward) * 100)

  // Download CSV helper
  const handleDownloadCsv = () => {
    const headers = ['Tax Year', 'Effective Date', 'Weekly Cap (£)', 'Max Basic Award (£)', 'Unfair Dismissal Cap (£)', 'Statutory Instrument', 'CPI-Equivalent £30k (£)']
    const lines = HISTORICAL_DATA.map((r) => [
      r.year,
      `"${r.effectiveDate}"`,
      r.weeklyCap,
      r.maxBasicAward,
      r.compensatoryCap,
      `"${r.statutoryInstrument}"`,
      r.cpiThresholdEquivalent,
    ].join(','))
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...lines].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'uk-statutory-employment-rates-2000-2026.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="bg-ink text-paper py-16 px-4 sm:px-6 lg:px-8 rounded-2xl relative overflow-hidden border border-ink/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-coral/20 text-coral border border-coral/30">
            <span>Authoritative Statutory Archive (2000 to 2026/27)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white tracking-tight leading-tight">
            UK Statutory Employment Rates & Compensation Caps History
          </h1>
          <p className="text-lg text-paper/80 font-sans leading-relaxed">
            A comprehensive, verified archive of statutory redundancy weekly pay caps (ERA 1996 s.162), unfair dismissal compensatory award ceilings (ERA 1996 s.124), Vento injury to feelings guidelines, and the economic erosion of the frozen £30,000 tax exemption (ITEPA 2003 s.403).
          </p>

          {/* Key Stat Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-paper/10">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Weekly Pay Cap</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-coral mt-1 block">£751</span>
              <span className="text-xs text-paper/70 mt-1 block">From £230 in 2000 (+226%)</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Compensatory Cap</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 block">£123,543</span>
              <span className="text-xs text-paper/70 mt-1 block">From £50,000 in 2000 (+147%)</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Max Basic Award</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 block">£22,530</span>
              <span className="text-xs text-paper/70 mt-1 block">30 weeks at statutory cap</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="block text-xs uppercase tracking-wider text-paper/60 font-medium">Frozen s.403 Limit</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber mt-1 block">£30,000</span>
              <span className="text-xs text-paper/70 mt-1 block">Frozen since 1988 (£92k in CPI)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Navigation Tabs */}
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'table'
                ? 'bg-ink text-white shadow-sm'
                : 'bg-card text-ink hover:bg-paper-2 border border-rule'
            }`}
          >
            Full 27-Year Archive (2000 to 2026)
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'compare'
                ? 'bg-ink text-white shadow-sm'
                : 'bg-card text-ink hover:bg-paper-2 border border-rule'
            }`}
          >
            Year-on-Year Comparator
          </button>
          <button
            onClick={() => setActiveTab('vento')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'vento'
                ? 'bg-ink text-white shadow-sm'
                : 'bg-card text-ink hover:bg-paper-2 border border-rule'
            }`}
          >
            Vento Bands Progression (Discrimination)
          </button>
          <button
            onClick={() => setActiveTab('inflation')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'inflation'
                ? 'bg-ink text-white shadow-sm'
                : 'bg-card text-ink hover:bg-paper-2 border border-rule'
            }`}
          >
            The Frozen £30,000 Exemption Analysis
          </button>
        </div>

        {/* Tab 1: Full Historical Table */}
        {activeTab === 'table' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-rule">
              <div className="w-full sm:w-72">
                <label htmlFor="search-rates" className="sr-only">Search tax year or SI</label>
                <input
                  id="search-rates"
                  type="text"
                  placeholder="Filter by year (e.g. 2026) or SI..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-rule bg-paper focus:outline-none focus:ring-2 focus:ring-coral/50"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">Showing {filteredRows.length} of {HISTORICAL_DATA.length} statutory years</span>
                <button
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-paper border border-rule text-ink hover:bg-paper-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-rule bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-paper-2 text-ink text-xs uppercase font-semibold border-b border-rule">
                  <tr>
                    <th scope="col" className="py-3.5 px-4">Tax Year</th>
                    <th scope="col" className="py-3.5 px-4">Effective Date</th>
                    <th scope="col" className="py-3.5 px-4">Weekly Pay Cap</th>
                    <th scope="col" className="py-3.5 px-4">Max Basic Award (30 wks)</th>
                    <th scope="col" className="py-3.5 px-4">Unfair Dismissal Cap</th>
                    <th scope="col" className="py-3.5 px-4">Statutory Instrument</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule font-sans">
                  {filteredRows.map((row) => {
                    const isLatest = row.year === '2026/27'
                    return (
                      <tr key={row.year} className={`hover:bg-paper/50 transition-colors ${isLatest ? 'bg-coral/5 font-medium' : ''}`}>
                        <td className="py-3 px-4 font-mono font-semibold text-ink">
                          {row.year}
                          {isLatest && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-coral text-white">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted">{row.effectiveDate}</td>
                        <td className="py-3 px-4 font-serif font-bold text-ink">
                          £{row.weeklyCap.toLocaleString('en-GB')}
                        </td>
                        <td className="py-3 px-4 text-ink">
                          £{row.maxBasicAward.toLocaleString('en-GB')}
                        </td>
                        <td className="py-3 px-4 text-ink">
                          £{row.compensatoryCap.toLocaleString('en-GB')}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-muted">{row.statutoryInstrument}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              * Note on Unfair Dismissal Compensatory Award: From 29 July 2013 onwards, under section 124(1ZA) of the Employment Rights Act 1996, the compensatory award is capped at the lower of the statutory ceiling shown above or 52 weeks of the claimant&apos;s gross pay. Caps apply strictly to terminations occurring on or after the specified effective date.
            </p>
          </div>
        )}

        {/* Tab 2: Year-on-Year Comparator */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-rule space-y-6">
              <h3 className="text-xl font-serif font-semibold text-ink">Historical Uplift & Growth Comparator</h3>
              <p className="text-sm text-muted">
                Compare statutory employment limits between any two years to evaluate historical compensation growth and the legal basis for claims at different effective termination dates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="compare-a" className="block text-xs font-semibold uppercase text-muted mb-2">Year A (Later Year)</label>
                  <select
                    id="compare-a"
                    value={compareYearA}
                    onChange={(e) => setCompareYearA(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-rule bg-paper text-ink font-medium focus:outline-none focus:ring-2 focus:ring-coral/50"
                  >
                    {HISTORICAL_DATA.map((r) => (
                      <option key={r.year} value={r.year}>{r.year} (Weekly: £{r.weeklyCap})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="compare-b" className="block text-xs font-semibold uppercase text-muted mb-2">Year B (Base Year)</label>
                  <select
                    id="compare-b"
                    value={compareYearB}
                    onChange={(e) => setCompareYearB(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-rule bg-paper text-ink font-medium focus:outline-none focus:ring-2 focus:ring-coral/50"
                  >
                    {HISTORICAL_DATA.map((r) => (
                      <option key={r.year} value={r.year}>{r.year} (Weekly: £{r.weeklyCap})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-rule">
                <div className="bg-paper p-5 rounded-xl border border-rule space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Weekly Pay Cap</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-mono text-muted">£{rowB.weeklyCap}</span>
                    <span className="text-xs text-muted">→</span>
                    <span className="text-2xl font-serif font-bold text-coral">£{rowA.weeklyCap}</span>
                  </div>
                  <div className="text-xs font-semibold text-ink pt-1 border-t border-rule/60 flex justify-between">
                    <span>Absolute Uplift:</span>
                    <span>+{weeklyDiff >= 0 ? `£${weeklyDiff}` : `-£${Math.abs(weeklyDiff)}`} ({weeklyPct}%)</span>
                  </div>
                </div>

                <div className="bg-paper p-5 rounded-xl border border-rule space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Max Statutory Basic Award</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-mono text-muted">£{rowB.maxBasicAward.toLocaleString('en-GB')}</span>
                    <span className="text-xs text-muted">→</span>
                    <span className="text-2xl font-serif font-bold text-ink">£{rowA.maxBasicAward.toLocaleString('en-GB')}</span>
                  </div>
                  <div className="text-xs font-semibold text-ink pt-1 border-t border-rule/60 flex justify-between">
                    <span>Absolute Uplift:</span>
                    <span>+{basicDiff >= 0 ? `£${basicDiff.toLocaleString('en-GB')}` : `-£${Math.abs(basicDiff).toLocaleString('en-GB')}`} ({basicPct}%)</span>
                  </div>
                </div>

                <div className="bg-paper p-5 rounded-xl border border-rule space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Compensatory Ceiling</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-mono text-muted">£{rowB.compensatoryCap.toLocaleString('en-GB')}</span>
                    <span className="text-xs text-muted">→</span>
                    <span className="text-2xl font-serif font-bold text-ink">£{rowA.compensatoryCap.toLocaleString('en-GB')}</span>
                  </div>
                  <div className="text-xs font-semibold text-ink pt-1 border-t border-rule/60 flex justify-between">
                    <span>Absolute Uplift:</span>
                    <span>+{compDiff >= 0 ? `£${compDiff.toLocaleString('en-GB')}` : `-£${Math.abs(compDiff).toLocaleString('en-GB')}`} ({compPct}%)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-paper-2 border border-rule text-xs text-muted space-y-1">
                <p className="font-semibold text-ink">Governing Statutory Instruments:</p>
                <p>{rowA.year}: {rowA.statutoryInstrument} (Effective: {rowA.effectiveDate})</p>
                <p>{rowB.year}: {rowB.statutoryInstrument} (Effective: {rowB.effectiveDate})</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Vento Bands Progression */}
        {activeTab === 'vento' && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-rule space-y-4">
              <h3 className="text-xl font-serif font-semibold text-ink">Vento Bands for Injury to Feelings (2002 to 2026/27)</h3>
              <p className="text-sm text-muted leading-relaxed">
                Under the Equality Act 2010 and the Employment Tribunal Presidential Guidance (originally established in <em>Vento v Chief Constable of West Yorkshire Police [2002]</em>), compensation for injury to feelings in discrimination, harassment, and whistleblowing detriment claims is categorized into three primary bands.
              </p>

              <div className="overflow-x-auto rounded-xl border border-rule">
                <table className="w-full text-left text-sm">
                  <thead className="bg-paper-2 text-ink text-xs uppercase font-semibold border-b border-rule">
                    <tr>
                      <th scope="col" className="py-3 px-4">Period</th>
                      <th scope="col" className="py-3 px-4">Presidential Guidance</th>
                      <th scope="col" className="py-3 px-4">Lower Band</th>
                      <th scope="col" className="py-3 px-4">Middle Band</th>
                      <th scope="col" className="py-3 px-4">Upper Band</th>
                      <th scope="col" className="py-3 px-4">Exceptional Cases</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule font-sans">
                    {VENTO_HISTORY.map((row, idx) => (
                      <tr key={row.period} className={`hover:bg-paper/50 ${idx === 0 ? 'bg-coral/5 font-medium' : ''}`}>
                        <td className="py-3 px-4 font-mono font-semibold text-ink">{row.period}</td>
                        <td className="py-3 px-4 text-xs text-muted">{row.guidance}</td>
                        <td className="py-3 px-4 text-ink">{row.lowerBand}</td>
                        <td className="py-3 px-4 font-serif font-bold text-ink">{row.middleBand}</td>
                        <td className="py-3 px-4 text-coral font-serif font-bold">{row.upperBand}</td>
                        <td className="py-3 px-4 text-xs text-muted">{row.exceptional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-rule text-xs text-muted">
                <div className="p-3 bg-paper rounded-lg border border-rule">
                  <span className="font-semibold text-ink block mb-1">Lower Band (£1,300 to £12,600)</span>
                  Appropriate for less serious cases, such as an isolated or one-off occurrence of unlawful discrimination or harassment.
                </div>
                <div className="p-3 bg-paper rounded-lg border border-rule">
                  <span className="font-semibold text-ink block mb-1">Middle Band (£12,600 to £37,700)</span>
                  Applies to serious cases that do not merit an award in the highest band, including prolonged discriminatory treatment.
                </div>
                <div className="p-3 bg-paper rounded-lg border border-rule">
                  <span className="font-semibold text-ink block mb-1">Upper Band (£37,700 to £62,900)</span>
                  Reserved for the most serious cases, such as an extended campaign of severe discriminatory harassment or career loss.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: The Frozen £30k Exemption Analysis */}
        {activeTab === 'inflation' && (
          <div className="space-y-6">
            <div className="bg-card p-6 sm:p-8 rounded-xl border border-rule space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber">Economic Analysis & Fiscal Drag</span>
                <h3 className="text-2xl font-serif font-semibold text-ink">The Frozen £30,000 Exemption (ITEPA 2003 s.403)</h3>
                <p className="text-sm text-muted leading-relaxed">
                  The statutory £30,000 tax-free exemption threshold for termination payments was introduced in the Finance Act 1988 (s.74, amending ICTA 1970 s.188 / ICTA 1988 s.588, now codified in ITEPA 2003 s.403) under Chancellor Nigel Lawson. Unlike redundancy weekly pay caps which are uprated annually by statutory instrument, the £30,000 threshold has remained frozen for nearly 40 years.
                </p>
              </div>

              {/* Economic comparison banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-paper border border-rule">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted">Current Statutory Exemption</span>
                  <div className="text-4xl font-serif font-bold text-ink">£30,000</div>
                  <p className="text-xs text-muted">
                    Unchanged since 1988. Any termination payment above this threshold is subject to income tax at your marginal rate (20%, 40%, or 45%) plus employer Class 1A NICs at 15.0%.
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-coral">CPI Inflation Adjusted (2026)</span>
                  <div className="text-4xl font-serif font-bold text-coral">£92,450+</div>
                  <p className="text-xs text-muted">
                    If indexed to the UK Consumer Prices Index (CPI) since 1988, an employee could walk away with over £92,400 completely free of income tax.
                  </p>
                </div>
              </div>

              {/* Loss of shelter visual */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-ink">Real Purchasing Power of £30k Tax Shelter</span>
                  <span className="text-amber">67.5% Real Value Erosion</span>
                </div>
                <div className="w-full h-4 bg-paper-2 rounded-full overflow-hidden border border-rule flex">
                  <div className="bg-ink h-full" style={{ width: '32.5%' }} title="Real Value Retained (32.5%)"></div>
                  <div className="bg-amber/40 h-full" style={{ width: '67.5%' }} title="Real Value Lost to Inflation (67.5%)"></div>
                </div>
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Retained shelter value (£30,000 in nominal terms)</span>
                  <span>Eroded tax shelter (£62,450 lost to fiscal drag)</span>
                </div>
              </div>

              {/* Interactive Year Selector for Inflation */}
              <div className="pt-4 border-t border-rule space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <label htmlFor="exemption-year" className="text-sm font-semibold text-ink">
                    Inspect CPI Equivalent by Historical Year:
                  </label>
                  <select
                    id="exemption-year"
                    value={selectedExemptionYear}
                    onChange={(e) => setSelectedExemptionYear(e.target.value)}
                    className="w-full sm:w-64 px-3.5 py-2 rounded-lg border border-rule bg-paper text-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-coral/50"
                  >
                    {HISTORICAL_DATA.map((r) => (
                      <option key={r.year} value={r.year}>{r.year} (CPI Equiv: £{r.cpiThresholdEquivalent.toLocaleString('en-GB')})</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const selectedRow = HISTORICAL_DATA.find((r) => r.year === selectedExemptionYear) || HISTORICAL_DATA[0]
                  const taxPenaltyOnExtra = Math.round((selectedRow.cpiThresholdEquivalent - 30000) * 0.40)
                  return (
                    <div className="p-4 rounded-xl bg-paper-2 border border-rule grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <span className="block text-xs uppercase text-muted font-medium">Nominal Threshold</span>
                        <span className="text-lg font-serif font-bold text-ink">£30,000</span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase text-muted font-medium">CPI Adjusted Equivalent</span>
                        <span className="text-lg font-serif font-bold text-coral">£{selectedRow.cpiThresholdEquivalent.toLocaleString('en-GB')}</span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase text-muted font-medium">Tax Drag (Higher Rate 40%)</span>
                        <span className="text-lg font-serif font-bold text-amber">£{taxPenaltyOnExtra.toLocaleString('en-GB')} extra tax</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="p-4 rounded-lg bg-paper border border-rule text-xs text-muted leading-relaxed space-y-2">
                <p className="font-semibold text-ink">Strategic Implication for Settlement Negotiations:</p>
                <p>
                  Because the £30,000 limit is frozen, high-earning employees and long-serving staff receiving substantial redundancy packages rapidly breach the threshold. Employers must account for Class 1A National Insurance contributions (15.0% for 2026/27) on any non-contractual termination package exceeding £30,000, creating an incentive for employers to structure settlement terms efficiently (e.g., agreed pension contributions, which remain exempt from both income tax and National Insurance).
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Statutory Guidance & Legal Rules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 sm:p-8 rounded-xl border border-rule">
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-ink">Effective Date of Termination (EDT) Rules</h2>
          <p className="text-sm text-muted leading-relaxed">
            Statutory caps are strictly governed by the employee&apos;s Effective Date of Termination (EDT). If dismissal takes effect on or after 6 April 2026, the 2026/27 caps (£751/week and £123,543 compensatory ceiling) apply automatically under SI 2026/310.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            If dismissal occurred on or before 5 April 2026, the 2025/26 caps (£719/week and £118,223 ceiling) govern the claim, even if the tribunal hearing or settlement execution occurs months later.
          </p>
          <div className="pt-2">
            <Link
              href="/guides/redundancy-pay-cap-2026/"
              className="inline-flex items-center text-sm font-semibold text-coral hover:underline"
            >
              Read our full guide to the 2026 redundancy pay cap →
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-ink">Section 203(3) Independent Legal Advice Requirement</h2>
          <p className="text-sm text-muted leading-relaxed">
            Under Section 203(3) of the Employment Rights Act 1996, an employee cannot waive statutory employment rights unless they have received independent legal advice from a qualified, insured relevant adviser (such as an SRA-regulated solicitor).
          </p>
          <p className="text-sm text-muted leading-relaxed">
            To ensure the agreement is legally binding, employers standardly pay a capped contribution toward the employee&apos;s legal fees (typically £350 to £500+ VAT for a standard sign-off, or higher for complex negotiations) directly to the solicitor upon completion of the agreement. Abortive fees or advice exceeding the cap remain subject to the instructed solicitor&apos;s engagement terms.
          </p>
          <div className="pt-2">
            <Link
              href="/settlement-agreement-review/"
              className="inline-flex items-center text-sm font-semibold text-coral hover:underline"
            >
              Get your draft agreement reviewed by an independent solicitor →
            </Link>
          </div>
        </div>
      </section>

      {/* Official Dataset Export & Press Citation Section */}
      <section className="space-y-6">
        <DataExportBox
          title="Download Complete Statutory Rates Archive (2000 – 2026)"
          description="Download the full 27-year historical time series of UK statutory redundancy pay weekly caps, maximum basic awards, unfair dismissal compensatory limits, and Vento injury to feelings guidelines in CSV or JSON format."
          datasetName="statutory-rates-history-2000-2026"
          csvUrl="/data/statutory-rates-history-2000-2026.csv"
          jsonUrl="/data/statutory-rates-history-2000-2026.json"
          recordCount="27 Tax Years (2000/01 – 2026/27)"
          fileSizeEstimate={{ csv: '1.8 KB', json: '10.4 KB' }}
          lastUpdated="April 2026"
          licence="Open Government Licence v3.0 (legislation.gov.uk)"
          licenceUrl="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          sourceAttribution="Department for Business and Trade (DBT), legislation.gov.uk statutory instruments, and Employment Tribunals Presidential Guidance"
          previewHeaders={['Tax Year', 'Effective Date', 'Weekly Cap', 'Max Basic Award (30 wks)', 'Compensatory Cap', 'Statutory Instrument']}
          previewRows={[
            ['2026/27', '6 April 2026', '£751', '£22,530', '£123,543', 'SI 2026/310'],
            ['2025/26', '6 April 2025', '£719', '£21,570', '£118,223', 'SI 2025/209'],
            ['2024/25', '6 April 2024', '£700', '£21,000', '£115,115', 'SI 2024/252'],
            ['2023/24', '6 April 2023', '£643', '£19,290', '£105,707', 'SI 2023/317'],
            ['2022/23', '6 April 2022', '£571', '£17,130', '£93,878', 'SI 2022/182'],
          ]}
        />

        <PressCitationBox
          title="UK Statutory Employment Rates & Compensation Caps History (2000-2026)"
          url="https://settlementcheck.co.uk/statutory-rates-history/"
          datasetName="statutoryrateshistory"
          author="SettlementCheck Legal Research Desk"
          sourceAgency="Department for Business and Trade & legislation.gov.uk"
          license="Open Government Licence v3.0"
          year="2026"
        />
      </section>

      {/* Embedded Calculator Card */}
      <section className="pt-4">
        <EmbeddedCalculatorCard
          badge="Live Statutory Evaluation"
          title="Check Your Offer Against Current Statutory Rates"
          subtitle="Use our deterministic calculation engine to check your redundancy pay, notice entitlements, and exit terms against April 2026 statutory limits."
          initialSalary={48000}
          initialYears={5}
          initialAge={42}
          ctaText="Check My Complete Settlement Value →"
        />
      </section>

      {/* Internal Navigation Links */}
      <section className="bg-paper p-6 rounded-xl border border-rule space-y-4">
        <h3 className="text-base font-serif font-semibold text-ink">Related Statutory Calculators & Guidance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Link
            href="/redundancy-calculator/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Redundancy Calculator</span>
            <span className="text-xs text-muted">Statutory age multipliers and £751 cap</span>
          </Link>
          <Link
            href="/unfair-dismissal-calculator/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Unfair Dismissal Calculator</span>
            <span className="text-xs text-muted">Basic award and £123,543 cap</span>
          </Link>
          <Link
            href="/settlement-agreement-tax-calculator/"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Settlement Tax Calculator</span>
            <span className="text-xs text-muted">ITEPA £30,000 threshold and PENP</span>
          </Link>
          <Link
            href="/reports/uk-settlement-index-2026/#tribunal-backlog"
            className="p-3 bg-card rounded-lg border border-rule text-ink hover:text-coral hover:border-coral/50 transition-colors"
          >
            <span className="font-semibold block">Settlement Index & Tribunal Backlog</span>
            <span className="text-xs text-muted">Regional wait times and employer costs</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
