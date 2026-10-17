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
  used         boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists otp_codes_email_form_type_idx
  on otp_codes (email, form_type);

-- ─── Solicitor Applications ───────────────────────────────────────────────────
-- Stores panel applications submitted through the /for-solicitors Typeform flow.
-- Email is verified via OTP before the application is accepted.

create table if not exists solicitor_applications (
  id           uuid primary key default gen_random_uuid(),
  firm_name    text not null,
  contact_name text not null,
  email        text not null,
  phone        text,
  coverage     text,
  sra_confirmed boolean not null default false,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

create index if not exists solicitor_applications_email_idx
  on solicitor_applications (email);

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
  exclusive_outward_codes     text[] default array[]::text[],
  tier                        text not null default 'charter' check (tier in ('charter', 'enterprise', 'boutique')),
  status                      text not null default 'active' check (status in ('active', 'paused', 'pending_verification', 'suspended')),
  webhook_pms_url             text,
  leads_claimed_count         integer not null default 0,
  avg_response_minutes        numeric default 12.0,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_solicitor_panel_email
  on solicitor_panel (email);

create index if not exists idx_solicitor_panel_status
  on solicitor_panel (status);

-- ─── Territorial Lead Claims & 15-Minute Exclusivity Watchdog ─────────────────
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
  id                          uuid primary key default gen_random_uuid(),
  run_id                      text not null,
  query                       text not null,
  action_type                 text not null,
  priority                    text not null,
  status                      text not null default 'STAGED' check (status in ('STAGED', 'VALIDATED', 'APPLIED', 'REJECTED')),
  target_canonical_url        text not null,
  calibrated_title            text not null,
  calibrated_meta_description text not null,
  faq_question                text not null,
  faq_answer                  text not null,
  contextual_link_snippet     text not null,
  seo_brief                   jsonb not null default '{}'::jsonb,
  copy_package                jsonb not null default '{}'::jsonb,
  statutory_audit             jsonb not null default '{}'::jsonb,
  anti_ai_quality             jsonb not null default '{}'::jsonb,
  created_at                  timestamptz not null default now()
);

create index if not exists idx_seo_actions_run_id
  on seo_autonomous_actions (run_id);

create index if not exists idx_seo_actions_query
  on seo_autonomous_actions (query);

create index if not exists idx_seo_actions_created_at
  on seo_autonomous_actions (created_at desc);
