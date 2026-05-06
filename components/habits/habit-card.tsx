'use client'

import { cn } from '@/lib/utils'
import { HabitIcon } from '@/components/ui/habit-icons'
import type { DailyLog, HabitDefinition } from '@/types/habit'

interface HabitCardProps {
  habit: HabitDefinition
  log: Partial<DailyLog>
  onChange: (fields: Partial<DailyLog>) => void
  index?: number
}

export function HabitCard({ habit, log, onChange, index = 0 }: HabitCardProps) {
  const done = !!(log[habit.key as keyof DailyLog])
  const subValue = habit.subField ? (log[habit.subField.key as keyof DailyLog] as number | null) : null

  function toggle() {
    const update: Partial<DailyLog> = { [habit.key]: !done }
    if (done && habit.subField) {
      (update as Record<string, unknown>)[habit.subField.key as string] = null
    }
    onChange(update)
  }

  return (
    <div
      onClick={toggle}
      className={cn(
        'relative flex flex-col items-center justify-center text-center',
        'min-h-[148px] rounded-2xl p-4 cursor-pointer select-none',
        'active:scale-[0.97] transition-all duration-200 border',
        'animate-fade-up',
        done
          ? 'border-[#C8A96E]/25 shadow-[0_0_24px_rgba(200,169,110,0.07)]'
          : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
      )}
      style={{
        animationDelay: `${index * 55}ms`,
        backgroundColor: done ? 'rgba(200,169,110,0.07)' : 'rgba(255,255,255,0.03)',
      }}
    >
      {/* Gold stamp — top-right, animates in on completion */}
      {done && (
        <div className="absolute top-3 right-3 animate-scale-in">
          <div className="w-5 h-5 rounded bg-[#C8A96E]/15 border border-[#C8A96E]/35 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C8A96E"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 check-draw"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Icon */}
      <HabitIcon
        habitKey={habit.key}
        className={cn(
          'w-7 h-7 mb-3 transition-colors duration-300',
          done ? 'text-[#C8A96E]' : 'text-white/35'
        )}
      />

      {/* Label */}
      <span className={cn(
        'text-[13px] font-medium leading-tight transition-colors duration-300',
        done ? 'text-white/85' : 'text-white/55'
      )}>
        {habit.label}
      </span>

      {/* Sub-fields — shown inside completed card */}
      {habit.subField && done && (
        <div
          className="mt-3 w-full flex justify-center animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {habit.subField.type === 'count' ? (
            <div className="flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange({ [habit.subField!.key]: n } as Partial<DailyLog>)}
                  className={cn(
                    'w-8 h-7 rounded text-xs font-semibold transition-all active:scale-95',
                    subValue === n
                      ? 'bg-[#C8A96E] text-[#0C0C0C]'
                      : 'bg-white/[0.06] text-white/35 hover:bg-white/[0.1] hover:text-white/60'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="number"
              value={subValue ?? ''}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                onChange({ [habit.subField!.key]: isNaN(v) ? null : v } as Partial<DailyLog>)
              }}
              placeholder={habit.subField.placeholder}
              className="w-28 px-2.5 py-1.5 text-xs bg-white/[0.06] border border-white/[0.1] rounded-lg text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#C8A96E]/40 text-center"
            />
          )}
        </div>
      )}

      {/* Status label */}
      {!(habit.subField && done) && (
        <p className={cn(
          'mt-3 text-[10px] uppercase tracking-widest font-semibold transition-colors duration-300',
          done ? 'text-[#C8A96E]/70' : 'text-white/18'
        )}>
          {done ? 'Done' : 'Todo'}
        </p>
      )}
    </div>
  )
}
