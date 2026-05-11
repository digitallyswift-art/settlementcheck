import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Employment Settlement Agreement Guides | SettlementCheck',
  description: 'Plain-English guides on settlement agreements, negotiation, legal advice, and your rights as an employee in the UK.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides',
  },
  openGraph: {
    title: 'Employment Settlement Agreement Guides | SettlementCheck',
    description: 'Plain-English guides on settlement agreements, negotiation, legal advice, and your rights as an employee in the UK.',
    url: 'https://settlementcheck.co.uk/guides',
    type: 'website',
    locale: 'en_GB',
  },
}

const GUIDES = [
  {
    href: '/guides/how-to-negotiate-a-settlement-agreement',
    eyebrow: 'Negotiation',
    title: 'How to Negotiate a Settlement Agreement',
    description: 'Without Prejudice rules, what leverage you have, counter-offer tactics, and the step-by-step process from first offer to signed agreement.',
    readTime: '8 min read',
  },
  {
    href: '/guides/employer-recommended-solicitor',
    eyebrow: 'Legal advice',
    title: 'Do You Have to Use the Solicitor Your Employer Recommends?',
    description: 'No. You are entitled to choose your own solicitor. Here is what the law says, why it matters, and how to find someone whose interests are aligned with yours.',
    readTime: '5 min read',
  },
]

export default function GuidesPage() {
  return (
    <>
      <Nav />
      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="py-14 md:py-[72px]" style={{ background: '#F7F4EE' }}>
          <div className="sc-container">
            <div className="max-w-[640px]">
              <span className="sc-eyebrow">Guides</span>
              <h1 className="sc-h1 mt-4">
                Understand your rights.<br />
                <em style={{ fontStyle: 'italic', color: '#D9603B' }}>Before you sign.</em>
              </h1>
              <p className="sc-lead mt-6">
                Plain-English guides written for employees. No legal jargon. No sales pitch. New guides added regularly.
              </p>
            </div>
          </div>
        </section>

        {/* ── GUIDE CARDS ──────────────────────────────────────── */}
        <section className="py-section bg-paper">
          <div className="sc-container">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-[900px]">
              {GUIDES.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group bg-card border border-rule rounded-xl p-7 flex flex-col gap-4 hover:border-rule-strong hover:shadow-sm transition-all duration-[160ms] no-underline"
                >
                  <div className="flex items-center justify-between">
                    <span className="sc-eyebrow">{g.eyebrow}</span>
                    <span className="text-[12px] text-muted">{g.readTime}</span>
                  </div>
                  <h2 className="font-serif text-ink font-[460] leading-snug tracking-[-0.012em]"
                    style={{ fontSize: 'clamp(18px, 2vw, 21px)' }}>
                    {g.title}
                  </h2>
                  <p className="sc-body flex-1">{g.description}</p>
                  <span className="text-[14px] font-medium text-coral group-hover:underline underline-offset-2 mt-auto">
                    Read guide →
                  </span>
                </Link>
              ))}

              {/* Placeholder card — signals more content is coming (good for SEO crawl signals) */}
              <div className="bg-paper-2 border border-rule border-dashed rounded-xl p-7 flex flex-col gap-3 opacity-60">
                <span className="sc-eyebrow">Coming soon</span>
                <p className="font-serif text-ink font-[420] leading-snug tracking-[-0.012em]"
                  style={{ fontSize: 'clamp(18px, 2vw, 21px)' }}>
                  What happens if you do not sign a settlement agreement?
                </p>
                <p className="sc-body">Your options if you reject the offer, including tribunal claims, negotiation, and the risks on both sides.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-16 md:py-[88px]"
          style={{ background: '#0B1F3A' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 36% 80% at 90% 50%, rgba(217,96,59,0.18) 0%, transparent 70%)' }}
          />
          <div className="sc-container relative">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
              <div>
                <h2 className="sc-section-h2 text-white" style={{ maxWidth: '22ch' }}>
                  Ready to find out where your offer stands?
                </h2>
                <p className="sc-lead mt-3" style={{ color: 'rgba(247,244,238,0.78)', maxWidth: '46ch' }}>
                  Free estimate in under two minutes. Your employer covers the legal fees.
                </p>
              </div>
              <Link href="/calculator" className="btn-accent whitespace-nowrap self-start md:self-auto">
                Check my offer →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
