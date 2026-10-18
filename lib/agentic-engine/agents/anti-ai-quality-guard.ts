/**
 * Anti-AI Quality Guardrail (Backward-Compatibility Alias)
 * Re-exports AntiAiQualityGuard from lib/agentic-engine/guardrails/anti-ai-quality-guard.ts.
 * The guardrail was moved to guardrails/ to strictly align with clean agent architecture
 * (separating deterministic linguistic validators from cognitive LLM agents).
 */

export { AntiAiQualityGuard } from '../guardrails/anti-ai-quality-guard';
