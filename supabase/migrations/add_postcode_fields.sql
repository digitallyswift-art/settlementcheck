-- Migration: add postcode fields for geographic matching
-- Apply in Supabase SQL editor: https://app.supabase.com → SQL Editor

-- ── leads table (employee postcode) ──────────────────────────────────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS postcode        text,
  ADD COLUMN IF NOT EXISTS postcode_region text,
  ADD COLUMN IF NOT EXISTS postcode_lat    numeric,
  ADD COLUMN IF NOT EXISTS postcode_lng    numeric;

-- ── solicitor_applications table (office postcode + coverage radius) ──────────
ALTER TABLE solicitor_applications
  ADD COLUMN IF NOT EXISTS office_postcode       text,
  ADD COLUMN IF NOT EXISTS office_lat            numeric,
  ADD COLUMN IF NOT EXISTS office_lng            numeric,
  ADD COLUMN IF NOT EXISTS office_region         text,
  ADD COLUMN IF NOT EXISTS coverage_radius_miles integer;

-- geographic_coverage (old free-text column) is kept nullable for backward
-- compatibility with any existing rows — it will no longer be populated.
