# Changelog

All notable changes to this project are documented here.

---

## [0.2.0] — 2026-05-06

### Added
- **Demo mode** — "Try demo without an account" link on sign-in page sets a `demo_mode` cookie, bypasses Supabase auth, and runs the full UI in-memory with no data persistence
- `/api/demo/start` and `/api/demo/stop` routes to set/clear the demo cookie
- Demo banner on dashboard with "Exit demo" link

### Changed
- `proxy.ts` middleware now allows requests through if `demo_mode=1` cookie is present
- `DashboardShell` accepts optional `isDemo` prop and renders demo banner
- `IntegrateTab` skips debounced server saves when `isDemo` is true
- `VisualizeTab` skips data fetching when `isDemo` is true

---

## [0.1.0] — 2026-05-06

### Added

#### Core Infrastructure
- `types/habit.ts` — TypeScript interfaces for `DailyLog`, `WeeklyLog`, `AiInsight`, `HabitDefinition`, `CorePillarDefinition`
- `lib/habits.ts` — All habit/pillar constants, `calculateDailyScore()`, date helpers (`todayISO`, `weekStartISO`, `isFriday`)
- `app/dashboard/actions.ts` — Server Actions: `upsertDailyLog`, `getDailyLog`, `upsertWeeklyLog`, `getWeeklyLog`, `getLast30Days`, `getDateRange`, `getAllLogs`, `deleteAiInsightCache`

#### Integrate Tab
- **Core Pillars** — 5 range sliders (1–5) with distinct accent colors (amber, emerald, violet, sky, rose), free text note, "Save Core Pillars" button with saved-at timestamp
- **Morning Habit Stack** — ☕ Pourover Coffee, 🐕 Dog Walk, 🥗 Healthy Lunch — Yes/No toggles with completion counter
- **Evening Habit Stack** — 🏋️ Gym, 🍳 Cook a Meal (+ meal count 1–3), 🧘 Meditation, 👟 10K Steps (+ step count text), 🥦 Healthy Dinner, 💻 Focus Work, 📚 30min Reading — Yes/No toggles
- **Daily Score Banner** — Live score progress bar with color shift (gray → amber → green)
- **Evening Reflection** — Free text textarea, debounce-saved
- **End of Week Recap** — Collapsible section (auto-opens on Fridays); 4 Yes/No questions + free text
- 800ms debounced auto-save for all habit/pillar changes

#### Visualize Tab
- **AI Insight Card** — Calls Claude API (`claude-sonnet-4-6`), cached per day; shows correlation text, predicted pillar bar chart, weekly narrative; "Regenerate" button
- **Streak Section** — Per-habit current streak and all-time best
- **Core Pillar Line Chart** — Recharts `LineChart` with 5 colored lines, time-range filter (7D / 30D / 90D / 1Y)
- **Activity Heatmap** — 12-week CSS grid with intensity shading based on daily score
- **Data Table** — Sortable by date/score, date range filter, inline cell editing for pillar scores

#### API Routes
- `POST /api/ai-insight` — Generates/caches Claude insight with 30-day habit context
- `GET /api/google-fit/auth` — Initiates Google OAuth for fitness data
- `GET /api/google-fit/callback` — Handles OAuth callback, stores tokens
- `GET /api/google-fit/steps?date=` — Returns step count for a given date

#### Database (Supabase)
- `daily_logs` table with RLS
- `weekly_logs` table with RLS
- `ai_insights` cache table with RLS
- `google_fit_tokens` table with RLS

#### Infrastructure
- Installed `recharts`, `@anthropic-ai/sdk`, `server-only`
- `next.config.ts` updated with `serverExternalPackages: ['@anthropic-ai/sdk']`
- `lib/ai.ts` — Anthropic SDK wrapper, prompt builder, JSON response parser
- `lib/google-fit.ts` — Token management + Google Fit REST API calls

---

## [0.0.1] — 2026-03-13 (Boilerplate)

Initial Next.js 16 starter template with:
- Supabase Auth (sign-in / sign-up / sign-out)
- Protected `/dashboard` route
- `Button`, `Card`, `Input` UI components
- `Header`, `Footer`, `Container` layout components
- `proxy.ts` auth middleware
- Vercel-ready deployment setup
