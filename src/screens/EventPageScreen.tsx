import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Bookmark, Share2, CalendarDays, Route as RouteIcon, Clock, Users, Navigation, Check } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { Badge, VerifiedBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ClubIcon } from '@/components/ui/IconTile'
import { FollowButton } from '@/components/ui/FollowButton'
import { LiveMap } from '@/components/map/LiveMap'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'
import { share } from '@/lib/share'
import { fullDateTime, formatNumber, formatKm } from '@/lib/format'
import type { LatLngExpression } from 'leaflet'

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-md bg-surface-2 py-3">
      <span className="text-primary">{icon}</span>
      <span className="text-base font-extrabold text-text">{value}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  )
}

export function EventPageScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const events = useAppStore((s) => s.events)
  const clubs = useAppStore((s) => s.clubs)
  const event = id ? events.find((e) => e.id === id) : undefined
  const joined = useAppStore((s) => (id ? !!s.joinedEvents[id] : false))
  const saved = useAppStore((s) => (id ? !!s.savedEvents[id] : false))
  const toggleJoin = useAppStore((s) => s.toggleEventJoin)
  const toggleSave = useAppStore((s) => s.toggleSaveEvent)
  const pushToast = useAppStore((s) => s.pushToast)
  const t = useT()

  if (!event) {
    return (
      <div className="grid h-full place-items-center text-text-secondary">
        Подію не знайдено.
      </div>
    )
  }

  const club = event.hostClubId ? clubs.find((c) => c.id === event.hostClubId) : undefined
  const onJoin = () => {
    const next = toggleJoin(event.id)
    pushToast({
      title: next ? `Ви долучились до «${event.title}»!` : `Ви залишили «${event.title}»`,
      icon: next ? 'success' : 'info',
    })
  }

  return (
    <div className="relative h-full overflow-hidden bg-bg">
      <div className="h-full overflow-y-auto no-scrollbar pb-24">
        <div className="mx-auto w-full max-w-app">
          {/* Hero */}
          <div className="relative h-72 w-full">
            <img src={event.cover} alt={event.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-bg" />
            <div className="absolute inset-x-0 top-0 z-10 pt-safe">
              <StatusBar />
              <div className="flex items-center justify-between px-4 pt-1">
                <IconButton label="Назад" variant="glass" onClick={() => navigate(-1)}>
                  <ChevronLeft size={22} />
                </IconButton>
                <div className="flex gap-2">
                  <IconButton
                    label="Зберегти подію"
                    variant="glass"
                    onClick={() => {
                      const next = toggleSave(event.id)
                      pushToast({ title: next ? 'Збережено в обране' : 'Видалено з обраного', icon: next ? 'success' : 'info' })
                    }}
                  >
                    <Bookmark size={20} className={saved ? 'fill-current text-primary' : ''} />
                  </IconButton>
                  <IconButton
                    label="Поділитися"
                    variant="glass"
                    onClick={async () => {
                      const res = await share({ title: event.title, text: `${event.location} · ${event.priceLabel}` })
                      if (res === 'copied') pushToast({ title: 'Посилання скопійовано', icon: 'success' })
                      else if (res === 'shared') pushToast({ title: 'Подію поширено', icon: 'success' })
                    }}
                  >
                    <Share2 size={20} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          <div className="-mt-6 rounded-t-[28px] bg-bg px-5 pt-5">
            {/* Category + status */}
            <div className="flex items-center gap-2">
              <Badge tone="glass">{event.categoryLabel}</Badge>
              {event.startsInLabel && <Badge tone="primary">{event.startsInLabel}</Badge>}
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-text">{event.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <CalendarDays size={16} className="text-text-muted" />
              {fullDateTime(event.date)} · {event.location}
            </p>

            {/* Host */}
            {club && (
              <div className="mt-4 flex items-center gap-3 rounded-md bg-surface-2 p-3">
                <ClubIcon icon={club.icon} gradient={club.gradient} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-muted">{t('Організатор')}</p>
                  <p className="flex items-center gap-1.5 font-bold text-text">
                    {club.name} {club.verified && <VerifiedBadge size={14} />}
                  </p>
                </div>
                <FollowButton riderId={club.id} riderName={club.name} />
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 flex gap-2.5">
              {event.distanceKm ? (
                <StatTile icon={<RouteIcon size={20} />} value={formatKm(event.distanceKm)} label={t('Маршрут')} />
              ) : null}
              {event.duration ? (
                <StatTile icon={<Clock size={20} />} value={event.duration} label={t('Тривалість')} />
              ) : null}
              <StatTile icon={<Users size={20} />} value={formatNumber(event.going)} label={t('Учасники')} />
            </div>

            {/* About */}
            <h2 className="mt-6 text-lg font-bold text-text">{t('Про заїзд')}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{event.description}</p>

            {/* Location & route */}
            <div className="mt-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">{t('Локація і маршрут')}</h2>
              <button
                onClick={() => {
                  const q = encodeURIComponent(event.location)
                  window.open(`https://www.openstreetmap.org/search?query=${q}`, '_blank', 'noopener')
                }}
                className="flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Прокласти <Navigation size={14} />
              </button>
            </div>
            <div className="mt-3 h-44 w-full overflow-hidden rounded-lg border border-border">
              <LiveMap
                interactive={false}
                showRiders={false}
                showClubs={false}
                showEvents={false}
                center={event.pos}
                zoom={13}
                routePath={event.routePath as LatLngExpression[] | undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky join bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass px-5 pb-safe pt-3">
        <div className="mx-auto flex max-w-app items-center gap-4 pb-3">
          <div>
            <p className="text-lg font-extrabold text-text">{event.priceLabel}</p>
            <p className="text-xs text-text-muted">вхід · кемп €40</p>
          </div>
          <Button
            className="flex-1"
            size="lg"
            variant={joined ? 'success' : 'primary'}
            onClick={onJoin}
            leftIcon={joined ? <Check size={18} /> : undefined}
          >
            {joined ? t('Ви учасник') : t('Долучитися')}
          </Button>
        </div>
      </div>
    </div>
  )
}
