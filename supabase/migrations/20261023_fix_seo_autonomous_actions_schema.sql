-- ─── Fix seo_autonomous_actions Schema for Deterministic Package IDs & OCC ───
-- Ensures runtime package IDs (e.g., 'pkg_actuator_1792778764346_1') persist natively
-- as primary keys across serverless instances, and supports CANARY/PERMANENT/ROLLED_BACK
-- lifecycle states and Optimistic Concurrency Control (OCC) fields.

alter table if exists seo_autonomous_actions
  alter column id drop default,
  alter column id type text using id::text,
  alter column id set default gen_random_uuid()::text,
  alter column run_id set default 'manual_actuation',
  alter column action_type set default 'INTERNAL_LINK_BOOST',
  alter column priority set default 'CRITICAL',
  alter column faq_question set default '',
  alter column faq_answer set default '',
  alter column contextual_link_snippet set default '';

-- Replace restrictive status check constraint with full lifecycle enum
alter table if exists seo_autonomous_actions
  drop constraint if exists seo_autonomous_actions_status_check;

alter table if exists seo_autonomous_actions
  add constraint seo_autonomous_actions_status_check
  check (status in ('STAGED', 'VALIDATED', 'CANARY', 'APPLIED', 'PERMANENT', 'ROLLED_BACK', 'REJECTED'));

-- Add Optimistic Concurrency Control (OCC) and audit metadata columns
alter table if exists seo_autonomous_actions
  add column if not exists version integer not null default 1,
  add column if not exists lock_state text not null default 'IDLE',
  add column if not exists locked_by text,
  add column if not exists locked_until timestamptz,
  add column if not exists last_modified_by text;
