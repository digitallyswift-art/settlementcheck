'use client'

import { useState } from 'react'

export interface PressCitationBoxProps {
  title: string
  url: string
  datasetName?: string
  author?: string
  sourceAgency?: string
  license?: string
  year?: string
  lastAccessedDate?: string
  className?: string
}

export default function PressCitationBox({
  title,
  url,
  datasetName,
  author = 'SettlementCheck Research Desk',
  sourceAgency = 'Ministry of Justice & HMCTS',
  license = 'Open Government Licence v3.0',
  year = '2026',
  lastAccessedDate = '6 April 2026',
  className = '',
}: PressCitationBoxProps) {
  const [activeTab, setActiveTab] = useState<'press' | 'harvard' | 'oscola' | 'bibtex'>('press')
  const [copied, setCopied] = useState(false)

  // Clean trailing slash ensured URL
  const canonicalUrl = url.endsWith('/') ? url : `${url}/`

  const citations = {
    press: `Source: SettlementCheck, "${title}" (${year}), based on data from ${sourceAgency}, licensed under ${license}. Available at: ${canonicalUrl}`,
    harvard: `SettlementCheck, ${year}. ${title}. [online] London: SettlementCheck.co.uk. Available at: <${canonicalUrl}> [Accessed ${lastAccessedDate}].`,
    oscola: `SettlementCheck, '${title}' (${author} ${year}) <${canonicalUrl}> accessed ${lastAccessedDate}.`,
    bibtex: `@misc{settlementcheck${year}${datasetName ? datasetName.replace(/[^a-zA-Z0-9]/g, '') : 'data'},
  author = {${author}},
  title = {{${title}}},
  year = {${year}},
  howpublished = {\\url{${canonicalUrl}}},
  note = {Source: ${sourceAgency}. Licensed under ${license}}
}`,
  }

  const currentSnippet = citations[activeTab]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  return (
    <div className={`bg-card rounded-2xl border border-rule p-6 sm:p-8 shadow-sm space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ink text-paper">
              Media &amp; Academic Citation
            </span>
            <span className="text-xs text-muted">
              OGL v3.0 Open Licence Compatible
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">
            Cite This Research &amp; Dataset
          </h2>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-coral hover:bg-coral-ink text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Citation Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy Citation</span>
            </>
          )}
        </button>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-rule pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('press')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'press'
              ? 'bg-ink text-paper'
              : 'text-muted hover:text-ink hover:bg-paper'
          }`}
        >
          Journalistic / Press
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('harvard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'harvard'
              ? 'bg-ink text-paper'
              : 'text-muted hover:text-ink hover:bg-paper'
          }`}
        >
          Harvard (Academic)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('oscola')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'oscola'
              ? 'bg-ink text-paper'
              : 'text-muted hover:text-ink hover:bg-paper'
          }`}
        >
          OSCOLA (Legal)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bibtex')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'bibtex'
              ? 'bg-ink text-paper'
              : 'text-muted hover:text-ink hover:bg-paper'
          }`}
        >
          BibTeX
        </button>
      </div>

      {/* Citation Box Body */}
      <div className="relative bg-paper rounded-xl border border-rule p-4 font-mono text-xs text-ink leading-relaxed break-all select-all">
        {activeTab === 'bibtex' ? (
          <pre className="whitespace-pre overflow-x-auto text-[11px] font-mono text-ink">
            {currentSnippet}
          </pre>
        ) : (
          <p>{currentSnippet}</p>
        )}
      </div>

      {/* Press & Rights Usage Note */}
      <div className="bg-paper/50 rounded-xl p-4 border border-rule text-xs text-muted space-y-1">
        <span className="font-semibold text-ink block font-serif">
          Permitted Press &amp; Academic Usage
        </span>
        <p className="leading-relaxed">
          National press, legal correspondents, HR practitioners, and parliamentary researchers are granted permission to freely quote, cite, and reproduce figures from this analysis. When reporting, please credit <strong className="text-ink">SettlementCheck</strong> and provide a hyperlink to <a href={canonicalUrl} className="text-coral underline hover:text-coral-ink">{canonicalUrl}</a>.
        </p>
      </div>
    </div>
  )
}
