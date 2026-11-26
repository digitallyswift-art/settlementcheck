-- SettlementCheck database schema
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/<project-id>/sql

-- ─── OTP Codes ────────────────────────────────────────────────────────────────
-- Stores 6-digit verification codes for email OTP flows.
-- form_type distinguishes 'solicitor' vs 'employee' flows.
-- Codes expire after 10 minutes and are single-use.

create table if not exists otp_codes (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  code         text not null,
  form_type    text not null check (form_type in ('solicitor', 'employee')),
  expires_at   timestamptz not null,
  attempts     integer not null default 0,
  used         boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists otp_codes_email_form_type_idx
  on otp_codes (email, form_type);

-- ─── Solicitor Applications ───────────────────────────────────────────────────
-- Stores panel applications submitted through the /for-solicitors onboarding flow.
-- Email is verified post-submission via single-use SHA-256 verification link.

create table if not exists solicitor_applications (
  id                            uuid primary key default gen_random_uuid(),
  firm_name                     text not null,
  contact_name                  text not null,
  email                         text not null,
  phone                         text,
  coverage                      text,
  office_postcode               text,
  office_lat                    numeric,
  office_lng                    numeric,
  office_region                 text,
  coverage_radius_miles         integer,
  sra_number                    text check (sra_number is null or sra_number ~ '^\d{5,7}$'),
  companies_house_number        text,
  sra_confirmed                 boolean not null default false,
  fee_shield_agreed             boolean not null default false,
  email_verified                boolean not null default false,
  verification_token_hash       text,
  verification_token_expires_at timestamptz,
  status                        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at                    timestamptz not null default now()
);

create index if not exists solicitor_applications_email_idx
  on solicitor_applications (email);

create unique index if not exists solicitor_applications_pending_email_uidx
  on solicitor_applications (lower(email))
  where status = 'pending';

create unique index if not exists solicitor_applications_pending_sra_uidx
  on solicitor_applications (sra_number)
  where status = 'pending' and sra_number is not null;

create index if not exists solicitor_applications_verification_token_hash_idx
  on solicitor_applications (verification_token_hash)
  where verification_token_hash is not null;

create index if not exists solicitor_applications_status_idx
  on solicitor_applications (status);

-- ─── Employee Waitlist ────────────────────────────────────────────────────────
-- Stores verified employee email addresses from the results page waitlist capture.
-- Only inserted after OTP verification succeeds.

create table if not exists employee_waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  verified_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists employee_waitlist_email_idx
  on employee_waitlist (email);

-- ─── Leads ────────────────────────────────────────────────────────────────────
-- Stores employee lead form submissions from the /results page.
-- Captures calculator context so solicitors arrive informed.
-- consent must be true before a row is accepted.

create table if not exists leads (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  email             text not null,
  phone             text not null,
  contact_time      text not null default 'Morning' check (contact_time in ('Morning', 'Afternoon', 'Evening')),
  verdict           text not null,
  offer_amount      numeric(12,2),
  salary            numeric(12,2),
  months_service    integer,
  practice_area     text default 'settlement_agreement',
  postcode          text,
  postcode_region   text,
  postcode_lat      numeric,
  postcode_lng      numeric,
  consent           boolean not null default false,
  status            text not null default 'new' check (status in ('new', 'contacted', 'matched', 'closed')),
  created_at        timestamptz not null default now()
);

create index if not exists leads_status_idx
  on leads (status);

create index if not exists leads_created_at_idx
  on leads (created_at desc);

-- ─── Solicitor Panel (Phase 2 Territorial Lock) ───────────────────────────────
create table if not exists solicitor_panel (
  id                          uuid primary key default gen_random_uuid(),
  auth_user_id                uuid unique,
  firm_name                   text not null,
  sra_number                  text not null check (sra_number ~ '^(SRA-)?\d{5,7}$'),
  contact_name                text not null,
  email                       text not null unique,
  phone                       text not null,
  office_postcode             text not null,
  office_lat                  numeric,
  office_lng                  numeric,
  office_region               text,
  coverage_radius_miles       integer not null default 25,
  exclusive_outward_codes     text[] default array[]::text[],
  tier                        text not null default 'charter' check (tier in ('charter', 'enterprise', 'boutique')),
  status                      text not null default 'active' check (status in ('active', 'paused', 'pending_verification', 'suspended')),
  webhook_pms_url             text,
  leads_claimed_count         integer not null default 0,
  avg_response_minutes        numeric default 12.0,
  companies_house_number      text,
  sra_status                  text default 'authorised' check (sra_status in ('authorised', 'lapsed', 'intervened', 'unknown')),
  sra_last_verified_at        timestamptz,
  companies_house_status      text default 'active' check (companies_house_status in ('active', 'dissolved', 'liquidation', 'insolvency', 'unknown')),
  routing_weight              integer not null default 100 check (routing_weight >= 0 and routing_weight <= 500),
  practice_areas              text[] not null default array['settlement_agreement']::text[],
  weekly_capacity             integer not null default 10 check (weekly_capacity >= 0),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_solicitor_panel_email
  on solicitor_panel (email);

create index if not exists idx_solicitor_panel_status
  on solicitor_panel (status);

create unique index if not exists idx_solicitor_panel_active_sra_uidx
  on solicitor_panel (regexp_replace(sra_number, '^SRA-', ''))
  where status in ('active', 'pending_verification');

-- ─── Territorial Lead Claims & 15-Minute Exclusivity Watchdog ─────────────────
create table if not exists lead_claims (
  id                          uuid primary key default gen_random_uuid(),
  dossier_id                  text not null,
  lead_id                     uuid references leads(id) on delete set null,
  panel_firm_id               uuid references solicitor_panel(id) on delete restrict,
  status                      text not null default 'locked' check (status in ('locked', 'claimed', 'dispatched_pms', 'contacted', 'expired', 'released')),
  claim_token                 text not null unique,
  locked_at                   timestamptz not null default now(),
  expires_at                  timestamptz not null,
  claimed_at                  timestamptz,
  notes                       text,
  created_at                  timestamptz not null default now()
);

-- Atomic counter RPC for claimed matters
create or replace function increment_panel_claimed_count(firm_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update solicitor_panel
  set leads_claimed_count = leads_claimed_count + 1,
      updated_at = now()
  where id = firm_id;
end;
$$;

revoke all on function increment_panel_claimed_count(uuid) from public, anon, authenticated;
grant execute on function increment_panel_claimed_count(uuid) to service_role;

create index if not exists idx_lead_claims_dossier_id
  on lead_claims (dossier_id);

create index if not exists idx_lead_claims_claim_token
  on lead_claims (claim_token);

-- ─── Autonomous SEO Action Logs & Run History ──────────────────────────────
create table if not exists seo_run_logs (
  id                          uuid primary key default gen_random_uuid(),
  run_id                      text not null unique,
  source                      text not null,
  total_queries               integer not null,
  total_impressions           integer not null,
  total_clicks                integer not null,
  avg_ctr                     numeric not null,
  avg_position                numeric not null,
  actions_count               integer not null default 0,
  staged_packages_count       integer not null default 0,
  email_sent                  boolean not null default false,
  digest_json                 jsonb,
  created_at                  timestamptz not null default now()
);

create index if not exists idx_seo_run_logs_created_at
  on seo_run_logs (created_at desc);

create table if not exists seo_autonomous_actions (
  id                          text primary key default gen_random_uuid()::text,
  run_id                      text not null default 'manual_actuation',
  query                       text not null,
  action_type                 text not null default 'INTERNAL_LINK_BOOST',
  priority                    text not null default 'CRITICAL',
  status                      text not null default 'STAGED' check (status in ('STAGED', 'VALIDATED', 'CANARY', 'APPLIED', 'PERMANENT', 'ROLLED_BACK', 'REJECTED')),
  target_canonical_url        text not null,
  calibrated_title            text not null,
  calibrated_meta_description text not null,
  faq_question                text not null default '',
  faq_answer                  text not null default '',
  contextual_link_snippet     text not null default '',
  seo_brief                   jsonb not null default '{}'::jsonb,
  copy_package                jsonb not null default '{}'::jsonb,
  statutory_audit             jsonb not null default '{}'::jsonb,
  anti_ai_quality             jsonb not null default '{}'::jsonb,
  version                     integer not null default 1,
  lock_state                  text not null default 'IDLE',
  locked_by                   text,
  locked_until                timestamptz,
  last_modified_by            text,
  created_at                  timestamptz not null default now()
);

create index if not exists idx_seo_actions_run_id
  on seo_autonomous_actions (run_id);

create index if not exists idx_seo_actions_query
  on seo_autonomous_actions (query);

create index if not exists idx_seo_actions_created_at
  on seo_autonomous_actions (created_at desc);

-- ─── Row Level Security (RLS) & UK GDPR Access Control ────────────────────────
-- Fixes SC-E-PRIV-001 / SC-B-001 (P0 Security & Data Breach Remediation)
-- Enforce strict default-deny RLS across all tables.
-- Only the backend Next.js application operating via SUPABASE_SERVICE_ROLE_KEY
-- has access. Direct anon and authenticated access is strictly denied.

alter table if exists otp_codes enable row level security;
alter table if exists solicitor_applications enable row level security;
alter table if exists employee_waitlist enable row level security;
alter table if exists leads enable row level security;
alter table if exists solicitor_panel enable row level security;
alter table if exists lead_claims enable row level security;
alter table if exists seo_run_logs enable row level security;
alter table if exists seo_autonomous_actions enable row level security;
alter table if exists settlement_outcomes enable row level security;
alter table if exists email_captures enable row level security;

-- Explicit service_role full access policies
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_otp_codes') then
    create policy service_role_all_otp_codes on otp_codes for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_solicitor_applications') then
    create policy service_role_all_solicitor_applications on solicitor_applications for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_employee_waitlist') then
    create policy service_role_all_employee_waitlist on employee_waitlist for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_leads') then
    create policy service_role_all_leads on leads for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_solicitor_panel') then
    create policy service_role_all_solicitor_panel on solicitor_panel for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_lead_claims') then
    create policy service_role_all_lead_claims on lead_claims for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_seo_run_logs') then
    create policy service_role_all_seo_run_logs on seo_run_logs for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_seo_autonomous_actions') then
    create policy service_role_all_seo_autonomous_actions on seo_autonomous_actions for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_settlement_outcomes') then
    create policy service_role_all_settlement_outcomes on settlement_outcomes for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_email_captures') then
    create policy service_role_all_email_captures on email_captures for all to service_role using (true) with check (true);
  end if;
end $$;


-- ─── Calculator A/B Testing Telemetry & Configurations ────────────────────────
-- Experiment tracking for calc_ux_v2 (sequential vs thematic).
-- Privacy-first: strictly zero PII collected.

create table if not exists experiment_events (
  id               uuid primary key default gen_random_uuid(),
  experiment_id    text not null default 'calc_ux_v2',
  variant          text not null check (variant in ('sequential', 'thematic')),
  event_type       text not null check (event_type in ('enrolled', 'stage_viewed', 'completed', 'lead_submitted')),
  stage_number     integer,
  time_elapsed_ms  integer,
  created_at       timestamptz not null default now()
);

create index if not exists idx_exp_events_query 
  on experiment_events (experiment_id, variant, event_type, created_at);

create index if not exists idx_exp_events_created_at
  on experiment_events (created_at desc);

create table if not exists experiment_configurations (
  experiment_id    text primary key,
  mode             text not null default 'split_50_50' check (mode in ('split_50_50', 'winner_selected')),
  winner           text check (winner is null or winner in ('sequential', 'thematic')),
  updated_at       timestamptz not null default now()
);

insert into experiment_configurations (experiment_id, mode, winner)
values ('calc_ux_v2', 'split_50_50', null)
on conflict (experiment_id) do nothing;

alter table if exists experiment_events enable row level security;
alter table if exists experiment_configurations enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_experiment_events') then
    create policy service_role_all_experiment_events on experiment_events for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_experiment_configurations') then
    create policy service_role_all_experiment_configurations on experiment_configurations for all to service_role using (true) with check (true);
  end if;
end $$;
