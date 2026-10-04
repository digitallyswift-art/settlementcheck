-- ─── Proprietary Telemetry & Outcome Flywheel ─────────────────────────────

-- Captures anonymized real-world settlement outcomes to build SettlementCheck's
-- 10-year proprietary dataset (what employers actually pay in practice).
-- Strictly zero-PII for GDPR and SRA client confidentiality.

create table if not exists settlement_outcomes (
  id                          uuid primary key default gen_random_uuid(),
  created_at                  timestamptz not null default now(),

  -- Case Dimensions (Zero PII)
  dispute_category            text not null check (dispute_category in ('redundancy', 'pip', 'discrimination', 'whistleblowing', 'constructive_dismissal', 'other')),
  industry_sector             text,
  employer_size_bracket       text check (employer_size_bracket in ('micro', 'sme', 'enterprise')),
  tenure_months               integer not null,
  gross_annual_salary         numeric(12,2) not null,
  jurisdiction                text not null default 'GB' check (jurisdiction in ('GB', 'NI')),

  -- Financial Telemetry
  initial_employer_offer      numeric(12,2),
  final_settled_amount        numeric(12,2) not null,
  legal_fees_paid_by_employer numeric(12,2),
  settlement_multiplier       numeric(6,2), -- final_settled_amount / gross_annual_salary

  -- Negotiation Resolution
  duration_weeks              integer,
  represented_by_sra_firm     boolean not null default true,
  source                      text not null default 'solicitor_outcome_report' check (source in ('solicitor_outcome_report', 'verified_employee_report', 'benchmark_import'))
);

create index if not exists idx_outcomes_category_salary
  on settlement_outcomes (dispute_category, gross_annual_salary);

create index if not exists idx_outcomes_created_at
  on settlement_outcomes (created_at desc);

-- Aggregate benchmark view for instant percentile queries in AI agents & UI
create or replace view settlement_benchmark_aggregates as
select
  dispute_category,
  count(*) as sample_size,
  round(avg(settlement_multiplier), 2) as avg_settlement_multiplier,
  round(avg(legal_fees_paid_by_employer), 0) as avg_legal_fee_contribution,
  round(avg(duration_weeks), 1) as avg_duration_weeks
from settlement_outcomes
group by dispute_category;