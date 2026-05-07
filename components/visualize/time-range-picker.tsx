'use client'

import { cn } from '@/lib/utils'

export type TimeRange = 'week' | 'month' | 'quarter' | 'year'

interface TimeRangePickerProps {
  value: TimeRange
  onChange: (v: TimeRange) => void
}

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'week', label: '7D' },
  { value: 'month', label: '30D' },
  { value: 'quarter', label: '90D' },
  { value: 'year', label: '1Y' },
]

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  return (
    <div className="flex gap-0.5 p-1 bg-white/[0.04] border border-white/[0.06] rounded-lg w-fit">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1 text-[11px] font-semibold tracking-wide rounded-md transition-all duration-150',
            value === opt.value
              ? 'bg-white/[0.1] text-white/88'
              : 'text-white/40 hover:text-white/70'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function getRangeStartDate(range: TimeRange): string {
  const d = new Date()
  if (range === 'week') d.setDate(d.getDate() - 7)
  else if (range === 'month') d.setDate(d.getDate() - 30)
  else if (range === 'quarter') d.setDate(d.getDate() - 90)
  else d.setFullYear(d.getFullYear() - 1)
  return d.toISOString().slice(0, 10)
}
