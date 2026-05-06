'use client'

import { cn } from '@/lib/utils'
import type { CorePillarDefinition } from '@/types/habit'

interface PillarSliderProps {
  pillar: CorePillarDefinition
  value: number | null
  onChange: (v: number) => void
}

const LABELS = ['', 'Low', 'Fair', 'Good', 'Great', 'Peak']

export function PillarSlider({ pillar, value, onChange }: PillarSliderProps) {
  const current = value ?? 0

  return (
    <div className={cn('rounded-xl border p-4 transition-all', pillar.borderClass, pillar.bgClass)}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn('text-sm font-bold', pillar.textClass)}>{pillar.label}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn('text-xl font-extrabold tabular-nums', pillar.textClass)}>
            {current || '—'}
          </span>
          {current > 0 && (
            <span className="text-xs text-gray-400">{LABELS[current]}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={current || 1}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={cn('w-full h-2 rounded-full cursor-pointer', pillar.trackClass)}
        style={{
          // Show gray track until user has set a value
          opacity: current === 0 ? 0.4 : 1,
        }}
      />
      <div className="flex justify-between mt-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              'text-xs tabular-nums',
              current === n ? pillar.textClass + ' font-bold' : 'text-gray-300'
            )}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}
