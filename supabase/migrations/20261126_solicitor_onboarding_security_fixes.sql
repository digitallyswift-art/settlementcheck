-- Migration: Solicitor onboarding & portal security fixes
-- 1. Consolidate postcode/radius columns on solicitor_applications
-- 2. Enforce SRA number format CHECK and partial unique indexes for pending/active SRA numbers
-- 3. Add auth_user_id to solicitor_panel for portal SSR session binding
-- 4. Add increment_panel_claimed_count RPC (service_role only)
-- 5. Change lead_claims.panel_firm_id FK from ON DELETE CASCADE to ON DELETE RESTRICT

-- ─── 1. Postcode & radius columns on solicitor_applications ───────────────────
alter table if exists solicitor_applications
  add column if not exists office_postcode text,
  add column if not exists office_lat numeric,
  add column if not exists office_lng numeric,
  add column if not exists office_region text,
  add column if not exists coverage_radius_miles integer;

-- ─── 2. SRA number format CHECK & partial unique indexes ──────────────────────
-- Null out any malformed legacy sra_number values before applying CHECK
update solicitor_applications
set sra_number = null
where sra_number is not null
  and sra_number !~ '^\d{5,7}$';

-- Deduplicate any legacy duplicate pending SRA numbers (keep most recent)
with ranked_pending_sra as (
  select
    id,
    row_number() over (
      partition by sra_number
      order by created_at desc, id desc
    ) as rn
  from solicitor_applications
  where status = 'pending'
    and sra_number is not null
)
update solicitor_applications
set status = 'rejected'
where id in (select id from ranked_pending_sra where rn > 1);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'solicitor_applications_sra_number_check'
      and conrelid = 'solicitor_applications'::regclass
  ) then
    alter table solicitor_applications
      add constraint solicitor_applications_sra_number_check
      check (sra_number is null or sra_number ~ '^\d{5,7}$');
  end if;
end $$;

create unique index if not exists solicitor_applications_pending_sra_uidx
  on solicitor_applications (sra_number)
  where status = 'pending' and sra_number is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'solicitor_panel_sra_number_check'
      and conrelid = 'solicitor_panel'::regclass
  ) then
    alter table solicitor_panel
      add constraint solicitor_panel_sra_number_check
      check (sra_number ~ '^(SRA-)?\d{5,7}$');
  end if;
end $$;

create unique index if not exists idx_solicitor_panel_active_sra_uidx
  on solicitor_panel (regexp_replace(sra_number, '^SRA-', ''))
  where status in ('active', 'pending_verification');

-- ─── 3. Portal auth user binding on solicitor_panel ───────────────────────────
alter table if exists solicitor_panel
  add column if not exists auth_user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'solicitor_panel_auth_user_id_key'
      and conrelid = 'solicitor_panel'::regclass
  ) then
    alter table solicitor_panel
      add constraint solicitor_panel_auth_user_id_key unique (auth_user_id);
  end if;
end $$;

-- ─── 4. Atomic claim counter RPC ──────────────────────────────────────────────
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

-- ─── 5. Preserve lead_claims audit history with ON DELETE RESTRICT ────────────
do $$
declare
  fk_name text;
begin
  select c.conname
  into fk_name
  from pg_constraint c
  join pg_attribute a
    on a.attrelid = c.conrelid
   and a.attnum = any(c.conkey)
  where c.conrelid = 'lead_claims'::regclass
    and c.contype = 'f'
    and a.attname = 'panel_firm_id'
  limit 1;

  if fk_name is not null then
    execute format('alter table lead_claims drop constraint %I', fk_name);
  end if;

  alter table lead_claims
    add constraint lead_claims_panel_firm_id_fkey
    foreign key (panel_firm_id)
    references solicitor_panel(id)
    on delete restrict;
end $$;
