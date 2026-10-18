/**
 * SEO Opportunity & Architecture Worker
 * Specialist worker executing Technical Brief synthesis and Search Intent mapping.
 */

import { AgenticWorker, SeoTechnicalBrief } from '../types';
import { SeoArchitectAgent, SeoAuditContext } from '../agents/seo-architect-agent';
import { sentinelMonitorSerpTool } from '../tools/serp-tools';

export const seoOpportunityWorker: AgenticWorker<SeoAuditContext, SeoTechnicalBrief> = {
  name: 'SEO Opportunity & Architecture Worker',
  description: 'Classifies search intent, defines statutory invariants, and maps internal link graphs.',
  permittedTools: [sentinelMonitorSerpTool],
  execute: async (context: SeoAuditContext): Promise<SeoTechnicalBrief> => {
    return SeoArchitectAgent.generateTechnicalBrief(context);
  },
};
