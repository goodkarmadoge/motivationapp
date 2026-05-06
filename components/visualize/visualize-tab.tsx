'use client'

import { useEffect, useState } from 'react'
import { TimeRangePicker, getRangeStartDate } from './time-range-picker'
import { StreakSection } from './streak-section'
import { PillarChart } from './pillar-chart'
import { HabitHeatmap } from './habit-heatmap'
import { DataTable } from './data-table'
import { AiInsightCard } from './ai-insight-card'
import { getDateRange, getAllLogs } from '@/app/dashboard/actions'
import type { DailyLog } from '@/types/habit'
import type { TimeRange } from './time-range-picker'

interface VisualizeTabProps {
  today: string
  isDemo?: boolean
}

export function VisualizeTab({ today, isDemo }: VisualizeTabProps) {
  const [range, setRange] = useState<TimeRange>('month')
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [allLogs, setAllLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(!isDemo)

  useEffect(() => {
    if (isDemo) return // no data to fetch in demo mode
    async function load() {
      setLoading(true)
      const [ranged, all] = await Promise.all([
        getDateRange(getRangeStartDate(range), today),
        getAllLogs(),
      ])
      setLogs(ranged)
      setAllLogs(all)
      setLoading(false)
    }
    load()
  }, [range, today, isDemo])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-gray-400">Trend window</p>
        <TimeRangePicker value={range} onChange={setRange} />
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-50 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <AiInsightCard today={today} />
          <StreakSection logs={allLogs} />
          <PillarChart logs={logs} />
          <HabitHeatmap logs={allLogs} />
          <DataTable logs={allLogs} onLogsChange={setAllLogs} />
        </>
      )}
    </div>
  )
}
