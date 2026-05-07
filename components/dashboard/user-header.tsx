import { signOut } from '@/app/(auth)/actions'

interface UserHeaderProps {
  firstName: string
}

export function UserHeader({ firstName }: UserHeaderProps) {
  const initial = firstName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between pt-1 pb-3 animate-fade-up">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full border border-white/[0.1] bg-white/[0.04] flex items-center justify-center text-[11px] font-semibold text-white/70 tabular-nums">
          {initial}
        </div>
        <p className="text-sm text-white/55">
          Hi, <span className="text-white/85 font-medium">{firstName}</span>
        </p>
      </div>
      <form action={signOut}>
        <button
          type="submit"
          className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40 hover:text-white/80 transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
