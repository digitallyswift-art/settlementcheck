'use client'

import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: 'Does it cost me anything?',
    a: 'No. Your employer is required by UK law to cover your legal fees for this process, typically £350 to £750. You pay nothing. This means you can choose a specialist who will genuinely advise you, not just whoever is cheapest.',
  },
  {
    q: 'Do I legally need a solicitor?',
    a: 'Yes. Under Section 203 of the Employment Rights Act 1996, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured solicitor. You cannot waive your rights without it.',
  },
  {
    q: 'How accurate is the calculator?',
    a: "The calculator gives a general estimate based on UK statutory rates and typical UK settlement market data. It is not legal advice. Your circumstances may justify substantially more or less, and only a solicitor reviewing your contract and reason for leaving can tell you.",
  },
  {
    q: 'When will the solicitor matching service be available?',
    a: 'The calculator is live and free to use today. The solicitor matching service is launching shortly. When live, panel solicitors will commit to responding within 24 hours of an introduction, often the same business day.',
  },
  {
    q: 'What if I want to negotiate a higher amount?',
    a: 'Many employees do successfully negotiate more once a solicitor reviews their circumstances. A specialist will assess whether factors like length of service, discrimination, whistleblowing, or contract breaches justify a higher offer.',
  },
  {
    q: 'Is my information shared?',
    a: 'Only with vetted SRA-regulated solicitors you opt in to be introduced to once matching launches. Never with employers, recruiters, or third parties. You can withdraw consent at any point.',
  },
  {
    q: 'Why is your calculator independent when others are not?',
    a: 'Most settlement calculators are built by law firms. The goal of those calculators is to capture your details so that firm can take on your case. Our calculator is run by an independent platform with no firm to promote. The estimate you get reflects your actual situation, not what a firm wants you to believe.',
  },
]

export default function FaqAccordion({ faqs = DEFAULT_FAQS }: { faqs?: FaqItem[] } = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="border-t border-rule">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="faq-item"
          open={openIdx === i}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) setOpenIdx(i)
            else if (openIdx === i) setOpenIdx(null)
          }}
        >
          <summary className="flex items-center justify-between gap-4 py-5 md:py-6 cursor-pointer list-none font-serif font-460 text-[16px] md:text-[19px] text-ink tracking-[-0.008em] select-none">
            <span>{faq.q}</span>
            <span className="faq-icon" aria-hidden="true">+</span>
          </summary>
          <p className="text-[15px] text-muted leading-[1.65] pb-6 max-w-[68ch]">{faq.a}</p>
        </details>
      ))}
    </div>
  )
}
