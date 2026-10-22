'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';

export default function CockpitAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured, signInWithEmail, signInWithGoogle, signInWithDevPasskey } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#D9603B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#0B1F3A]/70 uppercase tracking-wider">
            Verifying Cockpit Access...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const res = await signInWithEmail(email, password);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    }
    setIsSubmitting(false);
  };

  const handleGoogleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const res = await signInWithGoogle();
    if (!res.success) {
      setError(res.error || 'Google authentication failed');
    }
    setIsSubmitting(false);
  };

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const res = await signInWithDevPasskey(passkey);
    if (!res.success) {
      setError(res.error || 'Invalid administrator passkey');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#0B1F3A]/10 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#0B1F3A] p-6 text-white text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9603B]/20 text-[#D9603B] text-[11px] font-mono font-bold uppercase tracking-widest border border-[#D9603B]/30">
            <span>🛡️ SettlementCheck Cockpit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Administrator Gateway
          </h1>
          <p className="text-xs text-white/70 max-w-xs mx-auto">
            Autonomous Fleet Command, Human-In-The-Loop Approvals & Inbound Leads Monitor
          </p>
        </div>

        {/* Auth Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
              <strong className="font-semibold block">Authentication Error</strong>
              <p>{error}</p>
            </div>
          )}

          {isConfigured ? (
            /* Firebase Live Mode */
            <div className="space-y-4">
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@settlementcheck.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/15 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/15 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In with Firebase Email →'}
                </button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#0B1F3A]/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                  <span className="bg-white px-2 text-[#0B1F3A]/40">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl border border-[#0B1F3A]/15 bg-white hover:bg-[#F7F4EE] text-xs font-semibold text-[#0B1F3A] transition-all flex items-center justify-center gap-2"
              >
                <span>🌐</span>
                <span>Sign In with Google</span>
              </button>
            </div>
          ) : (
            /* Firebase Ready Wiring + Passkey Mode */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-xs text-[#0B1F3A]/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B1F3A]">
                  <span>⚡ Firebase Wiring Active</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Firebase project credentials will activate automatically once environment variables are populated. In the meantime, enter the administrator passkey to access the cockpit immediately.
                </p>
              </div>

              <form onSubmit={handlePasskeySubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">
                    Administrator Passkey
                  </label>
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/15 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Accessing...' : 'Enter Website Cockpit →'}
                </button>
              </form>
            </div>
          )}

          <div className="pt-2 text-center border-t border-[#0B1F3A]/5">
            <span className="text-[11px] text-[#0B1F3A]/50">
              SRA-compliant legal tech platform · Strictly confidential
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
