'use client'

import { useState, useTransition } from 'react'
import { syncStepsFromGarmin } from '@/app/dashboard/actions'
import type { DailyLog } from '@/types/habit'

interface GarminBannerProps {
  log: DailyLog
  today: string
  onLogChange: (log: DailyLog) => void
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="22 12 18 12 15 20 9 4 6 12 2 12" />
    </svg>
  )
}

export function GarminBanner({ log, today, onLogChange }: GarminBannerProps) {
  const [syncing, setSyncing] = useState(false)
  const [lastSteps, setLastSteps] = useState<number | null>(log.habit_step_count ?? null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleSync() {
    setSyncing(true)
    setSyncError(null)
    startTransition(async () => {
      try {
        const { steps } = await syncStepsFromGarmin(today)
        setLastSteps(steps)
        onLogChange({
          ...log,
          habit_step_count: steps,
          habit_step_source: 'garmin',
          habit_10k_steps: steps !== null && steps >= 10000 ? true : log.habit_10k_steps,
        })
      } catch {
        setSyncError('Sync failed — check Garmin credentials')
      } finally {
        setSyncing(false)
      }
    })
  }

  const stepDisplay =
    lastSteps !== null
      ? lastSteps.toLocaleString()
      : log.habit_step_source === 'garmin' && log.habit_step_count !== null
      ? log.habit_step_count.toLocaleString()
      : null

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center justify-between animate-fade-up">
      <div className="flex items-center gap-2.5">
        <div className="text-[#C8A96E]/60">
          <ActivityIcon />
        </div>
        <div>
          <span className="text-[12px] font-medium text-white/60">Garmin Connect</span>
          {stepDisplay && (
            <span className="text-[11px] text-white/35 ml-2">{stepDisplay} steps today</span>
          )}
          {syncError && (
            <span className="text-[11px] text-red-400/70 ml-2">{syncError}</span>
          )}
        </div>
      </div>

      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-white/80 transition-colors disabled:opacity-40"
      >
        {syncing ? (
          <span className="w-3 h-3 rounded-full border border-white/30 border-t-white/70 animate-spin inline-block" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        )}
        Sync
      </button>
    </div>
  )
}
