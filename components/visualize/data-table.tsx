'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { upsertDailyLog } from '@/app/dashboard/actions'
import { CORE_PILLARS, ALL_HABITS } from '@/lib/habits'
import { HabitIcon } from '@/components/ui/habit-icons'
import type { DailyLog } from '@/types/habit'

interface DataTableProps {
  logs: DailyLog[]
  onLogsChange: (logs: DailyLog[]) => void
}

type SortKey = 'log_date' | 'daily_score'
type SortDir = 'asc' | 'desc'

export function DataTable({ logs, onLogsChange }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('log_date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [editCell, setEditCell] = useState<{ date: string; field: string } | null>(null)
  const [editVal, setEditVal] = useState<string>('')
  const [, startTransition] = useTransition()

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = logs
    .filter((l) => (!filterFrom || l.log_date >= filterFrom) && (!filterTo || l.log_date <= filterTo))
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      return a[sortKey] < b[sortKey] ? -mul : mul
    })

  function startEdit(date: string, field: string, current: unknown) {
    setEditCell({ date, field })
    setEditVal(current != null ? String(current) : '')
  }

  function commitEdit(log: DailyLog) {
    if (!editCell) return
    const field = editCell.field as keyof DailyLog
    let val: unknown = editVal
    if (typeof log[field] === 'number' || log[field] === null) {
      val = editVal === '' ? null : Number(editVal)
    }
    const updated = { ...log, [field]: val }
    onLogsChange(logs.map((l) => (l.log_date === log.log_date ? updated : l)))
    setEditCell(null)
    startTransition(async () => {
      await upsertDailyLog(log.log_date, { [field]: val } as Partial<DailyLog>)
    })
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-white/25 ml-1">↕</span>
    return <span className="ml-1 text-white/70">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <section className="mb-8 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-white/88 leading-tight">
          Data Log
        </h2>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-white/40 uppercase tracking-[0.15em] font-semibold">From</span>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="border border-white/[0.08] bg-white/[0.03] text-white/80 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.05] transition-colors"
            style={{ colorScheme: 'dark' }}
          />
          <span className="text-white/40 uppercase tracking-[0.15em] font-semibold">To</span>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="border border-white/[0.08] bg-white/[0.03] text-white/80 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.05] transition-colors"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>
      <p className="text-xs text-white/40 mb-3">Click a cell to edit. Tap column headers to sort.</p>

      <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/[0.06]">
              <th
                className="px-3 py-2 text-left font-semibold text-white/55 cursor-pointer whitespace-nowrap hover:text-white/80 transition-colors"
                onClick={() => toggleSort('log_date')}
              >
                Date <SortIcon k="log_date" />
              </th>
              <th
                className="px-3 py-2 text-left font-semibold text-white/55 cursor-pointer whitespace-nowrap hover:text-white/80 transition-colors"
                onClick={() => toggleSort('daily_score')}
              >
                Score <SortIcon k="daily_score" />
              </th>
              {CORE_PILLARS.map((p) => (
                <th key={p.key} className={cn('px-3 py-2 text-left font-semibold whitespace-nowrap', p.textClass)}>
                  {p.label.slice(0, 3)}
                </th>
              ))}
              {ALL_HABITS.slice(0, 5).map((h) => (
                <th
                  key={h.key}
                  title={h.label}
                  className="px-3 py-2 text-center font-semibold whitespace-nowrap"
                >
                  <HabitIcon habitKey={h.key} className="w-4 h-4 text-white/45 inline-block" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-white/30">
                  No data for selected range
                </td>
              </tr>
            )}
            {filtered.map((log) => (
              <tr key={log.log_date} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                <td className="px-3 py-2 font-mono text-white/55 whitespace-nowrap">{log.log_date}</td>
                <td className="px-3 py-2 font-semibold text-white/85 tabular-nums">{log.daily_score}</td>
                {CORE_PILLARS.map((p) => {
                  const val = log[p.dbKey] as number | null
                  const isEditing = editCell?.date === log.log_date && editCell?.field === p.dbKey
                  return (
                    <td
                      key={p.key}
                      className={cn('px-3 py-2 cursor-pointer tabular-nums', val ? p.textClass : 'text-white/25')}
                      onClick={() => startEdit(log.log_date, p.dbKey as string, val)}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          type="number"
                          min={1}
                          max={5}
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onBlur={() => commitEdit(log)}
                          onKeyDown={(e) => e.key === 'Enter' && commitEdit(log)}
                          className="w-10 text-center border border-white/[0.15] bg-white/[0.05] text-white/85 rounded px-1 py-0.5 focus:outline-none focus:border-white/[0.3]"
                        />
                      ) : (
                        val ?? '—'
                      )}
                    </td>
                  )
                })}
                {ALL_HABITS.slice(0, 5).map((h) => {
                  const done = !!log[h.key as keyof DailyLog]
                  return (
                    <td key={h.key} className="px-3 py-2 text-center">
                      <span className={done ? 'text-[#C8A96E]' : 'text-white/20'}>
                        {done ? '✓' : '·'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
