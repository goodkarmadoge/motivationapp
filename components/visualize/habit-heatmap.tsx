'use client'

import { cn } from '@/lib/utils'
import type { DailyLog } from '@/types/habit'

interface HabitHeatmapProps {
  logs: DailyLog[]
}

function intensity(score: number, max: number): string {
  if (!score || max === 0) return 'bg-gray-100'
  const pct = score / max
  if (pct >= 0.8) return 'bg-black'
  if (pct >= 0.6) return 'bg-gray-700'
  if (pct >= 0.4) return 'bg-gray-400'
  if (pct >= 0.2) return 'bg-gray-200'
  return 'bg-gray-100'
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
    <section className="mb-8">
      <h2 className="text-base font-bold text-black mb-1">Activity Heatmap</h2>
      <p className="text-xs text-gray-400 mb-3">Daily score intensity — last 12 weeks</p>
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
                log ? intensity(log.daily_score, log.max_possible_score) : 'bg-gray-100'
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs text-gray-400">Less</span>
        {['bg-gray-100', 'bg-gray-200', 'bg-gray-400', 'bg-gray-700', 'bg-black'].map((c) => (
          <div key={c} className={cn('w-3 h-3 rounded-sm', c)} />
        ))}
        <span className="text-xs text-gray-400">More</span>
      </div>
    </section>
  )
}
