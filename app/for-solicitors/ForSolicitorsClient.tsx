'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function ForSolicitorsClient() {
  const [form, setForm] = useState({
    firmName: '', contactName: '', email: '', phone: '', coverage: '', sra: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Replace YOUR_FORMSPREE_ID with the real Formspree form ID before going live
      await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, form_type: 'solicitor_application' }),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'border border-rule rounded-xl px-4 py-3 w-full text-sm focus:ring-2 focus:ring-ink focus:border-transparent outline-none transition bg-white text-ink placeholder:text-muted-2'

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block bg-paper-2 text-muted text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide mb-5">
              For employment solicitors
            </span>
            <h1 className="sc-h1 mb-4">
              Receive qualified settlement agreement leads
            </h1>
            <p className="sc-lead max-w-2xl mx-auto">
              Every lead on SettlementCheck has used an independent calculator and already knows where their offer stands. They arrive informed, motivated, and with a verified email address. These are not cold enquiries.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section id="how-it-works" className="bg-paper-2 border-y border-rule py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" fill="#D9603B" stroke="none" />
                      <line x1="12" y1="2" x2="12" y2="5" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="5" y2="12" />
                      <line x1="19" y1="12" x2="22" y2="12" />
                    </svg>
                  ),
                  title: 'Pre-qualified leads',
                  body: 'Every enquiry has a known offer amount, salary, and years of service. You receive the full picture before the first call.',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  ),
                  title: 'Your geography only',
                  body: 'We match by location and availability. You only receive leads relevant to where you practice.',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="14" rx="3" />
                      <path d="M2 10h20" />
                      <path d="M6 15h4" strokeWidth="2" />
                    </svg>
                  ),
                  title: 'No minimum spend',
                  body: 'Pay £60 per qualified introduction. Founding panel rate — no subscription, no lock-in, no hidden fees. You only pay when we deliver.',
                },
              ].map((card) => (
                <div key={card.title} className="bg-card rounded-2xl border border-rule p-8">
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="sc-h3 mb-2">{card.title}</h3>
                  <p className="sc-body">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="contact" className="bg-paper py-16">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="sc-section-h2 text-center mb-2">Apply to join our panel</h2>
            <p className="sc-body text-center mb-8">SRA-regulated employment law firms only.</p>

            {submitted ? (
              <div className="text-center py-8 bg-paper-2 rounded-2xl border border-rule">
                <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-ink text-lg mb-1">Application received</h3>
                <p className="text-sm text-muted">We&apos;ll be in touch within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-card rounded-2xl border border-rule p-6">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Firm name</label>
                  <input type="text" className={inputClass} required value={form.firmName}
                    onChange={(e) => setForm({ ...form, firmName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Contact name</label>
                  <input type="text" className={inputClass} required value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Email address</label>
                  <input type="email" className={inputClass} required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Phone number</label>
                  <input type="tel" className={inputClass} value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Geographic coverage</label>
                  <input type="text" className={inputClass} placeholder="e.g. London, South East" value={form.coverage}
                    onChange={(e) => setForm({ ...form, coverage: e.target.value })} />
                </div>
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 accent-coral" required checked={form.sra}
                      onChange={(e) => setForm({ ...form, sra: e.target.checked })} />
                    <span className="text-sm text-muted">Regulated by the SRA</span>
                  </label>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-accent w-full py-4 disabled:opacity-60">
                  {loading ? 'Sending...' : 'Submit application →'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
