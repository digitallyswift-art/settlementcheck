import { AIServiceRequest, AIServiceResponse, AIProvider } from './types';
import { callGemini } from './providers/gemini';
import { callAnthropic } from './providers/anthropic';
import { callOpenAI } from './providers/openai';
import { callMock } from './providers/mock';
import { sanitizePiiAndSpecialCategoryData } from './sanitizer';

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

  // SC-B-003: Pre-gateway edge scrubbing for any external AI call
  const sanitizedRequest: AIServiceRequest = {
    ...request,
    messages: request.messages?.map(m => ({
      ...m,
      content: sanitizePiiAndSpecialCategoryData(m.content).sanitizedText,
    })) || [],
    systemPrompt: request.systemPrompt
      ? sanitizePiiAndSpecialCategoryData(request.systemPrompt).sanitizedText
      : undefined,
  };

  try {
    switch (provider) {
      case 'gemini':
        return await callGemini(sanitizedRequest);
      case 'anthropic':
        return await callAnthropic(sanitizedRequest);
      case 'openai':
        return await callOpenAI(sanitizedRequest);
      case 'mock':
      default:
        return await callMock(sanitizedRequest);
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
