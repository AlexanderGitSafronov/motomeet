import { useNavigate, useParams } from 'react-router-dom'
import { Layers, Bike, Flame, Shield, SlidersHorizontal } from 'lucide-react'
import { LiveMap } from '@/components/map/LiveMap'
import { Sheet } from '@/components/ui/Sheet'
import { StatusBar } from '@/components/ui/StatusBar'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { UserCardContent } from '@/components/cards/UserCardContent'
import { useAppStore } from '@/store/useAppStore'

/** Screen 03 — a rider's card presented as a bottom sheet over the live map. */
export function RiderCardScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const riders = useAppStore((s) => s.riders)
  const currentUser = useAppStore((s) => s.currentUser)
  const rider = id ? [currentUser, ...riders].find((r) => r.id === id) : undefined

  const close = () => navigate('/map')

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Dimmed, non-interactive map backdrop */}
      <div className="pointer-events-none absolute inset-0 isolate opacity-60">
        <LiveMap interactive={false} center={rider?.pos} zoom={14} />
      </div>

      {/* Faded top overlay (search + chips) carried over from the map */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-safe opacity-70">
        <StatusBar />
        <div className="px-4 pt-1">
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="Пошук райдерів, подій, клубів"
            className="glass"
            trailing={<SlidersHorizontal size={18} className="shrink-0 text-text-secondary" />}
          />
        </div>
        <div className="px-4 pt-3">
          <FilterChips
            options={[
              { value: 'all', label: 'Усі', icon: <Layers size={15} /> },
              { value: 'riders', label: 'Райдери', icon: <Bike size={15} /> },
              { value: 'events', label: 'Події', icon: <Flame size={15} /> },
              { value: 'clubs', label: 'Клуби', icon: <Shield size={15} /> },
            ]}
            value="all"
            onChange={() => {}}
          />
        </div>
      </div>

      <Sheet open onClose={close}>
        {rider ? (
          <UserCardContent rider={rider} />
        ) : (
          <div className="px-5 pb-8 pt-4 text-center text-text-secondary">Райдера не знайдено.</div>
        )}
      </Sheet>
    </div>
  )
}
