-- ============================================================
-- Migration 002: Add new habit columns, remove Google Fit
-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Add new morning habit columns
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS habit_brew_coffee      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS habit_walk_karma        boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS habit_healthy_breakfast boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS habit_read_podcast      boolean NOT NULL DEFAULT false;

-- Add new afternoon habit columns
-- (habit_healthy_lunch, habit_gym, habit_focus_work already exist from migration 001)
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS habit_drink_water       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS habit_drink_water_count smallint,
  ADD COLUMN IF NOT EXISTS habit_focus_work_count  smallint;

-- habit_step_source now accepts 'garmin' in addition to 'manual'
-- No schema change needed (it's plain text with no CHECK constraint)

-- To remove Google Fit table once confirmed unused, uncomment:
-- DROP TABLE IF EXISTS public.google_fit_tokens;
