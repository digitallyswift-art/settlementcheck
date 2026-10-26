import React from 'react';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import DynamicFaqSection from './DynamicFaqSection';
import DynamicWorkedExample from './DynamicWorkedExample';
import DynamicStatutoryTable from './DynamicStatutoryTable';

interface DynamicSeoBlockProps {
  pathname: string;
  headingText?: string;
  suppressSchema?: boolean;
}

/**
 * Master Dynamic SEO Block Orchestrator
 * Fetches active route optimization once and renders:
 * 1. Statutory Comparison Table (if present)
 * 2. Worked Mathematical Example (if present)
 * 3. Dynamic Answer-First FAQ Section with JSON-LD Schema
 */
export default async function DynamicSeoBlock({
  pathname,
  headingText = 'Key Statutory Guidance',
  suppressSchema = false,
}: DynamicSeoBlockProps) {
  const activeOptimization = await SeoActuatorService.getActiveOptimization(pathname);

  if (!activeOptimization) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 1. Comparison Table (High-intent overview) */}
      {activeOptimization.comparisonTable && (
        <DynamicStatutoryTable
          pathname={pathname}
          tableData={activeOptimization.comparisonTable}
        />
      )}

      {/* 2. Worked Mathematical Case Study (High information gain) */}
      {activeOptimization.workedExample && (
        <DynamicWorkedExample
          pathname={pathname}
          workedExample={activeOptimization.workedExample}
        />
      )}

      {/* 3. Answer-First FAQ with JSON-LD and Contextual Links */}
      {activeOptimization.faqQuestion && activeOptimization.faqAnswer && (
        <DynamicFaqSection
          pathname={pathname}
          headingText={headingText}
          suppressSchema={suppressSchema}
        />
      )}
    </div>
  );
}
