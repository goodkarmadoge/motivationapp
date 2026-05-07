'use client'

import { useCallback, useRef, useState } from 'react'
import { HabitCard } from './habit-card'
import { GoogleFitBanner } from './google-fit-banner'
import { MORNING_HABITS, EVENING_HABITS, isFriday } from '@/lib/habits'
import { upsertDailyLog } from '@/app/dashboard/actions'
import { WeekRecapSection } from '@/components/integrate/week-recap-section'
import type { DailyLog, WeeklyLog } from '@/types/habit'

interface HabitsTabProps {
  log: DailyLog
  weeklyLog: WeeklyLog | null
  today: string
  onLogChange: (log: DailyLog) => void
  isDemo?: boolean
  googleFitConnected?: boolean
}

export function HabitsTab({ log, weeklyLog, today, onLogChange, isDemo, googleFitConnected }: HabitsTabProps) {
  const logRef = useRef<DailyLog>(log)
  logRef.current = log

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [reflectionText, setReflectionText] = useState(log.evening_reflection ?? '')
  const [reflectionSaved, setReflectionSaved] = useState(false)

  const handleChange = useCallback(
    (fields: Partial<DailyLog>) => {
      const next = { ...logRef.current, ...fields } as DailyLog
      logRef.current = next
      onLogChange(next)

      if (isDemo) return

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        upsertDailyLog(today, logRef.current)
      }, 800)
    },
    [today, onLogChange, isDemo]
  )

  function saveReflection() {
    handleChange({ evening_reflection: reflectionText })
    setReflectionSaved(true)
    setTimeout(() => setReflectionSaved(false), 2000)
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.'

  const allHabits = [...MORNING_HABITS, ...EVENING_HABITS]
  const totalDone = allHabits.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const morningDone = MORNING_HABITS.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const eveningDone = EVENING_HABITS.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const pct = totalDone / allHabits.length

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6 pt-1 animate-fade-up">
        <h2 className="text-[1.65rem] font-semibold tracking-tight text-white/88 leading-tight">
          {greeting}
        </h2>
        <p className="text-white/35 mt-1.5 text-sm">
          {totalDone === 0
            ? 'No habits logged yet today.'
            : totalDone === allHabits.length
            ? `All ${totalDone} habits complete.`
            : `${totalDone} of ${allHabits.length} complete.`}
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="h-px w-full bg-white/[0.06] rounded-full mb-8 overflow-hidden animate-fade-up"
        style={{ animationDelay: '60ms' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct * 100}%`,
            backgroundColor: pct >= 1 ? '#C8A96E' : 'rgba(255,255,255,0.3)',
          }}
        />
      </div>

      {/* Morning section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">
            Morning
          </p>
          <p className="text-[10px] text-white/20 tabular-nums">
            {morningDone} / {MORNING_HABITS.length}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {MORNING_HABITS.map((habit, i) => (
            <HabitCard
              key={habit.key}
              habit={habit}
              log={log}
              onChange={handleChange}
              index={i + 2}
            />
          ))}
        </div>
      </section>

      {/* Google Fit banner */}
      {!isDemo && (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <GoogleFitBanner
            connected={!!googleFitConnected}
            log={log}
            today={today}
            onLogChange={onLogChange}
          />
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-8 animate-fade-up" style={{ animationDelay: '240ms' }} />

      {/* Evening section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: '220ms' }}>
          <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">
            Evening
          </p>
          <p className="text-[10px] text-white/20 tabular-nums">
            {eveningDone} / {EVENING_HABITS.length}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {EVENING_HABITS.map((habit, i) => (
            <HabitCard
              key={habit.key}
              habit={habit}
              log={log}
              onChange={handleChange}
              index={i + MORNING_HABITS.length + 4}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-8" />

      {/* Reflection */}
      <section className="mb-8 animate-fade-up" style={{ animationDelay: '400ms' }}>
        <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] mb-3">
          Reflection
        </p>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="What went well today? What would you do differently?"
          rows={4}
          className="w-full px-4 py-3 text-sm border border-white/[0.07] rounded-xl resize-none focus:outline-none focus:border-white/[0.15] placeholder:text-white/18 bg-white/[0.03] text-white/75 transition-colors"
        />
        <button
          type="button"
          onClick={saveReflection}
          className="mt-2.5 w-full py-3 text-sm font-semibold bg-white/[0.08] text-white/75 rounded-xl hover:bg-white/[0.12] hover:text-white/90 active:scale-[0.99] transition-all border border-white/[0.08]"
        >
          {reflectionSaved ? '✓ Saved' : 'Save Reflection'}
        </button>
      </section>

      <WeekRecapSection weeklyLog={weeklyLog} isFriday={isFriday()} />
    </div>
  )
}
