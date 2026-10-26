/**
 * SettlementCheck Autonomous Agentic Engine — Core Type Definitions
 * Designed for AGI-level evolvable multi-agent orchestration with deterministic UK statutory invariants.
 */

import { AIToolDefinition } from '@/lib/ai/types';
import { OfficialBenchmarkData } from '@/lib/statutory-rates';

// ── Master State Machine ──────────────────────────────────────────────────────

export type CaseWorkflowState =
  | 'INITIAL_INTAKE'
  | 'STATUTORY_TRIAGE'
  | 'THREAT_DETECTION'
  | 'THREAT_INTERVENTION'      // Triggered if captive steering / fee penalty detected
  | 'FORENSIC_CLAUSE_AUDIT'
  | 'MARKET_BENCHMARKING'
  | 'DOSSIER_COMPILATION'
  | 'TERRITORIAL_ROUTING'
  | 'CRM_DISPATCH'
  | 'SLA_MONITORING'
  | 'COMPLETED';

// ── Ingested Matter Context ───────────────────────────────────────────────────

export interface EmployeeMatterContext {
  matterId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  salary: number;
  yearsOfService: number;
  age: number;
  employerOffer: number;
  noticeWeeks?: number;
  disputeReason?: 'redundancy' | 'redundancy_collective' | 'pip' | 'constructive_dismissal' | 'discrimination' | 'unfair_dismissal' | 'other';
  isDiscrimination?: boolean;
  jurisdiction?: 'GB' | 'NI';
  rawAgreementText?: string;
  employerNominatedFirm?: string;
  employerOfferedLegalFee?: number;
  independentOfferedLegalFee?: number;
  partnerId?: string;
  sourceUrl?: string;
  consentVerified?: boolean;
}

// ── Worker Outputs ────────────────────────────────────────────────────────────

export interface StatutoryFloorReport {
  statutoryRedundancyPay: number;
  noticePayPilon: number;
  statutoryMinimumTotal: number;
  weeklyCapUsed: number;
  maxServiceYearsApplied: number;
  taxFreeTerminationPortion: number;
  taxableTerminationPortion: number;
  estimatedTaxLiability: number;
  estimatedNetTakeHome: number;
  isOfferBelowStatutoryMinimum: boolean;
  statutoryShortfallDelta: number; // e.g. 2500 if offer is £2500 below statutory floor
  governingLegislation: string;
}

export interface CaptiveThreatReport {
  hasCaptiveSteering: boolean;
  severity: 'none' | 'moderate' | 'critical';
  captiveClauseExcerpt?: string;
  nominatedFirmName?: string;
  feePenaltyAmount?: number;
  counterNoticeRequired: boolean;
  counterNoticeDraft?: string; // SRA Independence & ACAS Fee Parity demand letter
  legalGrounds: string[];
}

export interface ContractClauseAuditReport {
  clausesAuditedCount: number;
  s203ChecklistStatus: {
    inWriting: boolean;
    relatesToParticularProceedings: boolean;
    relevantIndependentAdviserIdentified: boolean;
    adviserInsuranceInForce: boolean;
    adviserConditionsStated: boolean;
  };
  redFlags: Array<{
    category: 'restrictive_covenant' | 'indemnity' | 'pension_waiver' | 'pi_carveout' | 'confidentiality' | 'tax_gross_up';
    severity: 'high' | 'medium' | 'low';
    clauseSnippet?: string;
    issueDescription: string;
    recommendedAmendment: string;
  }>;
  draftS203CertificateReady: boolean;
}

export interface MarketBenchmarkReport {
  sampleSize: number;
  medianSettlementMultiplier: number; // e.g. 3.2x monthly salary
  upperQuartileMultiplier: number;     // e.g. 4.8x monthly salary
  typicalSettlementRange: {
    low: number;
    high: number;
    uncapped: boolean;
  };
  recommendedCounterOffer: {
    targetExGratia: number;
    targetTotalPayout: number;
    recommendedLegalFeeContribution: number;
  };
  tacticalNegotiationPoints: string[];
  officialBenchmark?: OfficialBenchmarkData;
}

export interface TerritorialRoutingReport {
  postcode: string;
  normalizedPostcode: string;
  adminDistrict?: string;
  region?: string | null;
  matchedFirmId?: string;
  matchedFirmName?: string;
  matchedFirmEmail?: string;
  isTerritoryLocked: boolean;
  slaWatchdogMinutes: number;
  claimToken?: string;
  claimUrl?: string;
  lockExpiresAt?: string;
  distanceMiles?: number;
}

// ── Instruction-Ready Solicitor Pre-Flight Dossier ────────────────────────────

export interface SolicitorPreFlightDossier {
  dossierId: string;
  compiledAt: string;
  matterSummary: {
    clientName: string;
    clientContact: {
      email: string;
      phone: string;
      postcode: string;
    };
    keyFigures: {
      salary: number;
      tenureYears: number;
      age: number;
      employerOffer: number;
      statutoryMinimum: number;
      targetSettlement: number;
      employerLegalFeeOffered: number;
      recommendedLegalFeeDemand: number;
    };
    strategicVerdict: 'CRITICAL_STATUTORY_DEFICIT' | 'BELOW_MARKET_BENCHMARK' | 'FAIR_MARKET_RANGE' | 'ABOVE_MARKET_STANDARD';
  };
  statutoryAnalysis: StatutoryFloorReport;
  threatAssessment: CaptiveThreatReport;
  contractAudit: ContractClauseAuditReport;
  marketNegotiationBrief: MarketBenchmarkReport;
  territorialRouting?: TerritorialRoutingReport;
  crmPayload: {
    leadSource: string;
    matterTitle: string;
    clioMatterPayload: Record<string, unknown>;
  };
  sraComplianceStatement: string;
}

// ── Agentic Worker Definition ─────────────────────────────────────────────────

export interface AgenticWorker<TInput, TOutput, TContext = any> {
  name: string;
  description: string;
  permittedTools: AIToolDefinition[];
  execute: (input: TInput, context?: TContext) => Promise<TOutput>;
}

// ── Phase 3: Autonomous Background Fleet Types ───────────────────────────────

export interface TopMoverQuery {
  query: string;
  previousPosition: number;
  currentPosition: number;
  change: number; // positive = gained positions, negative = dropped
  clicks: number;
  impressions: number;
  isHighIntent: boolean;
}

export interface CompetitorThreatSignal {
  competitorDomain: string;
  category: 'LEGAL_FIRM' | 'AGGREGATOR' | 'ADVERTISER' | 'GOV_BODY';
  queriesIntercepted: string[];
  averageCompetitorRank: number;
  adCopySignal?: string;
  estimatedLostImpressionShare: number;
}

export interface AiOverviewSighting {
  query: string;
  aiOverviewPresent: boolean;
  settlementCheckCited: boolean;
  citedDomains: string[];
  rankingPosition: number;
  recommendedAction: string;
}

export interface SerpSentinelReport {
  snapshotId: string;
  generatedAt: string;
  baselinePeriod: string;
  activePeriod: string;
  totalQueriesTracked: number;
  totalImpressions: number;
  totalClicks: number;
  topMovers: TopMoverQuery[];
  emergingOpportunities: string[];
  competitorThreats: CompetitorThreatSignal[];
  aiOverviewSightings: AiOverviewSighting[];
  recommendedOptimizations: string[];
}

export interface SlaReroutedClaim {
  claimId: string;
  dossierId: string;
  previousFirmId: string;
  previousFirmName?: string;
  newFirmId?: string;
  newFirmName?: string;
  action: 'REROUTED_TO_PANEL' | 'UNLOCKED_TO_POOL' | 'ALERT_SENT';
  expiredAt: string;
  reroutedAt: string;
}

export interface SlaWatchdogReport {
  runId: string;
  timestamp: string;
  claimsChecked: number;
  activeLockedClaims: number;
  claimedMatters: number;
  expiredClaims: number;
  reroutedClaims: SlaReroutedClaim[];
  slaBreachRatePercent: number;
  summary: string;
}

// ── Track 2: Dual-Agent SEO & Conversion Workflow Types ───────────────────────

export type SeoSearchIntent =
  | 'TRANSACTIONAL_CALCULATOR'
  | 'COMPROMISE_AGREEMENT_LEGACY'
  | 'TAX_STATUTORY_EXEMPTION'
  | 'GOV_ACAS_BENCHMARK'
  | 'REDUNDANCY_DISPUTE'
  | 'EMOTIONAL_DISPUTE'
  | 'SOLICITOR_SELECTION'
  | 'GENERAL_SETTLEMENT';

export type SeoStatutoryCategory = 'FINANCIAL_CALCULATION' | 'EMOTIONAL_DISPUTE';

export interface QueryClusterProfile {
  targetPage: string;
  primaryAnchorQuery: string;
  primaryAnchorImpressions: number;
  strikingDistanceCandidates: string[];
  longTailVariants: string[];
  totalClusterImpressions: number;
  totalClusterClicks: number;
}

export interface SeoTechnicalBrief {
  query: string;
  currentMetrics: {
    impressions: number;
    clicks: number;
    position: number;
    ctr: number;
  };
  searchIntent: SeoSearchIntent;
  statutoryCategory?: SeoStatutoryCategory;
  targetCanonicalUrl: string;
  targetPageExistingH1?: string;
  queryClusterProfile?: QueryClusterProfile;
  characterBudgets: {
    titleMin: number;
    titleMax: number;
    metaMin: number;
    metaMax: number;
    titleMaxPixels?: number;
    metaMaxPixels?: number;
  };
  statutoryInvariants: {
    weeklyCapGB: number;
    weeklyCapNI: number;
    taxFreeThreshold: number;
    unfairDismissalCap: number;
    protectiveAwardDays: number;
  };
  schemaSpecification: {
    type: 'WebApplication' | 'Article' | 'HowTo' | 'FAQPage';
    primarySubject: string;
    targetFaqQuestion: string;
  };
  internalLinkGraph: {
    sourceRoutes: string[];
    destinationRoute: string;
    exactAnchorText: string;
  };
}

export interface ConversionCopyPackage {
  calibratedTitle: string;
  calibratedMetaDescription: string;
  answerFirstFaq: {
    question: string;
    answer: string;
    characterCount: number;
  };
  contextualInternalLinkBlock: {
    sourceRoute: string;
    targetRoute: string;
    anchorText: string;
    surroundingText: string;
  };
  ctaText: string;
  brandComplianceReport: {
    zeroEmDashes: boolean;
    zeroBannedUsTerms: boolean;
    ukSpellingVerified: boolean;
    employerFeesMentioned: boolean;
    statutoryAccuracyVerified: boolean;
  };
  workedExample?: StatutoryWorkedCaseStudy;
  comparisonTable?: StatutoryComparisonTableData;
  inProsePlacement?: InProseLinkPlacement;
  contentGapBrief?: ContentGapBrief;
}

export interface StatutoryWorkedCaseStudy {
  caseTitle: string;
  jobTitle: string;
  grossSalary: number;
  yearsOfService: number;
  age: number;
  statutoryRedundancyFloor: number;
  noticePayPilon: number;
  exGratiaCompensation: number;
  totalSettlementOffer: number;
  taxFreePortion: number; // s.403 ITEPA 2003 up to £30,000
  taxablePortion: number;
  estimatedNetTakeHome: number;
  statutoryCitations: string[]; // e.g. ["ERA 1996 s.162", "ITEPA 2003 s.403", "PENP s.402D"]
  narrativeBreakdown: string;
}

export interface StatutoryComparisonTableRow {
  element: string;
  statutoryBasis: string;
  standardCapGB: string;
  standardCapNI: string;
  taxTreatment: string;
  eligibilityRule: string;
}

export interface StatutoryComparisonTableData {
  tableTitle: string;
  caption?: string;
  headers: string[];
  rows: StatutoryComparisonTableRow[];
  footnoteCitation?: string;
}

export interface InProseLinkPlacement {
  targetFilePath: string; // e.g. "app/guides/settlement-agreement-how-much/page.tsx"
  sourceRoute: string;    // e.g. "/guides/settlement-agreement-how-much/"
  destinationRoute: string; // e.g. "/settlement-agreement-tax-calculator/"
  matchedExcerpt: string; // Exact existing sentence or paragraph fragment
  replacementExcerpt: string; // Updated snippet containing contextual anchor
  anchorText: string;     // Exact anchor text
  gitDiffPreview?: string;
  relevanceRationale: string;
}

export interface ContentGapBrief {
  proposedSlug: string; // e.g. "/guides/constructive-dismissal-settlement-agreement/"
  suggestedH1: string;
  primaryCluster: string;
  monthlySearchVolume: number;
  searchIntent: SeoSearchIntent;
  targetAudiencePainPoint: string;
  statutoryAnchors: string[];
  recommendedOutline: string[];
  internalLinkDestinations: string[];
}

export interface StatutoryAuditVerdict {
  isCompliant: boolean;
  governingLegislation: string[];
  statutoryCapsVerified: {
    weeklyCapGB: number;
    weeklyCapNI: number;
    taxFreeThreshold: number;
    unfairDismissalCap: number;
    protectiveAwardDays: number;
  };
  sraBoundaryPassed: boolean;
  issues: string[];
}

export interface AntiAiQualityVerdict {
  authenticityScore: number; // 0-100%
  isLowEffort: boolean;
  burstinessScore: number;   // Variance in sentence rhythm
  answerFirstVerified: boolean;
  roboticMarkersFound: string[];
  humanTouchImprovements: string[];
}

export type SeoActionLifecycleStatus =
  | 'STAGED'
  | 'VALIDATED'
  | 'CANARY'
  | 'APPLIED'
  | 'PERMANENT'
  | 'ROLLED_BACK'
  | 'REJECTED';

export type SeoActuationScope = 'FULL_META_AND_FAQ' | 'ADDITIVE_CONTENT_AND_LINKS';

export type SeoDeploymentRiskTier = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';

export interface SeoTradeOffSummary {
  whyTriggered: string;
  whatChanges: string;
  riskExplanation: string;
  preservesLiveTitle: boolean;
  baselineLiveTitle: string;
  droppedAnchorTokens: string[];
}

export interface SeoGuardrailPolicyRule {
  id: string;
  scopeType: 'GLOBAL' | 'ROUTE' | 'INTENT';
  scopeValue: string;
  ruleTitle: string;
  constraintDescription: string;
  lockTitleOverwrite?: boolean;
  requiredTokens?: string[];
  prohibitedPhrases?: string[];
  source: 'BASELINE_INVARIANT' | 'ADVERSARIAL_HEAD_PROMOTED' | 'HUMAN_ADMIN_PROMOTED';
  createdAt: string;
}

export interface AdversarialSeoReviewResult {
  verdict: 'APPROVED_AS_IS' | 'COUNTER_PLAN_RECOMMENDED' | 'VETO_DESTRUCTIVE';
  deploymentRisk: SeoDeploymentRiskTier;
  executiveSummary: string;
  critiquePoints: string[];
  counterProposal?: {
    calibratedTitle: string;
    calibratedMetaDescription: string;
    faqQuestion: string;
    faqAnswer: string;
    contextualLinkSnippet?: string;
    actuationScope: SeoActuationScope;
    targetCanonicalUrl?: string;
  };
  candidatePolicyRule?: SeoGuardrailPolicyRule;
  evaluatedAt: string;
}

export type SeoActionType =
  | 'META_RECALIBRATION'
  | 'INTERNAL_LINK_BOOST'
  | 'SCHEMA_FAQ_SNIPPET'
  | 'FULL_CLUSTER_PACKAGE'
  | 'PILLAR_CONTENT_EXPANSION'
  | 'IN_PROSE_INTERNAL_LINK'
  | 'CANARY_TITLE_EXPERIMENT'
  | 'CONTENT_GAP_BRIEF';

export interface AutonomousSeoActionPackage {
  id: string;
  query: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  actionType: SeoActionType;
  actuationScope?: SeoActuationScope;
  deploymentRisk?: SeoDeploymentRiskTier;
  tradeOffSummary?: SeoTradeOffSummary;
  adversarialReview?: AdversarialSeoReviewResult;
  seoTechnicalBrief: SeoTechnicalBrief;
  copyPackage: ConversionCopyPackage;
  statutoryAudit: StatutoryAuditVerdict;
  antiAiQuality: AntiAiQualityVerdict;
  stagedDiffSummary: string;
  status: SeoActionLifecycleStatus;
  timestamp: string;
  workedExample?: StatutoryWorkedCaseStudy;
  comparisonTable?: StatutoryComparisonTableData;
  inProsePlacement?: InProseLinkPlacement;
  contentGapBrief?: ContentGapBrief;
}

export interface SeoAutonomousActionRecord {
  id?: string;
  run_id: string;
  query: string;
  action_type: string;
  priority: string;
  status: string;
  target_canonical_url: string;
  calibrated_title: string;
  calibrated_meta_description: string;
  faq_question: string;
  faq_answer: string;
  contextual_link_snippet: string;
  seo_brief: Record<string, any>;
  copy_package: Record<string, any>;
  statutory_audit: Record<string, any>;
  anti_ai_quality: Record<string, any>;
  created_at?: string;
}

export interface SeoRunLogRecord {
  id?: string;
  run_id: string;
  source: string;
  total_queries: number;
  total_impressions: number;
  total_clicks: number;
  avg_ctr: number;
  avg_position: number;
  actions_count: number;
  staged_packages_count: number;
  email_sent: boolean;
  digest_json: Record<string, any>;
  created_at?: string;
}

// ── Evidence-Bounded Inter-Agent Protocol (EBIAP) ─────────────────────────────

export type ClaimClassification =
  | 'STATUTORY_INVARIANT'     // Directly derived from UK statute (ERA 1996, ITEPA 2003)
  | 'SYSTEM_TELEMETRY'        // Live database query / authenticated telemetry
  | 'REGULATORY_STATUS'       // Verified SRA register / statutory body status
  | 'PURE_UX_NAVIGATION';     // Standard UI / navigation without empirical assertions

export interface AgentHandoffContract {
  taskId: string;
  sourceAgent: string;
  targetAgent: string;
  targetComponent: string;
  proposedAction: string;
  proposedCopyOrSpec: string;
  claimClassification: ClaimClassification;
  evidentiaryProofRequired: boolean;
  substantiationProof?: {
    statuteReference?: string;
    databaseQuery?: string;
    regulatoryId?: string;
    empiricalSourceUrl?: string;
  };
}

export interface HandoffValidationResult {
  isValid: boolean;
  rejectionReason?: string;
  interceptedViolations?: string[];
}

