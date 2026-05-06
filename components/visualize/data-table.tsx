'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { upsertDailyLog } from '@/app/dashboard/actions'
import { CORE_PILLARS, ALL_HABITS } from '@/lib/habits'
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
    if (sortKey !== k) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-black">Data Log</h2>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">From</span>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
          <span className="text-gray-400">To</span>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-3">Click a cell to edit. Tap column headers to sort.</p>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th
                className="px-3 py-2 text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap"
                onClick={() => toggleSort('log_date')}
              >
                Date <SortIcon k="log_date" />
              </th>
              <th
                className="px-3 py-2 text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap"
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
                <th key={h.key} className="px-3 py-2 text-center font-semibold text-gray-500 whitespace-nowrap">
                  {h.emoji}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-gray-300">
                  No data for selected range
                </td>
              </tr>
            )}
            {filtered.map((log) => (
              <tr key={log.log_date} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{log.log_date}</td>
                <td className="px-3 py-2 font-bold text-gray-700">{log.daily_score}</td>
                {CORE_PILLARS.map((p) => {
                  const val = log[p.dbKey] as number | null
                  const isEditing = editCell?.date === log.log_date && editCell?.field === p.dbKey
                  return (
                    <td
                      key={p.key}
                      className={cn('px-3 py-2 cursor-pointer', p.textClass)}
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
                          className="w-10 text-center border border-gray-300 rounded px-1 py-0.5 focus:outline-none"
                        />
                      ) : (
                        val ?? '—'
                      )}
                    </td>
                  )
                })}
                {ALL_HABITS.slice(0, 5).map((h) => (
                  <td key={h.key} className="px-3 py-2 text-center">
                    {log[h.key as keyof DailyLog] ? '✓' : '·'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
