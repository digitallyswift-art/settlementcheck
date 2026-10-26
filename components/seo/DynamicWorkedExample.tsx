import React from 'react';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { StatutoryWorkedCaseStudy } from '@/lib/agentic-engine/types';

interface DynamicWorkedExampleProps {
  pathname?: string;
  workedExample?: StatutoryWorkedCaseStudy;
}

export default async function DynamicWorkedExample({
  pathname,
  workedExample,
}: DynamicWorkedExampleProps) {
  let data = workedExample;

  if (!data && pathname) {
    const active = await SeoActuatorService.getActiveOptimization(pathname);
    data = active?.workedExample;
  }

  if (!data) {
    return null;
  }

  return (
    <section
      aria-labelledby="worked-example-heading"
      className="my-10 max-w-4xl mx-auto px-4 sm:px-6"
    >
      <div className="rounded-3xl border border-[#0B1F3A]/10 bg-white p-6 sm:p-8 shadow-sm">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B]" />
            <h2 id="worked-example-heading" className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A]">
              {data.caseTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A] border border-[#0B1F3A]/10">
            April 2026 Statutory Calculation
          </span>
        </div>

        {/* Persona & Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7F4EE]/60 border border-[#0B1F3A]/5 mb-6 text-sm">
          <div>
            <span className="block text-xs text-[#0B1F3A]/60 font-medium">Employee Persona</span>
            <span className="font-semibold text-[#0B1F3A]">{data.jobTitle}</span>
          </div>
          <div>
            <span className="block text-xs text-[#0B1F3A]/60 font-medium">Gross Salary</span>
            <span className="font-semibold text-[#0B1F3A]">£{data.grossSalary.toLocaleString('en-GB')} / yr</span>
          </div>
          <div>
            <span className="block text-xs text-[#0B1F3A]/60 font-medium">Continuous Service</span>
            <span className="font-semibold text-[#0B1F3A]">{data.yearsOfService} Years (Age {data.age})</span>
          </div>
          <div>
            <span className="block text-xs text-[#0B1F3A]/60 font-medium">Statutory Floor (GB)</span>
            <span className="font-semibold text-[#D9603B]">£{data.statutoryRedundancyFloor.toLocaleString('en-GB')}</span>
          </div>
        </div>

        {/* Financial Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl border border-[#0B1F3A]/10 bg-white">
            <span className="block text-xs font-semibold text-[#0B1F3A]/60 uppercase tracking-wider mb-1">
              Notice Pay (PILON)
            </span>
            <div className="text-xl font-bold text-[#0B1F3A]">£{data.noticePayPilon.toLocaleString('en-GB')}</div>
            <p className="text-xs text-[#0B1F3A]/60 mt-1">Taxable General Earnings (s.402D ITEPA)</p>
          </div>

          <div className="p-4 rounded-2xl border border-[#0B1F3A]/10 bg-white">
            <span className="block text-xs font-semibold text-[#0B1F3A]/60 uppercase tracking-wider mb-1">
              Ex-Gratia Sum
            </span>
            <div className="text-xl font-bold text-[#0B1F3A]">£{data.exGratiaCompensation.toLocaleString('en-GB')}</div>
            <p className="text-xs text-[#0B1F3A]/60 mt-1">100% Tax-Free (s.403 ITEPA exemption)</p>
          </div>

          <div className="p-4 rounded-2xl border border-[#D9603B]/20 bg-[#D9603B]/5">
            <span className="block text-xs font-semibold text-[#D9603B] uppercase tracking-wider mb-1">
              Total Package
            </span>
            <div className="text-xl font-bold text-[#D9603B]">£{data.totalSettlementOffer.toLocaleString('en-GB')}</div>
            <p className="text-xs text-[#0B1F3A]/70 mt-1">Est. Net Take-Home: £{data.estimatedNetTakeHome.toLocaleString('en-GB')}</p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-2xl bg-[#F7F4EE]/40 border border-[#0B1F3A]/5 text-sm text-[#0B1F3A]/80 leading-relaxed mb-6">
          {data.narrativeBreakdown}
        </div>

        {/* Statutory Citations & Legal Reassurance */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#0B1F3A]/10 text-xs text-[#0B1F3A]/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#0B1F3A]">Citations:</span>
            {data.statutoryCitations.map((citation, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#0B1F3A]/5 text-[#0B1F3A] font-mono text-[11px]"
              >
                {citation}
              </span>
            ))}
          </div>
          <div className="font-medium text-[#0B1F3A]">
            Independent legal fees typically covered by employer (Section 203(3) ERA 1996)
          </div>
        </div>
      </div>
    </section>
  );
}
