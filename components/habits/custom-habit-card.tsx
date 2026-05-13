'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CustomHabit, CustomHabitEntry } from '@/lib/custom-habits'

interface CustomHabitCardProps {
  habit: CustomHabit
  entry: CustomHabitEntry
  onToggle: (done: boolean) => void
  onCount: (count: number) => void
  onEdit: () => void
  onDelete: () => void
  index?: number
}

function DotsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

export function CustomHabitCard({
  habit,
  entry,
  onToggle,
  onCount,
  onEdit,
  onDelete,
  index = 0,
}: CustomHabitCardProps) {
  const done = entry.done
  const count = entry.count
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onClick={() => {
        if (menuOpen) { setMenuOpen(false); return }
        onToggle(!done)
      }}
      className={cn(
        'relative flex flex-col items-center justify-center text-center',
        'min-h-[148px] rounded-2xl p-4 cursor-pointer select-none',
        'active:scale-[0.97] transition-all duration-200 border',
        'animate-fade-up',
        done
          ? 'border-[#C8A96E]/25 shadow-[0_0_24px_rgba(200,169,110,0.07)]'
          : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
      )}
      style={{
        animationDelay: `${index * 55}ms`,
        backgroundColor: done ? 'rgba(200,169,110,0.07)' : 'rgba(255,255,255,0.03)',
      }}
    >
      {/* ··· edit/delete menu — top-left */}
      <div
        className="absolute top-2.5 left-2.5"
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen((o) => !o)
        }}
      >
        <button className="p-1 rounded-md hover:bg-white/[0.1] transition-colors text-white/20 hover:text-white/50">
          <DotsIcon />
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 mt-1 bg-[#1c1c1c] border border-white/[0.1] rounded-xl overflow-hidden z-20 min-w-[96px] shadow-xl">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onEdit()
              }}
              className="w-full px-4 py-2.5 text-left text-xs text-white/60 hover:bg-white/[0.08] hover:text-white/90 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onDelete()
              }}
              className="w-full px-4 py-2.5 text-left text-xs text-rose-400 hover:bg-white/[0.06] transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Done stamp — top-right */}
      {done && (
        <div className="absolute top-3 right-3 animate-scale-in">
          <div className="w-5 h-5 rounded bg-[#C8A96E]/15 border border-[#C8A96E]/35 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C8A96E"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Label */}
      <span
        className={cn(
          'text-[13px] font-medium leading-tight transition-colors duration-300 px-3',
          done ? 'text-white/85' : 'text-white/55'
        )}
      >
        {habit.name}
      </span>

      {/* 1,2,3 count picker */}
      {habit.type === 'count' && done && (
        <div
          className="mt-3 w-full flex justify-center animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onCount(n)}
                className={cn(
                  'w-8 h-7 rounded text-xs font-semibold transition-all active:scale-95',
                  count === n
                    ? 'bg-[#C8A96E] text-[#0C0C0C]'
                    : 'bg-white/[0.06] text-white/35 hover:bg-white/[0.1] hover:text-white/60'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status label */}
      {!(habit.type === 'count' && done) && (
        <p
          className={cn(
            'mt-3 text-[10px] uppercase tracking-widest font-semibold transition-colors duration-300',
            done ? 'text-[#C8A96E]/70' : 'text-white/18'
          )}
        >
          {done ? 'Done' : 'Todo'}
        </p>
      )}
    </div>
  )
}
