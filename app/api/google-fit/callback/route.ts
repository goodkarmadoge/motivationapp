import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/sign-in', req.url))

  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/dashboard?error=google_fit_denied', req.url))

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })

  const json = await res.json()
  if (!json.access_token) {
    return NextResponse.redirect(new URL('/dashboard?error=google_fit_token', req.url))
  }

  const expiresAt = new Date(Date.now() + json.expires_in * 1000).toISOString()
  await supabase.from('google_fit_tokens').upsert(
    {
      user_id: user.id,
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      expires_at: expiresAt,
    },
    { onConflict: 'user_id' }
  )

  return NextResponse.redirect(new URL('/dashboard?tab=integrate&fit=connected', req.url))
}
