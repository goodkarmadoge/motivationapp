'use client'

import { cn } from '@/lib/utils'
import type { DailyLog } from '@/types/habit'

interface HabitHeatmapProps {
  logs: DailyLog[]
}

const RAMP = [
  'bg-white/[0.06]',
  'bg-white/[0.18]',
  'bg-[#C8A96E]/45',
  'bg-[#C8A96E]/70',
  'bg-[#C8A96E]',
]

function intensity(score: number, max: number): string {
  if (!score || max === 0) return RAMP[0]
  const pct = score / max
  if (pct >= 0.8) return RAMP[4]
  if (pct >= 0.6) return RAMP[3]
  if (pct >= 0.4) return RAMP[2]
  if (pct >= 0.2) return RAMP[1]
  return RAMP[0]
}

export function HabitHeatmap({ logs }: HabitHeatmapProps) {
  const byDate = new Map(logs.map((l) => [l.log_date, l]))

  // Build last 84 days (12 weeks)
  const days: { date: string; log: DailyLog | null }[] = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const date = d.toISOString().slice(0, 10)
    days.push({ date, log: byDate.get(date) ?? null })
  }

  // Day-of-week offset to align grid
  const firstDay = new Date(days[0].date + 'T12:00:00').getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1 // Monday=0

  return (
    <section className="mb-8 animate-fade-up">
      <div className="mb-4">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-white/88 leading-tight">
          Activity Heatmap
        </h2>
        <p className="text-white/35 mt-1 text-sm">
          Daily score intensity — last 12 weeks
        </p>
      </div>
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4">
        <div className="overflow-x-auto pb-1">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: 'repeat(12, 1fr)', minWidth: 280 }}
          >
            {Array.from({ length: offset }, (_, i) => (
              <div key={`pad-${i}`} className="w-full aspect-square" />
            ))}
            {days.map(({ date, log }) => (
              <div
                key={date}
                title={`${date}: ${log ? `${log.daily_score}/${log.max_possible_score}` : 'No data'}`}
                className={cn(
                  'w-full aspect-square rounded-sm cursor-default transition-opacity hover:opacity-70',
                  log ? intensity(log.daily_score, log.max_possible_score) : RAMP[0]
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/40">
            Less
          </span>
          {RAMP.map((c) => (
            <div key={c} className={cn('w-3 h-3 rounded-sm', c)} />
          ))}
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/40">
            More
          </span>
        </div>
      </div>
    </section>
  )
}
