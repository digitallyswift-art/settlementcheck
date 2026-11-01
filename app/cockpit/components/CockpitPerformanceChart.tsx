'use client';

import React, { useState, useId } from 'react';
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

  const gradientId = useId();

  if (!timeseries || timeseries.length === 0) {
    return null;
  }

  // Clean formatted range of en-dash or em-dash
  const cleanRange = (formattedRange || 'selected window').replace(/\u2013|\u2014/g, '-');

  // Compute aggregate metrics
  const computedTotalImpr = totalImpressions || timeseries.reduce((acc, d) => acc + d.impressions, 0);
  const computedTotalClicks = totalClicks || timeseries.reduce((acc, d) => acc + d.clicks, 0);
  const avgCtr = computedTotalImpr > 0 ? ((computedTotalClicks / computedTotalImpr) * 100).toFixed(2) : '0.00';
  const avgPos = timeseries.length > 0
    ? (timeseries.reduce((acc, d) => acc + (d.position || 0), 0) / timeseries.length).toFixed(1)
    : '-';

  // Scales
  const maxImprRaw = Math.max(...timeseries.map((d) => d.impressions), 10);
  const maxClicksRaw = Math.max(...timeseries.map((d) => d.clicks), 5);

  // Round up scales to nice round numbers for Y-axis ticks
  const roundNice = (val: number) => {
    if (val <= 10) return 10;
    if (val <= 50) return Math.ceil(val / 10) * 10;
    if (val <= 200) return Math.ceil(val / 25) * 25;
    if (val <= 1000) return Math.ceil(val / 50) * 50;
    return Math.ceil(val / 100) * 100;
  };

  const maxImpr = roundNice(maxImprRaw);
  const maxClicks = roundNice(maxClicksRaw);

  // SVG Chart Geometry
  const width = 800;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = activeMetric === 'both' ? 50 : 25;
  const paddingTop = 25;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;
  const baselineY = height - paddingBottom;

  // Coordinate mapping
  const points = timeseries.map((day, i) => {
    const x = paddingLeft + (timeseries.length > 1 ? (i / (timeseries.length - 1)) * plotWidth : plotWidth / 2);
    const yImpr = baselineY - (day.impressions / maxImpr) * plotHeight;
    const yClicks = baselineY - (day.clicks / maxClicks) * plotHeight;
    return { x, yImpr, yClicks, day };
  });

  // Catmull-Rom to Cubic Bezier Spline
  const createSplinePath = (coords: { x: number; y: number }[]) => {
    if (coords.length < 2) return '';
    let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[Math.max(0, i - 1)];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[Math.min(coords.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const imprCoords = points.map((p) => ({ x: p.x, y: p.yImpr }));
  const clicksCoords = points.map((p) => ({ x: p.x, y: p.yClicks }));

  const imprLinePath = createSplinePath(imprCoords);
  const clicksLinePath = createSplinePath(clicksCoords);

  const imprAreaPath = points.length > 1
    ? `${imprLinePath} L ${points[points.length - 1].x.toFixed(1)},${baselineY} L ${points[0].x.toFixed(1)},${baselineY} Z`
    : '';

  const clicksAreaPath = points.length > 1
    ? `${clicksLinePath} L ${points[points.length - 1].x.toFixed(1)},${baselineY} L ${points[0].x.toFixed(1)},${baselineY} Z`
    : '';

  // Currently active or hovered day
  const activeDayIndex = hoveredIndex !== null ? hoveredIndex : timeseries.length - 1;
  const activePoint = points[activeDayIndex] || points[points.length - 1];
  const activeDay = activePoint?.day;

  // Grid tick levels: 4 horizontal tiers (100%, 66%, 33%, 0%)
  const yTicks = [1, 0.66, 0.33, 0];

  return (
    <div className="bg-white rounded-3xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#0B1F3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0B1F3A]/5 flex items-center justify-center text-xl">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0B1F3A]">
                Google Search Console Daily Trend
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0B1F3A]/10 text-[#0B1F3A] border border-[#0B1F3A]/20">
                {source === 'GSC_LIVE_API' ? 'Live GSC API' : 'Archive Snapshot'}
              </span>
            </div>
            <p className="text-xs text-[#0B1F3A]/60 mt-0.5">
              Daily impressions and employee click volume for {cleanRange}
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B1F3A]/5 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMetric('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetric === 'both'
                  ? 'bg-white text-[#0B1F3A] shadow-sm font-bold'
                  : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              Dual Trend
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('impressions')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetric === 'impressions'
                  ? 'bg-[#0B1F3A] text-white shadow-sm font-bold'
                  : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              Impressions
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('clicks')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetric === 'clicks'
                  ? 'bg-[#D9603B] text-white shadow-sm font-bold'
                  : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              Clicks
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border border-[#0B1F3A]/10 text-xs text-[#0B1F3A]/60 hover:text-[#0B1F3A] hover:bg-[#0B1F3A]/5 transition-colors"
            title={isCollapsed ? 'Expand chart' : 'Collapse chart'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Quick KPI Stat Strip (At-A-Glance Metric Understanding) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveMetric('impressions')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeMetric === 'impressions' || activeMetric === 'both'
                  ? 'bg-[#0B1F3A]/5 border-[#0B1F3A]/30 ring-1 ring-[#0B1F3A]/20'
                  : 'bg-white border-[#0B1F3A]/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0B1F3A]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60">
                  Total Impressions
                </span>
              </div>
              <span className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A] block mt-1">
                {computedTotalImpr.toLocaleString('en-GB')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetric('clicks')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeMetric === 'clicks' || activeMetric === 'both'
                  ? 'bg-[#D9603B]/10 border-[#D9603B]/30 ring-1 ring-[#D9603B]/20'
                  : 'bg-white border-[#0B1F3A]/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D9603B]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9603B]">
                  Total Clicks
                </span>
              </div>
              <span className="text-lg sm:text-xl font-serif font-bold text-[#D9603B] block mt-1">
                {computedTotalClicks.toLocaleString('en-GB')}
              </span>
            </button>

            <div className="p-3 rounded-2xl bg-white border border-[#0B1F3A]/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                Average CTR
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A] block mt-1">
                {avgCtr}%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#0B1F3A]/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                Average Position
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A] block mt-1">
                Pos {avgPos}
              </span>
            </div>
          </div>

          {/* Active Day Inspector Strip */}
          <div className="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#0B1F3A]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {activeDay ? (
              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#0B1F3A]">
                  <span>📅</span>
                  <span>
                    {new Date(activeDay.date).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[#0B1F3A]">
                  <span className="w-2 h-2 rounded-full bg-[#0B1F3A]" />
                  <span>{activeDay.impressions.toLocaleString('en-GB')} impressions</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#D9603B]">
                  <span className="w-2 h-2 rounded-full bg-[#D9603B]" />
                  <span>{activeDay.clicks} clicks</span>
                </div>
                <div className="font-mono text-[#0B1F3A]/70">
                  CTR: <strong className="text-[#0B1F3A]">{activeDay.ctr}%</strong>
                </div>
                <div className="font-mono text-[#0B1F3A]/70">
                  Pos: <strong className="text-[#0B1F3A]">{activeDay.position}</strong>
                </div>
              </div>
            ) : (
              <span className="text-[#0B1F3A]/60 italic">
                Hover or tap along the chart to inspect daily telemetry
              </span>
            )}

            {/* Legend Indicators */}
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[#0B1F3A]/70 ml-auto">
              {(activeMetric === 'both' || activeMetric === 'impressions') && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A]" />
                  <span>Impressions (Left Axis)</span>
                </span>
              )}
              {(activeMetric === 'both' || activeMetric === 'clicks') && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B]" />
                  <span>Clicks {activeMetric === 'both' ? '(Right Axis)' : ''}</span>
                </span>
              )}
            </div>
          </div>

          {/* Professional SVG Dual-Axis Line & Area Chart */}
          <div className="relative w-full overflow-hidden bg-white rounded-2xl border border-[#0B1F3A]/10 p-2 sm:p-4">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id={`imprGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B1F3A" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id={`clicksGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D9603B" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#D9603B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Scale Labels */}
              {yTicks.map((ratio, idx) => {
                const y = paddingTop + (1 - ratio) * plotHeight;
                const imprVal = Math.round(ratio * maxImpr);
                const clicksVal = Math.round(ratio * maxClicks);

                return (
                  <g key={idx}>
                    {/* Grid line */}
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#0B1F3A"
                      strokeOpacity="0.08"
                      strokeDasharray={idx === yTicks.length - 1 ? 'none' : '3 3'}
                      strokeWidth="1"
                    />

                    {/* Left Y-Axis Label (Impressions) */}
                    {(activeMetric === 'both' || activeMetric === 'impressions') && (
                      <text
                        x={paddingLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[10px] font-mono font-medium fill-[#0B1F3A]/60"
                      >
                        {imprVal}
                      </text>
                    )}

                    {/* Right Y-Axis Label (Clicks in Dual View) */}
                    {activeMetric === 'both' && (
                      <text
                        x={width - paddingRight + 8}
                        y={y + 3}
                        textAnchor="start"
                        className="text-[10px] font-mono font-semibold fill-[#D9603B]"
                      >
                        {clicksVal}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Impressions Area & Line */}
              {(activeMetric === 'both' || activeMetric === 'impressions') && (
                <>
                  <path
                    d={imprAreaPath}
                    fill={`url(#imprGrad-${gradientId})`}
                  />
                  <path
                    d={imprLinePath}
                    fill="none"
                    stroke="#0B1F3A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Clicks Area & Line */}
              {(activeMetric === 'both' || activeMetric === 'clicks') && (
                <>
                  <path
                    d={clicksAreaPath}
                    fill={`url(#clicksGrad-${gradientId})`}
                  />
                  <path
                    d={clicksLinePath}
                    fill="none"
                    stroke="#D9603B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Vertical Crosshair Line on Active Point */}
              {activePoint && (
                <line
                  x1={activePoint.x}
                  y1={paddingTop}
                  x2={activePoint.x}
                  y2={baselineY}
                  stroke="#0B1F3A"
                  strokeOpacity="0.35"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
              )}

              {/* Data Point Dots & Active Pulse Indicators */}
              {points.map((p, idx) => {
                const isActive = idx === activeDayIndex;

                return (
                  <g key={idx}>
                    {/* Impressions Dot */}
                    {(activeMetric === 'both' || activeMetric === 'impressions') && (
                      <>
                        {isActive && (
                          <circle
                            cx={p.x}
                            cy={p.yImpr}
                            r="7"
                            fill="#0B1F3A"
                            fillOpacity="0.25"
                          />
                        )}
                        <circle
                          cx={p.x}
                          cy={p.yImpr}
                          r={isActive ? '4.5' : '2.5'}
                          fill="#0B1F3A"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      </>
                    )}

                    {/* Clicks Dot */}
                    {(activeMetric === 'both' || activeMetric === 'clicks') && (
                      <>
                        {isActive && (
                          <circle
                            cx={p.x}
                            cy={p.yClicks}
                            r="7"
                            fill="#D9603B"
                            fillOpacity="0.30"
                          />
                        )}
                        <circle
                          cx={p.x}
                          cy={p.yClicks}
                          r={isActive ? '4.5' : '2.5'}
                          fill="#D9603B"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Dedicated X-Axis Baseline & Date Labels */}
              <line
                x1={paddingLeft}
                y1={baselineY}
                x2={width - paddingRight}
                y2={baselineY}
                stroke="#0B1F3A"
                strokeOpacity="0.2"
                strokeWidth="1.5"
              />

              {points.map((p, idx) => {
                // Show label every few days and for the last day
                const step = Math.ceil(points.length / 7);
                const shouldShow = idx % step === 0 || idx === points.length - 1;
                if (!shouldShow) return null;

                const dateObj = new Date(p.day.date);
                const label = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                return (
                  <g key={`x-tick-${idx}`}>
                    <line
                      x1={p.x}
                      y1={baselineY}
                      x2={p.x}
                      y2={baselineY + 4}
                      stroke="#0B1F3A"
                      strokeOpacity="0.3"
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={baselineY + 16}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-[#0B1F3A]/60"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Invisible Full-Height Slices for Touch & Hover Interaction */}
              {points.map((p, idx) => {
                const sliceWidth = plotWidth / points.length;
                const sliceX = p.x - sliceWidth / 2;

                return (
                  <rect
                    key={`slice-${idx}`}
                    x={sliceX}
                    y={paddingTop}
                    width={sliceWidth}
                    height={plotHeight + 20}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onTouchStart={() => setHoveredIndex(idx)}
                    onTouchMove={() => setHoveredIndex(idx)}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
