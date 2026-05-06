'use client'

import { useState, useTransition } from 'react'
import { YesNoToggle } from './yes-no-toggle'
import { upsertWeeklyLog } from '@/app/dashboard/actions'
import { weekStartISO } from '@/lib/habits'
import type { WeeklyLog } from '@/types/habit'
import { cn } from '@/lib/utils'

interface WeekRecapSectionProps {
  weeklyLog: WeeklyLog | null
  isFriday: boolean
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="22 12 18 12 15 20 9 4 6 12 2 12" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function DumbbellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M6 5v14M18 5v14M3 8v8M21 8v8M6 12h12" />
    </svg>
  )
}

const QUESTIONS: { key: keyof WeeklyLog; label: string; Icon: React.ComponentType }[] = [
  { key: 'had_social_event', label: 'Had a Social Event', Icon: UsersIcon },
  { key: 'did_pickleball_cardio', label: 'Played Pickleball or Cardio', Icon: ActivityIcon },
  { key: 'planned_hosted_event', label: 'Planned or Hosted an Event', Icon: CalendarIcon },
  { key: 'gym_4_plus_times', label: 'Hit the Gym 4+ Times This Week', Icon: DumbbellIcon },
]

export function WeekRecapSection({ weeklyLog, isFriday }: WeekRecapSectionProps) {
  const [open, setOpen] = useState(isFriday)
  const [form, setForm] = useState<Partial<WeeklyLog>>({
    had_social_event: weeklyLog?.had_social_event ?? null,
    did_pickleball_cardio: weeklyLog?.did_pickleball_cardio ?? null,
    planned_hosted_event: weeklyLog?.planned_hosted_event ?? null,
    gym_4_plus_times: weeklyLog?.gym_4_plus_times ?? null,
    weekly_recap_note: weeklyLog?.weekly_recap_note ?? null,
  })
  const [note, setNote] = useState(weeklyLog?.weekly_recap_note ?? '')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    startTransition(async () => {
      await upsertWeeklyLog(weekStartISO(), { ...form, weekly_recap_note: note })
      setSaved(true)
    })
  }

  return (
    <section className="mb-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl border border-dashed border-white/[0.08] hover:border-white/[0.15] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/40">
            <CalendarIcon />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white/70">End of Week Recap</p>
            <p className="text-xs text-white/28 mt-0.5">
              {isFriday ? "It's Friday — time to reflect" : 'Open anytime to review your week'}
            </p>
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('w-4 h-4 text-white/20 transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="mt-2.5 rounded-xl border border-white/[0.06] p-4 space-y-1 animate-fade-up" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          {QUESTIONS.map(({ key, label, Icon }) => (
            <div key={key} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-white/30">
                  <Icon />
                </span>
                <span className="text-sm text-white/55">{label}</span>
              </div>
              <YesNoToggle
                value={!!(form[key])}
                onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
                size="sm"
              />
            </div>
          ))}

          <div className="pt-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Weekly reflection — highlights, lessons, intentions for next week…"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-white/[0.07] rounded-xl resize-none focus:outline-none focus:border-white/[0.15] placeholder:text-white/18 bg-white/[0.03] text-white/65 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              'w-full py-3 text-sm font-semibold rounded-xl transition-all active:scale-[0.99] border',
              saved
                ? 'bg-[#C8A96E]/15 text-[#C8A96E] border-[#C8A96E]/25'
                : 'bg-white/[0.07] text-white/60 border-white/[0.08] hover:bg-white/[0.11] hover:text-white/80',
              isPending && 'opacity-40'
            )}
          >
            {isPending ? 'Saving…' : saved ? '✓ Saved' : 'Save Week Recap'}
          </button>
        </div>
      )}
    </section>
  )
}
