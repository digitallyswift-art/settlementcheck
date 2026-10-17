/**
 * SettlementCheck Tool Registry
 * Exports all deterministic tools available to the Agentic Engine.
 */

export * from './statutory-tools';
export * from './threat-counter-tools';
export * from './legal-pack-tools';
export * from './telemetry-tools';
export * from './territorial-tools';
export * from './pms-sync-tools';
export * from './serp-tools';

import { verifyStatutoryInvariantsTool } from './statutory-tools';
import { detectAndCounterCaptiveSteeringTool } from './threat-counter-tools';
import { generateS203AdviserPackTool } from './legal-pack-tools';
import { querySettlementBenchmarksTool } from './telemetry-tools';
import { matchAndLockTerritoryTool } from './territorial-tools';
import { syncPmsIntakeTool } from './pms-sync-tools';
import { sentinelMonitorSerpTool } from './serp-tools';
import { AIToolDefinition } from '@/lib/ai/types';

export const ALL_AGENTIC_TOOLS: AIToolDefinition[] = [
  verifyStatutoryInvariantsTool,
  detectAndCounterCaptiveSteeringTool,
  generateS203AdviserPackTool,
  querySettlementBenchmarksTool,
  matchAndLockTerritoryTool,
  syncPmsIntakeTool,
  sentinelMonitorSerpTool,
];
