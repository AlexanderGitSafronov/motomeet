import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, SlidersHorizontal, Shield, MapPin, Map, Compass } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { FilterChips } from '@/components/ui/FilterChips'
import { ClubCard } from '@/components/cards/ClubCard'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'

type Filter = 'all' | 'near' | 'touring' | 'adventure' | 'track'

export function ClubsScreen() {
  const navigate = useNavigate()
  const clubs = useAppStore((s) => s.clubs)
  const t = useT()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = clubs.filter((c) => {
    if (filter === 'all' || filter === 'near') return true
    return c.category === filter
  })

  return (
    <Screen>
      <div className="pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2">
        <IconButton label="Назад" variant="surface" onClick={() => navigate('/map')} className="border-border bg-transparent">
          <ChevronLeft size={22} />
        </IconButton>
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-extrabold leading-tight text-text">{t('Клуби')}</h1>
          <p className="text-sm text-text-secondary">{t('284 клуби у світі')}</p>
        </div>
        <IconButton label="Фільтр клубів" variant="surface">
          <SlidersHorizontal size={20} />
        </IconButton>
      </div>

      {/* Filter chips */}
      <div className="px-5 pt-4">
        <FilterChips<Filter>
          options={[
            { value: 'all', label: t('Усі'), icon: <Shield size={15} /> },
            { value: 'near', label: t('Поруч'), icon: <MapPin size={15} /> },
            { value: 'touring', label: t('Туризм'), icon: <Map size={15} /> },
            { value: 'adventure', label: t('Пригоди'), icon: <Compass size={15} /> },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* Club cards */}
      <div className="mt-4 flex flex-col gap-4 px-5">
        {filtered.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>
    </Screen>
  )
}
