# Architecture

## Overview

A Next.js 16 App Router application with server-side auth, Supabase Postgres storage, and client-side React state for real-time habit tracking. The dashboard is split into two tabs: **Integrate** (data input) and **Visualize** (trends and insights).

## System Diagram

```
Browser
  │
  ├── /sign-in or /sign-up     → Supabase Auth
  │
  └── /dashboard               → DashboardShell (Client Component)
        ├── Tab: Integrate      → IntegrateTab
        │     ├── CorePillarsSection   → upsertDailyLog (Server Action)
        │     ├── HabitStackSection    → upsertDailyLog (Server Action, debounced 800ms)
        │     ├── EveningReflection    → upsertDailyLog (Server Action)
        │     └── WeekRecapSection     → upsertWeeklyLog (Server Action)
        │
        └── Tab: Visualize      → VisualizeTab
              ├── AiInsightCard  → POST /api/ai-insight → Claude API
              ├── StreakSection  → computed client-side from logs
              ├── PillarChart    → Recharts LineChart
              ├── HabitHeatmap   → CSS grid
              └── DataTable      → inline edits → upsertDailyLog
```

## Data Flow

### Write Path (Habit Toggle)
```
User taps Yes on habit card
  → HabitCard.onChange() fires
  → IntegrateTab updates formState optimistically (instant)
  → DailyScoreBanner re-renders with new score
  → 800ms debounce timer resets
  → [800ms] upsertDailyLog(date, fields) Server Action
      → calculateDailyScore() recomputes daily_score
      → supabase.from('daily_logs').upsert(...)
      → returns confirmed row
  → IntegrateTab syncs state with server values
```

### Read Path (Visualize Tab)
```
User switches to Visualize tab
  → VisualizeTab mounts
  → getDateRange() + getAllLogs() Server Actions called in parallel
  → logs array flows to:
      StreakSection  → computeStreaks() utility
      PillarChart    → buildPillarChartData() maps to Recharts shape
      HabitHeatmap   → intensity() maps daily_score to CSS class
      DataTable      → raw rows, filtered/sorted client-side
```

### AI Insight Path
```
AiInsightCard mounts
  → POST /api/ai-insight { date }
      → Check ai_insights table for cached result
      → Cache hit: return immediately
      → Cache miss:
          → getLast30Days() from Supabase
          → buildHabitPrompt(logs) → CSV-formatted prompt
          → Anthropic SDK: claude-sonnet-4-6
          → parseAiResponse() → { correlation_text, predicted_pillars, weekly_narrative }
          → INSERT into ai_insights (cached for the day)
          → Return JSON
  → Render three sections + predicted pillar bar chart
```

### Google Fit Path (Step Count)
```
One-time setup:
  GET /api/google-fit/auth → Google OAuth consent
  GET /api/google-fit/callback → exchange code → store tokens in google_fit_tokens

Daily:
  HabitCard (10K steps) mounts
  → GET /api/google-fit/steps?date=YYYY-MM-DD
      → Load tokens; refresh if expired
      → Google Fit REST aggregate endpoint
      → Return { steps: number }
  → Pre-fills step count; sets habit_10k_steps if steps >= 10000
```

## Authentication

- Supabase Auth with email/password
- Session managed via httpOnly cookies (`@supabase/ssr`)
- Middleware (`proxy.ts`) refreshes session on every request and redirects unauthenticated users away from `/dashboard`
- Demo mode: `demo_mode=1` cookie bypasses auth check; no DB reads or writes occur

## Database Schema

### `daily_logs`
One row per `(user_id, log_date)`. Stores all 11 habit booleans, 5 pillar scores (1–5), reflection text, and computed `daily_score`. RLS: users see only their own rows.

### `weekly_logs`
One row per `(user_id, week_start_date)` (Monday). Stores 4 end-of-week Y/N questions and free text.

### `ai_insights`
One row per `(user_id, insight_date)`. Caches Claude's JSON response so the API is only called once per day. Can be invalidated via the "Regenerate" button (deletes the row, then re-fetches).

### `google_fit_tokens`
One row per `user_id`. Stores access token, refresh token, and expiry. The API route refreshes the access token automatically when expired.

## Score Calculation

```typescript
habitPoints = count of 11 habit booleans that are true          // max 11
pillarBonus = allPillarsSubmitted
  ? (sum of 5 pillar scores / 5 / 5) * 5                        // max 5
  : 0
daily_score = habitPoints + pillarBonus                          // max 16
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Server Actions over API routes for DB writes | Simpler auth propagation; no extra fetch boilerplate |
| 800ms debounce on habit saves | Avoids a Supabase call per keystroke/click; still feels instant |
| AI response cached per day | Claude API is slow (~2s); daily insights don't need real-time freshness |
| Recharts over D3 | React-native API; much less code for standard chart types |
| CSS grid heatmap over SVG | Simpler, easier to style with Tailwind, no viewBox arithmetic |
| Distinct Core Pillar colors, B&W elsewhere | PRD requirement; keeps UI minimal while making pillar data scannable |
