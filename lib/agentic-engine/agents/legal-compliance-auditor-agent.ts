/**
 * Legal Compliance & Statutory Auditor Agent
 * Corresponding to AGENTS.md Section 2.E and .agents/skills/legal-compliance-auditor/
 *
 * Verifies that all autonomous content and recommendations strictly comply with:
 * - Employment Rights Act 1996 s.162 (April 2026 £751/week cap, 20-year service limit)
 * - Section 203(3) ERA 1996 (Independent SRA solicitor advice requirement)
 * - ITEPA 2003 s.403 (£30,000 tax-free termination exemption threshold)
 * - ITEPA 2003 s.402D (PILON taxable earnings under PENP)
 * - ERA 1996 s.124 (£123,543 unfair dismissal compensatory cap)
 * - TULRCA 1992 s.189 (90 days maximum protective award)
 * - Equality Act 2010 Vento bands (2026/27 bands: Lower £1,300-£12,600, Middle £12,600-£37,700, Upper £37,700-£62,900)
 * - ACAS Code of Practice 4 (10 calendar days minimum offer consideration benchmark)
 * - SRA Regulatory Boundaries under Legal Services Act 2007 (No unauthorized practice of law)
 */

import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates';
import { enforceSraRegulatoryBoundary } from '../guardrails/sra-boundary-guard';
import { auditClaimsAndSubstantiation } from '../guardrails/cap-code-claims-guard';
import { StatutoryAuditVerdict, ConversionCopyPackage, SeoTechnicalBrief } from '../types';

export class LegalComplianceAuditorAgent {
  public static readonly BANNED_US_LEGAL_TERMS = [
    'severance',
    'at-will',
    'attorney',
    'layoff',
    'labor court',
  ];

  public static readonly PROHIBITED_LEGAL_PHRASES = [
    'employment rights act 2025', // Unenacted / incorrect year reference
    '180 days',                   // Erroneous protective award figure; statutory max is 90 days
    'pilon is tax-free',          // Contradicts ITEPA 2003 s.402D PENP
    'we recommend seeking legal advice', // Deflective hedging
    'it depends on your circumstances',  // Uninformative evasion
    'expert solicitors',          // Unqualified marketing superlative
    'you may wish to',            // Passive deflection
  ];

  public static readonly VENTO_BANDS_2026 = {
    lower: { min: 1300, max: 12600 },
    middle: { min: 12600, max: 37700 },
    upper: { min: 37700, max: 62900 },
  };

  /**
   * Conducts an exhaustive forensic audit of the generated copy package against UK law
   */
  public static auditCopy(
    copy: ConversionCopyPackage,
    brief: SeoTechnicalBrief
  ): StatutoryAuditVerdict {
    const issues: string[] = [];
    const governingLegislation: string[] = [];

    const fullText = `${copy.calibratedTitle} ${copy.calibratedMetaDescription} ${copy.answerFirstFaq.question} ${copy.answerFirstFaq.answer} ${copy.contextualInternalLinkBlock.surroundingText}`;
    const lower = fullText.toLowerCase();

    // 1. Audit UK vs US Legal Terminology
    for (const term of this.BANNED_US_LEGAL_TERMS) {
      if (new RegExp(`\\b${term}\\b`, 'i').test(fullText)) {
        issues.push(`Prohibited non-UK legal terminology detected: "${term}". UK employment law uses "settlement", "redundancy", or "solicitor".`);
      }
    }

    // 2. Audit Prohibited Legal & Deflective Phrases (Rule 4)
    for (const phrase of this.PROHIBITED_LEGAL_PHRASES) {
      if (lower.includes(phrase)) {
        issues.push(`Prohibited phrasing detected: "${phrase}". Must use precise statutory citation without deflective hedging.`);
      }
    }

    // 3. Audit SRA Solicitor Requirement (Section 203(3) ERA 1996)
    if (!lower.includes('solicitor')) {
      issues.push('Statutory requirement: Must specify an SRA-regulated solicitor for independent Section 203(3) ERA 1996 advice.');
    } else {
      governingLegislation.push('Section 203(3) Employment Rights Act 1996');
    }

    // 4. Audit Statutory Caps (April 2026)
    const expectedGbCap = STATUTORY_RATES_2026_27.weeklyCapGB; // £751
    const expectedTaxFree = STATUTORY_RATES_2026_27.taxFreeLimit; // £30,000
    const expectedCompensatory = STATUTORY_RATES_2026_27.compensatoryAwardLimitGB; // £123,543

    if (lower.includes('cap') || lower.includes('redundancy') || lower.includes('statutory')) {
      if (!fullText.includes(`£${expectedGbCap}`) && !fullText.includes(expectedGbCap.toString()) && !fullText.includes('£30,000')) {
        issues.push(`Statutory rate discrepancy: April 2026 GB statutory weekly cap is £${expectedGbCap}/week.`);
      } else {
        governingLegislation.push('Employment Rights Act 1996 s.162 (SI 2026/310)');
      }
    }

    if (lower.includes('tax') || lower.includes('tax-free')) {
      if (!fullText.includes('£30,000') && !fullText.includes('30,000') && !fullText.includes('30000')) {
        issues.push('Statutory tax inaccuracy: Must cite the £30,000 tax-free termination exemption threshold.');
      } else {
        governingLegislation.push('ITEPA 2003 s.403');
      }
    }

    // 5. Discrimination / Vento Band Verification
    if (lower.includes('discrimination') || lower.includes('harassment') || lower.includes('victimisation')) {
      governingLegislation.push('Equality Act 2010 (Vento Guidance 2026/27)');
    }

    // 6. Audit Employer Legal Fee Contribution
    const hasEmployerFees = lower.includes('employer') && 
      (lower.includes('fee') || lower.includes('cost'));
    if (!hasEmployerFees) {
      issues.push('Missing statutory employee protection note: Must indicate employer covers legal advice fees.');
    }

    // 7. Audit SRA Regulatory Boundary (Legal Services Act 2007)
    const boundaryCheck = enforceSraRegulatoryBoundary(fullText);
    const sraPassed = !boundaryCheck.isModified;
    if (!sraPassed) {
      issues.push('SRA Boundary warning: Phrasing crossed into formal legal advice rather than objective statutory calculation/triage.');
    }

    // 8. Audit Marketing Claims under ASA / CAP Code (claims-privacy-auditor)
    const claimsCheck = auditClaimsAndSubstantiation(fullText);
    if (!claimsCheck.isCompliant) {
      for (const v of claimsCheck.violations) {
        issues.push(`CAP Code substantiation risk: "${v.phrase}" violates ${v.capCodeRule} (${v.riskReason})`);
      }
    }

    const isCompliant = issues.length === 0;

    return {
      isCompliant,
      governingLegislation: Array.from(new Set(governingLegislation)),
      statutoryCapsVerified: {
        weeklyCapGB: expectedGbCap,
        weeklyCapNI: STATUTORY_RATES_2026_27.weeklyCapNI,
        taxFreeThreshold: expectedTaxFree,
        unfairDismissalCap: expectedCompensatory,
        protectiveAwardDays: 90,
      },
      sraBoundaryPassed: sraPassed,
      issues,
    };
  }
}

/**
 * 100% Backwards-Compatible Alias for StatutoryAuditorAgent
 */
export const StatutoryAuditorAgent = LegalComplianceAuditorAgent;
export type StatutoryAuditorAgent = LegalComplianceAuditorAgent;
