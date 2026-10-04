import { AIServiceRequest, AIServiceResponse } from '../types';

/**
 * Offline / Mock Provider Adapter
 * Returns deterministic, high-quality simulated responses for offline development and CI evals.
 */
export async function callMock(request: AIServiceRequest): Promise<AIServiceResponse> {
  const startTime = Date.now();
  const lastUserMsg = [...request.messages].reverse().find(m => m.role === 'user')?.content || '';

  let content = 'Under UK employment law (Employment Rights Act 1996 and ITEPA 2003 s.403), your settlement package should include statutory redundancy, accrued contractual notice, and compensation. Employers typically contribute £500-£1,500+VAT towards your independent solicitor fees.';
  let structuredData: Record<string, unknown> | undefined = undefined;

  if (request.jsonMode) {
    structuredData = {
      summary: 'Analysis completed under UK statutory employment guidelines.',
      statutoryCompliance: true,
      legalFeeContributionExpected: '£500 to £1,500 + VAT',
      taxExemptionFloor: 30000,
      governingActs: ['Employment Rights Act 1996', 'ITEPA 2003 s.403'],
      recommendedNextStep: 'Consult an SRA-regulated employment solicitor to review and sign the agreement.',
    };
    content = JSON.stringify(structuredData, null, 2);
  }

  return {
    content,
    structuredData,
    modelUsed: 'mock-deterministic-v1',
    provider: 'mock',
    usage: {
      promptTokens: 120,
      completionTokens: 85,
      totalTokens: 205,
    },
    durationMs: Date.now() - startTime,
  };
}
