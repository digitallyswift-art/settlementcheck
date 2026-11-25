'use client';

import React, { useState } from 'react';
import { trackClientEvent } from '@/lib/telemetry';

export type SigningDeadlineOption = 'within_48h' | 'this_week' | 'ten_plus_days' | 'no_deadline';

interface PostSubmitConflictCardProps {
  leadId?: string;
  email: string;
  source?: string;
}

const DEADLINE_OPTIONS: Array<{ id: SigningDeadlineOption; label: string }> = [
  { id: 'within_48h', label: 'Within 48 hours' },
  { id: 'this_week', label: 'This week' },
  { id: 'ten_plus_days', label: '10+ days' },
  { id: 'no_deadline', label: 'No deadline yet' },
];

export default function PostSubmitConflictCard({
  leadId,
  email,
  source = 'post_submit_card',
}: PostSubmitConflictCardProps) {
  const [employerName, setEmployerName] = useState('');
  const [signingDeadline, setSigningDeadline] = useState<SigningDeadlineOption | ''>('');
  const [hasDraftAgreement, setHasDraftAgreement] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (skipped) {
    return (
      <div className="mt-4 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] px-4 py-3 text-sm text-[#0B1F3A]/80">
        No problem. Your matched solicitor will run the brief conflict check with you on your first call.
      </div>
    );
  }

  if (saved) {
    return (
      <div className="mt-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/20 p-4 text-left space-y-1">
        <div className="flex items-center gap-2 text-sm font-bold text-[#0B1F3A]">
          <span className="inline-flex w-5 h-5 rounded-full bg-[#0B1F3A] text-white items-center justify-center text-xs">
            ✓
          </span>
          Saved confidentially for your matched solicitor
        </div>
        <p className="text-sm text-[#0B1F3A]/75 leading-relaxed m-0">
          Your solicitor can now complete their SRA conflict check before calling you. We never contact your employer.
        </p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerName.trim() && !signingDeadline && !hasDraftAgreement) {
      setError('Add your employer name, deadline, or draft status, or tap Skip below.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/lead/enrich/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          email,
          employerName: employerName.trim() || undefined,
          signingDeadline: signingDeadline || undefined,
          hasDraftAgreement,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not save details. You can still share this on your call.');
      }

      setSaved(true);
      trackClientEvent('lead_conflict_enriched', {
        source,
        has_employer_name: Boolean(employerName.trim()),
        signing_deadline: signingDeadline || 'none',
        has_draft_agreement: hasDraftAgreement,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not save details right now. You can share this on your call.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    trackClientEvent('lead_conflict_skipped', { source });
  };

  return (
    <div className="mt-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] p-4 sm:p-5 text-left">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1F3A]/10 text-[#0B1F3A]">
          Optional · Fast-Track
        </span>
      </div>

      <h4 className="font-serif text-lg font-bold text-[#0B1F3A] m-0 leading-snug">
        Save 15 minutes on your first call
      </h4>
      <p className="text-sm text-[#0B1F3A]/80 leading-relaxed mt-1 mb-4">
        SRA-regulated solicitors must run a quick conflict check before advising you. Sharing your employer&apos;s name now lets your matched solicitor clear that check before they ring.
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="sc-enrich-employer" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
            Employer name <span className="font-normal text-[#0B1F3A]/65">(optional)</span>
          </label>
          <input
            id="sc-enrich-employer"
            type="text"
            value={employerName}
            onChange={e => setEmployerName(e.target.value)}
            placeholder="e.g. Acme UK Ltd"
            autoComplete="organization"
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DCCE] text-base text-[#0B1F3A] placeholder:text-[#0B1F3A]/45 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-[#0B1F3A] mb-2">
            Employer signing deadline <span className="font-normal text-[#0B1F3A]/65">(optional)</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DEADLINE_OPTIONS.map(opt => {
              const selected = signingDeadline === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSigningDeadline(selected ? '' : opt.id)}
                  className={`min-h-[42px] px-3 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer text-left ${
                    selected
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                      : 'bg-white text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]/40'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasDraftAgreement}
            onChange={e => setHasDraftAgreement(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#0B1F3A] rounded"
          />
          <span className="text-sm text-[#0B1F3A]/85 leading-snug">
            I already have a written draft settlement agreement ready to review
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-[#D9603B] m-0">
            {error}
          </p>
        )}

        <p className="text-xs text-[#0B1F3A]/70 leading-relaxed m-0">
          Strictly confidential under UK GDPR. Used solely for SRA conflict checking by your 1 matched solicitor. We never contact your employer.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-sm sm:text-base font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save for my solicitor →'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="min-h-[44px] px-3 py-2 text-sm font-medium text-[#0B1F3A]/75 hover:text-[#0B1F3A] underline underline-offset-2 bg-transparent border-0 cursor-pointer"
          >
            Skip, I will share this on the phone
          </button>
        </div>
      </form>
    </div>
  );
}
