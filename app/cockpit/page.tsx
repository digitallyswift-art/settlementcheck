import { Metadata } from 'next';
import { AuthProvider } from '@/lib/firebase/auth-context';
import CockpitAuthGate from './components/CockpitAuthGate';
import CockpitClient from './CockpitClient';

export const metadata: Metadata = {
  title: 'Website Cockpit & Autonomous Fleet Command | SettlementCheck',
  description: 'Executive cockpit for autonomous SEO approvals, real-time website telemetry, and inbound lead monitoring.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CockpitPage() {
  return (
    <AuthProvider>
      <CockpitAuthGate>
        <CockpitClient />
      </CockpitAuthGate>
    </AuthProvider>
  );
}
