import { AIMessage, AIServiceRequest, AIServiceResponse } from '../types';

/**
 * Google Gemini Provider Adapter
 * Works directly with Gemini REST API (gemini-2.5-flash, gemini-2.5-pro, etc.)
 */
export async function callGemini(request: AIServiceRequest): Promise<AIServiceResponse> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const model = request.tier === 'frontier' 
    ? (process.env.GEMINI_FRONTIER_MODEL || 'gemini-2.5-pro')
    : (process.env.GEMINI_FAST_MODEL || 'gemini-2.5-flash');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Map messages to Gemini format
  const contents = request.messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemInstruction = request.systemPrompt
    ? { parts: [{ text: request.systemPrompt }] }
    : undefined;

  const generationConfig: Record<string, unknown> = {
    temperature: request.temperature ?? 0.2,
    maxOutputTokens: request.maxTokens ?? 2048,
  };

  if (request.jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }

  const payload: Record<string, unknown> = {
    contents,
    generationConfig,
  };

  if (systemInstruction) {
    payload.systemInstruction = systemInstruction;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  let structuredData = undefined;

  if (request.jsonMode && rawText) {
    try {
      structuredData = JSON.parse(rawText);
    } catch {
      // Return raw text if parse fails
    }
  }

  return {
    content: rawText,
    structuredData,
    modelUsed: model,
    provider: 'gemini',
    usage: {
      promptTokens: data?.usageMetadata?.promptTokenCount || 0,
      completionTokens: data?.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: data?.usageMetadata?.totalTokenCount || 0,
    },
    durationMs: Date.now() - startTime,
  };
}
