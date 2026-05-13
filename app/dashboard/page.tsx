import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { getDailyLog, getCurrentWeeklyLog } from './actions'
import { DEFAULT_DAILY_LOG, todayISO } from '@/lib/habits'
import type { DailyLog } from '@/types/habit'

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('demo_mode')?.value === '1'
  const today = todayISO()

  const params = await searchParams
  let selectedDate = params.date || today

  // Prevent future-date navigation
  if (new Date(selectedDate) > new Date(today)) {
    selectedDate = today
  }

  if (isDemo) {
    const initialLog: DailyLog = { ...DEFAULT_DAILY_LOG, log_date: selectedDate }
    return (
      <DashboardShell
        key={selectedDate}
        initialLog={initialLog}
        initialWeeklyLog={null}
        today={today}
        selectedDate={selectedDate}
        isDemo
      />
    )
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const [existingLog, weeklyLog] = await Promise.all([
    getDailyLog(selectedDate),
    getCurrentWeeklyLog(),
  ])

  const initialLog: DailyLog = existingLog ?? {
    ...DEFAULT_DAILY_LOG,
    log_date: selectedDate,
    user_id: user.id,
  }

  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined
  const firstName =
    meta?.full_name?.trim().split(/\s+/)[0] ||
    meta?.name?.trim().split(/\s+/)[0] ||
    user.email?.split('@')[0] ||
    'there'

  return (
    <DashboardShell
      key={selectedDate}
      initialLog={initialLog}
      initialWeeklyLog={weeklyLog}
      today={today}
      selectedDate={selectedDate}
      userFirstName={firstName}
    />
  )
}
