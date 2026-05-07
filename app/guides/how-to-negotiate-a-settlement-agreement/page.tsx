import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'How to Negotiate a Settlement Agreement | The Complete UK Guide',
  description: 'Learn how to negotiate a fair settlement agreement in the UK. Understand your leverage, Without Prejudice conversations, and how to value your exit.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/how-to-negotiate-a-settlement-agreement',
  },
}

const FAQS = [
  {
    q: 'Should I make the first offer?',
    a: 'Usually, no. It is generally better to let your employer present their initial offer. This anchors the negotiation and prevents you from undervaluing your own exit. Once they make an offer, you can evaluate it and counter-offer from a position of knowledge.',
  },
  {
    q: 'Can I be fired for trying to negotiate?',
    a: 'Negotiating a settlement agreement cannot legally be used as a reason to dismiss you. However, if the alternative to the settlement is a performance management process or redundancy, refusing the settlement may result in that process continuing. Your employer cannot instantly dismiss you simply because you asked for more money.',
  },
  {
    q: 'Does my employer pay my legal fees for negotiating?',
    a: 'Your employer pays a set contribution, usually £350 to £750, for you to receive independent legal advice on the agreement. This covers the solicitor explaining the terms to you. If you instruct the solicitor to negotiate on your behalf, this may incur additional fees. A good solicitor will tell you upfront if your requested changes will cost extra and whether the financial upside justifies the cost.',
  },
  {
    q: 'How long does the negotiation process take?',
    a: 'A standard negotiation takes between one and three weeks. ACAS recommends employers give you a minimum of ten calendar days to consider the initial offer. If you submit a counter-offer, expect a few days of back-and-forth before reaching a final agreement.',
  },
  {
    q: 'Can they withdraw the offer if I ask for more?',
    a: 'Yes. In legal terms, a counter-offer acts as a rejection of the original offer. Your employer could choose to take the settlement off the table. In reality, this is rare. Employers offer settlements because they want certainty and a clean break. They are much more likely to reject your counter-offer and reiterate their original offer than they are to withdraw entirely.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const sections = [
  {
    title: '1. Understanding the fundamentals of negotiation',
    body: [
      'Receiving a settlement agreement can be highly stressful. Your employer wants you to leave the business quietly and is offering you a sum of money in exchange for you signing away your right to bring an employment tribunal claim. This is a commercial transaction. It is vital that you treat it as one.',
      'The offer presented to you is almost always a starting point. Employers rarely present their maximum budget in the first draft. They expect you to review it, seek legal advice, and potentially come back with a counter-offer. Negotiating is not aggressive or unusual. It is a standard part of the settlement process in the UK.',
      'To negotiate successfully, you must understand your leverage. Leverage is the reason your employer wants you to sign the agreement. It could be that they want to avoid a lengthy redundancy consultation, or they fear you might bring a discrimination claim, or they simply want to reorganize the team quickly. Understanding their motivation gives you the power to negotiate effectively.',
    ],
  },
  {
    title: '2. Why employers offer settlement agreements',
    body: [
      'Employers use settlement agreements for certainty. Dismissing an employee in the UK carries legal risks. Even if an employer follows a fair procedure, the employee could still bring a claim to an employment tribunal. Tribunal claims are expensive, time-consuming, and carry reputational damage. A settlement agreement eliminates this risk completely.',
      'Common reasons include avoiding long redundancy processes, bypassing lengthy performance management plans, resolving a dispute or grievance quietly, or facilitating a change in leadership. In every scenario, the employer is buying a clean break. Your signature has commercial value.',
      'When assessing your offer, consider how much it would cost your employer if you refused to sign. How much management time would it take to manage you out? How much would they spend on legal fees to defend a tribunal claim? The difference between their current offer and their potential future costs is your negotiation window.',
    ],
  },
  {
    title: '3. The Without Prejudice and Protected Conversations',
    body: [
      'Settlement discussions are usually held under the banner of "Without Prejudice" or as a "Protected Conversation" under Section 111A of the Employment Rights Act 1996. These legal terms mean that the conversation cannot be used as evidence in an employment tribunal later.',
      'This protection exists to allow both parties to speak freely about an exit without fear of those words being used against them. If your manager says, "We do not think you are a good fit and we want to offer you a settlement," you cannot use that statement to prove unfair dismissal in court.',
      'However, this protection is not absolute. It does not cover discriminatory remarks or whistleblowing claims. Furthermore, just because the conversation is protected does not mean you have to accept the offer immediately. You are legally entitled to take the agreement away, think about it, and get independent legal advice.',
    ],
  },
  {
    title: '4. Assessing your true leverage',
    body: [
      'Before you make a counter-offer, you must assess your leverage. Strong leverage means you have a realistic threat of bringing a successful tribunal claim, or that keeping you employed would cost the business a significant amount of money.',
      'Weak leverage means your employer has already followed a fair process and has a watertight case for your dismissal. If you are being made redundant and the company has followed proper consultation procedures, your leverage is low. In this case, you might only negotiate minor increases or non-financial terms.',
      'If you have recently raised a grievance about bullying, discrimination, or unequal pay, your leverage is extremely high. Employers are highly motivated to settle discrimination claims privately because tribunal awards for discrimination are uncapped and the judgments are public. If you hold strong evidence of unfair treatment, your settlement value increases significantly.',
    ],
  },
  {
    title: '5. How much should you ask for?',
    body: [
      'Valuing a settlement agreement is a precise exercise. You must first calculate your statutory minimums. This includes your contractual notice pay, any accrued but untaken holiday, and your statutory redundancy pay or basic award.',
      'Once you know your baseline, you need to calculate your compensatory award. This is the amount of money you would lose while looking for a new job. If it will take you six months to find a similar role, you should aim for six months of net pay as your settlement figure.',
      'You must also factor in the legal fees your employer is saving. Defending a standard unfair dismissal claim costs an employer between £8,000 and £15,000 in legal fees, even if they win. They are often willing to add a portion of these saved costs to your settlement offer to make the problem go away quickly.',
      'If you are unsure where to start, use our free calculator. You can run different scenarios based on redundancy, unfair dismissal, or mutual agreement to see where your current offer sits within the typical UK range.',
    ],
  },
  {
    title: '6. Negotiating non-financial terms',
    body: [
      'Money is important, but it is not the only term you should negotiate. The non-financial clauses in a settlement agreement can have a massive impact on your future career.',
      'Always negotiate an agreed reference. You want a clause stating that your employer will provide a reference in a specific, agreed format to any future employers. Usually, this is a standard factual reference confirming your dates of employment and job title. Ensure the agreement explicitly states that any verbal references will match the written agreed reference.',
      'You should also negotiate the internal announcement. You want to control the narrative of your departure. Agree on a specific wording that will be sent to your colleagues and clients. This prevents rumors and protects your professional reputation.',
      'Finally, check the post-termination restrictions. If your contract prevents you from working for a competitor for six months, you can use the settlement negotiation to try and have those restrictions reduced or waived entirely. If they are paying you to leave, they should not prevent you from earning a living elsewhere.',
    ],
  },
  {
    title: '7. The step-by-step negotiation process',
    body: [
      'First, listen to the offer. Do not accept or reject it in the room. Thank them for the offer and ask for it in writing, along with a copy of the draft settlement agreement. ACAS guidelines suggest you should have at least 10 calendar days to consider the offer.',
      'Second, calculate your position. Work out your notice pay, holiday pay, and statutory entitlements. Identify your leverage. Are there any grounds for a tribunal claim? How long will it take you to find a new job?',
      'Third, speak to an independent solicitor. Your employer will offer a contribution toward this. The solicitor will review the agreement, confirm if the offer is fair, and advise you on your options. They can highlight hidden risks in the confidentiality clauses or restrictive covenants.',
      'Fourth, make your counter-offer. You can do this yourself or ask your solicitor to do it for you. Keep the communication professional, factual, and focused on commercial realities. State your figure and provide a clear, logical justification for why that figure is appropriate. Avoid emotional language.',
      'Fifth, be prepared for a counter-offer from them. They will likely reject your first figure and offer something in the middle. Decide in advance what your absolute minimum acceptable figure is (your walk-away point). Once you reach an agreement on the core terms, the solicitor will finalize the legal wording and you will sign.',
    ],
  },
  {
    title: '8. The role of the independent solicitor',
    body: [
      'A settlement agreement is only legally binding if you have received independent legal advice from a qualified professional. Your employer knows this, which is why they offer to pay a contribution towards your legal fees. The standard contribution is between £350 and £750 plus VAT.',
      'The solicitor’s primary job is to explain the terms and effects of the agreement to you. They must ensure you understand exactly what rights you are signing away. They will also advise you on whether the financial offer is reasonable based on the circumstances of your departure.',
      'If you decide the offer is too low, you have a choice. You can negotiate directly with your HR department, or you can instruct your solicitor to negotiate on your behalf. Having a solicitor negotiate for you removes the emotion from the process and shows your employer you are serious about your legal position. However, ensure you understand the fee structure. If the negotiation takes substantial time, the legal fees may exceed your employer’s contribution.',
    ],
  },
  {
    title: '9. Common mistakes employees make',
    body: [
      'The most common mistake is accepting the first offer immediately. When you are shocked by the news of an exit, the offer of a lump sum can seem appealing. You must resist the urge to agree in the room. Take the paperwork away and review it calmly.',
      'Another critical mistake is resigning before the agreement is signed. If you resign, you lose your leverage. Your employer no longer needs to pay you to leave. Never resign verbally or in writing while a settlement agreement is being negotiated.',
      'Many employees also fail to value their benefits. A settlement is not just about your base salary. You must calculate the value of lost pension contributions, health insurance, company car allowances, and any upcoming bonuses or commission payments you will miss out on.',
      'Finally, do not breach confidentiality during the negotiation. Discussing the settlement offer with your colleagues can result in the employer withdrawing the offer entirely. Keep the matter strictly between you, your immediate family, and your legal adviser.',
    ],
  },
  {
    title: '10. Tax implications of your settlement',
    body: [
      'Understanding how your settlement is taxed is crucial. The headline figure offered by your employer is not always the amount that will land in your bank account. In the UK, different parts of the settlement are treated differently by HMRC.',
      'Your notice pay, known as Post-Employment Notice Pay (PENP), is fully taxable and subject to National Insurance contributions. Any accrued holiday pay and outstanding salary or bonuses are also taxed in the normal way.',
      'However, the ex-gratia portion of your settlement—the true compensation for loss of office—can usually be paid tax-free up to £30,000. This is a significant advantage. A £30,000 tax-free payment is worth considerably more than a £30,000 salary payment.',
      'If your employer offers to pay part of your settlement directly into your pension scheme, this can be highly tax-efficient. Pension contributions are generally not subject to the £30,000 limit, though they are subject to your annual pension allowance. Discuss this option with your solicitor if you want to maximize the financial efficiency of your exit.',
    ],
  },
  {
    title: '11. When to walk away',
    body: [
      'Negotiation is only effective if you are willing to walk away. You must know your alternative. What happens if you do not sign the agreement? Will you be made redundant? Will you face a disciplinary hearing? Do you have the energy and financial stability to pursue an employment tribunal claim?',
      'If your employer refuses to increase a genuinely unfair offer, and you have strong grounds for a tribunal claim, walking away might be the right commercial decision. If you refuse to sign, the employer’s problem remains unsolved.',
      'Before walking away, consult extensively with your solicitor. Tribunal claims take months, sometimes over a year, to resolve. They are stressful and there is never a guaranteed outcome. You must weigh the certain money of the current settlement offer against the uncertain prospect of a larger tribunal award later. A good solicitor will provide a risk-adjusted assessment to help you make this final decision.',
    ],
  },
]

export default function HowToNegotiateGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-5">
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-5">
              How to Negotiate a Settlement Agreement
            </h1>
            <p className="sc-lead">
              Receiving a settlement agreement can feel overwhelming. Your employer has offered you a sum of money to leave quietly. But is the offer fair? And how do you ask for more without jeopardising the deal? This comprehensive guide explains the mechanics of negotiation, how to assess your true leverage, and how to protect your interests.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-paper py-12">
          <div className="max-w-2xl mx-auto px-5 space-y-10">

            {sections.map((s, index) => (
              <div key={index} className="space-y-3">
                <h2 className="guide-h2">{s.title}</h2>
                {s.body.map((para, i) => (
                  <p key={i} className="guide-body">{para}</p>
                ))}
              </div>
            ))}

            {/* Useful Resources */}
            <div className="space-y-3">
              <h2 className="guide-h2">Useful independent resources</h2>
              <p className="guide-body">When preparing for a negotiation, it is vital to know your rights. We recommend reviewing these official UK resources:</p>
              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-5">
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.acas.org.uk/settlement-agreements" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">ACAS Guide to Settlement Agreements</a> - The official government-backed advice body for workplace relations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.gov.uk/dismissal/what-your-employer-must-do" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">GOV.UK: Dismissal Rights</a> - Understand the legal processes your employer must follow.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.citizensadvice.org.uk/work/problems-at-work/settlement-agreements/" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">Citizens Advice: Settlement Agreements</a> - Free, impartial advice on your options and rights.
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Find out what your claim is worth
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Before you negotiate, check if your offer is fair. Use our free calculator to see the typical UK range for your circumstances.
              </p>
              <Link href="/redundancy-calculator" className="btn-accent">
                Calculate my settlement →
              </Link>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-8">
              <h2 className="guide-h2">Frequently asked questions</h2>
              <div className="divide-y divide-rule border-t border-rule">
                {FAQS.map(({ q, a }) => (
                  <div key={q} className="py-5">
                    <h3 className="font-serif text-[17px] font-[460] text-ink tracking-[-0.008em] leading-snug mb-2">{q}</h3>
                    <p className="guide-body">{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed">
              SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides general information, not legal counsel.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
