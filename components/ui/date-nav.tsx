'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface DateNavProps {
  selectedDate: string
  today: string
}

export function DateNav({ selectedDate, today }: DateNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPicker, setShowPicker] = useState(false)

  const handleDateChange = (newDate: string) => {
    const todayDate = new Date(today)
    const selectedDateObj = new Date(newDate)

    if (selectedDateObj > todayDate) {
      return
    }

    const params = new URLSearchParams(searchParams)
    if (newDate === today) {
      params.delete('date')
    } else {
      params.set('date', newDate)
    }
    router.push(`?${params.toString()}`)
    setShowPicker(false)
  }

  const goToPreviousDay = () => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() - 1)
    const newDate = current.toISOString().split('T')[0]
    handleDateChange(newDate)
  }

  const goToNextDay = () => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + 1)
    const newDate = current.toISOString().split('T')[0]

    const todayDate = new Date(today)
    const nextDateObj = new Date(newDate)

    if (nextDateObj <= todayDate) {
      handleDateChange(newDate)
    }
  }

  const goToToday = () => {
    handleDateChange(today)
  }

  const goToYesterday = () => {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString().split('T')[0]
    handleDateChange(yesterdayISO)
  }

  const canGoToNext = new Date(selectedDate) < new Date(today)
  const isToday = selectedDate === today

  const formatDate = (date: string) => {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="flex items-center justify-between gap-2 mb-6 px-1">
      <div className="flex items-center gap-2">
        <button
          onClick={goToPreviousDay}
          className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
          title="Previous day"
        >
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>

        <button
          onClick={goToNextDay}
          disabled={!canGoToNext}
          className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next day"
        >
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={goToYesterday}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedDate === new Date(today)
              .toISOString()
              .split('T')[0]
              .split('-')
              .slice(0)
              .map((v, i) => {
                if (i === 2) return String(parseInt(v) - 1).padStart(2, '0')
                return v
              })
              .join('-')
              ? 'bg-white/[0.12] text-white'
              : 'hover:bg-white/[0.08] text-white/60'
          }`}
        >
          Yesterday
        </button>

        <button
          onClick={goToToday}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isToday ? 'bg-white/[0.12] text-white' : 'hover:bg-white/[0.08] text-white/60'
          }`}
        >
          Today
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
          title="Pick a date"
        >
          <Calendar className="w-4 h-4 text-white/60" />
        </button>

        {showPicker && (
          <div className="absolute right-0 top-full mt-2 bg-white/[0.05] border border-white/[0.1] rounded-lg p-4 z-50">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              max={today}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/[0.1] text-white text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
