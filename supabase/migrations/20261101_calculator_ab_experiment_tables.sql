-- ─── Calculator A/B Testing Telemetry & Configuration Schema ───────────────────
-- Phase 1 Migration for calc_ux_v2 (8-step sequential vs 4-stage thematic)
-- Privacy-first: strictly zero PII collected (only session duration, stage reached, conversion state).

-- 1. Experiment Event Ingestion Table
create table if not exists experiment_events (
  id               uuid primary key default gen_random_uuid(),
  experiment_id    text not null default 'calc_ux_v2',
  variant          text not null check (variant in ('sequential', 'thematic')),
  event_type       text not null check (event_type in ('enrolled', 'stage_viewed', 'completed', 'lead_submitted')),
  stage_number     integer,
  time_elapsed_ms  integer,
  created_at       timestamptz not null default now()
);

create index if not exists idx_exp_events_query 
  on experiment_events (experiment_id, variant, event_type, created_at);

create index if not exists idx_exp_events_created_at
  on experiment_events (created_at desc);

-- 2. Persistent Experiment Configuration Table
create table if not exists experiment_configurations (
  experiment_id    text primary key,
  mode             text not null default 'split_50_50' check (mode in ('split_50_50', 'winner_selected')),
  winner           text check (winner is null or winner in ('sequential', 'thematic')),
  updated_at       timestamptz not null default now()
);

-- Seed default initial row for the experiment
insert into experiment_configurations (experiment_id, mode, winner)
values ('calc_ux_v2', 'split_50_50', null)
on conflict (experiment_id) do nothing;

-- 3. Row Level Security (RLS) Policies
alter table if exists experiment_events enable row level security;
alter table if exists experiment_configurations enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_experiment_events') then
    create policy service_role_all_experiment_events on experiment_events for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_experiment_configurations') then
    create policy service_role_all_experiment_configurations on experiment_configurations for all to service_role using (true) with check (true);
  end if;
end $$;
