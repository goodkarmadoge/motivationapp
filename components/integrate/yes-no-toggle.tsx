'use client'

import { cn } from '@/lib/utils'

interface YesNoToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  size?: 'sm' | 'md'
}

export function YesNoToggle({ value, onChange, size = 'md' }: YesNoToggleProps) {
  const base = size === 'sm'
    ? 'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95'
    : 'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95'

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          base,
          value
            ? 'bg-white/90 text-[#0C0C0C]'
            : 'bg-white/[0.05] text-white/30 border border-white/[0.07] hover:bg-white/[0.09] hover:text-white/55'
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          base,
          !value
            ? 'bg-white/90 text-[#0C0C0C]'
            : 'bg-white/[0.05] text-white/30 border border-white/[0.07] hover:bg-white/[0.09] hover:text-white/55'
        )}
      >
        No
      </button>
    </div>
  )
}
