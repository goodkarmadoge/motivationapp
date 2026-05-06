'use client'

import { cn } from '@/lib/utils'
import { calculateDailyScore } from '@/lib/habits'
import type { DailyLog } from '@/types/habit'

interface DailyScoreBannerProps {
  log: Partial<DailyLog>
}

export function DailyScoreBanner({ log }: DailyScoreBannerProps) {
  const { score, max } = calculateDailyScore(log)
  const pct = max > 0 ? score / max : 0

  const barColor =
    pct >= 0.7 ? 'bg-emerald-500' : pct >= 0.4 ? 'bg-amber-400' : 'bg-gray-300'

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Today's Score
        </span>
        <span
          className={cn(
            'text-lg font-extrabold tabular-nums',
            pct >= 0.7 ? 'text-emerald-600' : pct >= 0.4 ? 'text-amber-500' : 'text-gray-400'
          )}
        >
          {score.toFixed(1)} / {max}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(pct * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}
