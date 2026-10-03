import Link from 'next/link'

export interface RelatedItem {
  href: string
  title: string
  description?: string
  tag?: string
}

export default function RelatedArticles({
  title = 'Related Guides & Calculators',
  items,
}: {
  title?: string
  items: RelatedItem[]
}) {
  if (!items || items.length === 0) return null

  return (
    <div className="pt-10 mt-12 border-t border-rule">
      <h3 className="font-serif text-[20px] font-[460] text-ink mb-6">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-5 rounded-xl border border-rule bg-paper hover:border-coral hover:shadow-sm transition-all duration-[160ms] flex flex-col justify-between group no-underline"
          >
            <div>
              {item.tag && (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-coral mb-1 block">
                  {item.tag}
                </span>
              )}
              <h4 className="text-[15px] font-medium text-ink group-hover:text-coral transition-colors mb-1.5 leading-snug">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-[13px] text-muted leading-relaxed">{item.description}</p>
              )}
            </div>
            <span className="text-[13px] font-medium text-coral mt-3 inline-flex items-center gap-1 group-hover:underline">
              View resource →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
