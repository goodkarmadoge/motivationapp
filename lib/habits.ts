import type { CorePillarDefinition, DailyLog, HabitDefinition } from '@/types/habit'

export const CORE_PILLARS: CorePillarDefinition[] = [
  {
    key: 'happy',
    dbKey: 'pillar_happy',
    label: 'Happy',
    color: '#f59e0b',
    textClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    trackClass: 'accent-amber-500',
  },
  {
    key: 'healthy',
    dbKey: 'pillar_healthy',
    label: 'Healthy',
    color: '#10b981',
    textClass: 'text-emerald-500',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    trackClass: 'accent-emerald-500',
  },
  {
    key: 'wealthy',
    dbKey: 'pillar_wealthy',
    label: 'Wealthy',
    color: '#8b5cf6',
    textClass: 'text-violet-500',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-300',
    trackClass: 'accent-violet-500',
  },
  {
    key: 'grounded',
    dbKey: 'pillar_grounded',
    label: 'Grounded',
    color: '#0ea5e9',
    textClass: 'text-sky-500',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-300',
    trackClass: 'accent-sky-500',
  },
  {
    key: 'motivated',
    dbKey: 'pillar_motivated',
    label: 'Motivated',
    color: '#f43f5e',
    textClass: 'text-rose-500',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
    trackClass: 'accent-rose-500',
  },
]

export const MORNING_HABITS: HabitDefinition[] = [
  { key: 'habit_pourover_coffee', label: 'Make Pourover Coffee', emoji: '☕', session: 'morning' },
  { key: 'habit_dog_walk', label: 'Take Dog on Morning Walk', emoji: '🐕', session: 'morning' },
  { key: 'habit_healthy_lunch', label: 'Eat a Healthy Lunch', emoji: '🥗', session: 'morning' },
  { key: 'habit_reading', label: '30 Minutes of Reading', emoji: '📚', session: 'morning' },
]

export const EVENING_HABITS: HabitDefinition[] = [
  { key: 'habit_gym', label: 'Workout at the Gym', emoji: '🏋️', session: 'evening' },
  {
    key: 'habit_cook_meal',
    label: 'Cook a Meal Today',
    emoji: '🍳',
    session: 'evening',
    subField: {
      type: 'count',
      key: 'habit_cook_meal_count',
      label: 'How many meals?',
      min: 1,
      max: 3,
    },
  },
  { key: 'habit_meditation', label: 'Daily Calm Meditation', emoji: '🧘', session: 'evening' },
  {
    key: 'habit_10k_steps',
    label: 'Hit 10K Steps Today',
    emoji: '👟',
    session: 'evening',
    subField: {
      type: 'number',
      key: 'habit_step_count',
      label: 'Step count',
      placeholder: 'e.g. 10432',
    },
  },
  { key: 'habit_healthy_dinner', label: 'Eat a Healthy Dinner', emoji: '🥦', session: 'evening' },
  { key: 'habit_focus_work', label: 'Meaningful Focus Work', emoji: '💻', session: 'evening' },
]

export const ALL_HABITS: HabitDefinition[] = [...MORNING_HABITS, ...EVENING_HABITS]

export const HABIT_BOOLEAN_KEYS = ALL_HABITS.map((h) => h.key)

export function calculateDailyScore(log: Partial<DailyLog>): { score: number; max: number } {
  const score = [
    log.pillar_happy ?? 0,
    log.pillar_healthy ?? 0,
    log.pillar_wealthy ?? 0,
    log.pillar_grounded ?? 0,
    log.pillar_motivated ?? 0,
  ].reduce((s, p) => s + p, 0)
  return { score, max: 25 }
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  // Monday-based week
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function weekStartISO(date?: Date): string {
  return getWeekStart(date ?? new Date()).toISOString().slice(0, 10)
}

export function isFriday(): boolean {
  return new Date().getDay() === 5
}

export const DEFAULT_DAILY_LOG: Omit<DailyLog, 'log_date'> = {
  pillar_happy: null,
  pillar_healthy: null,
  pillar_wealthy: null,
  pillar_grounded: null,
  pillar_motivated: null,
  pillar_note: null,
  pillars_submitted_at: null,
  habit_pourover_coffee: false,
  habit_dog_walk: false,
  habit_healthy_lunch: false,
  habit_gym: false,
  habit_cook_meal: false,
  habit_cook_meal_count: null,
  habit_meditation: false,
  habit_10k_steps: false,
  habit_step_count: null,
  habit_step_source: 'manual',
  habit_healthy_dinner: false,
  habit_focus_work: false,
  habit_reading: false,
  evening_reflection: null,
  daily_score: 0,
  max_possible_score: 25,
}
