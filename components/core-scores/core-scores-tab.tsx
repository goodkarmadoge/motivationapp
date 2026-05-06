'use client'

import { useCallback, useRef, useState } from 'react'
import { PillarScoreCard } from './pillar-score-card'
import { CORE_PILLARS, calculateDailyScore } from '@/lib/habits'
import { upsertDailyLog } from '@/app/dashboard/actions'
import type { DailyLog } from '@/types/habit'
import { cn } from '@/lib/utils'

interface CoreScoresTabProps {
  log: DailyLog
  today: string
  onLogChange: (log: DailyLog) => void
  isDemo?: boolean
}

export function CoreScoresTab({ log, today, onLogChange, isDemo }: CoreScoresTabProps) {
  const logRef = useRef<DailyLog>(log)
  logRef.current = log
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [note, setNote] = useState(log.pillar_note ?? '')
  const [noteSaved, setNoteSaved] = useState(false)

  const handlePillarChange = useCallback(
    (fields: Partial<DailyLog>) => {
      const next = { ...logRef.current, ...fields } as DailyLog
      logRef.current = next
      onLogChange(next)

      if (isDemo) return

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        upsertDailyLog(today, {
          ...logRef.current,
          pillars_submitted_at: new Date().toISOString(),
        })
      }, 800)
    },
    [today, onLogChange, isDemo]
  )

  function saveNote() {
    handlePillarChange({ pillar_note: note })
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const allScored = CORE_PILLARS.every((p) => (log[p.dbKey] as number | null) != null)
  const { score, max } = calculateDailyScore(log)
  const pillarSum = CORE_PILLARS.reduce((s, p) => s + ((log[p.dbKey] as number) || 0), 0)
  const pillarAvg = allScored ? (pillarSum / 5).toFixed(1) : null

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pt-1 animate-fade-up">
        <h2 className="text-[1.65rem] font-semibold tracking-tight text-white/88 leading-tight">
          How are you feeling?
        </h2>
        <p className="text-white/35 mt-1.5 text-sm">
          Rate each pillar from 1 (low) to 5 (peak).
        </p>
      </div>

      {/* Summary strip */}
      {allScored && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl border border-[#C8A96E]/15 bg-[#C8A96E]/[0.04] animate-scale-in">
          <div className="flex-1">
            <p className="text-[9px] text-white/28 uppercase tracking-[0.2em] font-semibold">
              Avg Score
            </p>
            <p className="text-2xl font-semibold text-white/80 mt-0.5 tabular-nums">
              {pillarAvg}
              <span className="text-sm font-normal text-white/20 ml-1">/ 5</span>
            </p>
          </div>
          <div className="w-px h-10 bg-white/[0.08]" />
          <div className="flex-1 text-right">
            <p className="text-[9px] text-white/28 uppercase tracking-[0.2em] font-semibold">
              Daily Score
            </p>
            <p className="text-2xl font-semibold text-[#C8A96E] mt-0.5 tabular-nums">
              {score}
              <span className="text-sm font-normal text-white/20 ml-1">/ {max}</span>
            </p>
          </div>
        </div>
      )}

      {/* Pillar score cards */}
      <div className="flex flex-col gap-2.5 mb-6">
        {CORE_PILLARS.map((pillar, i) => (
          <PillarScoreCard
            key={pillar.key}
            pillar={pillar}
            value={log[pillar.dbKey] as number | null}
            onChange={(v) => handlePillarChange({ [pillar.dbKey]: v } as Partial<DailyLog>)}
            index={i}
          />
        ))}
      </div>

      <div className="h-px bg-white/[0.05] mb-6" />

      {/* Note */}
      <section className="animate-fade-up" style={{ animationDelay: '300ms' }}>
        <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] mb-3">
          Notes
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any reflections on your scores today?"
          rows={3}
          className="w-full px-4 py-3 text-sm border border-white/[0.07] rounded-xl resize-none focus:outline-none focus:border-white/[0.15] placeholder:text-white/18 bg-white/[0.03] text-white/75 transition-colors"
        />
        <button
          type="button"
          onClick={saveNote}
          className={cn(
            'mt-2.5 w-full py-3 text-sm font-semibold rounded-xl transition-all active:scale-[0.99] border',
            noteSaved
              ? 'bg-[#C8A96E]/15 text-[#C8A96E] border-[#C8A96E]/25'
              : 'bg-white/[0.06] text-white/60 border-white/[0.08] hover:bg-white/[0.1] hover:text-white/80'
          )}
        >
          {noteSaved ? '✓ Saved' : 'Save Note'}
        </button>
      </section>
    </div>
  )
}
