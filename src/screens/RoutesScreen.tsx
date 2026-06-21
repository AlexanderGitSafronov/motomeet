import { useState } from 'react'
import { Plus, Play, Square, Coffee, Camera, Flag, Fuel, MapPin, Check, Trash2, Route as RouteIcon } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AvatarStack } from '@/components/ui/Avatar'
import { Sheet } from '@/components/ui/Sheet'
import { Input, FieldLabel } from '@/components/ui/Input'
import { SectionTitle } from '@/components/ui/ScreenHeader'
import { LiveMap } from '@/components/map/LiveMap'
import { routes } from '@/data/mock'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'
import { formatKm } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { RouteStop } from '@/data/types'
import type { LatLngExpression } from 'leaflet'

const stopIcons = { start: Play, coffee: Coffee, viewpoint: Camera, finish: Flag, fuel: Fuel } as const

function StopRow({
  stop,
  last,
  visited,
  onToggle,
}: {
  stop: RouteStop
  last: boolean
  visited: boolean
  onToggle: () => void
}) {
  const Icon = stopIcons[stop.kind]
  return (
    <button onClick={onToggle} className="flex w-full gap-3.5 text-left">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'grid h-9 w-9 place-items-center rounded-full transition-colors',
            visited ? 'bg-success text-white' : 'bg-primary-soft text-primary'
          )}
        >
          {visited ? <Check size={16} /> : <Icon size={16} />}
        </span>
        {!last && <span className={cn('my-1 w-0.5 flex-1 transition-colors', visited ? 'bg-success/50' : 'bg-border')} />}
      </div>
      <div className="flex flex-1 items-start justify-between pb-5">
        <div>
          <p className={cn('font-semibold transition-colors', visited ? 'text-text-muted line-through' : 'text-text')}>
            {stop.title}
          </p>
          <p className="text-sm text-text-secondary">{stop.subtitle}</p>
        </div>
        <span className="text-sm font-semibold text-text-muted">{stop.time}</span>
      </div>
    </button>
  )
}

export function RoutesScreen() {
  const pushToast = useAppStore((s) => s.pushToast)
  const rideActive = useAppStore((s) => s.rideActive)
  const toggleRide = useAppStore((s) => s.toggleRide)
  const visitedStops = useAppStore((s) => s.visitedStops)
  const toggleStopVisited = useAppStore((s) => s.toggleStopVisited)
  const customRoutes = useAppStore((s) => s.customRoutes)
  const addRoute = useAppStore((s) => s.addRoute)
  const removeRoute = useAppStore((s) => s.removeRoute)
  const t = useT()
  const route = routes[0]

  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ title: '', from: '', to: '' })

  const visitedCount = route.stops.filter((s) => visitedStops[s.id]).length

  const onStart = () => {
    const next = toggleRide()
    pushToast({
      title: next ? 'Заїзд розпочато — бережіть себе! 🏍️' : 'Заїзд завершено 🏁',
      icon: next ? 'success' : 'info',
    })
  }

  const onCreate = () => {
    if (!form.title.trim()) {
      pushToast({ title: t('Вкажіть назву маршруту'), icon: 'info' })
      return
    }
    addRoute({ title: form.title.trim(), from: form.from.trim(), to: form.to.trim(), distanceKm: 0, duration: '—', stops: 2 })
    pushToast({ title: `«${form.title.trim()}» ${t('збережено')}`, icon: 'success' })
    setForm({ title: '', from: '', to: '' })
    setCreateOpen(false)
  }

  return (
    <Screen>
      <div className="pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight text-text">{t('Маршрути')}</h1>
          <p className="text-sm text-text-secondary">{t('Плануйте та катайте разом')}</p>
        </div>
        <IconButton label={t('Новий маршрут')} variant="primary" onClick={() => setCreateOpen(true)}>
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
            <Badge tone="success" icon={<span className={cn('h-1.5 w-1.5 rounded-full bg-success', rideActive && 'animate-ping')} />}>
              {rideActive ? t('У дорозі') : t('Активний маршрут')}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text">{route.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
            <MapPin size={14} className="text-text-muted" />
            {formatKm(route.distanceKm)} · {route.duration} · {route.stops.length} зупинки
          </p>

          {/* Progress while riding */}
          {rideActive && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                <span>{t('У дорозі')}</span>
                <span>
                  {visitedCount}/{route.stops.length}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${(visitedCount / route.stops.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AvatarStack avatars={route.companionAvatars} size={26} />
              <span className="text-sm font-medium text-text-secondary">Ви та {route.companions} райдери</span>
            </span>
            <Button
              variant={rideActive ? 'success' : 'primary'}
              leftIcon={rideActive ? <Square size={15} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              onClick={onStart}
            >
              {rideActive ? t('Завершити') : t('Старт')}
            </Button>
          </div>
        </div>
      </div>

      {/* Planned stops */}
      <SectionTitle className="mt-7">{t('Заплановані зупинки')}</SectionTitle>
      <div className="mt-4 px-5">
        {route.stops.map((s, i) => (
          <StopRow
            key={s.id}
            stop={s}
            last={i === route.stops.length - 1}
            visited={!!visitedStops[s.id]}
            onToggle={() => toggleStopVisited(s.id)}
          />
        ))}
      </div>

      {/* My routes (user-created) */}
      {customRoutes.length > 0 && (
        <>
          <SectionTitle className="mt-5">{t('Мої маршрути')}</SectionTitle>
          <div className="mt-4 flex flex-col gap-3 px-5">
            {customRoutes.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg card-surface p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                  <RouteIcon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text">{r.title}</p>
                  <p className="truncate text-sm text-text-secondary">
                    {[r.from, r.to].filter(Boolean).join(' → ') || '—'}
                  </p>
                </div>
                <IconButton label="Видалити" variant="surface" size="sm" className="text-error" onClick={() => removeRoute(r.id)}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create route sheet */}
      <Sheet open={createOpen} onClose={() => setCreateOpen(false)}>
        <div className="px-5 pb-7 pt-2">
          <h2 className="mb-4 text-xl font-extrabold text-text">{t('Новий маршрут')}</h2>
          <FieldLabel>{t('Назва маршруту')}</FieldLabel>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} leftIcon={<RouteIcon size={18} />} placeholder={t('Назва маршруту')} aria-label={t('Назва маршруту')} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>{t('Звідки')}</FieldLabel>
              <Input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} leftIcon={<MapPin size={18} />} aria-label={t('Звідки')} />
            </div>
            <div>
              <FieldLabel>{t('Куди')}</FieldLabel>
              <Input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} leftIcon={<Flag size={18} />} aria-label={t('Куди')} />
            </div>
          </div>
          <Button block size="lg" className="mt-5" onClick={onCreate} leftIcon={<Plus size={18} />}>
            {t('Створити маршрут')}
          </Button>
        </div>
      </Sheet>
    </Screen>
  )
}
