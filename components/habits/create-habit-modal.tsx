'use client'

import { useState } from 'react'
import type { CustomHabit, HabitType, TimeOfDay } from '@/lib/custom-habits'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

interface CreateHabitModalProps {
  /** When provided the modal acts as an editor for an existing habit. */
  habit?: CustomHabit
  onSave: (data: Omit<CustomHabit, 'id' | 'createdAt'>) => void
  onClose: () => void
}

const TIME_OPTIONS: TimeOfDay[] = ['morning', 'afternoon', 'evening']
const TYPE_OPTIONS: [HabitType, string][] = [
  ['yes-no', 'Yes / No'],
  ['count', '1, 2, 3'],
]

export function CreateHabitModal({ habit, onSave, onClose }: CreateHabitModalProps) {
  const [name, setName] = useState(habit?.name ?? '')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(habit?.timeOfDay ?? 'morning')
  const [type, setType] = useState<HabitType>(habit?.type ?? 'yes-no')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!name.trim()) {
      setError('Please enter a habit name.')
      return
    }
    onSave({ name: name.trim(), timeOfDay, type })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-[#111] border-t border-x border-white/[0.1] rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-white/90">
            {habit ? 'Edit Habit' : 'Create Habit'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/[0.08] rounded-lg transition-colors text-white/50"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] block mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g. Morning Journaling"
            autoFocus
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/80 placeholder:text-white/18 focus:outline-none focus:border-white/[0.2] transition-colors"
          />
          {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
        </div>

        {/* Time of Day */}
        <div className="mb-5">
          <label className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] block mb-2">
            Time of Day
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeOfDay(t)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                  timeOfDay === t
                    ? 'bg-[#C8A96E]/15 border border-[#C8A96E]/40 text-[#C8A96E]'
                    : 'bg-white/[0.04] border border-white/[0.07] text-white/45 hover:border-white/[0.15] hover:text-white/70'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="mb-7">
          <label className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] block mb-2">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TYPE_OPTIONS.map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  type === t
                    ? 'bg-[#C8A96E]/15 border border-[#C8A96E]/40 text-[#C8A96E]'
                    : 'bg-white/[0.04] border border-white/[0.07] text-white/45 hover:border-white/[0.15] hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 bg-white/[0.1] border border-white/[0.1] rounded-xl text-sm font-semibold text-white/85 hover:bg-white/[0.15] hover:text-white active:scale-[0.99] transition-all"
        >
          {habit ? 'Save Changes' : 'Create Habit'}
        </button>
      </div>
    </div>
  )
}
