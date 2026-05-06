'use client'

import { useState, useCallback, useTransition } from 'react'
import { upsertDailyLog } from '@/app/dashboard/actions'
import type { DailyLog } from '@/types/habit'

interface EveningReflectionSectionProps {
  log: Partial<DailyLog>
  today: string
  onChange: (fields: Partial<DailyLog>) => void
}

export function EveningReflectionSection({ log, today, onChange }: EveningReflectionSectionProps) {
  const [text, setText] = useState(log.evening_reflection ?? '')
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const save = useCallback(
    (value: string) => {
      startTransition(async () => {
        await upsertDailyLog(today, { evening_reflection: value })
        onChange({ evening_reflection: value })
        setSavedAt(
          new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        )
      })
    },
    [today, onChange]
  )

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-black">Evening Reflection</h2>
          <p className="text-xs text-gray-400">End your day with intention</p>
        </div>
        {savedAt && <span className="text-xs text-gray-400">Saved {savedAt}</span>}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What went well today? What would you do differently?"
        rows={5}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-300 mb-3"
      />
      <button
        type="button"
        onClick={() => save(text)}
        disabled={isPending}
        className="w-full py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save Reflection'}
      </button>
    </section>
  )
}
