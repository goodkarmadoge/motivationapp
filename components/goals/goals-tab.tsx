import { GoalCard } from './goal-card'

const GOALS = [
  {
    id: 'get-fit',
    category: 'Physical Health',
    headline: 'Get Fit',
    subline: 'Reach 15% Body Fat',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  },
  {
    id: 'be-bold',
    category: 'Mindset',
    headline: 'Be Bold',
    subline: 'Reach out. Make big plans.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'be-uncomfortable',
    category: 'Growth',
    headline: 'Be Uncomfortable',
    subline: 'Push yourself to grow.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  },
]

export function GoalsTab() {
  return (
    <div>
      <div className="mb-5 animate-fade-up">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-white/88 leading-tight">
          Goals
        </h2>
        <p className="text-white/35 mt-1 text-sm">
          Keep these in sight. Let them pull you forward.
        </p>
      </div>

      <div className="space-y-3">
        {GOALS.map((goal, i) => (
          <GoalCard key={goal.id} {...goal} index={i} />
        ))}
      </div>
    </div>
  )
}
