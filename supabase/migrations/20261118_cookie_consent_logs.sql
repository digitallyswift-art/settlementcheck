-- ─── Cookie & Analytics Consent Audit Log (UK GDPR Art. 7(1) / UK PECR) ───────
-- Privacy-first: stores anonymous consent_id receipts, granted categories,
-- policy version, sanitized page path, salted IP hash (never raw IP), and
-- server-authoritative timestamp. Zero PII stored.

create table if not exists cookie_consent_logs (
  id              uuid primary key default gen_random_uuid(),
  consent_id      uuid not null,
  action          text not null check (action in ('accept_all', 'reject_non_essential', 'custom_save', 'withdraw')),
  policy_version  text not null default '2026-11',
  necessary       boolean not null default true,
  analytics       boolean not null default false,
  marketing       boolean not null default false,
  page_path       text,
  ip_hash         text,
  user_agent      text,
  consented_at    timestamptz not null default now()
);

-- Lookup consent & withdrawal history for a specific anonymous receipt ID
create index if not exists idx_cookie_consent_logs_consent_id_time
  on cookie_consent_logs (consent_id, consented_at desc);

-- Chronological audit queries & retention cleanup
create index if not exists idx_cookie_consent_logs_consented_at
  on cookie_consent_logs (consented_at desc);

-- Row Level Security: strict default-deny for anon/authenticated; service_role only
alter table if exists cookie_consent_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'service_role_all_cookie_consent_logs'
  ) then
    create policy service_role_all_cookie_consent_logs
      on cookie_consent_logs
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;
