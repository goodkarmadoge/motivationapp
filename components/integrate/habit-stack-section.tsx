'use client'

import { HabitCard } from './habit-card'
import type { DailyLog, HabitDefinition } from '@/types/habit'

interface HabitStackSectionProps {
  session: 'morning' | 'evening'
  habits: HabitDefinition[]
  log: Partial<DailyLog>
  onChange: (fields: Partial<DailyLog>) => void
  googleFitConnected?: boolean
}

const GREETINGS = {
  morning: { icon: '🌅', label: 'Morning Routine', sub: 'Start your day strong.' },
  evening: { icon: '🌙', label: 'Evening Check-In', sub: 'How did your day go?' },
}

export function HabitStackSection({
  session,
  habits,
  log,
  onChange,
  googleFitConnected,
}: HabitStackSectionProps) {
  const { icon, label, sub } = GREETINGS[session]
  const completed = habits.filter((h) => !!log[h.key]).length

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div>
            <h2 className="text-base font-bold text-black">{label}</h2>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-gray-400 tabular-nums">
          {completed}/{habits.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {habits.map((habit) => (
          <HabitCard
            key={habit.key}
            habit={habit}
            log={log}
            onChange={onChange}
            googleFitConnected={googleFitConnected}
          />
        ))}
      </div>
    </section>
  )
}
