'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Ga4RealtimeData,
  Ga4TodayMetrics,
  Ga4ConnectionCheck,
} from '@/lib/agentic-engine/services/ga4-client';

interface RealtimeApiResponse {
  success: boolean;
  configured: boolean;
  check: Ga4ConnectionCheck;
  realtime?: Ga4RealtimeData;
  today?: Ga4TodayMetrics | null;
  timestamp: string;
}

export default function CockpitGa4RealtimeCard() {
  const [data, setData] = useState<RealtimeApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(15); // 0 = off, 15s, 30s
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cockpit/realtime/', {
        cache: 'no-store',
      });
      const json: RealtimeApiResponse = await res.json();
      setData(json);
      setLastRefreshedAt(new Date().toLocaleTimeString('en-GB'));
    } catch (err) {
      console.error('Error fetching GA4 realtime data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh timer
  useEffect(() => {
    if (refreshInterval <= 0) return;
    const timer = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);
    return () => clearInterval(timer);
  }, [refreshInterval, fetchData]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const isConnected = data?.configured && data?.success && Boolean(data?.realtime);
  const check = data?.check;
  const realtime = data?.realtime;
  const today = data?.today;

  return (
    <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-5 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0B1F3A]/5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            {isConnected ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] animate-ping absolute" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] relative" />
              </>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            )}
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1F3A] flex items-center gap-2">
              Google Analytics 4 Live Telemetry
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A]/70 font-semibold">
                GA4 Realtime
              </span>
            </h3>
            <p className="text-xs text-[#0B1F3A]/60">
              {isConnected
                ? `Streaming active visitors in the last 30 minutes · Property ${realtime?.propertyId}`
                : 'Direct connection to Google Analytics Data API v1beta'}
            </p>
          </div>
        </div>

        {/* Controls: Refresh interval & Manual Trigger */}
        <div className="flex items-center gap-2 text-xs">
          {lastRefreshedAt && (
            <span className="text-[11px] font-mono text-[#0B1F3A]/50 hidden md:inline">
              Updated: {lastRefreshedAt}
            </span>
          )}
          <div className="flex items-center rounded-xl bg-[#0B1F3A]/5 p-0.5 border border-[#0B1F3A]/10">
            <button
              onClick={() => setRefreshInterval(15)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                refreshInterval === 15
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              15s
            </button>
            <button
              onClick={() => setRefreshInterval(30)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                refreshInterval === 30
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              30s
            </button>
            <button
              onClick={() => setRefreshInterval(0)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                refreshInterval === 0
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
              }`}
            >
              Paused
            </button>
          </div>

          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="p-1.5 rounded-xl border border-[#0B1F3A]/15 text-[#0B1F3A] hover:bg-[#0B1F3A]/5 transition-colors disabled:opacity-50"
            title="Refresh now"
            aria-label="Refresh now"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* When GA4 is connected and live */}
      {isConnected && realtime && (
        <div className="space-y-5">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Active Users Right Now */}
            <div className="p-4 rounded-2xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/10 space-y-1">
              <span className="text-xs font-semibold text-[#0B1F3A]/60 block">
                Active Users (Last 30m)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-[#0B1F3A]">
                  {realtime.activeUsersLast30Min}
                </span>
                <span className="text-[11px] font-mono font-medium text-[#D9603B]">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-[#0B1F3A]/50 block">
                Across all site pages
              </span>
            </div>

            {/* Today Active Users */}
            <div className="p-4 rounded-2xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/10 space-y-1">
              <span className="text-xs font-semibold text-[#0B1F3A]/60 block">
                Today&apos;s Visitors
              </span>
              <span className="text-3xl font-serif font-bold text-[#0B1F3A] block">
                {today ? today.activeUsers.toLocaleString('en-GB') : '-'}
              </span>
              <span className="text-[10px] text-[#0B1F3A]/50 block">
                {today ? `${today.sessions.toLocaleString('en-GB')} total sessions` : 'Standard API'}
              </span>
            </div>

            {/* Today Page Views */}
            <div className="p-4 rounded-2xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/10 space-y-1">
              <span className="text-xs font-semibold text-[#0B1F3A]/60 block">
                Today&apos;s Page Views
              </span>
              <span className="text-3xl font-serif font-bold text-[#0B1F3A] block">
                {today ? today.screenPageViews.toLocaleString('en-GB') : '-'}
              </span>
              <span className="text-[10px] text-[#0B1F3A]/50 block">
                {today?.averageSessionDuration
                  ? `Avg duration: ${Math.floor(today.averageSessionDuration / 60)}m ${today.averageSessionDuration % 60}s`
                  : 'Cumulative today'}
              </span>
            </div>

            {/* Device Dominance */}
            <div className="p-4 rounded-2xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/10 space-y-1">
              <span className="text-xs font-semibold text-[#0B1F3A]/60 block">
                Active Devices
              </span>
              <div className="flex flex-col gap-0.5 pt-0.5">
                {realtime.devices.length > 0 ? (
                  realtime.devices.map((d) => (
                    <div
                      key={d.deviceCategory}
                      className="flex items-center justify-between text-[11px] font-mono"
                    >
                      <span className="capitalize text-[#0B1F3A]/70">{d.deviceCategory}:</span>
                      <span className="font-bold text-[#0B1F3A]">{d.activeUsers}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-[#0B1F3A]/40 font-mono">No device signal</span>
                )}
              </div>
            </div>
          </div>

          {/* Minute by Minute Sparkline (0 to 29 mins ago) */}
          <div className="p-4 rounded-2xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0B1F3A]/70">
                User Activity Per Minute (Last 30 Minutes)
              </span>
              <span className="text-[10px] font-mono text-[#0B1F3A]/50">
                29 min ago → Now (0 min)
              </span>
            </div>
            <div className="h-14 flex items-end gap-1 pt-2">
              {realtime.activeUsersPerMinute.map((item) => {
                const max = Math.max(
                  ...realtime.activeUsersPerMinute.map((m) => m.activeUsers),
                  1
                );
                const heightPct = Math.max((item.activeUsers / max) * 100, 6);
                const isCurrentMinute = item.minuteAgo === 0;

                return (
                  <div
                    key={item.minuteAgo}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0B1F3A] text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none">
                      {item.minuteAgo === 0 ? 'Now' : `${item.minuteAgo}m ago`}: {item.activeUsers} user{item.activeUsers === 1 ? '' : 's'}
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-xs transition-all ${
                        isCurrentMinute
                          ? 'bg-[#D9603B]'
                          : item.activeUsers > 0
                          ? 'bg-[#0B1F3A]/70 hover:bg-[#D9603B]'
                          : 'bg-[#0B1F3A]/10'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Active Pages & Geographic Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Pages */}
            <div className="p-4 rounded-2xl border border-[#0B1F3A]/10 space-y-2.5">
              <span className="text-xs font-bold text-[#0B1F3A] block">
                Top Active Pages Right Now
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {realtime.topPages.length > 0 ? (
                  realtime.topPages.map((page, idx) => (
                    <div
                      key={page.screenName + idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#0B1F3A]/5 last:border-b-0"
                    >
                      <span
                        className="font-mono text-[11px] text-[#0B1F3A] truncate max-w-[240px]"
                        title={page.screenName}
                      >
                        {page.screenName}
                      </span>
                      <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                        <span className="text-[#0B1F3A]/60">
                          {page.screenPageViews} views
                        </span>
                        <span className="font-bold text-[#0B1F3A] px-1.5 py-0.2 rounded bg-[#0B1F3A]/5">
                          {page.activeUsers} active
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#0B1F3A]/50 py-3 text-center">
                    No active visitors recorded on pages in the last 30 minutes.
                  </p>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="p-4 rounded-2xl border border-[#0B1F3A]/10 space-y-2.5">
              <span className="text-xs font-bold text-[#0B1F3A] block">
                Visitor Locations (Real-Time)
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {realtime.locations.length > 0 ? (
                  realtime.locations.map((loc, idx) => (
                    <div
                      key={`${loc.city}-${loc.country}-${idx}`}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#0B1F3A]/5 last:border-b-0"
                    >
                      <span className="text-[#0B1F3A]/80 font-medium truncate">
                        {loc.city && loc.city !== '(not set)' ? `${loc.city}, ` : ''}{loc.country}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#0B1F3A] px-1.5 py-0.2 rounded bg-[#0B1F3A]/5">
                        {loc.activeUsers} active
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#0B1F3A]/50 py-3 text-center">
                    No geographic signal in current window.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup & Diagnostic Assistant when connection requires configuration */}
      {!isConnected && check && (
        <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/25 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚙️</span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#0B1F3A]">
                {check.status === 'NEEDS_API_ENABLEMENT' && 'Google Analytics Data API Not Enabled Yet'}
                {check.status === 'NEEDS_PROPERTY_ACCESS' && 'GA4 Property Access Required for Service Account'}
                {check.status === 'INVALID_PROPERTY_ID' && 'Invalid GA4 Property ID'}
                {check.status === 'MISSING_CONFIGURATION' && 'GA4 Credentials or Property ID Missing'}
                {check.status === 'ERROR' && 'GA4 API Handshake Issue'}
              </h4>
              <p className="text-xs text-[#0B1F3A]/80 leading-relaxed">
                {check.message}
              </p>
            </div>
          </div>

          {/* Step by Step Resolution Box */}
          <div className="bg-white p-4 rounded-xl border border-[#0B1F3A]/10 text-xs space-y-3">
            <span className="font-bold text-[#0B1F3A] block">
              Quick Setup Steps to Complete Connection:
            </span>

            {/* Step 1: Enable Google Analytics Data API */}
            <div className="flex items-start gap-2 text-[#0B1F3A]/80">
              <span className="font-mono font-bold text-[#D9603B]">1.</span>
              <div>
                <strong>Enable Google Analytics Data API:</strong>{' '}
                {check.activationUrl ? (
                  <a
                    href={check.activationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#D9603B] underline underline-offset-2 hover:opacity-80"
                  >
                    Click here to enable Google Analytics Data API in Google Cloud Console →
                  </a>
                ) : (
                  <span>
                    Visit{' '}
                    <a
                      href="https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D9603B] underline underline-offset-2"
                    >
                      Google Cloud Console
                    </a>{' '}
                    and click &quot;Enable&quot;.
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Add Service Account as Viewer in GA4 */}
            {check.clientEmail && (
              <div className="flex items-start gap-2 text-[#0B1F3A]/80">
                <span className="font-mono font-bold text-[#D9603B]">2.</span>
                <div className="space-y-1">
                  <span>
                    <strong>Grant Viewer Role in Google Analytics 4:</strong> Go to{' '}
                    <a
                      href="https://analytics.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D9603B] underline underline-offset-2"
                    >
                      Google Analytics
                    </a>{' '}
                    → <strong>Admin</strong> (gear icon bottom left) → <strong>Property Access Management</strong> → click <strong>+</strong> → <strong>Add users</strong>:
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <code className="px-2 py-1 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-lg font-mono text-[11px] text-[#0B1F3A]">
                      {check.clientEmail}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(check.clientEmail!)}
                      className="px-2.5 py-1 rounded-lg bg-[#0B1F3A] text-white text-[11px] font-mono hover:bg-[#0B1F3A]/90 transition-colors"
                    >
                      {copiedEmail ? 'Copied! ✓' : 'Copy Email'}
                    </button>
                    <span className="text-[11px] text-[#0B1F3A]/60">(Assign: Viewer)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Set GA4_PROPERTY_ID */}
            <div className="flex items-start gap-2 text-[#0B1F3A]/80">
              <span className="font-mono font-bold text-[#D9603B]">3.</span>
              <div>
                <strong>Set GA4_PROPERTY_ID:</strong> In Google Analytics → <strong>Admin</strong> → <strong>Property Settings</strong>, copy the numeric Property ID (e.g. <code>423859201</code>) and add to <code>.env.local</code>:
                <div className="pt-1">
                  <code className="px-2 py-1 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-lg font-mono text-[11px] text-[#0B1F3A]">
                    GA4_PROPERTY_ID={check.propertyId || '123456789'}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-[#0B1F3A]/60">
              Measurement ID: <strong>{check.measurementId || 'G-24BBF7DRPG'}</strong>
            </span>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#0B1F3A]/90 transition-colors flex items-center gap-1.5"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Test Connection Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
