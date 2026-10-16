import Link from 'next/link'

interface ReviewCalloutProps {
  title?: string
  description?: string
  ctaText?: string
  badge?: string
}

export default function ReviewCallout({
  title = 'Holding a draft settlement agreement?',
  description = 'Before signing, check whether your employer is paying standard solicitor fee contributions (£500 to £1,500 + VAT), verify your £30,000 tax exemption, and benchmark your severance against tribunal payouts.',
  ctaText = 'Check my draft clauses →',
  badge = 'Confidential Clause Checker',
}: ReviewCalloutProps) {
  return (
    <aside
      aria-label="Settlement Agreement Review Tool"
      className="my-8 p-6 sm:p-7 rounded-xl bg-card border border-rule border-l-4 border-l-coral shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-coral animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] font-semibold text-coral">
              {badge}
            </span>
          </div>
          <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-ink leading-snug m-0">
            {title}
          </h3>
          <p className="text-[13px] sm:text-[14px] text-muted leading-relaxed m-0">
            {description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href="/settlement-agreement-review/"
            className="btn-accent inline-flex items-center justify-center text-[13px] sm:text-[14px] px-5 py-3 whitespace-nowrap w-full sm:w-auto text-center"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </aside>
  )
}
