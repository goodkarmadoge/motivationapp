import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/dashboard', req.url))
  res.cookies.set('demo_mode', '1', { path: '/', sameSite: 'lax', httpOnly: true })
  return res
}
