import { TripCard } from './trip-card'

const UPCOMING_TRIPS = [
  {
    id: 'california-may-2026',
    name: 'California',
    date: 'May 2026',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a157d0e78a7e?w=900&h=506&q=85&fit=crop',
  },
  {
    id: 'vietnam-jun-2026',
    name: 'Vietnam',
    date: 'June 2026',
    imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=900&h=506&q=85&fit=crop',
  },
  {
    id: 'yunnan-jul-2026',
    name: 'Yunnan',
    date: 'July 2026',
    imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=900&h=506&q=85&fit=crop',
  },
  {
    id: 'seoul-sep-2026',
    name: 'Seoul',
    date: 'September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=900&h=506&q=85&fit=crop',
  },
  {
    id: 'barcelona-oct-2026',
    name: 'Barcelona',
    date: 'October 2026',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=900&h=506&q=85&fit=crop',
  },
]

const PAST_TRIPS = [
  {
    id: 'bangkok-jan-2026',
    name: 'Bangkok',
    date: 'January 2026',
    imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&h=506&q=85&fit=crop',
  },
  {
    id: 'guangzhou-feb-2026',
    name: 'Guangzhou',
    date: 'February 2026',
    imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=900&h=506&q=85&fit=crop',
  },
  {
    id: 'vietnam-apr-2026',
    name: 'Vietnam',
    date: 'April 2026',
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&h=506&q=85&fit=crop',
  },
]

export function ExploreTab() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <p className="text-white/35 text-sm">Your world, one chapter at a time.</p>
      </div>

      {/* Upcoming section */}
      <div
        className="flex items-center justify-between mb-3 animate-fade-up"
        style={{ animationDelay: '40ms' }}
      >
        <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">
          Upcoming
        </p>
        <p className="text-[10px] text-white/20 tabular-nums">
          {UPCOMING_TRIPS.length} trips
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {UPCOMING_TRIPS.map((trip, i) => (
          <TripCard key={trip.id} {...trip} status="upcoming" index={i} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-6" />

      {/* Past section */}
      <div
        className="flex items-center justify-between mb-3 animate-fade-up"
        style={{ animationDelay: '80ms' }}
      >
        <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em]">
          Past
        </p>
        <p className="text-[10px] text-white/20 tabular-nums">
          {PAST_TRIPS.length} trips
        </p>
      </div>

      <div className="space-y-3">
        {PAST_TRIPS.map((trip, i) => (
          <TripCard
            key={trip.id}
            {...trip}
            status="past"
            index={i + UPCOMING_TRIPS.length}
          />
        ))}
      </div>
    </div>
  )
}
