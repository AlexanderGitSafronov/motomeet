import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Navigation, Flame, Plus, SlidersHorizontal, Bike, Shield } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { SearchBar } from '@/components/ui/SearchBar'
import { IconButton } from '@/components/ui/IconButton'
import { Avatar } from '@/components/ui/Avatar'
import { FilterChips } from '@/components/ui/FilterChips'
import { LiveMap } from '@/components/map/LiveMap'
import { RidingNowRail } from '@/components/map/RidingNowRail'
import { ridingNowCount } from '@/data/mock'
import { useCurrentUser } from '@/store/useCurrentUser'
import { useT } from '@/i18n'
import type { Rider } from '@/data/types'

type Filter = 'all' | 'riders' | 'events' | 'clubs'

export function MapScreen() {
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const t = useT()
  const [filter, setFilter] = useState<Filter>('all')

  const onRiderClick = (rider: Rider) => navigate(`/rider/${rider.id}`)

  const show = {
    showRiders: filter === 'all' || filter === 'riders',
    showEvents: filter === 'all' || filter === 'events',
    showClubs: filter === 'all' || filter === 'clubs',
  }

  return (
    <div className="flex h-full w-full">
      {/* Map column */}
      <div className="relative h-full flex-1 overflow-hidden">
        {/* Isolate so Leaflet's internal panes (z 200–700) stay below the overlays */}
        <div className="absolute inset-0 z-0 isolate">
          <LiveMap
            onRiderClick={onRiderClick}
            onEventClick={(id) => navigate(`/events/${id}`)}
            onClubClick={() => navigate('/clubs')}
            {...show}
          />
        </div>

        {/* Soft scrim so markers don't bleed through the glass top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-bg/85 via-bg/40 to-transparent" />

        {/* Top overlay: status bar + search */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-safe">
          <div className="lg:hidden">
            <StatusBar />
          </div>
          <div className="pointer-events-auto flex items-center gap-2.5 px-4 pt-1 lg:pt-3">
            <button onClick={() => navigate('/search')} className="min-w-0 flex-1" aria-label="Відкрити пошук">
              <SearchBar
                value=""
                onChange={() => {}}
                placeholder={t('Пошук райдерів, подій, клубів')}
                className="glass pointer-events-none"
                trailing={<SlidersHorizontal size={18} className="shrink-0 text-text-secondary" />}
              />
            </button>
            <button onClick={() => navigate('/profile')} aria-label="Відкрити профіль" className="lg:hidden">
              <Avatar src={currentUser.avatar} alt={currentUser.name} size={44} ring="primary" />
            </button>
          </div>

          {/* Filter chips */}
          <div className="pointer-events-auto px-4 pt-3">
            <FilterChips<Filter>
              options={[
                { value: 'all', label: t('Усі'), icon: <Layers size={15} /> },
                { value: 'riders', label: t('Райдери'), icon: <Bike size={15} /> },
                { value: 'events', label: t('Події'), icon: <Flame size={15} /> },
                { value: 'clubs', label: t('Клуби'), icon: <Shield size={15} /> },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </div>
        </div>

        {/* Right-side map controls */}
        <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2.5">
          <IconButton label="Шари карти" variant="glass">
            <Layers size={20} />
          </IconButton>
          <IconButton label="Активні точки" variant="glass">
            <Flame size={20} className="text-primary" />
          </IconButton>
          <IconButton label="Центрувати" variant="glass">
            <Navigation size={20} className="text-accent" />
          </IconButton>
        </div>

        {/* Riding-now pill */}
        <div className="absolute bottom-28 left-4 z-20 flex items-center gap-2 rounded-full glass px-4 py-2.5 shadow-card lg:bottom-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <span className="text-sm font-semibold text-text">{ridingNowCount} {t('райдерів зараз у дорозі')}</span>
        </div>

        {/* FAB */}
        <button
          onClick={() => navigate('/create-event')}
          aria-label="Створити подію"
          className="absolute bottom-28 right-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-glow transition-transform active:scale-95 lg:bottom-6"
        >
          <Plus size={26} />
        </button>
      </div>

      {/* Desktop "Riding now" rail */}
      <RidingNowRail />
    </div>
  )
}
