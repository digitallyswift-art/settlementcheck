import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/[0.78]">
      <div className="sc-container pt-20 pb-10">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 max-[900px]:grid-cols-3 max-[520px]:grid-cols-1">
          {/* Brand */}
          <div>
            <div className="font-serif text-[22px] font-420 tracking-[-0.01em] mb-3">
              <span className="text-coral">Settlement</span>
              <span className="text-white">Check</span>
            </div>
            <p className="text-[14px] leading-[1.6] max-w-[34ch]">
              Free settlement agreement advice for UK employees. Your employer pays the legal fees.
            </p>
            <p className="text-[12px] text-white/55 mt-6 max-w-[38ch] leading-[1.6]">
              SettlementCheck is an introduction service, not a law firm. We are not regulated by the SRA. Solicitors on our panel are independently SRA-regulated.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h4 className="text-white text-[12px] font-sans font-medium tracking-[0.14em] uppercase mb-4">Calculators</h4>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {[
                { href: '/#calculator', label: 'Standard Calculator' },
                { href: '/redundancy-calculator', label: 'Redundancy Calculator' },
                { href: '/unfair-dismissal-calculator', label: 'Unfair Dismissal Calculator' },
                { href: '/constructive-dismissal-calculator', label: 'Constructive Dismissal Calculator' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-[160ms]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h4 className="text-white text-[12px] font-sans font-medium tracking-[0.14em] uppercase mb-4">Guides</h4>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {[
                { href: '/how-it-works', label: 'How it works' },
                { href: '/how-it-works#faq', label: 'FAQs' },
                { href: '/guides/how-to-negotiate-a-settlement-agreement', label: 'How to negotiate a settlement' },
                { href: '/guides/employer-recommended-solicitor', label: 'Do I have to use my employer\'s solicitor?' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-[160ms]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For solicitors */}
          <div>
            <h4 className="text-white text-[12px] font-sans font-medium tracking-[0.14em] uppercase mb-4">For solicitors</h4>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {[
                { href: '/for-solicitors', label: 'Join our panel' },
                { href: '/for-solicitors#how-it-works', label: 'How it works for firms' },
                { href: '/for-solicitors#contact', label: 'Contact us' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-[160ms]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-[12px] font-sans font-medium tracking-[0.14em] uppercase mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {[
                { href: '/privacy', label: 'Privacy policy' },
                { href: '/terms', label: 'Terms of use' },
                { href: '/disclaimer', label: 'Disclaimer' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-[160ms]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rule */}
        <hr className="border-0 border-t border-white/10 my-12" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-4 text-[12px] text-white/55 flex-wrap">
          <span>© 2026 SettlementCheck.co.uk · Registered in England</span>
          <span>settlementcheck.co.uk</span>
        </div>
      </div>
    </footer>
  )
}
