-- ─── Migration: Enable Row Level Security (RLS) on All Tables ────────────────
-- Fixes SC-E-PRIV-001 / SC-B-001 (P0 Security & Data Breach Remediation)
-- Enforces UK GDPR Article 9 & Data Protection Act 2018 tenant isolation.
-- Applies strict default-deny for anon/authenticated roles. Only service_role
-- (used by Next.js server endpoints) has read/write privileges.

-- 1. Enable RLS on core schema tables
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

-- 2. Explicit service_role full access policies
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
