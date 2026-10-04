/**
 * SettlementCheck AI Engine - Core Type Definitions
 * Model-agnostic types for decoupled AI/AGI agentic systems.
 */

export type AIProvider = 'gemini' | 'anthropic' | 'openai' | 'mock';

export type AIModelTier = 'fast' | 'reasoning' | 'frontier';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
  toolCalls?: AIToolCall[];
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      items?: Record<string, unknown>;
    }>;
    required?: string[];
  };
  execute: (args: Record<string, any>) => Promise<Record<string, unknown>> | Record<string, unknown>;
}

export interface AIServiceRequest {
  tier?: AIModelTier;
  provider?: AIProvider;
  systemPrompt?: string;
  messages: AIMessage[];
  tools?: AIToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AIServiceResponse<T = unknown> {
  content: string;
  structuredData?: T;
  toolCalls?: AIToolCall[];
  modelUsed: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
}
