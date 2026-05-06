'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { calculateDailyScore, DEFAULT_DAILY_LOG, weekStartISO } from '@/lib/habits'
import type { DailyLog, WeeklyLog } from '@/types/habit'
import { revalidatePath } from 'next/cache'

async function getUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return user.id
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .single()

  if (error?.code === 'PGRST116') return null // not found
  if (error) throw error
  return data as DailyLog
}

export async function upsertDailyLog(date: string, fields: Partial<DailyLog>): Promise<DailyLog> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const merged = { ...DEFAULT_DAILY_LOG, ...fields }
  const { score, max } = calculateDailyScore(merged)

  const { data, error } = await supabase
    .from('daily_logs')
    .upsert(
      {
        user_id: userId,
        log_date: date,
        ...fields,
        daily_score: score,
        max_possible_score: max,
      },
      { onConflict: 'user_id,log_date' }
    )
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard')
  return data as DailyLog
}

export async function getWeeklyLog(weekStart: string): Promise<WeeklyLog | null> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('weekly_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStart)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as WeeklyLog
}

export async function upsertWeeklyLog(weekStart: string, fields: Partial<WeeklyLog>): Promise<WeeklyLog> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('weekly_logs')
    .upsert(
      { user_id: userId, week_start_date: weekStart, ...fields },
      { onConflict: 'user_id,week_start_date' }
    )
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard')
  return data as WeeklyLog
}

export async function getLast30Days(): Promise<DailyLog[]> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const from = new Date()
  from.setDate(from.getDate() - 30)
  const fromStr = from.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', fromStr)
    .order('log_date', { ascending: true })

  if (error) throw error
  return (data ?? []) as DailyLog[]
}

export async function getDateRange(from: string, to: string): Promise<DailyLog[]> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', from)
    .lte('log_date', to)
    .order('log_date', { ascending: true })

  if (error) throw error
  return (data ?? []) as DailyLog[]
}

export async function getAllLogs(): Promise<DailyLog[]> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })

  if (error) throw error
  return (data ?? []) as DailyLog[]
}

export async function deleteAiInsightCache(date: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const userId = await getUserId()

  await supabase
    .from('ai_insights')
    .delete()
    .eq('user_id', userId)
    .eq('insight_date', date)
}

export async function getCurrentWeeklyLog(): Promise<WeeklyLog | null> {
  return getWeeklyLog(weekStartISO())
}
