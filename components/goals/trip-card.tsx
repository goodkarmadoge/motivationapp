'use client'

import { cn } from '@/lib/utils'

interface TripCardProps {
  name: string
  date: string
  imageUrl: string
  status: 'upcoming' | 'past'
  index: number
}

export function TripCard({ name, date, imageUrl, status, index }: TripCardProps) {
  const isUpcoming = status === 'upcoming'

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden animate-fade-up"
      style={{
        aspectRatio: '16 / 9',
        animationDelay: `${index * 75}ms`,
      }}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        style={isUpcoming ? undefined : { filter: 'brightness(0.8) saturate(0.75)' }}
        loading={index === 0 ? 'eager' : 'lazy'}
      />

      {/* Gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t',
          isUpcoming
            ? 'from-black/85 via-black/15 to-black/35'
            : 'from-black/90 via-black/25 to-black/50'
        )}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pb-5">
        {/* Top row: badge + date */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-[9px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border',
              isUpcoming
                ? 'text-[#C8A96E] border-[#C8A96E]/40 bg-[#C8A96E]/10'
                : 'text-white/35 border-white/15 bg-white/[0.06]'
            )}
          >
            {isUpcoming ? '✈ Upcoming' : '✦ Memory'}
          </span>
          <span
            className={cn(
              'text-[11px] font-medium tracking-wide',
              isUpcoming ? 'text-[#C8A96E]/75' : 'text-white/28'
            )}
          >
            {date}
          </span>
        </div>

        {/* Bottom: destination name */}
        <div>
          <h3
            className="text-[1.75rem] font-bold text-white leading-none tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {name}
          </h3>
          <div
            className={cn(
              'mt-2.5 h-px w-10 rounded-full',
              isUpcoming ? 'bg-[#C8A96E]/50' : 'bg-white/20'
            )}
          />
        </div>
      </div>
    </div>
  )
}
