import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getLast30Days } from '@/app/dashboard/actions'
import { generateInsight } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { date } = await req.json()
    if (!date) return NextResponse.json({ error: 'Missing date' }, { status: 400 })

    // Check cache first
    const { data: cached } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('insight_date', date)
      .single()

    if (cached) return NextResponse.json(cached)

    // Generate fresh insight
    const logs = await getLast30Days()
    if (logs.length < 3) {
      return NextResponse.json({
        correlation_text: 'Keep logging! Once you have at least 3 days of data, I can start identifying patterns in your habits and Core Pillar scores.',
        predicted_pillars: { happy: 3, healthy: 3, wealthy: 3, grounded: 3, motivated: 3 },
        weekly_narrative: 'You\'re just getting started — consistency is the foundation. Check back after a few more days for your first insights.',
      })
    }

    const payload = await generateInsight(logs)

    // Cache the result
    await supabase.from('ai_insights').upsert(
      {
        user_id: user.id,
        insight_date: date,
        correlation_text: payload.correlation_text,
        predicted_pillars: payload.predicted_pillars,
        weekly_narrative: payload.weekly_narrative,
      },
      { onConflict: 'user_id,insight_date' }
    )

    return NextResponse.json(payload)
  } catch (err) {
    console.error('[ai-insight]', err)
    return NextResponse.json(
      { error: 'Failed to generate insight. Check ANTHROPIC_API_KEY is set.' },
      { status: 500 }
    )
  }
}
