import { cn } from '@/lib/utils'

interface BrushstrokeDividerProps {
  className?: string
}

export function BrushstrokeDivider({ className }: BrushstrokeDividerProps) {
  return (
    <svg
      viewBox="0 0 400 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-2.5 text-[#1c1410]', className)}
      aria-hidden="true"
    >
      <path
        d="M2 5 C35 2.5, 90 7.5, 155 4.5 C210 2, 270 7, 330 5 C365 3.5, 388 6, 398 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.18"
      />
      <path
        d="M8 6 C55 3.5, 120 8, 185 5.5 C240 3, 300 7.5, 355 5 C375 4, 392 5.5, 398 4.5"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.1"
      />
    </svg>
  )
}
