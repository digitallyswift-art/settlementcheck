import fs from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

export interface ExperimentConfig {
  experiment_id: string
  mode: 'split_50_50' | 'winner_selected'
  winner: 'thematic' | 'sequential' | null
  updated_at: string
}

export interface ExperimentEvent {
  id?: string
  experiment_id: string
  variant: 'sequential' | 'thematic'
  event_type: 'enrolled' | 'stage_viewed' | 'completed' | 'lead_submitted'
  stage_number?: number | null
  time_elapsed_ms?: number | null
  created_at?: string
}

export interface VariantStats {
  enrolled: number
  completed: number
  leads: number
  completionRate: number
  leadRate: number
}

export interface ExperimentStats {
  experiment_id: string
  sequential: VariantStats
  thematic: VariantStats
  totalSessions: number
  targetSessions: number
  sampleProgressPct: number
  relativeLiftPct: number
  zScore: number
  pValue: number
  isStatisticallySignificant: number | boolean
  confidenceInterval: [number, number] // [lowerPct, upperPct]
  daysElapsed: number
  seasonalityComplete: boolean
  decisionRecommendation: string
}

const LOCAL_DIR = path.join(process.cwd(), 'data', 'experiments')
const LOCAL_CONFIG_FILE = path.join(LOCAL_DIR, 'calc_ux_v2_config.json')
const LOCAL_EVENTS_FILE = path.join(LOCAL_DIR, 'calc_ux_v2_events.json')

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_DIR)) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true })
  }
}

/**
 * Fetches the active configuration for the experiment.
 * Checks Supabase first; falls back to local JSON persistence if Supabase is offline.
 */
export async function getExperimentConfig(experimentId = 'calc_ux_v2'): Promise<ExperimentConfig> {
  try {
    const { data, error } = await supabase
      .from('experiment_configurations')
      .select('experiment_id, mode, winner, updated_at')
      .eq('experiment_id', experimentId)
      .maybeSingle()

    if (!error && data) {
      return data as ExperimentConfig
    }
  } catch {
    // Fall back to local file
  }

  try {
    if (fs.existsSync(LOCAL_CONFIG_FILE)) {
      const content = fs.readFileSync(LOCAL_CONFIG_FILE, 'utf-8')
      return JSON.parse(content) as ExperimentConfig
    }
  } catch {
    // Return default
  }

  return {
    experiment_id: experimentId,
    mode: 'split_50_50',
    winner: null,
    updated_at: new Date().toISOString(),
  }
}

/**
 * Ingests an experiment telemetry event.
 * Writes to Supabase and mirrors to local backup storage.
 */
export async function recordExperimentEvent(event: Omit<ExperimentEvent, 'id' | 'created_at'>): Promise<boolean> {
  const record = {
    experiment_id: event.experiment_id || 'calc_ux_v2',
    variant: event.variant,
    event_type: event.event_type,
    stage_number: event.stage_number ?? null,
    time_elapsed_ms: event.time_elapsed_ms ?? null,
    created_at: new Date().toISOString(),
  }

  let supabaseSuccess = false

  try {
    const { error } = await supabase.from('experiment_events').insert(record)
    if (!error) {
      supabaseSuccess = true
    }
  } catch {
    // Graceful fallback to local persistence
  }

  try {
    ensureLocalDir()
    let localList: any[] = []
    if (fs.existsSync(LOCAL_EVENTS_FILE)) {
      const content = fs.readFileSync(LOCAL_EVENTS_FILE, 'utf-8')
      localList = JSON.parse(content)
    }
    localList.push(record)
    // Keep max 5000 local items in backup buffer
    if (localList.length > 5000) {
      localList = localList.slice(-5000)
    }
    fs.writeFileSync(LOCAL_EVENTS_FILE, JSON.stringify(localList, null, 2), 'utf-8')
    return true
  } catch {
    return supabaseSuccess
  }
}

/**
 * Promotes a winning variant, locking 100% of production traffic to it,
 * or resets the experiment back to an active 50/50 split.
 */
export async function promoteExperimentWinner(
  experimentId = 'calc_ux_v2',
  winner: 'thematic' | 'sequential' | 'split'
): Promise<boolean> {
  const updatePayload = {
    experiment_id: experimentId,
    mode: (winner === 'split' ? 'split_50_50' : 'winner_selected') as 'split_50_50' | 'winner_selected',
    winner: winner === 'split' ? null : winner,
    updated_at: new Date().toISOString(),
  }

  let dbUpdated = false
  try {
    const { error } = await supabase
      .from('experiment_configurations')
      .upsert(updatePayload)
    if (!error) dbUpdated = true
  } catch {
    // Ignore error, update local file
  }

  try {
    ensureLocalDir()
    fs.writeFileSync(LOCAL_CONFIG_FILE, JSON.stringify(updatePayload, null, 2), 'utf-8')
    return true
  } catch {
    return dbUpdated
  }
}

/**
 * Aggregates statistics and computes two-proportion z-score and confidence intervals.
 */
export async function getExperimentStats(experimentId = 'calc_ux_v2'): Promise<ExperimentStats> {
  let events: any[] = []

  try {
    const { data, error } = await supabase
      .from('experiment_events')
      .select('variant, event_type, created_at')
      .eq('experiment_id', experimentId)

    if (!error && data && data.length > 0) {
      events = data
    }
  } catch {
    // Fall back to local events
  }

  if (events.length === 0 && fs.existsSync(LOCAL_EVENTS_FILE)) {
    try {
      events = JSON.parse(fs.readFileSync(LOCAL_EVENTS_FILE, 'utf-8'))
    } catch {
      events = []
    }
  }

  const seq = { enrolled: 0, completed: 0, leads: 0 }
  const them = { enrolled: 0, completed: 0, leads: 0 }

  let earliestTimestamp = Date.now()

  for (const e of events) {
    const time = new Date(e.created_at || Date.now()).getTime()
    if (time < earliestTimestamp) earliestTimestamp = time

    const target = e.variant === 'thematic' ? them : seq
    if (e.event_type === 'enrolled') target.enrolled++
    if (e.event_type === 'completed') target.completed++
    if (e.event_type === 'lead_submitted') target.leads++
  }

  const crSeq = seq.enrolled > 0 ? seq.completed / seq.enrolled : 0
  const crThem = them.enrolled > 0 ? them.completed / them.enrolled : 0

  const lrSeq = seq.completed > 0 ? seq.leads / seq.completed : 0
  const lrThem = them.completed > 0 ? them.leads / them.completed : 0

  const totalSessions = seq.enrolled + them.enrolled
  const targetSessions = 1520 // 760 per variant at MDE=5%, 80% power, alpha=0.05
  const sampleProgressPct = Math.min(100, Math.round((totalSessions / targetSessions) * 100))

  const daysElapsed = Math.max(1, Math.round((Date.now() - earliestTimestamp) / (1000 * 60 * 60 * 24)))
  const seasonalityComplete = daysElapsed >= 14

  // Two-proportion Z-test
  const pooledP = totalSessions > 0 ? (seq.completed + them.completed) / totalSessions : 0
  const standardError =
    totalSessions > 0 && pooledP > 0 && pooledP < 1 && seq.enrolled > 0 && them.enrolled > 0
      ? Math.sqrt(pooledP * (1 - pooledP) * (1 / seq.enrolled + 1 / them.enrolled))
      : 0

  const diff = crThem - crSeq
  const zScore = standardError > 0 ? diff / standardError : 0
  // Standard normal CDF approximation for two-tailed p-value
  const pValue = standardError > 0 ? 2 * (1 - normalCdf(Math.abs(zScore))) : 1

  const marginOfError = 1.96 * standardError
  const ciLower = (diff - marginOfError) * 100
  const ciUpper = (diff + marginOfError) * 100

  const isStatisticallySignificant = totalSessions >= targetSessions && seasonalityComplete && pValue < 0.05 && ciLower > 0

  const relativeLiftPct = crSeq > 0 ? ((crThem - crSeq) / crSeq) * 100 : 0

  let decisionRecommendation = 'Sample accumulating. Observation in progress.'
  if (!seasonalityComplete) {
    decisionRecommendation = `Seasonality cycle in progress (${daysElapsed}/14 days). Continue observation.`
  } else if (totalSessions < targetSessions) {
    decisionRecommendation = `Sample size gathering (${totalSessions}/${targetSessions} sessions). Continue observation.`
  } else if (isStatisticallySignificant) {
    decisionRecommendation = `Statistically significant winner identified (Thematic, p = ${pValue.toFixed(4)}). Recommendation: Promote Thematic.`
  } else if (pValue >= 0.05) {
    decisionRecommendation = 'No statistically significant difference detected. Both variants perform within parity.'
  }

  return {
    experiment_id: experimentId,
    sequential: {
      enrolled: seq.enrolled,
      completed: seq.completed,
      leads: seq.leads,
      completionRate: Math.round(crSeq * 1000) / 10,
      leadRate: Math.round(lrSeq * 1000) / 10,
    },
    thematic: {
      enrolled: them.enrolled,
      completed: them.completed,
      leads: them.leads,
      completionRate: Math.round(crThem * 1000) / 10,
      leadRate: Math.round(lrThem * 1000) / 10,
    },
    totalSessions,
    targetSessions,
    sampleProgressPct,
    relativeLiftPct: Math.round(relativeLiftPct * 10) / 10,
    zScore: Math.round(zScore * 100) / 100,
    pValue: Math.round(pValue * 10000) / 10000,
    isStatisticallySignificant,
    confidenceInterval: [Math.round(ciLower * 10) / 10, Math.round(ciUpper * 10) / 10],
    daysElapsed,
    seasonalityComplete,
    decisionRecommendation,
  }
}

function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - prob : prob
}
