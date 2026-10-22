'use client';

import React, { useState } from 'react';

interface RejectModalProps {
  pkg: any;
  onClose: () => void;
  onConfirmReject: (packageId: string, reason: string) => Promise<void>;
}

export default function RejectModal({ pkg, onClose, onConfirmReject }: RejectModalProps) {
  const [selectedTag, setSelectedTag] = useState('Tone / Brand mismatch');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = [
    'Tone / Brand mismatch',
    'Prefer statutory redundancy focus over tax',
    'Search query intent mismatch',
    'Duplicate / Page already optimized',
    'Other reason',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullReason = customNote.trim() ? `${selectedTag}: ${customNote.trim()}` : selectedTag;
    await onConfirmReject(pkg.id, fullReason);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#0B1F3A]/15 shadow-2xl overflow-hidden my-8">
        <div className="p-5 sm:p-6 border-b border-[#0B1F3A]/10 bg-red-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-200 block">
              Human-in-the-Loop Rejection
            </span>
            <h2 className="text-lg font-serif font-bold text-white">
              Reject Recommendation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#0B1F3A]">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#0B1F3A]/70 block">Target Query</span>
            <p className="text-sm font-bold font-serif">&ldquo;{pkg.query}&rdquo;</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0B1F3A] block">
              Reason for Rejection
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-[#0B1F3A] text-white shadow-sm'
                      : 'bg-[#0B1F3A]/5 text-[#0B1F3A]/80 hover:bg-[#0B1F3A]/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0B1F3A] block">
              Additional Feedback for Autonomous Agents (Optional)
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Keep title focused on redundancy payout instead of legal fees..."
              className="w-full px-3 py-2 rounded-xl border border-[#0B1F3A]/20 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="p-4 bg-[#F7F4EE] rounded-2xl border border-[#0B1F3A]/5 text-[11px] text-[#0B1F3A]/70">
            Rejecting this package marks it as rejected and records feedback to prevent agents from suggesting identical patterns in future runs.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
