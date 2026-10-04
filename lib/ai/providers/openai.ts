import { AIServiceRequest, AIServiceResponse } from '../types';

/**
 * OpenAI Provider Adapter
 * Works directly with OpenAI Chat Completions API (gpt-4o, gpt-4o-mini, o3-mini, etc.)
 */
export async function callOpenAI(request: AIServiceRequest): Promise<AIServiceResponse> {
  const startTime = Date.now();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const model = request.tier === 'fast'
    ? (process.env.OPENAI_FAST_MODEL || 'gpt-4o-mini')
    : (process.env.OPENAI_FRONTIER_MODEL || 'gpt-4o');

  const messages: Array<{ role: string; content: string }> = [];

  if (request.systemPrompt) {
    messages.push({ role: 'system', content: request.systemPrompt });
  }

  for (const m of request.messages) {
    messages.push({ role: m.role, content: m.content });
  }

  const payload: Record<string, unknown> = {
    model,
    messages,
    temperature: request.temperature ?? 0.2,
    max_tokens: request.maxTokens ?? 2048,
  };

  if (request.jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content || '';
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
    provider: 'openai',
    usage: {
      promptTokens: data?.usage?.prompt_tokens || 0,
      completionTokens: data?.usage?.completion_tokens || 0,
      totalTokens: data?.usage?.total_tokens || 0,
    },
    durationMs: Date.now() - startTime,
  };
}
