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
      <section className="mb-8 animate-fade-up">
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-6">
          <p className="text-sm text-white/40 text-center">
            No pillar data yet — start logging to see trends.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8 animate-fade-up">
      <div className="mb-4">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-white/88 leading-tight">
          Core Pillar Trends
        </h2>
        <p className="text-white/35 mt-1 text-sm">
          Daily scores (1–5) over time
        </p>
      </div>
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            />
            <Tooltip
              contentStyle={{
                background: '#161616',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                color: 'rgba(255,255,255,0.85)',
                fontSize: 12,
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.55)' }}
              cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
              labelFormatter={(v) => `Date: ${v}`}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }} />
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
      </div>
    </section>
  )
}
