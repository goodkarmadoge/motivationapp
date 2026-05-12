// Custom habit definitions and per-day logs stored in localStorage.
// The main DailyLog/DB schema only holds predefined habits; custom habits
// live entirely on the client so no migrations are required.

export type HabitType = 'yes-no' | 'count'
export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

export interface CustomHabit {
  id: string
  name: string
  timeOfDay: TimeOfDay
  type: HabitType
  createdAt: string
}

/** Per-day completion state for a custom habit. */
export interface CustomHabitEntry {
  done: boolean
  count: number | null
}

export type CustomHabitLog = Record<string, CustomHabitEntry>

const HABITS_KEY = 'motivation_custom_habits'
const LOG_PREFIX = 'motivation_custom_log_'

export function loadCustomHabits(): CustomHabit[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]') as CustomHabit[]
  } catch {
    return []
  }
}

export function saveCustomHabits(habits: CustomHabit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function loadCustomLog(date: string): CustomHabitLog {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(LOG_PREFIX + date) ?? '{}') as CustomHabitLog
  } catch {
    return {}
  }
}

export function saveCustomLog(date: string, log: CustomHabitLog): void {
  localStorage.setItem(LOG_PREFIX + date, JSON.stringify(log))
}
