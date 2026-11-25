import { Metadata } from 'next';
import { cookies } from 'next/headers';
import PortalClient, { PortalInitialSession } from './PortalClient';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Partner Solicitor Portal | SettlementCheck Command Center',
  description: 'Exclusive SRA solicitor portal for territorial matter claims, pre-flight case dossiers, and telemetry benchmarks.',
  robots: {
    index: false,
    follow: false,
  },
};

async function resolveServerPortalSession(isDemoRequested: boolean): Promise<PortalInitialSession> {
  if (isDemoRequested) {
    return { authenticated: true, isDemo: true };
  }

  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get('sb-access-token')?.value?.trim() ||
      cookieStore.get('supabase-auth-token')?.value?.trim() ||
      '';

    if (!token) {
      return { authenticated: false, isDemo: false };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return { authenticated: false, isDemo: false };
    }

    const userRes = await fetch(`${supabaseUrl.replace(/['"]/g, '').trim()}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey.replace(/['"]/g, '').trim(),
      },
      cache: 'no-store',
    });

    if (!userRes.ok) {
      return { authenticated: false, isDemo: false };
    }

    const authUser = await userRes.json();
    const email = typeof authUser?.email === 'string' ? authUser.email.trim().toLowerCase() : '';
    if (!email) {
      return { authenticated: false, isDemo: false };
    }

    const { data: panelFirm, error: panelError } = await supabase
      .from('solicitor_panel')
      .select('firm_name, sra_number, office_postcode, coverage_radius_miles, status')
      .eq('email', email)
      .eq('status', 'active')
      .maybeSingle();

    if (panelError || !panelFirm) {
      return { authenticated: false, isDemo: false };
    }

    return {
      authenticated: true,
      isDemo: false,
      firmName: panelFirm.firm_name,
      sraNumber: panelFirm.sra_number,
      email,
      territoryLabel: `${panelFirm.office_postcode} · ${panelFirm.coverage_radius_miles} mi`,
    };
  } catch {
    return { authenticated: false, isDemo: false };
  }
}

export default async function PortalPage({
  searchParams,
}: {
  searchParams?: { demo?: string };
}) {
  const isDemoRequested = searchParams?.demo === 'true';
  const initialSession = await resolveServerPortalSession(isDemoRequested);
  return <PortalClient initialSession={initialSession} />;
}
