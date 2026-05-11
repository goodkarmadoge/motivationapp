import type { CorePillarDefinition, DailyLog, HabitDefinition } from '@/types/habit'
export const CORE_PILLARS: CorePillarDefinition[] = [
  { key: 'happy', dbKey: 'pillar_happy', label: 'Happy', color: '#f59e0b', textClass: 'text-amber-500', bgClass: 'bg-amber-50', borderClass: 'border-amber-300', trackClass: 'accent-amber-500' },
  { key: 'healthy', dbKey: 'pillar_healthy', label: 'Healthy', color: '#10b981', textClass: 'text-emerald-500', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-300', trackClass: 'accent-emerald-500' },
  { key: 'wealthy', dbKey: 'pillar_wealthy', label: 'Wealthy', color: '#8b5cf6', textClass: 'text-violet-500', bgClass: 'bg-violet-50', borderClass: 'border-violet-300', trackClass: 'accent-violet-500' },
  { key: 'grounded', dbKey: 'pillar_grounded', label: 'Grounded', color: '#0ea5e9', textClass: 'text-sky-500', bgClass: 'bg-sky-50', borderClass: 'border-sky-300', trackClass: 'accent-sky-500' },
  { key: 'motivated', dbKey: 'pillar_motivated', label: 'Motivated', color: '#f43f5e', textClass: 'text-rose-500', bgClass: 'bg-rose-50', borderClass: 'border-rose-300', trackClass: 'accent-rose-500' },
]
export const MORNING_HABITS: HabitDefinition[] = [
  { key: 'habit_brew_coffee', label: 'Brew Coffee', emoji: 'coffee', session: 'morning' },
  { key: 'habit_walk_karma', label: 'Walk Karma', emoji: 'dog', session: 'morning' },
  { key: 'habit_healthy_breakfast', label: 'Healthy Breakfast', emoji: 'egg', session: 'morning' },
  { key: 'habit_read_podcast', label: 'Read or Podcast 30 Min', emoji: 'book', session: 'morning' },
]
export const AFTERNOON_HABITS: HabitDefinition[] = [
  { key: 'habit_healthy_lunch', label: 'Healthy Lunch', emoji: 'salad', session: 'afternoon' },
  { key: 'habit_drink_water', label: 'Drink Cup of Water', emoji: 'water', session: 'afternoon', subField: { type: 'count', key: 'habit_drink_water_count', label: 'How many cups?', min: 1, max: 3 } },
  { key: 'habit_focus_work', label: 'Focus Work', emoji: 'laptop', session: 'afternoon', subField: { type: 'count', key: 'habit_focus_work_count', label: 'Hours of focus?', min: 1, max: 3 } },
  { key: 'habit_gym', label: 'Workout at Gym', emoji: 'gym', session: 'afternoon' },
]
export const EVENING_HABITS: HabitDefinition[] = [
  { key: 'habit_cook_meal', label: 'Cook a Meal Today', emoji: 'cook', session: 'evening', subField: { type: 'count', key: 'habit_cook_meal_count', label: 'How many meals?', min: 1, max: 3 } },
  { key: 'habit_meditation', label: 'Daily Calm Meditation', emoji: 'leaf', session: 'evening' },
  { key: 'habit_10k_steps', label: 'Hit 10K Steps', emoji: 'steps', session: 'evening' },
]
export const ALL_HABITS: HabitDefinition[] = [...MORNING_HABITS, ...AFTERNOON_HABITS, ...EVENING_HABITS]
export const HABIT_BOOLEAN_KEYS = ALL_HABITS.map((h) => h.key)
export function calculateDailyScore(log: Partial<DailyLog>): { score: number; max: number } {
  const score = [log.pillar_happy??0,log.pillar_healthy??0,log.pillar_wealthy??0,log.pillar_grounded??0,log.pillar_motivated??0].reduce((s,p)=>s+p,0)
  return { score, max: 25 }
}
export function calculateAverageScore(log: Partial<DailyLog>): number {
  const pillars = [log.pillar_happy,log.pillar_healthy,log.pillar_wealthy,log.pillar_grounded,log.pillar_motivated].filter((v): v is number => v !== null && v !== undefined && v > 0)
  if (pillars.length === 0) return 0
  return Math.round((pillars.reduce((s,p)=>s+p,0)/pillars.length)*10)/10
}
export function calculateHabitScore(log: Partial<DailyLog>): number {
  let score = 0
  const simple: (keyof DailyLog)[] = ['habit_brew_coffee','habit_walk_karma','habit_healthy_breakfast','habit_read_podcast','habit_healthy_lunch','habit_gym','habit_meditation','habit_10k_steps']
  for (const k of simple) { if (log[k]) score += 1 }
  if (log.habit_drink_water) score += 1 + (log.habit_drink_water_count ?? 0)
  if (log.habit_focus_work)  score += 1 + (log.habit_focus_work_count ?? 0)
  if (log.habit_cook_meal)   score += 1 + (log.habit_cook_meal_count ?? 0)
  return score
}
export function getWeekStart(date: Date): Date {
  const d = new Date(date); const day = d.getDay(); const diff = day===0?-6:1-day
  d.setDate(d.getDate()+diff); d.setHours(0,0,0,0); return d
}
export function todayISO(): string { return new Date().toISOString().slice(0,10) }
export function weekStartISO(date?: Date): string { return getWeekStart(date??new Date()).toISOString().slice(0,10) }
export function isFriday(): boolean { return new Date().getDay()===5 }
export const DEFAULT_DAILY_LOG: Omit<DailyLog,'log_date'> = {
  pillar_happy:null,pillar_healthy:null,pillar_wealthy:null,pillar_grounded:null,pillar_motivated:null,
  pillar_note:null,pillars_submitted_at:null,
  habit_brew_coffee:false,habit_walk_karma:false,habit_healthy_breakfast:false,habit_read_podcast:false,
  habit_healthy_lunch:false,habit_drink_water:false,habit_drink_water_count:null,
  habit_focus_work:false,habit_focus_work_count:null,habit_gym:false,
  habit_cook_meal:false,habit_cook_meal_count:null,habit_meditation:false,habit_10k_steps:false,
  habit_step_count:null,habit_step_source:'manual',evening_reflection:null,daily_score:0,max_possible_score:25,
}