import { Metadata } from 'next';
import ReviewDossierClient from './ReviewDossierClient';

export const metadata: Metadata = {
  title: 'Solicitor Pre-Flight Case Dossier | SettlementCheck',
  description: 'Confidential SRA solicitor pre-flight matter dossier, statutory floor audit, and Section 203 adviser schedule.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReviewDossierPage({ params }: { params: { id: string } }) {
  return <ReviewDossierClient dossierId={params.id} />;
}
