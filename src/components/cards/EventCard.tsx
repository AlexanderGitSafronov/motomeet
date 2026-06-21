import { useNavigate } from 'react-router-dom'
import { MapPin, Flame } from 'lucide-react'
import type { RideEvent } from '@/data/types'
import { AvatarStack } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'
import { dateBadge, dateTimeLabel } from '@/lib/format'
import { cn } from '@/lib/cn'

export function EventCard({ event, className }: { event: RideEvent; className?: string }) {
  const navigate = useNavigate()
  const joined = useAppStore((s) => !!s.joinedEvents[event.id])
  const toggleJoin = useAppStore((s) => s.toggleEventJoin)
  const pushToast = useAppStore((s) => s.pushToast)
  const t = useT()
  const { day, month } = dateBadge(event.date)

  const onJoin = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = toggleJoin(event.id)
    pushToast({
      title: next ? `Ви долучились до «${event.title}»` : `Ви залишили «${event.title}»`,
      icon: next ? 'success' : 'info',
    })
  }

  return (
    <article
      onClick={() => navigate(`/events/${event.id}`)}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-lg card-surface shadow-card transition-transform duration-200 active:scale-[0.99]',
        className
      )}
    >
      {/* Cover */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={event.cover}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        {/* category pill */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold text-white">
          <Flame size={13} className="text-primary" />
          {event.categoryLabel}
        </span>
        {/* date badge */}
        <span className="absolute right-3 top-3 grid place-items-center rounded-md glass px-3 py-1 text-center">
          <span className="text-lg font-extrabold leading-none text-white">{day}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-white/80">{month}</span>
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-text">{event.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
          <MapPin size={14} className="text-text-muted" />
          {event.location}
          <span className="text-text-muted">·</span>
          {dateTimeLabel(event.date)}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AvatarStack avatars={event.goingAvatars} size={26} />
            <span className="text-sm font-medium text-text-secondary">+{event.going} учасників</span>
          </span>
          <Button size="sm" variant={joined ? 'secondary' : 'primary'} onClick={onJoin}>
            {joined ? t('Іду') : t('Піду')}
          </Button>
        </div>
      </div>
    </article>
  )
}
