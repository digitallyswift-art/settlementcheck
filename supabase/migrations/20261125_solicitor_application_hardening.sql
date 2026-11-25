-- Migration: Harden solicitor_applications schema for 2-step onboarding & post-submit verification
-- Adds SRA number, Fee Shield agreement, email verification token fields, and pending-email uniqueness.

alter table if exists solicitor_applications
  add column if not exists sra_number text,
  add column if not exists fee_shield_agreed boolean not null default false,
  add column if not exists email_verified boolean not null default false,
  add column if not exists verification_token_hash text,
  add column if not exists verification_token_expires_at timestamptz;

-- Deduplicate any legacy duplicate pending rows (keep most recent per email, mark older ones rejected)
with ranked_pending as (
  select
    id,
    row_number() over (
      partition by lower(email)
      order by created_at desc, id desc
    ) as rn
  from solicitor_applications
  where status = 'pending'
)
update solicitor_applications
set status = 'rejected'
where id in (select id from ranked_pending where rn > 1);

-- Enforce at most one pending application per email address (case-insensitive)
create unique index if not exists solicitor_applications_pending_email_uidx
  on solicitor_applications (lower(email))
  where status = 'pending';

-- Fast lookup for single-use email verification tokens
create index if not exists solicitor_applications_verification_token_hash_idx
  on solicitor_applications (verification_token_hash)
  where verification_token_hash is not null;
