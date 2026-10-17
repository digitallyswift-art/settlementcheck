import { Metadata } from 'next';
import PortalClient from './PortalClient';

export const metadata: Metadata = {
  title: 'Partner Solicitor Portal | SettlementCheck Command Center',
  description: 'Exclusive SRA solicitor portal for territorial matter claims, pre-flight case dossiers, and telemetry benchmarks.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalPage() {
  return <PortalClient />;
}
