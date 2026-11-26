-- Migration: B2B Supply-Side Watchdogs (SRA/Companies House Compliance & Territorial Supply-Demand Balancer)

alter table if exists solicitor_panel
  add column if not exists companies_house_number text,
  add column if not exists sra_status text default 'authorised' check (sra_status in ('authorised', 'lapsed', 'intervened', 'unknown')),
  add column if not exists sra_last_verified_at timestamptz,
  add column if not exists companies_house_status text default 'active' check (companies_house_status in ('active', 'dissolved', 'liquidation', 'insolvency', 'unknown')),
  add column if not exists routing_weight integer not null default 100 check (routing_weight >= 0 and routing_weight <= 500),
  add column if not exists practice_areas text[] not null default array['settlement_agreement']::text[],
  add column if not exists weekly_capacity integer not null default 10 check (weekly_capacity >= 0);

alter table if exists solicitor_applications
  add column if not exists companies_house_number text;

alter table if exists leads
  add column if not exists practice_area text default 'settlement_agreement';

create index if not exists idx_solicitor_panel_sra_verified_at
  on solicitor_panel (sra_last_verified_at);

create index if not exists idx_leads_practice_area
  on leads (practice_area);
