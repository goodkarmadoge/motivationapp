import { GoogleGenerativeAI } from '@google/generative-ai'
import type { DailyLog, PillarKey } from '@/types/habit'
import { ALL_HABITS, HABIT_BOOLEAN_KEYS } from '@/lib/habits'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface AiInsightPayload {
  correlation_text: string
  predicted_pillars: Record<PillarKey, number>
  weekly_narrative: string
}

export function buildHabitPrompt(logs: DailyLog[]): string {
  const header = [
    'Date,Happy,Healthy,Wealthy,Grounded,Motivated,HabitsCompleted,DailyScore',
  ]
  const rows = logs.map((l) => {
    const habitsCount = HABIT_BOOLEAN_KEYS.filter((k) => !!(l[k as keyof DailyLog])).length
    return [
      l.log_date,
      l.pillar_happy ?? '',
      l.pillar_healthy ?? '',
      l.pillar_wealthy ?? '',
      l.pillar_grounded ?? '',
      l.pillar_motivated ?? '',
      habitsCount,
      l.daily_score,
    ].join(',')
  })

  const todayLog = logs[logs.length - 1]
  const todayHabits = todayLog
    ? ALL_HABITS.filter((h) => !!(todayLog[h.key as keyof DailyLog])).map((h) => h.label)
    : []

  return `Here are my last ${logs.length} days of habit and wellness data:

${[...header, ...rows].join('\n')}

Today's completed habits so far: ${todayHabits.length > 0 ? todayHabits.join(', ') : 'None yet'}

Please analyze the data and respond ONLY with valid JSON matching this exact structure:
{
  "correlation_text": "<2-3 sentences identifying the strongest correlations between habit completion and Core Pillar scores>",
  "predicted_pillars": {
    "happy": <number 1-5 to one decimal>,
    "healthy": <number 1-5 to one decimal>,
    "wealthy": <number 1-5 to one decimal>,
    "grounded": <number 1-5 to one decimal>,
    "motivated": <number 1-5 to one decimal>
  },
  "weekly_narrative": "<3-4 sentences summarising this week's patterns, wins, and one actionable suggestion>"
}`
}

export function parseAiResponse(text: string): AiInsightPayload {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in AI response')
  return JSON.parse(match[0]) as AiInsightPayload
}

export async function generateInsight(logs: DailyLog[]): Promise<AiInsightPayload> {
  const prompt = buildHabitPrompt(logs)

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction:
      'You are a personal productivity coach. You analyze habit tracking data to find patterns and provide actionable insights. Always respond with valid JSON only — no preamble, no markdown code fences.',
  })

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return parseAiResponse(text)
}