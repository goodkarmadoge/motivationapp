-- ============================================================
-- Motivation App – Initial Schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ── daily_logs ──────────────────────────────────────────────
create table if not exists public.daily_logs (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  log_date              date not null,

  -- Core Pillars (1–5, nullable until submitted)
  pillar_happy          smallint check (pillar_happy between 1 and 5),
  pillar_healthy        smallint check (pillar_healthy between 1 and 5),
  pillar_wealthy        smallint check (pillar_wealthy between 1 and 5),
  pillar_grounded       smallint check (pillar_grounded between 1 and 5),
  pillar_motivated      smallint check (pillar_motivated between 1 and 5),
  pillar_note           text,
  pillars_submitted_at  timestamptz,

  -- Morning habits
  habit_pourover_coffee boolean not null default false,
  habit_dog_walk        boolean not null default false,
  habit_healthy_lunch   boolean not null default false,

  -- Evening habits
  habit_gym             boolean not null default false,
  habit_cook_meal       boolean not null default false,
  habit_cook_meal_count smallint,
  habit_meditation      boolean not null default false,
  habit_10k_steps       boolean not null default false,
  habit_step_count      integer,
  habit_step_source     text not null default 'manual',
  habit_healthy_dinner  boolean not null default false,
  habit_focus_work      boolean not null default false,
  habit_reading         boolean not null default false,

  -- Reflection
  evening_reflection    text,

  -- Score
  daily_score           numeric not null default 0,
  max_possible_score    smallint not null default 25,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  unique (user_id, log_date)
);

alter table public.daily_logs enable row level security;

create policy "Users can read own daily logs"
  on public.daily_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily logs"
  on public.daily_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily logs"
  on public.daily_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own daily logs"
  on public.daily_logs for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger daily_logs_updated_at
  before update on public.daily_logs
  for each row execute procedure public.set_updated_at();


-- ── weekly_logs ──────────────────────────────────────────────
create table if not exists public.weekly_logs (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  week_start_date         date not null,  -- Monday of the week

  had_social_event        boolean,
  did_pickleball_cardio   boolean,
  planned_hosted_event    boolean,
  gym_4_plus_times        boolean,
  weekly_recap_note       text,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  unique (user_id, week_start_date)
);

alter table public.weekly_logs enable row level security;

create policy "Users can read own weekly logs"
  on public.weekly_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own weekly logs"
  on public.weekly_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own weekly logs"
  on public.weekly_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own weekly logs"
  on public.weekly_logs for delete
  using (auth.uid() = user_id);

create trigger weekly_logs_updated_at
  before update on public.weekly_logs
  for each row execute procedure public.set_updated_at();


-- ── ai_insights ──────────────────────────────────────────────
create table if not exists public.ai_insights (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  insight_date        date not null,

  correlation_text    text,
  predicted_pillars   jsonb,   -- { happy: 3, healthy: 4, wealthy: 2, grounded: 5, motivated: 3 }
  weekly_narrative    text,

  created_at          timestamptz not null default now(),

  unique (user_id, insight_date)
);

alter table public.ai_insights enable row level security;

create policy "Users can read own ai insights"
  on public.ai_insights for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai insights"
  on public.ai_insights for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ai insights"
  on public.ai_insights for update
  using (auth.uid() = user_id);

create policy "Users can delete own ai insights"
  on public.ai_insights for delete
  using (auth.uid() = user_id);


-- ── google_fit_tokens ────────────────────────────────────────
create table if not exists public.google_fit_tokens (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  access_token  text not null,
  refresh_token text not null,
  expires_at    timestamptz not null,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.google_fit_tokens enable row level security;

create policy "Users can read own google fit tokens"
  on public.google_fit_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert own google fit tokens"
  on public.google_fit_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can update own google fit tokens"
  on public.google_fit_tokens for update
  using (auth.uid() = user_id);

create policy "Users can delete own google fit tokens"
  on public.google_fit_tokens for delete
  using (auth.uid() = user_id);

create trigger google_fit_tokens_updated_at
  before update on public.google_fit_tokens
  for each row execute procedure public.set_updated_at();
