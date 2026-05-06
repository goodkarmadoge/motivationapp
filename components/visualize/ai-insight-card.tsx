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
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-black">AI Insight</h2>
          <p className="text-xs text-gray-400">Powered by Claude — correlations & predictions</p>
        </div>
        {!loading && (
          <button
            onClick={handleRegenerate}
            className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-2"
          >
            Regenerate
          </button>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 p-4 space-y-5">
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {insight && !loading && (
          <>
            {insight.correlation_text && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Correlations
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{insight.correlation_text}</p>
              </div>
            )}

            {predictedData.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  Predicted Pillars (Today)
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={predictedData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis domain={[0, 5]} ticks={[0, 5]} tick={{ fontSize: 9, fill: '#d1d5db' }} />
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
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Weekly Summary
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{insight.weekly_narrative}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
