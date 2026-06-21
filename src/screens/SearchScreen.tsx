import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Gauge, Radio } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { SearchBar } from '@/components/ui/SearchBar'
import { Segmented } from '@/components/ui/Segmented'
import { RiderRow } from '@/components/cards/RiderRow'
import { EventCard } from '@/components/cards/EventCard'
import { ClubCard } from '@/components/cards/ClubCard'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/cn'

type Tab = 'riders' | 'events' | 'clubs'

const quickFilters = [
  { id: 'near', label: 'До 10 км', icon: MapPin },
  { id: 'sport', label: 'Спорт', icon: Gauge },
  { id: 'online', label: 'Онлайн', icon: Radio },
]

export function SearchScreen() {
  const navigate = useNavigate()
  const riders = useAppStore((s) => s.riders)
  const events = useAppStore((s) => s.events)
  const clubs = useAppStore((s) => s.clubs)
  const [query, setQuery] = useState('Ducati')
  const [tab, setTab] = useState<Tab>('riders')
  const [active, setActive] = useState<string[]>(['near'])

  const toggle = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))

  // Token-based search: split into words, drop generic stopwords, and require
  // every remaining token to appear in the item's searchable text.
  const STOP = new Set([
    'riders', 'rider', 'riding', 'near', 'nearby',
    'райдери', 'райдер', 'райдерів', 'подія', 'події', 'подій',
    'клуб', 'клуби', 'клубів', 'поруч', 'та', 'і',
  ])
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t && !STOP.has(t))

  const matches = (hay: string) => tokens.every((t) => hay.includes(t))

  const matchedRiders = riders.filter((r) =>
    matches(`${r.name} ${r.bike} ${r.category ?? ''} ${r.location ?? ''}`.toLowerCase())
  )
  const matchedEvents = events.filter((e) =>
    matches(`${e.title} ${e.categoryLabel} ${e.location} ${e.city}`.toLowerCase())
  )
  const matchedClubs = clubs.filter((c) =>
    matches(`${c.name} ${c.city} ${c.category}`.toLowerCase())
  )

  const count = tab === 'riders' ? matchedRiders.length : tab === 'events' ? matchedEvents.length : matchedClubs.length

  return (
    <Screen contentClassName="px-0">
      <div className="px-5 pt-safe">
        <StatusBar />
      </div>

      {/* Search row */}
      <div className="flex items-center gap-3 px-5 pt-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Пошук райдерів, подій, клубів"
          autoFocus
          active
          className="flex-1"
        />
        <button onClick={() => navigate('/map')} className="shrink-0 font-semibold text-primary">
          Скасувати
        </button>
      </div>

      {/* Quick filters */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {quickFilters.map(({ id, label, icon: Icon }) => {
          const on = active.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                on ? 'bg-primary text-on-primary' : 'bg-surface-2 text-text-secondary border border-border'
              )}
            >
              <Icon size={15} /> {label}
            </button>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <Segmented<Tab>
          options={[
            { value: 'riders', label: 'Райдери' },
            { value: 'events', label: 'Події' },
            { value: 'clubs', label: 'Клуби' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {/* Result meta */}
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-base font-bold text-text">
          {count}{' '}
          {tab === 'riders' ? 'райдерів поруч' : tab === 'events' ? 'подій знайдено' : 'клубів знайдено'}
        </h2>
        <span className="text-sm text-text-muted">Сортування: відстань</span>
      </div>

      {/* Results */}
      <div className="px-5 pt-2">
        {tab === 'riders' && (
          <div className="divide-y divide-border">
            {matchedRiders.map((r) => (
              <RiderRow key={r.id} rider={r} />
            ))}
          </div>
        )}
        {tab === 'events' && (
          <div className="flex flex-col gap-4">
            {matchedEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
        {tab === 'clubs' && (
          <div className="flex flex-col gap-3">
            {matchedClubs.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        )}
        {count === 0 && <p className="py-10 text-center text-text-secondary">Нічого не знайдено за «{query}».</p>}
      </div>
    </Screen>
  )
}
