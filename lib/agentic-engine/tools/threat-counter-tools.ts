/**
 * Tool 2: Captive Steering Detector & Threat Counter-Offensive
 * Protects employee statutory right to independent advice (ERA 1996 s.203)
 * and enforces fee parity under SRA Code of Conduct Rule 2.1 & ACAS guidance.
 */

import { AIToolDefinition } from '@/lib/ai/types';
import { CaptiveThreatReport } from '../types';

export const detectAndCounterCaptiveSteeringTool: AIToolDefinition = {
  name: 'detect_and_counter_captive_steering',
  description: 'Detects employer captive steering (nominated solicitors, fee penalties for independent choice) and generates an authoritative SRA s.203 fee parity notice.',
  parameters: {
    type: 'object',
    properties: {
      agreementText: { type: 'string', description: 'Raw settlement agreement text or employer email excerpt' },
      employerOfferedFee: { type: 'number', description: 'Legal fee offered by employer if using panel firm (GBP)' },
      independentOfferedFee: { type: 'number', description: 'Legal fee offered if employee chooses independent firm (GBP)' },
      nominatedFirm: { type: 'string', description: 'Name of the firm nominated by employer, if any' },
      employeeName: { type: 'string', description: 'Employee full name' },
      employerName: { type: 'string', description: 'Employer company name' },
    },
    required: ['agreementText'],
  },
  execute: (args) => {
    const rawText = String(args.agreementText || '');
    const text = rawText.toLowerCase();
    const nominatedFirm = args.nominatedFirm ? String(args.nominatedFirm) : undefined;
    const employeeName = args.employeeName ? String(args.employeeName) : 'Employee';
    const employerName = args.employerName ? String(args.employerName) : 'the Employer';

    let panelFee = Number(args.employerOfferedFee ?? 500);
    let independentFee = args.independentOfferedFee !== undefined && args.independentOfferedFee !== null
      ? Number(args.independentOfferedFee)
      : undefined;

    // Check if the text specifies an independent fee disparity e.g. "if using independent solicitor, contribution is £200"
    if (independentFee === undefined) {
      const independentMatch = rawText.match(/(?:independent|own|alternative|other)\s+(?:solicitor|adviser|firm)?[^£\d]*£?\s*(\d{2,4})/i)
        || rawText.match(/£\s*(\d{2,4})[^.]*(?:if|for|using)?\s*(?:independent|own|other)/i);
      if (independentMatch) {
        independentFee = Number(independentMatch[1]);
      }
    }

    // Also check if panel/nominated fee is explicitly stated in text e.g. "pay £500 legal fees ONLY IF using our nominated solicitor"
    const panelMatch = rawText.match(/£\s*(\d{2,4})[^.]*(?:only if|nominated|preferred|panel)/i)
      || rawText.match(/(?:nominated|preferred|panel)[^£\d]*£?\s*(\d{2,4})/i);
    if (panelMatch && (args.employerOfferedFee === undefined || args.employerOfferedFee === 500)) {
      panelFee = Number(panelMatch[1]);
    }

    if (independentFee === undefined) {
      independentFee = panelFee;
    }

    // Regex heuristics for employer steering
    const steeringKeywords = [
      'nominated solicitor',
      'nominated adviser',
      'company adviser',
      'preferred solicitor',
      'company panel',
      'exclusive adviser',
      'reduced contribution if',
      'only if using',
      'solely if instructed',
    ];

    let foundKeyword: string | undefined = undefined;
    for (const kw of steeringKeywords) {
      if (text.includes(kw)) {
        foundKeyword = kw;
        break;
      }
    }

    const feePenalty = panelFee > independentFee ? panelFee - independentFee : 0;
    const isSteeringDetected = Boolean(foundKeyword || feePenalty > 0 || (nominatedFirm && text.includes(nominatedFirm.toLowerCase())));

    if (!isSteeringDetected) {
      const benignReport: CaptiveThreatReport = {
        hasCaptiveSteering: false,
        severity: 'none',
        counterNoticeRequired: false,
        legalGrounds: [
          'No employer steering or fee penalty detected. Employee is free to choose an independent SRA-regulated solicitor under Section 203(3) ERA 1996.',
        ],
      };
      return benignReport as unknown as Record<string, unknown>;
    }

    const excerpt = feePenalty > 0
      ? `Employer offers £${panelFee} for captive firm, but penalizes independent advice down to £${independentFee}.`
      : foundKeyword
      ? `Identified restrictive term: "${foundKeyword}" within draft agreement.`
      : 'Employer restricts independent solicitor selection.';

    const disparitySentence = feePenalty > 0
      ? `Restricting or penalizing legal fee contributions (£${panelFee} vs £${independentFee}) for instructing independent representation prejudices the statutory requirement of independence and risks rendering the agreement vulnerable to challenge under Section 203.`
      : `Conditioning or restricting legal fee contributions (£${panelFee} + VAT) upon instructing an employer-nominated firm prejudices the statutory requirement of independence and risks rendering the agreement vulnerable to challenge under Section 203.`;

    const counterNoticeDraft = `
SUBJECT: Statutory Notice of Independent Legal Representation & Legal Fee Parity — ${employeeName}

Dear HR / People Team at ${employerName},

Thank you for providing the draft settlement agreement dated recently.

Please be advised that under Section 203(3) of the Employment Rights Act 1996 and Principle 3 & Rule 2.1 of the SRA Code of Conduct (Solicitors Regulation Authority), I am exercising my statutory right to receive advice from an independent qualified legal adviser who has no commercial relationship, panel affiliation, or conflict of interest with ${employerName}.

Under established ACAS Guidance on Settlement Agreements, employers are expected to provide a reasonable legal fee contribution to allow the employee genuine independent advice. ${disparitySentence}

I have instructed an independent SRA-regulated employment law firm via SettlementCheck to advise me. Please confirm by return that the standard legal fee contribution of £${panelFee} + VAT applies equally to my instructed independent solicitor upon provision of their Section 203 Adviser Certificate.

Yours sincerely,
${employeeName}
`.trim();

    const report: CaptiveThreatReport = {
      hasCaptiveSteering: true,
      severity: feePenalty > 0 || foundKeyword ? 'critical' : 'moderate',
      captiveClauseExcerpt: excerpt,
      nominatedFirmName: nominatedFirm,
      feePenaltyAmount: feePenalty,
      counterNoticeRequired: true,
      counterNoticeDraft,
      legalGrounds: [
        'Employment Rights Act 1996 s.203(3)(c) — Condition of independent advice',
        'SRA Code of Conduct 2019 Rule 2.1 — Independent professional judgment',
        'ACAS Code of Practice on Settlement Agreements — Freedom to select qualified adviser',
      ],
    };

    return report as unknown as Record<string, unknown>;
  },
};
