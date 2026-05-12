'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HabitCard } from './habit-card'
import { CustomHabitCard } from './custom-habit-card'
import { CreateHabitModal } from './create-habit-modal'
import { GarminBanner } from './garmin-banner'
import { MORNING_HABITS, AFTERNOON_HABITS, EVENING_HABITS } from '@/lib/habits'
import {
  loadCustomHabits,
  saveCustomHabits,
  loadCustomLog,
  saveCustomLog,
  type CustomHabit,
  type CustomHabitLog,
} from '@/lib/custom-habits'
import { upsertDailyLog } from '@/app/dashboard/actions'
import type { DailyLog, WeeklyLog } from '@/types/habit'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

interface HabitsTabProps {
  log: DailyLog
  weeklyLog: WeeklyLog | null
  selectedDate: string
  today: string
  onLogChange: (log: DailyLog) => void
  isDemo?: boolean
}

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; habit: CustomHabit }
  | null

export function HabitsTab({
  log,
  weeklyLog,
  selectedDate,
  today,
  onLogChange,
  isDemo,
}: HabitsTabProps) {
  const logRef = useRef<DailyLog>(log)
  logRef.current = log
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Custom habits ─────────────────────────────────────────────────────────────
  const [customHabits, setCustomHabits] = useState<CustomHabit[]>([])
  const [customLog, setCustomLog] = useState<CustomHabitLog>({})
  const [modal, setModal] = useState<ModalState>(null)

  useEffect(() => {
    setCustomHabits(loadCustomHabits())
    setCustomLog(loadCustomLog(selectedDate))
  }, [selectedDate])

  function persistCustomHabits(next: CustomHabit[]) {
    setCustomHabits(next)
    saveCustomHabits(next)
  }

  function persistCustomLog(next: CustomHabitLog) {
    setCustomLog(next)
    saveCustomLog(selectedDate, next)
  }

  function handleCreateSave(data: Omit<CustomHabit, 'id' | 'createdAt'>) {
    const newHabit: CustomHabit = {
      ...data,
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    }
    persistCustomHabits([...customHabits, newHabit])
  }

  function handleEditSave(id: string, data: Omit<CustomHabit, 'id' | 'createdAt'>) {
    persistCustomHabits(customHabits.map((h) => (h.id === id ? { ...h, ...data } : h)))
  }

  function handleDelete(id: string) {
    persistCustomHabits(customHabits.filter((h) => h.id !== id))
    const next = { ...customLog }
    delete next[id]
    persistCustomLog(next)
  }

  function handleCustomToggle(id: string, done: boolean) {
    persistCustomLog({
      ...customLog,
      [id]: { done, count: done ? (customLog[id]?.count ?? null) : null },
    })
  }

  function handleCustomCount(id: string, count: number) {
    persistCustomLog({ ...customLog, [id]: { done: true, count } })
  }

  // ── Predefined habit changes ──────────────────────────────────────────────────
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

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.'

  const allHabits = [...MORNING_HABITS, ...AFTERNOON_HABITS, ...EVENING_HABITS]
  const totalDone = allHabits.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const morningDone = MORNING_HABITS.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const afternoonDone = AFTERNOON_HABITS.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const eveningDone = EVENING_HABITS.filter((h) => !!(log[h.key as keyof DailyLog])).length
  const pct = totalDone / allHabits.length

  const customMorning = customHabits.filter((h) => h.timeOfDay === 'morning')
  const customAfternoon = customHabits.filter((h) => h.timeOfDay === 'afternoon')
  const customEvening = customHabits.filter((h) => h.timeOfDay === 'evening')

  return (
    <>
      <div>
        {/* Greeting + Create Habit button */}
        <div className="mb-6 pt-1 animate-fade-up flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[1.65rem] font-semibold tracking-tight text-white/88 leading-tight">
              {greeting}
            </h2>
            <p className="text-white/35 mt-1.5 text-sm">
              {totalDone === 0
                ? 'No habits logged yet today.'
                : totalDone === allHabits.length
                ? `All ${totalDone} habits complete.`
                : `${totalDone} of ${allHabits.length} complete.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: 'create' })}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/55 hover:bg-white/[0.1] hover:text-white/80 hover:border-white/[0.15] active:scale-[0.97] transition-all text-xs font-semibold mt-1"
          >
            <PlusIcon />
            Create Habit
          </button>
        </div>

        {/* Progress bar */}
        <div
          className="h-px w-full bg-white/[0.06] rounded-full mb-8 overflow-hidden animate-fade-up"
          style={{ animationDelay: '60ms' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct * 100}%`,
              backgroundColor: pct >= 1 ? '#C8A96E' : 'rgba(255,255,255,0.3)',
            }}
          />
        </div>

        {/* ── Morning ────────────────────────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">Morning</p>
            <p className="text-[10px] text-white/20 tabular-nums">{morningDone} / {MORNING_HABITS.length}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {MORNING_HABITS.map((habit, i) => (
              <HabitCard key={habit.key} habit={habit} log={log} onChange={handleChange} index={i + 2} />
            ))}
            {customMorning.map((habit, i) => (
              <CustomHabitCard
                key={habit.id}
                habit={habit}
                entry={customLog[habit.id] ?? { done: false, count: null }}
                onToggle={(done) => handleCustomToggle(habit.id, done)}
                onCount={(n) => handleCustomCount(habit.id, n)}
                onEdit={() => setModal({ mode: 'edit', habit })}
                onDelete={() => handleDelete(habit.id)}
                index={MORNING_HABITS.length + i + 2}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-white/[0.05] mb-8 animate-fade-up" style={{ animationDelay: '160ms' }} />

        {/* ── Afternoon ──────────────────────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: '180ms' }}>
            <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">Afternoon</p>
            <p className="text-[10px] text-white/20 tabular-nums">{afternoonDone} / {AFTERNOON_HABITS.length}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {AFTERNOON_HABITS.map((habit, i) => (
              <HabitCard
                key={habit.key}
                habit={habit}
                log={log}
                onChange={handleChange}
                index={i + MORNING_HABITS.length + 2}
              />
            ))}
            {customAfternoon.map((habit, i) => (
              <CustomHabitCard
                key={habit.id}
                habit={habit}
                entry={customLog[habit.id] ?? { done: false, count: null }}
                onToggle={(done) => handleCustomToggle(habit.id, done)}
                onCount={(n) => handleCustomCount(habit.id, n)}
                onEdit={() => setModal({ mode: 'edit', habit })}
                onDelete={() => handleDelete(habit.id)}
                index={MORNING_HABITS.length + AFTERNOON_HABITS.length + i + 2}
              />
            ))}
          </div>
        </section>

        {/* Garmin Connect banner */}
        {!isDemo && (
          <div className="mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <GarminBanner log={log} today={today} onLogChange={onLogChange} />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/[0.05] mb-8 animate-fade-up" style={{ animationDelay: '240ms' }} />

        {/* ── Evening ────────────────────────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: '260ms' }}>
            <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">Evening</p>
            <p className="text-[10px] text-white/20 tabular-nums">{eveningDone} / {EVENING_HABITS.length}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {EVENING_HABITS.map((habit, i) => (
              <HabitCard
                key={habit.key}
                habit={habit}
                log={log}
                onChange={handleChange}
                index={i + MORNING_HABITS.length + AFTERNOON_HABITS.length + 4}
              />
            ))}
            {customEvening.map((habit, i) => (
              <CustomHabitCard
                key={habit.id}
                habit={habit}
                entry={customLog[habit.id] ?? { done: false, count: null }}
                onToggle={(done) => handleCustomToggle(habit.id, done)}
                onCount={(n) => handleCustomCount(habit.id, n)}
                onEdit={() => setModal({ mode: 'edit', habit })}
                onDelete={() => handleDelete(habit.id)}
                index={MORNING_HABITS.length + AFTERNOON_HABITS.length + EVENING_HABITS.length + i + 4}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────────── */}
      {modal?.mode === 'create' && (
        <CreateHabitModal onSave={handleCreateSave} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <CreateHabitModal
          habit={modal.habit}
          onSave={(data) => handleEditSave(modal.habit.id, data)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
