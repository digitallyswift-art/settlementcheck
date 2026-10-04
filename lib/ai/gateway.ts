import { AIServiceRequest, AIServiceResponse, AIProvider } from './types';
import { callGemini } from './providers/gemini';
import { callAnthropic } from './providers/anthropic';
import { callOpenAI } from './providers/openai';
import { callMock } from './providers/mock';

/**
 * SettlementCheck Unified AI Gateway
 * Provides vendor-agnostic routing, tier management, and automatic fallbacks.
 */

function resolveProvider(requested?: AIProvider): AIProvider {
  if (requested) return requested;
  if (process.env.DEFAULT_AI_PROVIDER) {
    return process.env.DEFAULT_AI_PROVIDER as AIProvider;
  }
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'mock';
}

export async function callAI(request: AIServiceRequest): Promise<AIServiceResponse> {
  const provider = resolveProvider(request.provider);

  try {
    switch (provider) {
      case 'gemini':
        return await callGemini(request);
      case 'anthropic':
        return await callAnthropic(request);
      case 'openai':
        return await callOpenAI(request);
      case 'mock':
      default:
        return await callMock(request);
    }
  } catch (err: any) {
    console.error(`Primary AI provider (${provider}) failed:`, err.message);

    // Fallback logic
    if (provider !== 'mock') {
      console.warn('Falling back to secondary provider or mock...');
      if (provider !== 'gemini' && process.env.GEMINI_API_KEY) {
        return await callGemini(request);
      }
      if (provider !== 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        return await callAnthropic(request);
      }
      if (provider !== 'openai' && process.env.OPENAI_API_KEY) {
        return await callOpenAI(request);
      }
      // If no other live provider configured, fallback to mock
      return await callMock(request);
    }

    throw err;
  }
}
