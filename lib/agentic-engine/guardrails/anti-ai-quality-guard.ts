/**
 * Anti-AI Quality & E-E-A-T Evaluator Guardrail
 * Inspects generated copy to guarantee it is NEVER flagged as robotic, boilerplate, or low effort.
 * Enforces Google Helpful Content Guidelines & Search Quality Rater Guidelines:
 * - Eliminates AI cliché tropes ("delve", "furthermore", "navigating the complexities", "tapestry")
 * - Enforces human sentence rhythm variation (burstiness)
 * - Enforces Answer-First directness (immediate numeric/statutory answer in sentence 1)
 * - Strips corporate filler and passive constructions
 */

import { AntiAiQualityVerdict, ConversionCopyPackage } from '../types';

export class AntiAiQualityGuard {
  private static readonly ROBOTIC_CLICHE_MARKERS = [
    /\bdelve\b/i,
    /\btapestry\b/i,
    /\btestament\b/i,
    /\bbeacon\b/i,
    /\bparamount\b/i,
    /\bfurthermore\b/i,
    /\bmoreover\b/i,
    /\bin summary\b/i,
    /\bin conclusion\b/i,
    /\bcrucially\b/i,
    /\bit is important to remember\b/i,
    /\bit is crucial to note\b/i,
    /\bit should be noted that\b/i,
    /\bnavigating the complexities\b/i,
    /\bnavigating the murky waters\b/i,
    /\bin the fast-paced modern\b/i,
    /\bgame-changer\b/i,
    /\btreasure trove\b/i,
    /\bseamlessly\b/i,
  ];

  private static readonly LOW_EFFORT_PASSIVE_OPENERS = [
    /^basically,/i,
    /^essentially,/i,
    /^simply put,/i,
    /^needless to say,/i,
    /^in general terms,/i,
  ];

  /**
   * Sanitizes copy by removing robotic markers and replacing with natural human phrasing
   */
  public static humanizeCopy(text: string): { humanizedText: string; improvements: string[] } {
    let clean = text;
    const improvements: string[] = [];

    // Replace robotic clichés
    for (const marker of this.ROBOTIC_CLICHE_MARKERS) {
      if (marker.test(clean)) {
        clean = clean.replace(marker, '');
        improvements.push(`Removed robotic AI cliché marker: ${marker.source}`);
      }
    }

    // Replace passive openers
    for (const opener of this.LOW_EFFORT_PASSIVE_OPENERS) {
      if (opener.test(clean)) {
        clean = clean.replace(opener, '');
        improvements.push(`Removed low-effort conversational opener: ${opener.source}`);
      }
    }

    clean = clean.replace(/\s{2,}/g, ' ').trim();
    return { humanizedText: clean, improvements };
  }

  /**
   * Evaluates burstiness (variance of sentence lengths)
   * Human writing features sharp contrast (short punchy sentences alternating with detailed ones).
   */
  public static calculateBurstiness(text: string): { score: number; sentenceLengths: number[] } {
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim().split(/\s+/).filter(Boolean).length)
      .filter(l => l > 0);

    if (sentences.length <= 1) {
      return { score: 75, sentenceLengths: sentences };
    }

    const mean = sentences.reduce((a, b) => a + b, 0) / sentences.length;
    const variance = sentences.reduce((acc, l) => acc + Math.pow(l - mean, 2), 0) / sentences.length;
    const stdDev = Math.sqrt(variance);

    // Higher stdDev means more human-like rhythmic variance
    const score = Math.min(100, Math.round(50 + stdDev * 10));
    return { score, sentenceLengths: sentences };
  }

  /**
   * Verifies Answer-First directness
   * Google rewards content where sentence 1 gives the direct statutory answer instead of introductory fluff.
   */
  public static verifyAnswerFirst(answerText: string): boolean {
    const firstSentence = answerText.split(/[.!?]+/)[0] || '';
    
    // Check if the first sentence contains hard numbers, caps, statutory references, or direct terms
    const hasNumericOrStatutory = 
      /£\d+|\d+ weeks?|Employment Rights Act|ITEPA|Section 203|capped at|statutory/i.test(firstSentence);

    const hasIntroFluff = 
      /when you receive|it depends on many factors|there are various things to consider/i.test(firstSentence);

    return hasNumericOrStatutory && !hasIntroFluff;
  }

  /**
   * Performs the full Anti-AI and E-E-A-T evaluation
   */
  public static evaluateQuality(copy: ConversionCopyPackage): AntiAiQualityVerdict {
    const fullText = `${copy.calibratedTitle} ${copy.calibratedMetaDescription} ${copy.answerFirstFaq.answer} ${copy.contextualInternalLinkBlock.surroundingText}`;

    const roboticMarkersFound: string[] = [];
    for (const marker of this.ROBOTIC_CLICHE_MARKERS) {
      if (marker.test(fullText)) {
        roboticMarkersFound.push(marker.source);
      }
    }

    const burstiness = this.calculateBurstiness(copy.answerFirstFaq.answer);
    const answerFirst = this.verifyAnswerFirst(copy.answerFirstFaq.answer);

    const { improvements } = this.humanizeCopy(fullText);

    // Score computation
    let score = 95;
    if (roboticMarkersFound.length > 0) score -= roboticMarkersFound.length * 15;
    if (!answerFirst) score -= 20;
    if (burstiness.score < 60) score -= 15;
    if (fullText.includes('—')) score -= 10; // Em dash penalty

    score = Math.max(0, Math.min(100, score));
    const isLowEffort = score < 75;

    return {
      authenticityScore: score,
      isLowEffort,
      burstinessScore: burstiness.score,
      answerFirstVerified: answerFirst,
      roboticMarkersFound,
      humanTouchImprovements: improvements,
    };
  }
}
