import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/sign-in', req.url))
  res.cookies.delete('demo_mode')
  return res
}
