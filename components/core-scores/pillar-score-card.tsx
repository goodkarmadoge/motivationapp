'use client'

import { cn } from '@/lib/utils'
import type { CorePillarDefinition } from '@/types/habit'

const SCORE_LABELS = ['', 'Low', 'Fair', 'Good', 'Great', 'Peak']

interface PillarScoreCardProps {
  pillar: CorePillarDefinition
  value: number | null
  onChange: (v: number) => void
  index?: number
}

export function PillarScoreCard({ pillar, value, onChange, index = 0 }: PillarScoreCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all duration-300 animate-fade-up',
        value
          ? 'border-white/[0.1]'
          : 'border-white/[0.05] hover:border-white/[0.09]'
      )}
      style={{
        animationDelay: `${index * 60}ms`,
        backgroundColor: value ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          {pillar.label}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            'text-2xl font-semibold tabular-nums leading-none transition-all duration-200',
            value ? 'text-white/80' : 'text-white/12'
          )}>
            {value ?? '—'}
          </span>
          {value && (
            <span className="text-[11px] font-medium text-white/30 animate-fade-in">
              {SCORE_LABELS[value]}
            </span>
          )}
        </div>
      </div>

      {/* Score buttons */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 h-10 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 border',
              value === n
                ? 'text-[#0C0C0C] border-transparent'
                : 'border-white/[0.06] bg-white/[0.03] text-white/22 hover:bg-white/[0.07] hover:text-white/50 hover:border-white/[0.12]'
            )}
            style={value === n ? { backgroundColor: pillar.color, borderColor: pillar.color } : {}}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex mt-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex-1 text-center">
            <span className={cn(
              'text-[9px] tracking-wide uppercase',
              value === n ? 'font-semibold text-white/45' : 'text-white/15'
            )}>
              {SCORE_LABELS[n]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
