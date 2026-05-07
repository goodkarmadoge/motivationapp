'use client'

import { useEffect, useState, useTransition } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { CORE_PILLARS } from '@/lib/habits'
import { deleteAiInsightCache } from '@/app/dashboard/actions'
import type { AiInsight } from '@/types/habit'

interface AiInsightCardProps {
  today: string
}

export function AiInsightCard({ today }: AiInsightCardProps) {
  const [insight, setInsight] = useState<AiInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  async function fetchInsight() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setInsight(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load insight')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInsight() }, [today])

  function handleRegenerate() {
    startTransition(async () => {
      await deleteAiInsightCache(today)
      fetchInsight()
    })
  }

  const predictedData = insight?.predicted_pillars
    ? CORE_PILLARS.map((p) => ({
        label: p.label,
        value: insight.predicted_pillars![p.key] ?? 0,
        color: p.color,
      }))
    : []

  return (
    <section className="mb-8 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[1.05rem] font-semibold tracking-tight text-white/88 leading-tight">
            AI Insight
          </h2>
          <p className="text-white/35 mt-1 text-sm">
            Powered by Claude — correlations & predictions
          </p>
        </div>
        {!loading && (
          <button
            onClick={handleRegenerate}
            className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40 hover:text-white/80 transition-colors"
          >
            Regenerate
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 space-y-5">
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-white/[0.06] rounded w-full" />
            <div className="h-3 bg-white/[0.06] rounded w-5/6" />
            <div className="h-3 bg-white/[0.06] rounded w-4/6" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400/90">{error}</p>
        )}

        {insight && !loading && (
          <>
            {insight.correlation_text && (
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">
                  Correlations
                </p>
                <p className="text-sm text-white/75 leading-relaxed">{insight.correlation_text}</p>
              </div>
            )}

            {predictedData.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-3">
                  Predicted Pillars (Today)
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={predictedData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
                    <YAxis domain={[0, 5]} ticks={[0, 5]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {predictedData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {insight.weekly_narrative && (
              <div className="rounded-xl border border-[#C8A96E]/15 bg-[#C8A96E]/[0.04] p-4">
                <p className="text-[10px] font-semibold text-[#C8A96E]/85 uppercase tracking-[0.2em] mb-2">
                  Weekly Summary
                </p>
                <p className="text-sm text-white/80 leading-relaxed">{insight.weekly_narrative}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
