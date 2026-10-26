'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DateRangeMeta {
  preset: string;
  startDate: string;
  endDate: string;
  telemetryEndDate?: string;
  label: string;
  formatted: string;
  daysCount: number;
  gscLagDays: number;
  source: 'GSC_LIVE_API' | 'LOCAL_ARCHIVE_FALLBACK';
}

interface CockpitDateFilterProps {
  dateRangeMeta?: DateRangeMeta | null;
  isLoading?: boolean;
  onSelectRange: (preset: string, customStart?: string, customEnd?: string) => void;
}

const PRESET_OPTIONS = [
  { id: '7d', label: 'Last 7 days', description: 'Immediate weekly momentum' },
  { id: '28d', label: 'Last 28 days', description: 'Google Search Console default view', isDefault: true },
  { id: '30d', label: 'Last 30 days', description: 'Calendar monthly review' },
  { id: '90d', label: 'Last 3 months', description: 'Quarterly trend & seasonals' },
  { id: 'custom', label: 'Custom range', description: 'Select specific start and end dates' },
];

export default function CockpitDateFilter({
  dateRangeMeta,
  isLoading = false,
  onSelectRange,
}: CockpitDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>(dateRangeMeta?.preset || '28d');
  
  // Custom date range state
  const [customStart, setCustomStart] = useState<string>(
    dateRangeMeta?.startDate || new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [customEnd, setCustomEnd] = useState<string>(
    dateRangeMeta?.endDate || new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if dateRangeMeta changes from external source
  useEffect(() => {
    if (dateRangeMeta) {
      setSelectedPreset(dateRangeMeta.preset);
      if (dateRangeMeta.startDate) setCustomStart(dateRangeMeta.startDate);
      if (dateRangeMeta.endDate) setCustomEnd(dateRangeMeta.endDate);
      if (dateRangeMeta.preset === 'custom') {
        setActiveTab('custom');
      }
    }
  }, [dateRangeMeta]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleApplyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'custom') {
      setActiveTab('custom');
      return;
    }
    onSelectRange(presetId);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    setValidationError(null);
    if (!customStart || !customEnd) {
      setValidationError('Please select both a start date and an end date.');
      return;
    }
    if (customStart > customEnd) {
      setValidationError('Start date must be before or equal to end date.');
      return;
    }

    onSelectRange('custom', customStart, customEnd);
    setIsOpen(false);
  };

  // Human-readable trigger text
  const triggerLabel = dateRangeMeta?.label || 'Last 28 days';
  const triggerRangeFmt = dateRangeMeta?.formatted || 'Google Search Console';

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* GSC-Style Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#0B1F3A]/5 border border-[#0B1F3A]/20 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="text-base leading-none">📅</span>
        <div className="text-left flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="text-xs font-bold text-[#0B1F3A] flex items-center gap-1.5">
            {triggerLabel}
            {isLoading && (
              <span className="inline-block w-3 h-3 border-2 border-[#D9603B] border-t-transparent rounded-full animate-spin" />
            )}
          </span>
          <span className="text-[11px] font-mono text-[#0B1F3A]/60 whitespace-nowrap">
            {triggerRangeFmt}
          </span>
        </div>
        <span className="text-xs text-[#0B1F3A]/50 ml-1">▾</span>
      </button>

      {/* Popover / Calendar Modal */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-[340px] sm:w-[420px] bg-white rounded-3xl border border-[#0B1F3A]/15 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-[#F7F4EE] border-b border-[#0B1F3A]/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#0B1F3A]">Date Range Horizon</h3>
              <p className="text-[11px] text-[#0B1F3A]/60">
                Filter Search Console impressions, clicks &amp; dispute leads
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#0B1F3A]/50 hover:text-[#0B1F3A] text-lg font-bold p-1 leading-none"
              aria-label="Close date filter"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation: Quick Presets vs Custom Calendar */}
          <div className="flex border-b border-[#0B1F3A]/10 bg-white p-1.5 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'presets'
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'text-[#0B1F3A]/70 hover:bg-[#0B1F3A]/5'
              }`}
            >
              ⚡ Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'custom'
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'text-[#0B1F3A]/70 hover:bg-[#0B1F3A]/5'
              }`}
            >
              📅 Custom Dates
            </button>
          </div>

          {/* Tab Content 1: Presets */}
          {activeTab === 'presets' && (
            <div className="p-3 space-y-1.5 max-h-[300px] overflow-y-auto">
              {PRESET_OPTIONS.map((opt) => {
                const isSelected = selectedPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleApplyPreset(opt.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#D9603B] bg-[#D9603B]/5'
                        : 'border-[#0B1F3A]/10 hover:border-[#0B1F3A]/25 hover:bg-[#0B1F3A]/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#D9603B]' : 'text-[#0B1F3A]'}`}>
                          {opt.label}
                        </span>
                        {opt.isDefault && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#0B1F3A]/10 text-[#0B1F3A] text-[9px] font-mono font-bold uppercase">
                            GSC Default
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#0B1F3A]/60 block mt-0.5">
                        {opt.description}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[#D9603B] font-bold text-sm">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content 2: Custom Range Picker */}
          {activeTab === 'custom' && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#0B1F3A]/70 block">
                    Start Date (From)
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    max={customEnd || undefined}
                    className="w-full px-3 py-2 rounded-xl border border-[#0B1F3A]/20 text-xs font-mono text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#0B1F3A]/70 block">
                    End Date (To)
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    min={customStart || undefined}
                    className="w-full px-3 py-2 rounded-xl border border-[#0B1F3A]/20 text-xs font-mono text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  ⚠️ {validationError}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    // Quick reset to 28 days
                    handleApplyPreset('28d');
                  }}
                  className="text-xs text-[#0B1F3A]/60 hover:text-[#0B1F3A] underline"
                >
                  Reset to 28 days
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-[#0B1F3A]/15 text-xs font-semibold text-[#0B1F3A] hover:bg-[#0B1F3A]/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    className="px-4 py-1.5 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Apply Horizon
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GSC Verification Lag & Telemetry Disclaimer */}
          <div className="p-3 bg-[#0B1F3A]/5 border-t border-[#0B1F3A]/10 text-[11px] text-[#0B1F3A]/70 flex items-start gap-2">
            <span className="text-xs">⏱️</span>
            <div className="leading-tight space-y-0.5">
              <strong className="text-[#0B1F3A] font-semibold block">Google Processing Window</strong>
              <span>
                GSC search impressions and clicks have a standard ~3-day lag for Google verification. Inbound leads and calculator runs stream in real-time.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
