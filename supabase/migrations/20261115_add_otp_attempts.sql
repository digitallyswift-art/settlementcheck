-- Migration: Add attempts column to otp_codes for anti-brute-force lockout defense (SC-E-SEC-003)
alter table if exists otp_codes
  add column if not exists attempts integer not null default 0;
