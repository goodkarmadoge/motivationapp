# Project Status

## Current Version: 0.2.0

**Status: In Development — Core features complete, database setup required**

---

## What's Working

| Feature | Status | Notes |
|---|---|---|
| Sign up / Sign in | ✅ Done | Supabase email/password auth |
| Demo mode | ✅ Done | Full UI without account, no data saved |
| Core Pillars (5 sliders) | ✅ Done | Colors, save button, timestamp |
| Morning Habit Stack | ✅ Done | 3 habits with Yes/No toggles |
| Evening Habit Stack | ✅ Done | 8 habits, cook meal count, step count field |
| Daily Score (live) | ✅ Done | Debounced save, optimistic UI |
| Evening Reflection | ✅ Done | Saves on button press |
| End of Week Recap | ✅ Done | Auto-opens Fridays, manual open any day |
| Streaks | ✅ Done | Current + best per habit |
| Core Pillar Line Chart | ✅ Done | Recharts, 4 time range options |
| Activity Heatmap | ✅ Done | 12-week CSS grid |
| Data Table | ✅ Done | Sort, filter by date, inline cell edit |
| AI Insight Card | ✅ Done | Needs `ANTHROPIC_API_KEY` in `.env.local` |
| Google Fit step sync | ✅ Done | Needs Google Cloud OAuth credentials |

---

## Required Before First Real Use

- [ ] **Run Supabase SQL** — create the 4 database tables (see `README.md` for the SQL block)
- [ ] **Add `ANTHROPIC_API_KEY`** to `.env.local` for AI insights
- [ ] **Set up Google Cloud OAuth** and add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for step sync (optional)

---

## Known Limitations

- **Visualize tab in demo mode** shows empty charts (no seed data — by design)
- **Google Fit** only works on web with Google accounts; no Apple Health support
- **AI insight** is cached once per day — "Regenerate" deletes the cache and re-calls Claude
- **Data table** shows all habit columns but only the first 5 habit emoji columns to keep it readable on mobile
- **No offline support** — all saves require an internet connection to Supabase

---

## Potential Next Steps

### Short Term
- [ ] Mobile-responsive polish for the data table
- [ ] Notification / reminder system (browser push or email)
- [ ] Dark mode toggle
- [ ] Export data as CSV from the Data Table

### Medium Term
- [ ] Custom habit creation (add/remove/rename habits beyond the default set)
- [ ] Goal setting — set a target weekly frequency per habit
- [ ] Weekly email digest with the AI narrative
- [ ] Onboarding flow for new users

### Long Term
- [ ] Apple Health integration via a companion iOS shortcut
- [ ] Shared accountability — invite a friend to see your streaks
- [ ] Historical year-in-review summary
- [ ] Mobile PWA (installable on phone home screen)

---

## Tech Debt / Improvements

- The data table only shows 5 habit columns — add a horizontal scroll or column toggle
- `CorePillarsSection` manages its own `useState` for the note; could be unified with the parent `formState` in `IntegrateTab`
- `EveningReflectionSection` has its own save button — could be absorbed into the debounce auto-save pattern used by habits
- Add error boundaries around the AI insight card and charts so failures degrade gracefully
- Add loading skeletons to the Integrate tab on initial page load

---

## Environment Setup Checklist

```bash
# 1. Install dependencies (already done)
npm install

# 2. Configure .env.local
NEXT_PUBLIC_SUPABASE_URL=https://dzjnlzgjpbfvwbidfgvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
ANTHROPIC_API_KEY=sk-ant-...          # optional
GOOGLE_CLIENT_ID=...                   # optional
GOOGLE_CLIENT_SECRET=...               # optional
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-fit/callback

# 3. Run Supabase SQL (see README for the full block)

# 4. Start dev server
npm run dev
```
