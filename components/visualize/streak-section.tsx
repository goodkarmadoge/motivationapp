'use client'

import { computeStreaks } from './streak-utils'
import { ALL_HABITS } from '@/lib/habits'
import type { DailyLog } from '@/types/habit'

interface StreakSectionProps {
  logs: DailyLog[]
}

export function StreakSection({ logs }: StreakSectionProps) {
  const streaks = computeStreaks(logs)
  const active = streaks.filter((s) => s.current > 0).sort((a, b) => b.current - a.current)
  const inactive = streaks.filter((s) => s.current === 0).sort((a, b) => b.longest - a.longest)
  const sorted = [...active, ...inactive]

  function getHabit(key: string) {
    return ALL_HABITS.find((h) => h.key === key)
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-black mb-1">Streaks</h2>
      <p className="text-xs text-gray-400 mb-3">Consecutive days each habit was completed</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sorted.map((s) => {
          const habit = getHabit(s.key)
          if (!habit) return null
          const isActive = s.current > 0
          return (
            <div
              key={s.key}
              className={`rounded-xl border px-3 py-2.5 ${
                isActive ? 'border-black bg-black/[0.02]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{habit.emoji}</span>
                <span className="text-xs text-gray-500 truncate">{habit.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-xl font-extrabold ${isActive ? 'text-black' : 'text-gray-300'}`}>
                  {s.current}
                </span>
                <span className="text-xs text-gray-400 mb-0.5">day streak</span>
              </div>
              {s.longest > 0 && (
                <p className="text-xs text-gray-300 mt-0.5">Best: {s.longest}</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
