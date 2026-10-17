-- ─── Phase 2: Solicitor Panel & Territorial Lead Lock ────────────────────────
-- Migration: solicitor_panel & lead_claims (SRA Partner Exclusivity)
-- Apply in Supabase SQL editor: https://app.supabase.com → SQL Editor

-- 1. SRA-Regulated Solicitor Panel
create table if not exists solicitor_panel (
  id                          uuid primary key default gen_random_uuid(),
  firm_name                   text not null,
  sra_number                  text not null,
  contact_name                text not null,
  email                       text not null unique,
  phone                       text not null,
  office_postcode             text not null,
  office_lat                  numeric,
  office_lng                  numeric,
  office_region               text,
  coverage_radius_miles       integer not null default 25,
  exclusive_outward_codes     text[] default array[]::text[], -- e.g. ['BS8', 'BS1', 'SW1A']
  tier                        text not null default 'charter' check (tier in ('charter', 'enterprise', 'boutique')),
  status                      text not null default 'active' check (status in ('active', 'paused', 'pending_verification', 'suspended')),
  webhook_pms_url             text, -- Webhook for automated Clio/LEAP PMS dispatch
  leads_claimed_count         integer not null default 0,
  avg_response_minutes        numeric default 12.0,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_solicitor_panel_email
  on solicitor_panel (email);

create index if not exists idx_solicitor_panel_status
  on solicitor_panel (status);

create index if not exists idx_solicitor_panel_office_postcode
  on solicitor_panel (office_postcode);

-- 2. Territorial Lead Claims & 15-Minute Exclusivity Watchdog
create table if not exists lead_claims (
  id                          uuid primary key default gen_random_uuid(),
  dossier_id                  text not null,
  lead_id                     uuid references leads(id) on delete set null,
  panel_firm_id               uuid references solicitor_panel(id) on delete cascade,
  status                      text not null default 'locked' check (status in ('locked', 'claimed', 'dispatched_pms', 'contacted', 'expired', 'released')),
  claim_token                 text not null unique,
  locked_at                   timestamptz not null default now(),
  expires_at                  timestamptz not null,
  claimed_at                  timestamptz,
  notes                       text,
  created_at                  timestamptz not null default now()
);

create index if not exists idx_lead_claims_dossier_id
  on lead_claims (dossier_id);

create index if not exists idx_lead_claims_claim_token
  on lead_claims (claim_token);

create index if not exists idx_lead_claims_status_expires
  on lead_claims (status, expires_at);

-- 3. Seed initial vetted panel firms for demo / operational testing
insert into solicitor_panel (
  firm_name, sra_number, contact_name, email, phone, office_postcode,
  office_lat, office_lng, office_region, coverage_radius_miles, exclusive_outward_codes, tier, status
) values
(
  'Bristol Employment Law Specialists LLP',
  'SRA-649201',
  'David Thornton',
  'instructions@bristolemploymentlaw.co.uk',
  '0117 920 4500',
  'BS8 1TH',
  51.4584,
  -2.6139,
  'South West',
  30,
  array['BS8', 'BS1', 'BS2', 'BS3', 'BS6', 'BS7', 'BS9'],
  'charter',
  'active'
),
(
  'Westminster Legal Partners',
  'SRA-512890',
  'Eleanor Vance',
  'settlements@westminsterlegal.co.uk',
  '020 7946 0812',
  'SW1A 1AA',
  51.5014,
  -0.1419,
  'London',
  25,
  array['SW1', 'SW1A', 'SW1E', 'SW1H', 'SW1P', 'SW1V', 'SW1W', 'SW1X', 'SW1Y', 'W1', 'WC1', 'EC1'],
  'enterprise',
  'active'
),
(
  'Manchester City Employment Solicitors',
  'SRA-481023',
  'Marcus Sterling',
  'intake@manchester-employment.co.uk',
  '0161 834 2200',
  'M1 1AE',
  53.4794,
  -2.2343,
  'North West',
  35,
  array['M1', 'M2', 'M3', 'M4', 'M15', 'M16', 'M20', 'SK1', 'WA14'],
  'charter',
  'active'
)
on conflict (email) do update set
  exclusive_outward_codes = excluded.exclusive_outward_codes,
  status = 'active';
