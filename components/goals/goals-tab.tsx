'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GoalCard } from './goal-card'
import { ExploreTab } from './explore-tab'

const GOALS = [
  {
    id: 'get-fit',
    category: 'Physical Health',
    headline: 'Get Fit',
    subline: 'Reach 15% Body Fat',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  },
  {
    id: 'be-bold',
    category: 'Mindset',
    headline: 'Be Bold',
    subline: 'Reach out. Make big plans.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'be-uncomfortable',
    category: 'Growth',
    headline: 'Be Uncomfortable',
    subline: 'Push yourself to grow.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  },
]

type SubTab = 'goals' | 'explore'

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

export function GoalsTab() {
  const [subtab, setSubtab] = useState<SubTab>('goals')

  return (
    <div>
      {/* Subtab switcher */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.04] border border-white/[0.05] animate-fade-up">
        <button
          onClick={() => setSubtab('goals')}
          className={cn(
            'flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200',
            subtab === 'goals'
              ? 'bg-white/[0.1] text-white/90'
              : 'text-white/35 hover:text-white/55'
          )}
        >
          Goals
        </button>
        <button
          onClick={() => setSubtab('explore')}
          className={cn(
            'flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
            subtab === 'explore'
              ? 'bg-white/[0.1] text-white/90'
              : 'text-white/35 hover:text-white/55'
          )}
        >
          <CompassIcon className="w-3.5 h-3.5" />
          Explore
        </button>
      </div>

      {subtab === 'goals' && (
        <>
          <div className="mb-5 animate-fade-up">
            <p className="text-white/35 text-sm">Keep these in sight. Let them pull you forward.</p>
          </div>
          <div className="space-y-3">
            {GOALS.map((goal, i) => (
              <GoalCard key={goal.id} {...goal} index={i} />
            ))}
          </div>
        </>
      )}

      {subtab === 'explore' && <ExploreTab />}
    </div>
  )
}
