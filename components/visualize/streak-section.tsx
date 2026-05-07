'use client'

import { computeStreaks } from './streak-utils'
import { ALL_HABITS } from '@/lib/habits'
import { HabitIcon } from '@/components/ui/habit-icons'
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
      <div className="mb-4 animate-fade-up">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-white/88 leading-tight">
          Streaks
        </h2>
        <p className="text-white/35 mt-1 text-sm">
          Consecutive days each habit was completed
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {sorted.map((s, i) => {
          const habit = getHabit(s.key)
          if (!habit) return null
          const isActive = s.current > 0
          return (
            <div
              key={s.key}
              className={`rounded-xl border px-3 py-3 transition-all duration-300 animate-fade-up ${
                isActive
                  ? 'border-[#C8A96E]/25 bg-[#C8A96E]/[0.04] shadow-[0_0_20px_rgba(200,169,110,0.05)]'
                  : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.1]'
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <HabitIcon
                  habitKey={habit.key}
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#C8A96E]' : 'text-white/45'
                  }`}
                />
                <span
                  className={`text-[12px] font-medium truncate ${
                    isActive ? 'text-white/80' : 'text-white/55'
                  }`}
                >
                  {habit.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-semibold tabular-nums leading-none ${
                    isActive ? 'text-[#C8A96E]' : 'text-white/25'
                  }`}
                >
                  {s.current}
                </span>
                <span className="text-[11px] text-white/40 font-medium">
                  day streak
                </span>
              </div>
              {s.longest > 0 && (
                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/30 mt-2">
                  Best: <span className="text-white/55 normal-case tracking-normal font-semibold">{s.longest}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
