import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

const DEST_PROMPTS: Record<string, string> = {
  california: 'Cinematic California Pacific coast highway, dramatic golden cliffs, Pacific Ocean waves, warm golden hour light, aerial view, photorealistic travel photography',
  vietnam: 'Lush emerald rice terraces Sapa northern Vietnam, morning mist drifting through mountains, wooden stilt houses, photorealistic travel photography',
  yunnan: 'Dramatic Zhangjiajie stone pillar mountains, ancient pine trees, morning clouds, cinematic landscape photography',
  seoul: 'Gyeongbokgung Palace Seoul with modern glass skyscrapers, cherry blossom trees in bloom, spring sunshine, photorealistic travel photography',
  barcelona: 'Sagrada Familia Barcelona at golden hour, Gaudi stone spires, warm sunset light, photorealistic travel photography',
  bangkok: 'Wat Arun temple on Chao Phraya River Bangkok at blue hour, city lights reflecting on water, photorealistic travel photography',
  guangzhou: 'Canton Tower Guangzhou Pearl River at blue hour, futuristic skyline, city lights on water, photorealistic travel photography',
}

function getPrompt(dest: string): string {
  const key = dest.toLowerCase()
  return DEST_PROMPTS[key] ?? `${dest} iconic travel destination, cinematic landscape photography, golden hour light, photorealistic`
}

export async function GET(req: NextRequest) {
  const dest = req.nextUrl.searchParams.get('dest') ?? ''
  if (!dest) return new NextResponse('Missing dest', { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  const destKey = dest.toLowerCase()

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: cached } = await supabase
      .from('trip_image_cache')
      .select('image_base64, mime_type')
      .eq('destination', destKey)
      .single()
    if (cached?.image_base64) {
      const buffer = Buffer.from(cached.image_base64, 'base64')
      return new NextResponse(buffer, {
        headers: { 'Content-Type': cached.mime_type ?? 'image/png', 'Cache-Control': 'public, max-age=604800' },
      })
    }
  }

  if (!geminiKey) {
    return new NextResponse(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationConfig: { responseModalities: ['Text', 'Image'] } as any,
  })

  let result
  try {
    result = await model.generateContent(getPrompt(dest))
  } catch (err) {
    console.error('[trip-image] generateContent error:', err)
    return new NextResponse(JSON.stringify({ error: 'Request failed', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = result.response.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((p) => p.inlineData?.data)

  if (!imagePart?.inlineData) {
    console.error('[trip-image] No image in response:', JSON.stringify(result.response).slice(0, 600))
    return new NextResponse(JSON.stringify({ error: 'No image generated' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const base64: string = imagePart.inlineData.data
  const mimeType: string = imagePart.inlineData.mimeType ?? 'image/png'

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    supabase
      .from('trip_image_cache')
      .upsert({ destination: destKey, image_base64: base64, mime_type: mimeType })
      .then(({ error }) => { if (error) console.error('[trip-image] cache write error:', error) })
  }

  const buffer = Buffer.from(base64, 'base64')
  return new NextResponse(buffer, {
    headers: { 'Content-Type': mimeType, 'Cache-Control': 'public, max-age=604800' },
  })
}
