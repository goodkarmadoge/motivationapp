'use client'

interface GoalCardProps {
  category: string
  headline: string
  subline: string
  imageUrl: string
  index: number
}

export function GoalCard({ category, headline, subline, imageUrl, index }: GoalCardProps) {
  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden animate-fade-up bg-white/[0.04]"
      style={{ aspectRatio: '4/5', animationDelay: `${index * 100}ms` }}
    >
      <img
        src={imageUrl}
        alt={headline}
        className="absolute inset-0 w-full h-full object-cover"
        loading={index === 0 ? 'eager' : 'lazy'}
      />

      {/* Dual gradient: darken top and heavy black at bottom for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 pb-8">
        {/* Category label */}
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
          {category}
        </span>

        {/* Bottom text block */}
        <div>
          <h3
            className="text-[2rem] font-bold text-white leading-none tracking-tight mb-2.5"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {headline}
          </h3>
          <p className="text-[14px] font-medium text-white/65 leading-snug">
            {subline}
          </p>
          <div className="flex justify-end mt-6">
            <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center">
              <span className="text-white/55 text-base leading-none" style={{ marginTop: 1 }}>›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
