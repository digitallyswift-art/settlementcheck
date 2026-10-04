import { AIServiceRequest, AIServiceResponse } from '../types';

/**
 * Anthropic Claude Provider Adapter
 * Works directly with Anthropic Messages API (claude-3-7-sonnet, claude-3-5-haiku, etc.)
 */
export async function callAnthropic(request: AIServiceRequest): Promise<AIServiceResponse> {
  const startTime = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const model = request.tier === 'fast'
    ? (process.env.ANTHROPIC_FAST_MODEL || 'claude-3-5-haiku-20241022')
    : (process.env.ANTHROPIC_FRONTIER_MODEL || 'claude-3-7-sonnet-20250219');

  const messages = request.messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  const payload: Record<string, unknown> = {
    model,
    max_tokens: request.maxTokens ?? 2048,
    temperature: request.temperature ?? 0.2,
    messages,
  };

  if (request.systemPrompt) {
    payload.system = request.systemPrompt;
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.content?.[0]?.text || '';
  let structuredData = undefined;

  if (request.jsonMode && rawText) {
    try {
      structuredData = JSON.parse(rawText);
    } catch {
      // Leave structuredData undefined if not strict JSON
    }
  }

  return {
    content: rawText,
    structuredData,
    modelUsed: model,
    provider: 'anthropic',
    usage: {
      promptTokens: data?.usage?.input_tokens || 0,
      completionTokens: data?.usage?.output_tokens || 0,
      totalTokens: (data?.usage?.input_tokens || 0) + (data?.usage?.output_tokens || 0),
    },
    durationMs: Date.now() - startTime,
  };
}
