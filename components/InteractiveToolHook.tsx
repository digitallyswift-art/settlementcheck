import Link from 'next/link'

interface InteractiveToolHookProps {
  badge?: string
  title?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  statutoryPills?: Array<{ label: string; value: string; citation: string }>
}

export default function InteractiveToolHook({
  badge = 'Interactive Statutory Tool',
  title = 'AI summaries cannot calculate your individual service breakdown',
  description = 'Google AI Overviews only display static definitions. To compute your exact age-weighted redundancy multipliers, Post-Employment Notice Pay (PENP), and £30,000 tax-free split, run our verified April 2026 engine.',
  ctaText = 'Calculate my estimate →',
  ctaHref = '/calculator/',
  statutoryPills = [
    { label: 'Weekly Cap', value: '£751/week', citation: 'SI 2026/310' },
    { label: 'Tax-Free Cap', value: 'First £30,000', citation: 'ITEPA 2003 s.403' },
    { label: 'Max Redundancy', value: '£22,530', citation: 'ERA 1996 s.162' },
  ],
}: InteractiveToolHookProps) {
  return (
    <aside
      aria-label="Interactive Settlement Calculator Hook"
      className="my-8 rounded-xl bg-card border border-rule border-l-4 border-l-coral p-5 sm:p-7 shadow-sm transition-all"
    >
      <div className="flex flex-col gap-4">
        {/* Badge & Notice */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] font-bold text-coral">
              {badge}
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted">
            Beats Zero-Click AI Summaries
          </span>
        </div>

        {/* Title and copy */}
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-[18px] sm:text-[21px] font-bold text-ink leading-snug m-0">
            {title}
          </h3>
          <p className="text-[13px] sm:text-[14px] text-muted leading-relaxed m-0">
            {description}
          </p>
        </div>

        {/* Statutory Invariant Metric Badges */}
        {statutoryPills && statutoryPills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {statutoryPills.map((pill, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-paper border border-rule"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {pill.label}
                </span>
                <span className="text-[14px] font-bold text-ink">
                  {pill.value}
                </span>
                <span className="text-[10px] text-muted">
                  {pill.citation}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Row */}
        <div className="pt-3 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              className="text-coral flex-shrink-0"
            >
              <path
                d="M10 1L12.7 6.8L19 7.7L14.5 12.1L15.6 18.4L10 15.4L4.4 18.4L5.5 12.1L1 7.7L7.3 6.8L10 1Z"
                fill="currentColor"
              />
            </svg>
            <span>
              Free confidential calculation. Your employer covers independent legal fees.
            </span>
          </div>

          <Link
            href={ctaHref}
            className="btn-accent inline-flex items-center justify-center text-[13px] sm:text-[14px] px-6 py-3 font-bold rounded-lg whitespace-nowrap text-center transition-transform hover:-translate-y-0.5"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </aside>
  )
}
