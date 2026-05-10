-- Email captures table
-- Stores emails from SaveCard "Email me my results" (no phone/name required)
-- Separate from leads table which requires full contact details + consent

create table if not exists email_captures (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  email             text not null,
  salary            numeric,
  years_service     numeric,
  months_service    numeric,
  age               integer,
  offer_amount      numeric,
  reason            text,
  discrimination    text,
  contractual_notice integer,
  verdict           text,
  minimum           numeric,
  typical_low       numeric,
  typical_high      numeric,
  estimated_net     numeric,
  jurisdiction      text default 'GB'
);

-- Index for deduplication lookups
create index if not exists email_captures_email_idx on email_captures (email);

-- RLS: service role only (no public access)
alter table email_captures enable row level security;
