-- Migration: add partner tracking and benchmark columns to leads table
-- Apply in Supabase SQL editor: https://app.supabase.com → SQL Editor

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS partner_id text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS benchmark_data jsonb;

-- Index for partner queries
CREATE INDEX IF NOT EXISTS leads_partner_id_idx ON leads (partner_id);
