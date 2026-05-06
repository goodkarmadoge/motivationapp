'use client'

import { cn } from '@/lib/utils'
import { YesNoToggle } from './yes-no-toggle'
import type { DailyLog, HabitDefinition } from '@/types/habit'

interface HabitCardProps {
  habit: HabitDefinition
  log: Partial<DailyLog>
  onChange: (fields: Partial<DailyLog>) => void
  googleFitConnected?: boolean
}

export function HabitCard({ habit, log, onChange, googleFitConnected }: HabitCardProps) {
  const value = !!(log[habit.key])
  const subValue = habit.subField ? (log[habit.subField.key] as number | null) : null

  function handleToggle(v: boolean) {
    const update: Partial<DailyLog> = { [habit.key]: v }
    if (!v && habit.subField) {
      update[habit.subField.key] = null as never
    }
    onChange(update)
  }

  function handleSubChange(raw: string) {
    if (!habit.subField) return
    const parsed = parseInt(raw, 10)
    onChange({ [habit.subField.key]: isNaN(parsed) ? null : parsed } as Partial<DailyLog>)
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-200',
        value ? 'border-black bg-black/[0.02]' : 'border-gray-100 bg-white hover:border-gray-200'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{habit.emoji}</span>
          <span className="text-sm font-medium text-gray-900">{habit.label}</span>
        </div>
        <YesNoToggle value={value} onChange={handleToggle} />
      </div>

      {/* Sub-field: shown when Yes is selected */}
      {habit.subField && value && (
        <div className="mt-3 pl-10">
          {habit.subField.type === 'count' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{habit.subField.label}</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange({ [habit.subField!.key]: n } as Partial<DailyLog>)}
                    className={cn(
                      'w-7 h-7 rounded-md text-sm font-semibold border transition-all',
                      subValue === n
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{habit.subField.label}</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={subValue ?? ''}
                  onChange={(e) => handleSubChange(e.target.value)}
                  placeholder={habit.subField.placeholder}
                  className="w-28 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
                {googleFitConnected && habit.key === 'habit_10k_steps' && (
                  <span className="text-xs text-sky-500 font-medium">via Google Fit</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
