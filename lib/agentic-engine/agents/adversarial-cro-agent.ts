/**
 * SettlementCheck Adversarial CRO Agent
 *
 * Implements the dual-perspective debate:
 * - The Friction Prosecutor: Argues drop-offs stem from cognitive fatigue, jargon, or UI ambiguity.
 * - The Trust Defense: Argues drop-offs stem from fear of employer interception, data sharing, or fees.
 * - The Compliance Arbiter: Synthesizes the debate into a single SRA & CAP Code compliant hypothesis.
 *
 * Zero-Hallucination Invariant: Strictly refuses to generate proposals unless
 * the StatisticalValidator confirms p < 0.05 and N >= 250.
 */

import { ConversionImprovementPackage, CipCategory } from '../types';
import { StatisticalValidator, StatisticalSignificanceResult } from '../tools/statistical-validator';
import { auditRegulatoryAndAdversarialTraps } from '../guardrails/sra-boundary-guard';
import { auditClaimsAndSubstantiation } from '../guardrails/cap-code-claims-guard';

export interface FunnelAuditTarget {
  targetRoute: string;
  targetComponent: string;
  stepName: string;
  category: CipCategory;
  controlSuccesses: number;
  controlTotal: number;
  variantSuccesses: number;
  variantTotal: number;
  currentCopySnippet: string;
}

export class AdversarialCroAgent {
  /**
   * Generates a validated Conversion Improvement Package (CIP)
   * Enforces mathematical gate and deterministic regulatory guards.
   */
  public static async evaluateAndSynthesize(
    target: FunnelAuditTarget
  ): Promise<ConversionImprovementPackage | null> {
    // 1. Deterministic Statistical Invariant Gate
    const statResult: StatisticalSignificanceResult = StatisticalValidator.evaluateSignificance(
      target.controlSuccesses,
      target.controlTotal,
      target.variantSuccesses,
      target.variantTotal
    );

    if (!statResult.canTriggerAgent) {
      console.log(`[AdversarialCroAgent] Silenced: ${statResult.silenceReason}`);
      return null;
    }

    // 2. Adversarial Debate Simulation
    // A. Friction Prosecutor Argument
    const prosecutorArgument = `Cognitive overload on ${target.stepName}. Users are confronted with statutory terminology without clear immediate context. Dwell time indicates hesitation in calculation inputs.`;

    // B. Trust Defense Argument
    const defenseArgument = `Confidentiality and fear of employer discovery. In UK settlement agreement disputes, employees fear typing real salary or dispute figures on personal or corporate devices without explicit Section 203(3) ERA 1996 and UK GDPR reassurance.`;

    // C. Synthesized Compliance Insight
    const synthesizedInsight = `Synthesized consensus: Reduce hesitation by reinforcing statutory confidentiality and ACAS Code 4 without employer notification, removing perceived risk while simplifying the next immediate micro-action.`;

    // 3. Formulate Proposed Replacement Diff based on Category
    let proposedReplacement = target.currentCopySnippet;
    let placement = 'mid_container';

    if (target.category === 'FUNNEL_STEP_DECAY') {
      proposedReplacement = `${target.currentCopySnippet} (100% confidential under Section 203 ERA 1996. Your employer is never notified.)`;
      placement = 'inline_helper';
    } else if (target.category === 'LEAKY_BUCKET_CONVERSION') {
      proposedReplacement = `Were you given fewer than 10 calendar days to consider your agreement? Check your legal leverage and statutory floor now →`;
      placement = 'in_article_callout';
    } else if (target.category === 'PRIVACY_FRICTION_REDUCTION') {
      proposedReplacement = `SRA-Regulated Panel Solicitors · Zero fees to you (your employer pays the Section 203 legal advice contribution)`;
      placement = 'cta_subtext';
    }

    // 4. Deterministic Regulatory Guardrail Pipeline
    const sraCheck = auditRegulatoryAndAdversarialTraps(proposedReplacement);
    const capCheck = auditClaimsAndSubstantiation(proposedReplacement);

    const sraCompliant = sraCheck.violations.length === 0;
    const capCodeCompliant = capCheck.violations.length === 0;

    if (!sraCompliant || !capCodeCompliant) {
      console.warn('[AdversarialCroAgent] Proposed copy intercepted by regulatory guards:', {
        sraViolations: sraCheck.violations,
        capViolations: capCheck.violations,
      });
      return null;
    }

    // 5. Construct Final Staged Package
    const cipId = `CIP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    return {
      id: cipId,
      targetRoute: target.targetRoute,
      targetComponent: target.targetComponent,
      category: target.category,
      metrics: {
        baselineConversionRate: statResult.conversionRates.controlRate,
        observedDropOffPct: Math.abs(statResult.conversionRates.relativeUpliftPct),
        sampleSize: target.controlTotal + target.variantTotal,
        pValue: statResult.pValue,
        zScore: statResult.zScore,
        estimatedRecoverableLeads: Math.max(1, Math.round((target.controlTotal * Math.abs(statResult.conversionRates.absoluteDiff)) / 100)),
      },
      adversarialAnalysis: {
        frictionProsecutorPerspective: prosecutorArgument,
        trustDefensePerspective: defenseArgument,
        synthesizedInsight,
      },
      proposedDiff: {
        currentTextOrCta: target.currentCopySnippet,
        proposedReplacement,
        placement,
      },
      regulatorySignoff: {
        sraCompliant,
        capCodeCompliant,
        statutoryBasis: 'Section 203(3) Employment Rights Act 1996 & ACAS Code 4',
      },
      status: 'STAGED',
      stagedAt: new Date().toISOString(),
    };
  }
}
