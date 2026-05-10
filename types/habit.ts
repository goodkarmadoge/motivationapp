export type PillarKey = 'happy' | 'healthy' | 'wealthy' | 'grounded' | 'motivated'

export type HabitKey =
  | 'habit_brew_coffee'
  | 'habit_walk_karma'
  | 'habit_healthy_breakfast'
  | 'habit_read_podcast'
  | 'habit_healthy_lunch'
  | 'habit_drink_water'
  | 'habit_focus_work'
  | 'habit_gym'
  | 'habit_cook_meal'
  | 'habit_meditation'
  | 'habit_10k_steps'

export interface DailyLog {
  id?: string
  user_id?: string
  log_date: string // YYYY-MM-DD

  // Core Pillars (1-5)
  pillar_happy: number | null
  pillar_healthy: number | null
  pillar_wealthy: number | null
  pillar_grounded: number | null
  pillar_motivated: number | null
  pillar_note: string | null
  pillars_submitted_at: string | null

  // Morning habits
  habit_brew_coffee: boolean
  habit_walk_karma: boolean
  habit_healthy_breakfast: boolean
  habit_read_podcast: boolean

  // Afternoon habits
  habit_healthy_lunch: boolean
  habit_drink_water: boolean
  habit_drink_water_count: number | null
  habit_focus_work: boolean
  habit_focus_work_count: number | null
  habit_gym: boolean

  // Evening habits
  habit_cook_meal: boolean
  habit_cook_meal_count: number | null
  habit_meditation: boolean
  habit_10k_steps: boolean
  habit_step_count: number | null
  habit_step_source: 'manual' | 'garmin'

  // Reflection
  evening_reflection: string | null

  // Score
  daily_score: number
  max_possible_score: number

  created_at?: string
  updated_at?: string
}

export interface WeeklyLog {
  id?: string
  user_id?: string
  week_start_date: string // YYYY-MM-DD (Monday)

  had_social_event: boolean | null
  did_pickleball_cardio: boolean | null
  planned_hosted_event: boolean | null
  gym_4_plus_times: boolean | null
  weekly_recap_note: string | null

  created_at?: string
  updated_at?: string
}

export interface AiInsight {
  id?: string
  user_id?: string
  insight_date: string

  correlation_text: string | null
  predicted_pillars: Record<PillarKey, number> | null
  weekly_narrative: string | null

  created_at?: string
}

export interface HabitDefinition {
  key: HabitKey
  label: string
  emoji: string
  session: 'morning' | 'afternoon' | 'evening'
  subField?: {
    type: 'number' | 'count'
    key: keyof DailyLog
    label: string
    placeholder?: string
    min?: number
    max?: number
  }
}

export interface CorePillarDefinition {
  key: PillarKey
  dbKey: keyof DailyLog
  label: string
  color: string
  textClass: string
  bgClass: string
  borderClass: string
  trackClass: string
}
