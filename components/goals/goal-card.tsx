'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  id: string
  category: string
  headline: string
  subline: string
  imageUrl: string
  index: number
  expanded: boolean
  note: string
  onToggle: () => void
  onNoteChange: (text: string) => void
  onNoteSave: () => void
}

export function GoalCard({ category, headline, subline, imageUrl, index, expanded, note, onToggle, onNoteChange, onNoteSave }: GoalCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (expanded && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 320)
    }
  }, [expanded])

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
      <button
        onClick={onToggle}
        className="relative w-full rounded-3xl overflow-hidden bg-white/[0.04] text-left focus:outline-none"
        style={{ aspectRatio: '4/5' }}
      >
        <img src={imageUrl} alt={headline} className="absolute inset-0 w-full h-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 pb-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">{category}</span>
          <div>
            <h3 className="text-[2rem] font-bold text-white leading-none tracking-tight mb-2.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {headline}
            </h3>
            <p className="text-[14px] font-medium text-white/65 leading-snug">{subline}</p>
            <div className="flex justify-end mt-6">
              <div className={cn('w-8 h-8 rounded-full border border-white/25 flex items-center justify-center transition-transform duration-300', expanded && 'rotate-90')}>
                <span className="text-white/55 text-base leading-none" style={{ marginTop: 1 }}>›</span>
              </div>
            </div>
          </div>
        </div>
      </button>

      <div className={cn('overflow-hidden transition-all duration-300 ease-in-out', expanded ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0')}>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.2em] mb-3">Journal Notes</p>
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            onBlur={onNoteSave}
            placeholder="Add thoughts, progress, or reflections for this goal..."
            rows={4}
            className="w-full bg-transparent text-sm text-white/75 placeholder-white/20 resize-none outline-none leading-relaxed"
          />
          {note.length > 0 && (
            <p className="text-[10px] text-white/20 mt-2 text-right">Saves automatically</p>
          )}
        </div>
      </div>
    </div>
  )
}