'use client'

import { MotivationWordmark } from '@/components/ui/motivation-logo'

interface DashboardHeaderProps {
  score: number
  max: number
  date: string
}

export function DashboardHeader({ score, max, date }: DashboardHeaderProps) {
  const pct = max > 0 ? score / max : 0
  const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const scoreOpacity = pct >= 0.7 ? 1 : pct >= 0.4 ? 0.7 : pct > 0 ? 0.45 : 0.2

  return (
    <div className="flex items-center justify-between py-4 mb-6 border-b border-white/[0.06] animate-fade-up">
      <div>
        <MotivationWordmark size="sm" />
        <p className="text-[11px] text-white/28 mt-1.5 pl-0.5 tracking-wide">{label}</p>
      </div>
      <div className="text-right">
        <div
          className="text-3xl font-semibold tabular-nums leading-none transition-all duration-500"
          style={{
            color: pct >= 0.7 ? '#C8A96E' : 'rgba(255,255,255,' + scoreOpacity + ')',
          }}
        >
          {score}
          <span className="text-base font-normal ml-1 text-white/15">
            / {max}
          </span>
        </div>
        <p className="text-[10px] text-white/22 mt-1 tracking-widest uppercase">Daily Score</p>
      </div>
    </div>
  )
}
