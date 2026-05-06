import { cn } from '@/lib/utils'

interface MotivationLogoProps {
  size?: number
  className?: string
}

export function MotivationLogoMark({ size = 40, className }: MotivationLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mountain M shape with upward arrow — traced from the Motivation logo */}
      <path
        d="M8 82 L30 38 L50 62 L70 38 L92 82 Z"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 82 L35 55 L50 70 L65 55 L80 82"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow pointing up-right from the top */}
      <path
        d="M68 14 L88 14 L88 34"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 38 L88 14"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

interface MotivationWordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function MotivationWordmark({
  size = 'md',
  className,
  orientation = 'horizontal',
}: MotivationWordmarkProps) {
  const logoSize = size === 'sm' ? 24 : size === 'lg' ? 56 : 36
  const textClass =
    size === 'sm'
      ? 'text-sm font-black tracking-[0.15em]'
      : size === 'lg'
      ? 'text-3xl font-black tracking-[0.2em]'
      : 'text-lg font-black tracking-[0.18em]'

  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'flex items-center gap-2.5' : 'flex flex-col items-center gap-3',
        className
      )}
    >
      <MotivationLogoMark size={logoSize} />
      <span className={cn(textClass, 'uppercase')} style={{ letterSpacing: '0.18em' }}>
        Motivation
      </span>
    </div>
  )
}
