import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEST_PROMPTS: Record<string, string> = {
  california:
    'Cinematic California Pacific coast highway, dramatic golden cliffs, Pacific Ocean waves, warm golden hour light, aerial drone view, ultra-realistic travel photography, 16:9 landscape',
  vietnam:
    'Lush emerald green rice terraces Sapa northern Vietnam, morning mist drifting through mountains, wooden stilt houses, ultra-realistic travel photography, 16:9 landscape',
  yunnan:
    'Dramatic Zhangjiajie stone pillar mountains, ancient pine trees clinging to cliffs, morning clouds, cinematic landscape photography, 16:9 landscape',
  seoul:
    'Gyeongbokgung Palace Seoul with modern glass skyscrapers backdrop, cherry blossom trees in full bloom, spring sunshine, ultra-realistic travel photography, 16:9 landscape',
  barcelona:
    'Sagrada Familia Barcelona at golden hour, intricate Gaudi stone spires, warm sunset light, ultra-realistic travel photography, 16:9 landscape',
  bangkok:
    'Wat Arun temple of dawn on Chao Phraya River Bangkok at blue hour, city lights reflecting on water, ultra-realistic travel photography, 16:9 landscape',
  guangzhou:
    'Canton Tower Guangzhou Pearl River at blue hour, futuristic skyline, city lights reflecting on water, ultra-realistic travel photography, 16:9 landscape',
}

function getPrompt(dest: string): string {
  const key = dest.toLowerCase()
  return (
    DEST_PROMPTS[key] ??
    `${dest} iconic travel destination, cinematic landscape photography, golden hour light, ultra-realistic, 16:9`
  )
}

export async function GET(req: NextRequest) {
  const dest = req.nextUrl.searchParams.get('dest') ?? ''
  if (!dest) return new NextResponse('Missing dest', { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  if (!supabaseUrl || !supabaseKey) {
    return new NextResponse('Supabase not configured', { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const destKey = dest.toLowerCase()

  // Check cache first
  const { data: cached } = await supabase
    .from('trip_image_cache')
    .select('image_base64, mime_type')
    .eq('destination', destKey)
    .single()

  if (cached?.image_base64) {
    const buffer = Buffer.from(cached.image_base64, 'base64')
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': cached.mime_type ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=604800',
      },
    })
  }

  if (!geminiKey) {
    return new NextResponse('GEMINI_API_KEY not configured', { status: 500 })
  }

  // Generate image via Gemini
  const prompt = getPrompt(dest)
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${geminiKey}`

  const geminiRes = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  })

  if (!geminiRes.ok) {
    const errText = await geminiRes.text()
    console.error('[trip-image] Gemini error:', errText)
    return new NextResponse('Image generation failed', { status: 502 })
  }

  const geminiJson = await geminiRes.json()
  type InlineDataPart = { inlineData?: { mimeType: string; data: string } }
  const imagePart = (
    geminiJson.candidates?.[0]?.content?.parts as InlineDataPart[] | undefined
  )?.find((p) => p.inlineData)

  if (!imagePart?.inlineData) {
    console.error('[trip-image] No image in response:', JSON.stringify(geminiJson).slice(0, 500))
    return new NextResponse('No image generated', { status: 502 })
  }

  const { mimeType, data: base64 } = imagePart.inlineData

  // Cache the result
  await supabase.from('trip_image_cache').upsert({
    destination: destKey,
    image_base64: base64,
    mime_type: mimeType,
  })

  const buffer = Buffer.from(base64, 'base64')
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=604800',
    },
  })
}