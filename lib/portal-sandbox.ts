import { EmployeeMatterContext } from '@/lib/agentic-engine/types';

export const SANDBOX_DEMO_TOKEN = 'demo_partner_token';

export interface SandboxDossierFixture {
  dossierId: string;
  status: 'locked' | 'claimed';
  matterContext: EmployeeMatterContext;
}

/**
 * Strictly allowlisted synthetic matters for the B2B Solicitor Portal sandbox.
 * Requests matching these exact IDs + SANDBOX_DEMO_TOKEN short-circuit before
 * touching Supabase so live client PII and lead_claims remain completely air-gapped.
 */
export const SANDBOX_DOSSIERS: Readonly<Record<string, SandboxDossierFixture>> = {
  dossier_live_bristol_01: {
    dossierId: 'dossier_live_bristol_01',
    status: 'locked',
    matterContext: {
      matterId: 'dossier_live_bristol_01',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 's.jenkins@example.co.uk',
      phone: '07700 900342',
      postcode: 'BS8 1TH',
      salary: 58000,
      yearsOfService: 5,
      age: 44,
      employerOffer: 6500,
      disputeReason: 'redundancy',
      isDiscrimination: false,
      employerOfferedLegalFee: 500,
      rawAgreementText: `SETTLEMENT AGREEMENT (WITHOUT PREJUDICE & SUBJECT TO CONTRACT)
BETWEEN:
(1) Apex Technology UK Limited ("the Employer")
(2) Sarah Jenkins ("the Employee")

1. The Employment will terminate on the Termination Date by reason of redundancy.
2. The Company will pay the Employee a total ex-gratia compensation payment of £6,500.
3. The Company will contribute up to £500 plus VAT towards the legal fees incurred by the Employee in obtaining independent advice ONLY IF the Employee instructs our preferred panel solicitor Firm XYZ. If the Employee uses an independent solicitor, the contribution will be capped at £200 plus VAT.
4. The Employee waives all statutory and contractual claims against the Company, including claims relating to accrued pension entitlements and personal injury.`,
    },
  },
  dossier_live_london_02: {
    dossierId: 'dossier_live_london_02',
    status: 'claimed',
    matterContext: {
      matterId: 'dossier_live_london_02',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'm.vance@example.co.uk',
      phone: '07700 900418',
      postcode: 'BS1 4PB',
      salary: 72000,
      yearsOfService: 4,
      age: 38,
      employerOffer: 12000,
      disputeReason: 'pip',
      isDiscrimination: false,
      employerOfferedLegalFee: 500,
      rawAgreementText: `SETTLEMENT AGREEMENT (WITHOUT PREJUDICE & SUBJECT TO CONTRACT)
BETWEEN:
(1) Harbourside Financial Services Ltd ("the Employer")
(2) Marcus Vance ("the Employee")

1. The Employment will terminate by mutual agreement following a performance improvement process.
2. The Company will pay the Employee a total compensation payment of £12,000.
3. The Company will contribute up to £500 plus VAT towards independent legal advice.
4. The Employee agrees to a 12-month non-compete restriction across the United Kingdom and provides a full tax indemnity for all payments under this agreement.`,
    },
  },
  dossier_live_clifton_03: {
    dossierId: 'dossier_live_clifton_03',
    status: 'claimed',
    matterContext: {
      matterId: 'dossier_live_clifton_03',
      firstName: 'David H.',
      lastName: 'Miller',
      email: 'd.miller@example.co.uk',
      phone: '07700 900519',
      postcode: 'BS6 6TP',
      salary: 95000,
      yearsOfService: 11,
      age: 49,
      employerOffer: 32000,
      disputeReason: 'redundancy',
      isDiscrimination: false,
      employerOfferedLegalFee: 750,
      rawAgreementText: `SETTLEMENT AGREEMENT (WITHOUT PREJUDICE & SUBJECT TO CONTRACT)
BETWEEN:
(1) Severn Engineering Group PLC ("the Employer")
(2) David H. Miller ("the Employee")

1. The Employment will terminate on the Termination Date by reason of redundancy.
2. The Company will pay the Employee a compensation payment of £32,000 inclusive of statutory redundancy pay.
3. The Company will contribute up to £750 plus VAT towards the Employee's independent legal advice.
4. The Employee agrees to strict confidentiality and waives all statutory and contractual claims, including accrued pension rights.`,
    },
  },
};

export function getSandboxDossierFixture(
  dossierId: string,
  token: string
): SandboxDossierFixture | null {
  if (token !== SANDBOX_DEMO_TOKEN) {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(SANDBOX_DOSSIERS, dossierId)) {
    return null;
  }
  return SANDBOX_DOSSIERS[dossierId];
}
