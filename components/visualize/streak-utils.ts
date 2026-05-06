import type { DailyLog, HabitKey } from '@/types/habit'
import { HABIT_BOOLEAN_KEYS } from '@/lib/habits'

export interface StreakResult {
  key: HabitKey
  current: number
  longest: number
}

export function computeStreaks(logs: DailyLog[]): StreakResult[] {
  const sorted = [...logs].sort((a, b) => b.log_date.localeCompare(a.log_date))

  return HABIT_BOOLEAN_KEYS.map((key) => {
    let current = 0
    let longest = 0
    let temp = 0
    let inStreak = true

    for (const log of sorted) {
      const done = !!(log[key as keyof DailyLog])
      if (inStreak) {
        if (done) {
          current++
          temp = current
        } else {
          inStreak = false
        }
      }
      if (done) {
        temp++
      } else {
        if (temp > longest) longest = temp
        temp = 0
      }
    }
    if (temp > longest) longest = temp

    return { key, current, longest }
  })
}

export function buildPillarChartData(logs: DailyLog[]) {
  return logs.map((log) => ({
    date: log.log_date,
    happy: log.pillar_happy ?? null,
    healthy: log.pillar_healthy ?? null,
    wealthy: log.pillar_wealthy ?? null,
    grounded: log.pillar_grounded ?? null,
    motivated: log.pillar_motivated ?? null,
  }))
}

export function buildScoreChartData(logs: DailyLog[]) {
  return logs.map((log) => ({
    date: log.log_date,
    score: log.daily_score,
  }))
}
