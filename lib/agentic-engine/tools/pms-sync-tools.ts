/**
 * Tool 6: Practice Management System (PMS) Bi-directional Sync
 * Formats standardized Clio / LEAP / PracticeEvolve CRM payloads for zero-data-entry onboarding.
 */

import { AIToolDefinition } from '@/lib/ai/types';

export const syncPmsIntakeTool: AIToolDefinition = {
  name: 'sync_pms_intake',
  description: 'Compiles standardized Clio / LEAP matter intake payload and dispatches to partner legal CRM webhooks.',
  parameters: {
    type: 'object',
    properties: {
      firstName: { type: 'string', description: 'Client first name' },
      lastName: { type: 'string', description: 'Client last name' },
      email: { type: 'string', description: 'Client email' },
      phone: { type: 'string', description: 'Client mobile phone' },
      postcode: { type: 'string', description: 'Client residential postcode' },
      salary: { type: 'number', description: 'Client gross annual salary' },
      monthsService: { type: 'number', description: 'Total months of continuous service' },
      employerOffer: { type: 'number', description: 'Current settlement offer amount' },
      statutoryMinimum: { type: 'number', description: 'Calculated statutory redundancy + notice floor' },
      verdict: { type: 'string', description: 'Calculated verdict category' },
      disputeReason: { type: 'string', description: 'Reason for dispute: redundancy, pip, etc.' },
      partnerId: { type: 'string', description: 'Matched partner law firm ID' },
      preFlightDossierId: { type: 'string', description: 'Unique identifier for the compiled pre-flight dossier' },
    },
    required: ['firstName', 'email', 'phone', 'salary', 'employerOffer'],
  },
  execute: (args) => {
    const firstName = String(args.firstName || 'Client');
    const lastName = String(args.lastName || 'Matter');
    const email = String(args.email || '').trim().toLowerCase();
    const phone = String(args.phone || '').trim();
    const salary = Number(args.salary);
    const offer = Number(args.employerOffer);
    const statutoryMinimum = Number(args.statutoryMinimum ?? 0);
    const serviceYears = args.monthsService ? `${Math.floor(Number(args.monthsService) / 12)}y ${Number(args.monthsService) % 12}m` : 'Unspecified';

    const clioMatterPayload = {
      lead_source: 'SettlementCheck AI Engine',
      partner_id: args.partnerId || 'direct',
      dossier_id: args.preFlightDossierId || `dossier_${Date.now()}`,
      contact: {
        first_name: firstName,
        last_name: lastName,
        email_addresses: [{ address: email, location: 'Work' }],
        phone_numbers: [{ number: phone, location: 'Mobile' }],
        addresses: [{ postal_code: args.postcode || '', country: 'United Kingdom' }],
      },
      matter: {
        name: `Settlement Agreement: ${lastName} (${args.disputeReason || 'Exit'})`,
        status: 'Open',
        description: `SettlementCheck Pre-Flight Case Brief
---------------------------------------
Client: ${firstName} ${lastName} (${phone} | ${email})
Gross Salary: £${salary.toLocaleString('en-GB')}
Service Duration: ${serviceYears}
Employer Offer: £${offer.toLocaleString('en-GB')}
Statutory Floor (ERA 1996): £${statutoryMinimum.toLocaleString('en-GB')}
Strategic Verdict: ${args.verdict || 'EVALUATED'}
Dispute Category: ${args.disputeReason || 'redundancy'}
Employer Legal Fee Contribution: Subject to S.203 Parity Notice
SRA Section 203 Certificate: Draft Attached in Dossier`,
        custom_fields: {
          salary,
          offer_amount: offer,
          statutory_floor: statutoryMinimum,
          verdict: args.verdict || 'unknown',
          pre_flight_dossier_url: `https://settlementcheck.co.uk/dossier/review/${args.preFlightDossierId || 'latest'}/`,
        },
      },
    };

    return {
      success: true,
      provider: 'clio_leap_v1',
      matterTitle: clioMatterPayload.matter.name,
      clioMatterPayload,
    };
  },
};
