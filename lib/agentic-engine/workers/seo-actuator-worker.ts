/**
 * SEO Actuation & Indexing Worker
 * Specialist worker applying validated SEO packages to live routes,
 * managing rollbacks, and triggering the Google Indexing API.
 */

import { AgenticWorker } from '../types';
import { SeoActuatorService, AppliedSeoRecord } from '../services/seo-actuator-service';

export interface SeoActuationInput {
  action: 'APPLY' | 'ROLLBACK' | 'APPLY_ALL_VALIDATED';
  packageId?: string;
  triggerIndexing?: boolean;
}

export interface SeoActuationResult {
  success: boolean;
  package?: AppliedSeoRecord;
  appliedCount?: number;
  message: string;
  error?: string;
}

export const seoActuatorWorker: AgenticWorker<SeoActuationInput, SeoActuationResult> = {
  name: 'SEO Actuation & Indexing Worker',
  description: 'Applies validated SEO packages to live routes, manages rollbacks, and notifies Google Indexing API.',
  permittedTools: [],
  execute: async (input: SeoActuationInput): Promise<SeoActuationResult> => {
    if (input.action === 'APPLY_ALL_VALIDATED') {
      const res = await SeoActuatorService.applyAllValidated();
      return {
        success: res.success,
        appliedCount: res.appliedCount,
        message: `Applied ${res.appliedCount} validated SEO action packages to production routes.`,
      };
    }

    if (input.action === 'ROLLBACK' && input.packageId) {
      const res = await SeoActuatorService.rollbackPackage(input.packageId);
      return {
        success: res.success,
        message: res.success ? `Successfully rolled back package ${input.packageId}.` : (res.error || 'Rollback failed'),
        error: res.error,
      };
    }

    if (input.action === 'APPLY' && input.packageId) {
      const res = await SeoActuatorService.applyPackage(input.packageId, {
        triggerIndexing: input.triggerIndexing ?? true,
      });
      return {
        success: res.success,
        package: res.package,
        message: res.success ? `Successfully applied package ${input.packageId} to production.` : (res.error || 'Application failed'),
        error: res.error,
      };
    }

    return {
      success: false,
      message: 'Invalid actuation input. Must specify action and packageId when applicable.',
    };
  },
};
