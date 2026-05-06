'use client'

import { cn } from '@/lib/utils'

export type Tab = 'habits' | 'core-scores' | 'insights'

interface TabNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

function HabitsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.75 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ScoresIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.75 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
      <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.75 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
      <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  )
}

const TABS: { value: Tab; label: string; Icon: React.ComponentType<{ active: boolean }> }[] = [
  { value: 'habits', label: 'Habits', Icon: HabitsIcon },
  { value: 'core-scores', label: 'Scores', Icon: ScoresIcon },
  { value: 'insights', label: 'Insights', Icon: InsightsIcon },
]

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06]"
      style={{ backgroundColor: 'rgba(12,12,12,0.96)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-[430px] mx-auto flex">
        {TABS.map((tab) => {
          const isActive = active === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 min-h-[56px]',
                'transition-colors duration-150',
                isActive ? 'text-white/88' : 'text-white/25 hover:text-white/45'
              )}
            >
              <tab.Icon active={isActive} />
              <span className={cn(
                'text-[9px] uppercase tracking-widest',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-white/40 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
