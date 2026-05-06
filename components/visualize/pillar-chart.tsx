'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CORE_PILLARS } from '@/lib/habits'
import { buildPillarChartData } from './streak-utils'
import type { DailyLog } from '@/types/habit'

interface PillarChartProps {
  logs: DailyLog[]
}

export function PillarChart({ logs }: PillarChartProps) {
  const data = buildPillarChartData(logs)

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-400">
        No pillar data yet — start logging to see trends.
      </div>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-black mb-1">Core Pillar Trends</h2>
      <p className="text-xs text-gray-400 mb-4">Daily scores (1–5) over time</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(v) => v.slice(5)} // MM-DD
          />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            labelFormatter={(v) => `Date: ${v}`}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {CORE_PILLARS.map((p) => (
            <Line
              key={p.key}
              type="monotone"
              dataKey={p.key}
              name={p.label}
              stroke={p.color}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}
