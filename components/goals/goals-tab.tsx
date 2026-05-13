'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GoalCard } from './goal-card'
import { ExploreTab } from './explore-tab'
import { WeekRecapSection } from '@/components/integrate/week-recap-section'
import { upsertDailyLog } from '@/app/dashboard/actions'
import { isFriday } from '@/lib/habits'
import type { DailyLog, WeeklyLog } from '@/types/habit'

const GOALS = [
  { id: 'get-fit', category: 'Physical Health', headline: 'Get Fit', subline: 'Reach 15% Body Fat', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
  { id: 'be-bold', category: 'Mindset', headline: 'Be Bold', subline: 'Reach out. Make big plans.', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  { id: 'be-uncomfortable', category: 'Growth', headline: 'Be Uncomfortable', subline: 'Push yourself to grow.', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
]

type SubTab = 'goals' | 'explore'

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

interface GoalsTabProps {
  log: DailyLog
  weeklyLog: WeeklyLog | null
  selectedDate: string
  today: string
  onLogChange: (log: DailyLog) => void
  isDemo?: boolean
}

export function GoalsTab({ log, weeklyLog, selectedDate, today, onLogChange, isDemo }: GoalsTabProps) {
  const [subtab, setSubtab] = useState<SubTab>('goals')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Reflection state
  const logRef = useRef<DailyLog>(log)
  logRef.current = log
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [reflectionText, setReflectionText] = useState(log.evening_reflection ?? '')
  const [reflectionSaved, setReflectionSaved] = useState(false)

  useEffect(() => {
    if (isDemo) return
    fetch('/api/goal-note')
      .then((r) => r.ok ? r.json() : {})
      .then((data: Record<string, string>) => setNotes(data))
      .catch(() => {})
  }, [isDemo])

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const handleNoteChange = useCallback((goalId: string, text: string) => {
    setNotes((prev) => ({ ...prev, [goalId]: text }))
  }, [])

  const handleNoteSave = useCallback((goalId: string, currentNotes: Record<string, string>) => {
    if (isDemo) return
    clearTimeout(saveTimers.current[goalId])
    saveTimers.current[goalId] = setTimeout(() => {
      fetch('/api/goal-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, noteText: currentNotes[goalId] ?? '' }),
      }).catch(() => {})
    }, 300)
  }, [isDemo])

  const handleChange = useCallback(
    (fields: Partial<DailyLog>) => {
      const next = { ...logRef.current, ...fields } as DailyLog
      logRef.current = next
      onLogChange(next)
      if (isDemo) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        upsertDailyLog(selectedDate, logRef.current)
      }, 800)
    },
    [selectedDate, onLogChange, isDemo]
  )

  function saveReflection() {
    handleChange({ evening_reflection: reflectionText })
    setReflectionSaved(true)
    setTimeout(() => setReflectionSaved(false), 2000)
  }

  return (
    <div>
      {/* Sub-tab selector */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.04] border border-white/[0.05] animate-fade-up">
        <button
          onClick={() => setSubtab('goals')}
          className={cn('flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200', subtab === 'goals' ? 'bg-white/[0.1] text-white/90' : 'text-white/35 hover:text-white/55')}
        >
          Goals
        </button>
        <button
          onClick={() => setSubtab('explore')}
          className={cn('flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5', subtab === 'explore' ? 'bg-white/[0.1] text-white/90' : 'text-white/35 hover:text-white/55')}
        >
          <CompassIcon className="w-3.5 h-3.5" /> Explore
        </button>
      </div>

      {subtab === 'goals' && (
        <>
          <div className="mb-5 animate-fade-up">
            <p className="text-white/35 text-sm">Keep these in sight. Let them pull you forward.</p>
          </div>

          <div className="space-y-3 mb-10">
            {GOALS.map((goal, i) => (
              <GoalCard
                key={goal.id}
                {...goal}
                index={i}
                expanded={expandedId === goal.id}
                note={notes[goal.id] ?? ''}
                onToggle={() => handleToggle(goal.id)}
                onNoteChange={(text) => handleNoteChange(goal.id, text)}
                onNoteSave={() => handleNoteSave(goal.id, notes)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.05] mb-8" />

          {/* Reflection */}
          <section className="mb-8 animate-fade-up" style={{ animationDelay: '150ms' }}>
            <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] mb-3">
              Reflection
            </p>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="What went well today? What would you do differently?"
              rows={4}
              className="w-full px-4 py-3 text-sm border border-white/[0.07] rounded-xl resize-none focus:outline-none focus:border-white/[0.15] placeholder:text-white/18 bg-white/[0.03] text-white/75 transition-colors"
            />
            <button
              type="button"
              onClick={saveReflection}
              className="mt-2.5 w-full py-3 text-sm font-semibold bg-white/[0.08] text-white/75 rounded-xl hover:bg-white/[0.12] hover:text-white/90 active:scale-[0.99] transition-all border border-white/[0.08]"
            >
              {reflectionSaved ? '✓ Saved' : 'Save Reflection'}
            </button>
          </section>

          {/* End of Week Recap */}
          <WeekRecapSection weeklyLog={weeklyLog} isFriday={isFriday()} />
        </>
      )}

      {subtab === 'explore' && <ExploreTab />}
    </div>
  )
}