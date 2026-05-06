'use client'

import { useState, useTransition } from 'react'
import { PillarSlider } from './pillar-slider'
import { CORE_PILLARS } from '@/lib/habits'
import { upsertDailyLog } from '@/app/dashboard/actions'
import type { DailyLog } from '@/types/habit'

interface CorePillarsSectionProps {
  log: Partial<DailyLog>
  today: string
  onChange: (fields: Partial<DailyLog>) => void
}

export function CorePillarsSection({ log, today, onChange }: CorePillarsSectionProps) {
  const [note, setNote] = useState(log.pillar_note ?? '')
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState<string | null>(
    log.pillars_submitted_at
      ? new Date(log.pillars_submitted_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      : null
  )

  function handleSave() {
    startTransition(async () => {
      const fields: Partial<DailyLog> = {
        pillar_happy: log.pillar_happy,
        pillar_healthy: log.pillar_healthy,
        pillar_wealthy: log.pillar_wealthy,
        pillar_grounded: log.pillar_grounded,
        pillar_motivated: log.pillar_motivated,
        pillar_note: note,
        pillars_submitted_at: new Date().toISOString(),
      }
      const updated = await upsertDailyLog(today, fields)
      onChange(updated)
      setSavedAt(
        new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      )
    })
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-black">Core Pillars</h2>
          <p className="text-xs text-gray-400">Rate each area of your life today (1–5)</p>
        </div>
        {savedAt && (
          <span className="text-xs text-gray-400">Saved at {savedAt}</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {CORE_PILLARS.map((pillar) => (
          <PillarSlider
            key={pillar.key}
            pillar={pillar}
            value={log[pillar.dbKey] as number | null}
            onChange={(v) => onChange({ [pillar.dbKey]: v } as Partial<DailyLog>)}
          />
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="How are you feeling today? Any notes…"
        rows={3}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-300 mb-3"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save Core Pillars'}
      </button>
    </section>
  )
}
