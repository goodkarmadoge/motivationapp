export async function fetchGarminStepsForDate(date: string): Promise<number | null> {
  const email = process.env.GARMIN_EMAIL
  const password = process.env.GARMIN_PASSWORD
  if (!email || !password) return null

  try {
    // garmin-connect uses credential-based auth (no OAuth needed)
    const { GarminConnect } = await import('garmin-connect')
    const client = new GarminConnect({ username: email, password })
    await client.login()
    const dateObj = new Date(date + 'T12:00:00')
    // getSteps() returns a number directly
    const steps = await client.getSteps(dateObj)
    return typeof steps === 'number' ? steps : null
  } catch (err) {
    console.error('[Garmin] step fetch failed:', err)
    return null
  }
}

export function isGarminConfigured(): boolean {
  return !!(process.env.GARMIN_EMAIL && process.env.GARMIN_PASSWORD)
}