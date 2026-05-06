interface IconProps {
  className?: string
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M17 8h1a4 4 0 010 8h-1" />
      <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

export function RouteIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  )
}

export function BowlIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 2a10 10 0 0110 10H2A10 10 0 0112 2z" />
      <path d="M5 12c0 3.87 3.13 7 7 7s7-3.13 7-7" />
      <path d="M8.5 2.5L9.5 6M12 2v4M15.5 2.5L14.5 6" />
    </svg>
  )
}

export function DumbbellIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M6 5v14M18 5v14" />
      <path d="M3 8v8M21 8v8" />
      <path d="M6 12h12" />
    </svg>
  )
}

export function PotIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M2 12h20" />
      <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
      <path d="M9 8V5M15 8V5" />
      <path d="M6 8h12a2 2 0 012 2v2H4v-2a2 2 0 012-2z" />
    </svg>
  )
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 8-8 8" />
    </svg>
  )
}

export function ActivityIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <polyline points="22 12 18 12 15 20 9 4 6 12 2 12" />
    </svg>
  )
}

export function UtensilsIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  )
}

export function ZapIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  )
}

const HABIT_ICONS: Record<string, React.ComponentType<IconProps>> = {
  habit_pourover_coffee: CoffeeIcon,
  habit_dog_walk: RouteIcon,
  habit_healthy_lunch: BowlIcon,
  habit_gym: DumbbellIcon,
  habit_cook_meal: PotIcon,
  habit_meditation: LeafIcon,
  habit_10k_steps: ActivityIcon,
  habit_healthy_dinner: UtensilsIcon,
  habit_focus_work: ZapIcon,
  habit_reading: BookIcon,
}

interface HabitIconProps {
  habitKey: string
  className?: string
}

export function HabitIcon({ habitKey, className }: HabitIconProps) {
  const Icon = HABIT_ICONS[habitKey]
  if (!Icon) return null
  return <Icon className={className} />
}
