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
