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
  const [cacheChecked, setCacheChecked] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // On mount: cache lookup only — fast Supabase read, no generation
  useEffect(() => {
    let cancelled = false
    async function checkCache() {
      try {
        const res = await fetch(`/api/ai-insight?date=${today}`)
        if (!cancelled && res.ok) {
          const data = await res.json()
          setInsight(data ?? null)
        }
      } catch {
        // cache miss is fine — user can generate manually
      } finally {
        if (!cancelled) setCacheChecked(true)
      }
    }
    checkCache()
    return () => { cancelled = true }
  }, [today])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      })
      if (!res.ok) throw new Error(await res.text())
      setInsight(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate insight')
    } finally {
      setGenerating(false)
    }
  }

  function handleRegenerate() {
    startTransition(async () => {
      await deleteAiInsightCache(today)
      setInsight(null)
      handleGenerate()
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
        {insight && !generating && (
          <button
            onClick={handleRegenerate}
            className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40 hover:text-white/80 transition-colors"
          >
            Update
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 space-y-5">

        {/* Brief skeleton while cache check is in-flight */}
        {!cacheChecked && (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-white/[0.06] rounded w-3/4" />
            <div className="h-3 bg-white/[0.06] rounded w-1/2" />
          </div>
        )}

        {/* No cached insight — show generate CTA */}
        {cacheChecked && !insight && !generating && !error && (
          <div className="flex flex-col items-center py-5 gap-4">
            <p className="text-sm text-white/40 text-center leading-relaxed max-w-[260px]">
              Generate today&apos;s insight to see habit correlations, pillar predictions, and a weekly summary.
            </p>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 rounded-xl bg-[#C8A96E]/[0.1] border border-[#C8A96E]/20 text-[13px] font-semibold text-[#C8A96E]/90 hover:bg-[#C8A96E]/[0.18] transition-all"
            >
              Generate Insights
            </button>
          </div>
        )}

        {/* Generating spinner */}
        {generating && (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#C8A96E]/30 border-t-[#C8A96E] animate-spin" />
            <p className="text-xs text-white/35">Analyzing your data…</p>
          </div>
        )}

        {/* Error state */}
        {error && !generating && (
          <div className="space-y-3">
            <p className="text-sm text-red-400/90">{error}</p>
            <button
              onClick={handleGenerate}
              className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40 hover:text-white/80 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Insight content */}
        {insight && !generating && (
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
