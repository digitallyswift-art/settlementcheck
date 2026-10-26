'use client';

import React, { useState } from 'react';
import { GscDailyTimeseries } from '@/lib/agentic-engine/services/gsc-client';

interface CockpitPerformanceChartProps {
  timeseries?: GscDailyTimeseries[];
  source?: 'GSC_LIVE_API' | 'LOCAL_ARCHIVE_FALLBACK';
  formattedRange?: string;
  totalClicks?: number;
  totalImpressions?: number;
}

export default function CockpitPerformanceChart({
  timeseries = [],
  source,
  formattedRange,
  totalClicks = 0,
  totalImpressions = 0,
}: CockpitPerformanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<'both' | 'clicks' | 'impressions'>('both');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!timeseries || timeseries.length === 0) {
    return null;
  }

  const maxImpressions = Math.max(...timeseries.map((d) => d.impressions), 10);
  const maxClicks = Math.max(...timeseries.map((d) => d.clicks), 5);

  const hoveredDay = hoveredIndex !== null ? timeseries[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-3xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#0B1F3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#0B1F3A]/5 flex items-center justify-center text-lg">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0B1F3A]">
                Google Search Console Daily Trend
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  source === 'GSC_LIVE_API'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {source === 'GSC_LIVE_API' ? '● Live GSC API' : '📁 Archive Snapshot'}
              </span>
            </div>
            <p className="text-xs text-[#0B1F3A]/60 mt-0.5">
              Daily impressions and employee click volume for {formattedRange || 'selected window'}
            </p>
          </div>
        </div>

        {/* Metric Filter & Collapse Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B1F3A]/5 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMetric('both')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'both' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              All Metrics
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('impressions')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'impressions' ? 'bg-[#0B1F3A] text-white shadow-sm' : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              Impressions
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('clicks')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'clicks' ? 'bg-[#D9603B] text-white shadow-sm' : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              Clicks
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl border border-[#0B1F3A]/10 text-xs text-[#0B1F3A]/60 hover:text-[#0B1F3A] hover:bg-[#0B1F3A]/5"
            title={isCollapsed ? 'Expand chart' : 'Collapse chart'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Active Hover / Summary Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#F7F4EE]/70 border border-[#0B1F3A]/10 text-xs">
            {hoveredDay ? (
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono font-bold text-[#0B1F3A]">
                  📅 {new Date(hoveredDay.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[#0B1F3A] font-semibold">
                  👁️ {hoveredDay.impressions.toLocaleString('en-GB')} impressions
                </span>
                <span className="text-[#D9603B] font-bold">
                  👆 {hoveredDay.clicks} clicks
                </span>
                <span className="font-mono text-[#0B1F3A]/70">
                  CTR: {hoveredDay.ctr}%
                </span>
                <span className="font-mono text-[#0B1F3A]/70">
                  Avg Pos: {hoveredDay.position}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 text-[#0B1F3A]/70">
                <span className="italic">Hover over any day bar below to inspect detailed daily telemetry</span>
                <span className="font-mono">
                  Total: {totalImpressions.toLocaleString('en-GB')} impr · {totalClicks} clicks
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0B1F3A]" />
                <span>Impressions</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D9603B]" />
                <span>Clicks</span>
              </span>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="h-44 sm:h-52 w-full flex items-end gap-1 sm:gap-1.5 pt-4 pb-1 overflow-x-auto no-scrollbar">
            {timeseries.map((day, idx) => {
              const imprHeightPct = Math.max(4, Math.round((day.impressions / maxImpressions) * 100));
              const clicksHeightPct = Math.max(4, Math.round((day.clicks / maxClicks) * 100));
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={day.date}
                  className="flex-1 min-w-[14px] sm:min-w-[18px] max-w-[36px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating Micro-Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 z-20 pointer-events-none bg-[#0B1F3A] text-white text-[10px] font-mono py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                      <div>{day.date.slice(5)}</div>
                      <div className="text-white/80">{day.impressions} impr · {day.clicks} clk</div>
                    </div>
                  )}

                  {/* Dual Bar Representation */}
                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                    {/* Impressions Bar */}
                    {(activeMetric === 'both' || activeMetric === 'impressions') && (
                      <div
                        style={{ height: `${imprHeightPct}%` }}
                        className={`w-1/2 sm:w-2.5 rounded-t transition-all ${
                          isHovered
                            ? 'bg-[#0B1F3A]'
                            : 'bg-[#0B1F3A]/40 group-hover:bg-[#0B1F3A]/70'
                        }`}
                      />
                    )}

                    {/* Clicks Bar */}
                    {(activeMetric === 'both' || activeMetric === 'clicks') && (
                      <div
                        style={{ height: `${clicksHeightPct}%` }}
                        className={`w-1/2 sm:w-2.5 rounded-t transition-all ${
                          isHovered
                            ? 'bg-[#D9603B]'
                            : 'bg-[#D9603B]/60 group-hover:bg-[#D9603B]'
                        }`}
                      />
                    )}
                  </div>

                  {/* Day Date Label for every few days or on hover */}
                  {(idx % Math.ceil(timeseries.length / 7) === 0 || idx === timeseries.length - 1) && (
                    <span className="text-[9px] font-mono text-[#0B1F3A]/50 mt-1 whitespace-nowrap">
                      {new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
