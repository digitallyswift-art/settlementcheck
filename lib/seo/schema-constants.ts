/**
 * Schema.org JSON-LD Institutional & Publisher Standards
 * Defines authoritative, SRA-compliant, and April 2026-rate-verified publisher entities
 * for WebApplication, FAQPage, HowTo, and Article structured data across SettlementCheck.
 */

export const SETTLEMENT_CHECK_PUBLISHER = {
  '@type': 'Organization',
  name: 'SettlementCheck',
  url: 'https://settlementcheck.co.uk/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://settlementcheck.co.uk/icon.svg',
  },
  description:
    'SettlementCheck is an independent digital triage and statutory calculation service operating in alignment with ACAS guidance and April 2026 UK statutory employment rates (£751/week statutory cap, £123,543 unfair dismissal compensatory cap). Not an SRA-regulated law firm and does not provide legal representation or legal advice.',
  publishingPrinciples: 'https://settlementcheck.co.uk/regulatory-framework/',
} as const;

export const SETTLEMENT_CHECK_LEGAL_DESK = {
  '@type': 'Organization',
  name: 'SettlementCheck Legal Research Desk',
  url: 'https://settlementcheck.co.uk/how-it-works/',
  parentOrganization: SETTLEMENT_CHECK_PUBLISHER,
} as const;
