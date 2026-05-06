'use client'

import { useCallback, useRef } from 'react'
import { DailyScoreBanner } from './daily-score-banner'
import { CorePillarsSection } from './core-pillars-section'
import { HabitStackSection } from './habit-stack-section'
import { EveningReflectionSection } from './evening-reflection-section'
import { WeekRecapSection } from './week-recap-section'
import { MORNING_HABITS, EVENING_HABITS, isFriday } from '@/lib/habits'
import { upsertDailyLog } from '@/app/dashboard/actions'
import type { DailyLog, WeeklyLog } from '@/types/habit'

interface IntegrateTabProps {
  log: DailyLog
  weeklyLog: WeeklyLog | null
  today: string
  onLogChange: (log: DailyLog) => void
  isDemo?: boolean
}

export function IntegrateTab({ log, weeklyLog, today, onLogChange, isDemo }: IntegrateTabProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (fields: Partial<DailyLog>) => {
      onLogChange({ ...log, ...fields })

      if (isDemo) return // demo: optimistic only, no server save

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        const updated = await upsertDailyLog(today, { ...log, ...fields })
        onLogChange(updated)
      }, 800)
    },
    [log, today, onLogChange, isDemo]
  )

  return (
    <div>
      <DailyScoreBanner log={log} />
      <CorePillarsSection log={log} today={today} onChange={handleChange} />
      <HabitStackSection
        session="morning"
        habits={MORNING_HABITS}
        log={log}
        onChange={handleChange}
      />
      <HabitStackSection
        session="evening"
        habits={EVENING_HABITS}
        log={log}
        onChange={handleChange}
      />
      <EveningReflectionSection log={log} today={today} onChange={handleChange} />
      <WeekRecapSection weeklyLog={weeklyLog} isFriday={isFriday()} />
    </div>
  )
}
