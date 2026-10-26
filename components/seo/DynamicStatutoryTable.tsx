import React from 'react';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { StatutoryComparisonTableData } from '@/lib/agentic-engine/types';

interface DynamicStatutoryTableProps {
  pathname?: string;
  tableData?: StatutoryComparisonTableData;
}

export default async function DynamicStatutoryTable({
  pathname,
  tableData,
}: DynamicStatutoryTableProps) {
  let data = tableData;

  if (!data && pathname) {
    const active = await SeoActuatorService.getActiveOptimization(pathname);
    data = active?.comparisonTable;
  }

  if (!data || !data.rows || data.rows.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="statutory-table-heading"
      className="my-10 max-w-4xl mx-auto px-4 sm:px-6"
    >
      <div className="rounded-3xl border border-[#0B1F3A]/10 bg-white p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A]" />
            <h2 id="statutory-table-heading" className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A]">
              {data.tableTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A] border border-[#0B1F3A]/10">
            April 2026 Caps Verified
          </span>
        </div>

        {data.caption && (
          <p className="text-sm text-[#0B1F3A]/70 mb-4">{data.caption}</p>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#0B1F3A]/10">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0B1F3A] text-white">
              <tr>
                {data.headers.map((header, idx) => (
                  <th key={idx} scope="col" className="px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B1F3A]/10">
              {data.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#F7F4EE]/40 hover:bg-[#F7F4EE]/70 transition-colors'}
                >
                  <td className="px-4 py-3 font-semibold text-[#0B1F3A]">{row.element}</td>
                  <td className="px-4 py-3 text-[#0B1F3A]/80 font-mono text-xs">{row.statutoryBasis}</td>
                  <td className="px-4 py-3 font-semibold text-[#D9603B]">{row.standardCapGB}</td>
                  <td className="px-4 py-3 text-[#0B1F3A]/80">{row.taxTreatment}</td>
                  <td className="px-4 py-3 text-[#0B1F3A]/70 text-xs">{row.eligibilityRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        {data.footnoteCitation && (
          <p className="mt-4 text-xs text-[#0B1F3A]/60 leading-relaxed border-t border-[#0B1F3A]/10 pt-3">
            {data.footnoteCitation}
          </p>
        )}
      </div>
    </section>
  );
}
