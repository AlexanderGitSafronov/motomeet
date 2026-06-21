import { Plus, Play, Coffee, Camera, Flag, Fuel, MapPin } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AvatarStack } from '@/components/ui/Avatar'
import { SectionTitle } from '@/components/ui/ScreenHeader'
import { LiveMap } from '@/components/map/LiveMap'
import { routes } from '@/data/mock'
import { useAppStore } from '@/store/useAppStore'
import { formatKm } from '@/lib/format'
import type { RouteStop } from '@/data/types'
import type { LatLngExpression } from 'leaflet'

const stopIcons = {
  start: Play,
  coffee: Coffee,
  viewpoint: Camera,
  finish: Flag,
  fuel: Fuel,
} as const

function StopRow({ stop, last }: { stop: RouteStop; last: boolean }) {
  const Icon = stopIcons[stop.kind]
  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon size={16} />
        </span>
        {!last && <span className="my-1 w-0.5 flex-1 bg-border" />}
      </div>
      <div className="flex flex-1 items-start justify-between pb-5">
        <div>
          <p className="font-semibold text-text">{stop.title}</p>
          <p className="text-sm text-text-secondary">{stop.subtitle}</p>
        </div>
        <span className="text-sm font-semibold text-text-muted">{stop.time}</span>
      </div>
    </div>
  )
}

export function RoutesScreen() {
  const pushToast = useAppStore((s) => s.pushToast)
  const route = routes[0]

  return (
    <Screen>
      <div className="pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight text-text">Маршрути</h1>
          <p className="text-sm text-text-secondary">Плануйте та катайте разом</p>
        </div>
        <IconButton label="Новий маршрут" variant="primary" onClick={() => pushToast({ title: 'Планувальник маршрутів незабаром', icon: 'info' })}>
          <Plus size={20} />
        </IconButton>
      </div>

      {/* Active route card */}
      <div className="mx-5 mt-4 overflow-hidden rounded-lg card-surface shadow-card">
        <div className="relative h-40 w-full">
          <div className="absolute inset-0 z-0 isolate">
            <LiveMap
              interactive={false}
              showRiders={false}
              showEvents={false}
              showClubs={false}
              center={route.path[2] as [number, number]}
              zoom={12}
              routePath={route.path as LatLngExpression[]}
            />
          </div>
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <Badge tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-success" />}>
              Активний маршрут
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text">{route.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
            <MapPin size={14} className="text-text-muted" />
            {formatKm(route.distanceKm)} · {route.duration} · {route.stops.length} зупинки
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AvatarStack avatars={route.companionAvatars} size={26} />
              <span className="text-sm font-medium text-text-secondary">Ви та {route.companions} райдери</span>
            </span>
            <Button leftIcon={<Play size={16} fill="currentColor" />} onClick={() => pushToast({ title: 'Заїзд розпочато — бережіть себе! 🏍️', icon: 'success' })}>
              Старт
            </Button>
          </div>
        </div>
      </div>

      {/* Planned stops */}
      <SectionTitle className="mt-7">Заплановані зупинки</SectionTitle>
      <div className="mt-4 px-5">
        {route.stops.map((s, i) => (
          <StopRow key={s.id} stop={s} last={i === route.stops.length - 1} />
        ))}
      </div>
    </Screen>
  )
}
