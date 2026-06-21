import { useNavigate } from 'react-router-dom'
import { MessageCircle, Navigation, ChevronRight, Bike } from 'lucide-react'
import type { Rider } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { VerifiedBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { FollowButton } from '@/components/ui/FollowButton'
import { Stat, StatRow } from '@/components/ui/Stat'
import { formatKm, formatNumber } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'
import { conversations } from '@/data/mock'

/** The rider card body shared by the map sheet (screen 03) and the desktop rail. */
export function UserCardContent({ rider }: { rider: Rider }) {
  const navigate = useNavigate()
  const pushToast = useAppStore((s) => s.pushToast)

  const openMessage = () => {
    const cv = conversations.find((c) => c.riderId === rider.id)
    if (cv) navigate(`/chats/${cv.id}`)
    else {
      pushToast({ title: `Розпочато чат з ${rider.name}`, icon: 'info' })
      navigate('/chats')
    }
  }

  return (
    <div className="px-5 pb-5 pt-2">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar src={rider.avatar} alt={rider.name} size={64} ring="primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-xl font-extrabold text-text">{rider.name}</h2>
            {rider.verified && <VerifiedBadge size={18} />}
          </div>
          <p className="truncate text-sm text-text-secondary">{rider.handle}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Bike size={14} />
            {rider.bike}
            {rider.bikeYear && <span className="text-text-muted">· {rider.bikeYear}</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-text">{formatKm(rider.distanceKm)}</p>
          <p className="text-xs text-text-muted">від вас</p>
        </div>
      </div>

      {/* Presence */}
      {rider.ridingNow && (
        <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="font-semibold text-success">Зараз у дорозі</span>
          {rider.lastActive && <span className="text-text-muted">· {rider.lastActive}</span>}
        </p>
      )}

      {/* Stats */}
      <StatRow className="mt-4 rounded-lg bg-surface-2 p-4">
        <Stat value={formatNumber(rider.followers)} label="Підписники" />
        <Stat value={formatNumber(rider.rides)} label="Заїзди" className="border-x border-border" />
        <Stat value={formatNumber(rider.events)} label="Події" />
      </StatRow>

      {/* Latest ride */}
      {rider.latestRide && (
        <button className="mt-3 flex w-full items-center gap-3 rounded-md bg-surface-2 p-3 text-left">
          <img
            src={rider.latestRide.cover}
            alt={rider.latestRide.title}
            className="h-12 w-16 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-text">{rider.latestRide.title}</p>
            <p className="truncate text-sm text-text-secondary">
              {formatKm(rider.latestRide.distanceKm)} · останній заїзд
            </p>
          </div>
          <ChevronRight size={18} className="text-text-muted" />
        </button>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2.5">
        <Button variant="secondary" className="flex-1" leftIcon={<MessageCircle size={18} />} onClick={openMessage}>
          Написати
        </Button>
        <FollowButton riderId={rider.id} riderName={rider.name} size="md" />
        <IconButton label="Прокласти до райдера" variant="surface" size="md" className="text-accent">
          <Navigation size={18} />
        </IconButton>
      </div>
    </div>
  )
}
