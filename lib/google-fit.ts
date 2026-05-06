import { createServerSupabaseClient } from '@/lib/supabase'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_FIT_URL = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'

interface GoogleTokenRow {
  access_token: string
  refresh_token: string
  expires_at: string
}

async function getTokens(userId: string): Promise<GoogleTokenRow | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('google_fit_tokens')
    .select('access_token,refresh_token,expires_at')
    .eq('user_id', userId)
    .single()
  return data as GoogleTokenRow | null
}

async function refreshTokens(userId: string, refreshToken: string): Promise<string> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const json = await res.json()
  if (!json.access_token) throw new Error('Token refresh failed')

  const expiresAt = new Date(Date.now() + json.expires_in * 1000).toISOString()
  const supabase = await createServerSupabaseClient()
  await supabase
    .from('google_fit_tokens')
    .update({ access_token: json.access_token, expires_at: expiresAt })
    .eq('user_id', userId)

  return json.access_token as string
}

export async function fetchStepsForDate(userId: string, date: string): Promise<number | null> {
  const tokens = await getTokens(userId)
  if (!tokens) return null

  let accessToken = tokens.access_token
  if (new Date(tokens.expires_at) <= new Date()) {
    accessToken = await refreshTokens(userId, tokens.refresh_token)
  }

  const [year, month, day] = date.split('-').map(Number)
  const startMs = Date.UTC(year, month - 1, day, 0, 0, 0)
  const endMs = Date.UTC(year, month - 1, day, 23, 59, 59, 999)

  const res = await fetch(GOOGLE_FIT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startTimeMillis: startMs,
      endTimeMillis: endMs,
      aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
      bucketByTime: { durationMillis: 86400000 },
    }),
  })

  const json = await res.json()
  const bucket = json?.bucket?.[0]
  const dataset = bucket?.dataset?.[0]
  const point = dataset?.point?.[0]
  const steps = point?.value?.[0]?.intVal as number | undefined
  return steps ?? null
}
