import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({})
    const { data } = await supabase.from('goal_notes').select('goal_id, note_text').eq('user_id', user.id)
    const result: Record<string, string> = {}
    for (const row of data ?? []) { result[row.goal_id] = row.note_text ?? '' }
    return NextResponse.json(result)
  } catch { return NextResponse.json({}) }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { goalId, noteText } = await req.json()
    if (!goalId || typeof noteText !== 'string') return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    await supabase.from('goal_notes').upsert(
      { user_id: user.id, goal_id: goalId, note_text: noteText, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,goal_id' }
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[goal-note]', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}