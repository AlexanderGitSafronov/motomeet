import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LayoutGrid, Trophy, Flag, Map } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { FilterChips } from '@/components/ui/FilterChips'
import { EventCard } from '@/components/cards/EventCard'
import { useAppStore } from '@/store/useAppStore'

type Cat = 'all' | 'rally' | 'track' | 'tour'

export function EventsScreen() {
  const navigate = useNavigate()
  const events = useAppStore((s) => s.events)
  const [cat, setCat] = useState<Cat>('all')

  const filtered = events.filter((e) => cat === 'all' || e.category === cat)

  return (
    <Screen width="wide">
      <div className="pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight text-text">Події</h1>
          <p className="text-sm text-text-secondary">243 події поряд із вами</p>
        </div>
        <div className="flex gap-2">
          <IconButton label="Пошук подій" variant="surface" onClick={() => navigate('/search')}>
            <Search size={20} />
          </IconButton>
          <IconButton label="Змінити вигляд" variant="primary">
            <LayoutGrid size={20} />
          </IconButton>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 pt-4">
        <FilterChips<Cat>
          options={[
            { value: 'all', label: 'Усі', icon: <Flag size={15} /> },
            { value: 'rally', label: 'Ралі', icon: <Trophy size={15} /> },
            { value: 'track', label: 'Трек', icon: <Flag size={15} /> },
            { value: 'tour', label: 'Тури', icon: <Map size={15} /> },
          ]}
          value={cat}
          onChange={setCat}
        />
      </div>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
        {filtered.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="px-5 py-12 text-center text-text-secondary">У цій категорії ще немає подій.</p>
      )}
    </Screen>
  )
}
