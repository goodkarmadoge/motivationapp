'use client'

import { MotivationWordmark } from '@/components/ui/motivation-logo'

interface DashboardHeaderProps {
  averageScore: number
  habitScore: number
  date: string
}

export function DashboardHeader({ averageScore, habitScore, date }: DashboardHeaderProps) {
  const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
  const avgPct = averageScore / 5
  const avgColor = avgPct >= 0.7 ? '#C8A96E' : avgPct >= 0.4 ? 'rgba(255,255,255,0.70)' : avgPct > 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.20)'
  return (
    <div className="flex items-center justify-between py-4 mb-6 border-b border-white/[0.06] animate-fade-up">
      <div>
        <MotivationWordmark size="sm" />
        <p className="text-[11px] text-white/28 mt-1.5 pl-0.5 tracking-wide">{label}</p>
      </div>
      <div className="flex items-end gap-4">
        <div className="text-right">
          <div className="text-xl font-semibold tabular-nums leading-none text-white/55 transition-all duration-500">{habitScore}</div>
          <p className="text-[9px] text-white/22 mt-1 tracking-widest uppercase">Habits</p>
        </div>
        <div className="h-7 w-px bg-white/[0.07] mb-1" />
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums leading-none transition-all duration-500" style={{ color: avgColor }}>
            {averageScore > 0 ? averageScore.toFixed(1) : '—'}
            <span className="text-base font-normal ml-1 text-white/15">/ 5</span>
          </div>
          <p className="text-[9px] text-white/22 mt-1 tracking-widest uppercase">Avg Score</p>
        </div>
      </div>
    </div>
  )
}