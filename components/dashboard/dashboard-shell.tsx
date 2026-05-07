'use client'

import { useState } from 'react'
import { TabNav, type Tab } from './tab-nav'
import { DashboardHeader } from './dashboard-header'
import { UserHeader } from './user-header'
import { HabitsTab } from '@/components/habits/habits-tab'
import { CoreScoresTab } from '@/components/core-scores/core-scores-tab'
import { VisualizeTab } from '@/components/visualize/visualize-tab'
import { GoalsTab } from '@/components/goals/goals-tab'
import { calculateDailyScore } from '@/lib/habits'
import type { DailyLog, WeeklyLog } from '@/types/habit'

interface DashboardShellProps {
  initialLog: DailyLog
  initialWeeklyLog: WeeklyLog | null
  today: string
  isDemo?: boolean
  userFirstName?: string
  googleFitConnected?: boolean
}

export function DashboardShell({ initialLog, initialWeeklyLog, today, isDemo, userFirstName, googleFitConnected }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>('habits')
  const [log, setLog] = useState<DailyLog>(initialLog)

  const { score, max } = calculateDailyScore(log)

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      <div className="max-w-[430px] mx-auto px-4 sm:px-5 pt-5 pb-24">
        {isDemo ? (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 animate-fade-up">
            <p className="text-sm text-white/40">
              <span className="font-semibold text-white/60">Demo mode</span> — data is not saved.
            </p>
            <a
              href="/api/demo/stop"
              className="text-xs font-semibold text-white/28 underline underline-offset-2 hover:text-white/60 transition-colors"
            >
              Exit demo
            </a>
          </div>
        ) : userFirstName ? (
          <UserHeader firstName={userFirstName} />
        ) : null}

        <DashboardHeader score={score} max={max} date={today} />

        {activeTab === 'habits' && (
          <HabitsTab
            log={log}
            weeklyLog={initialWeeklyLog}
            today={today}
            onLogChange={setLog}
            isDemo={isDemo}
            googleFitConnected={googleFitConnected}
          />
        )}

        {activeTab === 'core-scores' && (
          <CoreScoresTab
            log={log}
            today={today}
            onLogChange={setLog}
            isDemo={isDemo}
          />
        )}

        {activeTab === 'insights' && (
          <VisualizeTab today={today} isDemo={isDemo} />
        )}

        {activeTab === 'goals' && (
          <GoalsTab />
        )}
      </div>

      <TabNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
