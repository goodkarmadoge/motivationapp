# Motivation

Track your habits. Build your life.

A personal habit tracking app built with Next.js, Supabase, and Tailwind CSS. Dark, minimal UI optimized for Android mobile.

## Features

- **Daily Habit Tracking** — Morning and evening habit stacks with animated card interactions
- **Core Scores** — Rate 5 life pillars (Happy, Healthy, Wealthy, Grounded, Motivated) on a 1–5 scale for a daily score out of 25
- **AI Insights** — Weekly narrative and pillar predictions powered by Claude
- **Insights** — Streak tracking, pillar charts, habit heatmap, and data table
- **Demo Mode** — Try the full app without an account
- **Mobile-first** — Fixed bottom nav, optimized for Android viewport

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Server Actions
- [Supabase](https://supabase.com) — Auth, Postgres, Row Level Security
- [Tailwind CSS v4](https://tailwindcss.com)
- [Anthropic Claude](https://anthropic.com) — AI insight generation

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.local.sample` to `.env.local` and add your keys:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```
