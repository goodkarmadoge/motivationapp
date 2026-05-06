# CLAUDE.md — Daily Habit Tracker

## Project Goal

A personal productivity web app that motivates daily habit adherence by breaking goals into trackable habits and Core Pillar scores. Users log habits each day, rate their wellbeing across 5 dimensions, and visualise trends over time. AI (Claude) surfaces correlations between habits and outcomes.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS 4 (black & white, accent colors for Core Pillars only) |
| Auth + Database | Supabase (Postgres + RLS) |
| Charts | Recharts |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Health Data | Google Fit REST API (OAuth 2.0) |
| Deployment | Vercel |

## Key Commands

```bash
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Production build (run before deploying)
npm run lint     # Lint check
npm run start    # Run production build locally
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Optional — AI insights
ANTHROPIC_API_KEY=sk-ant-...

# Optional — Google Fit step sync
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-fit/callback
```

## Project Structure

```
app/
├── dashboard/
│   ├── page.tsx          # Entry point — loads today's log, renders DashboardShell
│   └── actions.ts        # All Supabase server actions (upsert, fetch)
├── (auth)/               # Sign-in, sign-up pages + server actions
├── api/
│   ├── ai-insight/       # POST — generates/caches Claude insight
│   ├── demo/start|stop   # Sets/clears demo_mode cookie
│   └── google-fit/       # OAuth flow + step count endpoint

components/
├── dashboard/            # Shell, header, tab nav
├── integrate/            # Core Pillars, Habit cards, Reflection, Week Recap
└── visualize/            # Charts, Streaks, Heatmap, Data Table, AI card

lib/
├── habits.ts             # Habit/pillar constants, score calculator, date utils
├── ai.ts                 # Anthropic SDK — prompt builder + response parser
├── google-fit.ts         # Token management + step fetch
├── supabase.ts           # Supabase client (browser, server, middleware)
└── utils.ts              # cn() helper

types/
└── habit.ts              # DailyLog, WeeklyLog, AiInsight, HabitDefinition, etc.

docs/
├── architecture.md       # System design and data flow
├── changelog.md          # Version history
└── project-status.md     # Current status and next steps
```

## Database Tables

| Table | Purpose |
|---|---|
| `daily_logs` | One row per user per day — all habit booleans, pillar scores, daily score |
| `weekly_logs` | One row per user per week — end-of-week recap |
| `ai_insights` | Cached Claude responses keyed by user + date |
| `google_fit_tokens` | OAuth tokens for Google Fit step sync |

All tables have RLS enabled — users only access their own rows.

## Core Concepts

### Daily Score
- 11 habit booleans × 1 point each = max 11
- Core Pillars bonus: `(avg of 5 pillar scores / 5) × 5` = max 5
- **Total max: 16**

### Core Pillar Colors
```
Happy     → amber   (#f59e0b)
Healthy   → emerald (#10b981)
Wealthy   → violet  (#8b5cf6)
Grounded  → sky     (#0ea5e9)
Motivated → rose    (#f43f5e)
```

### Demo Mode
Visit `/sign-in` → "Try demo without an account" → sets `demo_mode=1` cookie → full UI works, nothing saves to Supabase. Exit via the banner link.

## Coding Standards

- TypeScript for all files — no `any` unless unavoidable
- Components in `/components` with PascalCase names
- Tailwind CSS only — no separate CSS files
- Server Actions in `app/dashboard/actions.ts` for all DB writes
- Client components (`'use client'`) only where interactivity requires it
- Keep components under 200 lines; split if larger

## Files Not to Change Without Good Reason

- `proxy.ts` — auth middleware
- `lib/supabase.ts` — Supabase client setup
- `next.config.ts` — `serverExternalPackages` for Anthropic SDK
- `.env.local` — never commit

## Deployment Checklist

1. `npm run build` — fix all errors
2. Push to GitHub
3. Deploy to Vercel
4. Set all env vars in Vercel dashboard (Settings → Environment Variables)
5. Run SQL migrations in Supabase if schema changed
