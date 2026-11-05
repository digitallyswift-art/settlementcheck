'use client'

import { useState } from 'react'

export interface DataExportBoxProps {
  title?: string
  description?: string
  datasetName: string
  csvUrl: string
  jsonUrl: string
  recordCount: string
  fileSizeEstimate?: {
    csv: string
    json: string
  }
  lastUpdated?: string
  licence?: string
  licenceUrl?: string
  sourceAttribution?: string
  previewHeaders?: string[]
  previewRows?: (string | number)[][]
  className?: string
}

export default function DataExportBox({
  title = 'Download Official Dataset',
  description = 'Access the underlying raw data in standard open formats for news reporting, academic analysis, legal pleadings, or HR benchmarking.',
  datasetName,
  csvUrl,
  jsonUrl,
  recordCount,
  fileSizeEstimate = { csv: '~3 KB', json: '~7 KB' },
  lastUpdated = 'April 2026',
  licence = 'Open Government Licence v3.0 (OGL v3.0)',
  licenceUrl = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  sourceAttribution = 'Ministry of Justice & SettlementCheck Research Desk',
  previewHeaders,
  previewRows,
  className = '',
}: DataExportBoxProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [copiedLink, setCopiedLink] = useState<'csv' | 'json' | null>(null)

  const copyDirectLink = (url: string, format: 'csv' | 'json') => {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
    navigator.clipboard.writeText(fullUrl)
    setCopiedLink(format)
    setTimeout(() => setCopiedLink(null), 2500)
  }

  return (
    <div className={`bg-card rounded-2xl border border-rule p-6 sm:p-8 shadow-sm space-y-6 ${className}`}>
      {/* Header and Context */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-coral/10 text-coral">
              Open Data Asset
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-paper-2 text-ink">
              {recordCount}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs text-muted">
              Updated {lastUpdated}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
            {title}
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            {description}
          </p>
        </div>

        {/* Source & Licence Badge */}
        <div className="p-3 bg-paper rounded-xl border border-rule text-xs text-muted space-y-1.5 md:min-w-[220px]">
          <span className="font-semibold text-ink block font-serif">Licence &amp; Provenance</span>
          <p className="text-xs text-muted leading-normal">
            Licensed under the{' '}
            <a
              href={licenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink font-semibold underline hover:text-coral transition-colors"
            >
              {licence}
            </a>
            .
          </p>
          <p className="text-[11px] text-muted-2">
            Free to reuse, distribute, and quote with attribution.
          </p>
        </div>
      </div>

      {/* Action Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CSV Download Box */}
        <div className="p-4 bg-paper rounded-xl border border-rule flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 bg-ink text-white rounded">
                  CSV
                </span>
                <span className="text-sm font-semibold text-ink">Spreadsheet Format</span>
              </div>
              <p className="text-xs text-muted mt-1">
                Optimised for Microsoft Excel, Google Sheets, Python Pandas, and R analysis.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-2">{fileSizeEstimate.csv}</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={csvUrl}
              download={`${datasetName}.csv`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink text-paper rounded-lg text-xs font-semibold hover:bg-ink-2 transition-colors text-center"
            >
              <svg className="w-4 h-4 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </a>
            <button
              type="button"
              onClick={() => copyDirectLink(csvUrl, 'csv')}
              aria-label="Copy CSV URL"
              className="px-3 py-2.5 bg-card border border-rule rounded-lg text-xs font-medium text-ink hover:text-coral hover:border-coral/40 transition-colors"
              title="Copy direct download URL"
            >
              {copiedLink === 'csv' ? (
                <span className="text-coral font-semibold">Copied!</span>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* JSON Download Box */}
        <div className="p-4 bg-paper rounded-xl border border-rule flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 bg-coral text-white rounded">
                  JSON
                </span>
                <span className="text-sm font-semibold text-ink">Structured API Format</span>
              </div>
              <p className="text-xs text-muted mt-1">
                Structured machine-readable feed with comprehensive metadata, schemas, and descriptors.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-2">{fileSizeEstimate.json}</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={jsonUrl}
              download={`${datasetName}.json`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink text-paper rounded-lg text-xs font-semibold hover:bg-ink-2 transition-colors text-center"
            >
              <svg className="w-4 h-4 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download JSON
            </a>
            <button
              type="button"
              onClick={() => copyDirectLink(jsonUrl, 'json')}
              aria-label="Copy JSON URL"
              className="px-3 py-2.5 bg-card border border-rule rounded-lg text-xs font-medium text-ink hover:text-coral hover:border-coral/40 transition-colors"
              title="Copy direct download URL"
            >
              {copiedLink === 'json' ? (
                <span className="text-coral font-semibold">Copied!</span>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Data Preview Accordion */}
      {previewHeaders && previewRows && previewRows.length > 0 && (
        <div className="border border-rule rounded-xl overflow-hidden bg-card">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full px-4 py-3 bg-paper/60 hover:bg-paper flex items-center justify-between text-left text-xs font-semibold text-ink transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg
                className={`w-4 h-4 text-coral transition-transform duration-200 ${showPreview ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{showPreview ? 'Hide Sample Preview' : 'Inspect Sample Rows in Browser'}</span>
            </div>
            <span className="text-[11px] text-muted font-normal">
              Showing first {previewRows.length} rows
            </span>
          </button>

          {showPreview && (
            <div className="overflow-x-auto p-4 border-t border-rule bg-card">
              <table className="min-w-full divide-y divide-rule text-xs">
                <thead>
                  <tr className="bg-paper">
                    {previewHeaders.map((header, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        className="px-3 py-2 text-left font-serif font-semibold text-ink whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule font-mono">
                  {previewRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-card' : 'bg-paper/30'}>
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-3 py-2 text-muted whitespace-nowrap"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Attribution & Legal Invariant Footer */}
      <div className="pt-2 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted">
        <div>
          Official Data Provenance: <span className="text-ink font-medium">{sourceAttribution}</span>
        </div>
        <div className="text-muted-2">
          UK Crown Copyright &amp; Open Government Licence v3.0 Compatible
        </div>
      </div>
    </div>
  )
}
