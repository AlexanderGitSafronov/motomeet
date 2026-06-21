import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Navigation } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { VerifiedBadge, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { FollowButton } from '@/components/ui/FollowButton'
import { Segmented } from '@/components/ui/Segmented'
import { EventCard } from '@/components/cards/EventCard'
import { ClubCard } from '@/components/cards/ClubCard'
import { ridingNowCount } from '@/data/mock'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'
import { formatKm } from '@/lib/format'

/** Desktop-only right rail mirroring the 1440 dashboard mockup. */
export function RidingNowRail() {
  const navigate = useNavigate()
  const riders = useAppStore((s) => s.riders)
  const events = useAppStore((s) => s.events)
  const clubs = useAppStore((s) => s.clubs)
  const t = useT()
  const [tab, setTab] = useState<'riders' | 'events' | 'clubs'>('riders')
  const ridingNow = riders.filter((r) => r.ridingNow)
  const featured = ridingNow[0]

  return (
    <aside className="hidden h-full w-[360px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-surface/30 p-5 no-scrollbar lg:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-text">{t('Зараз у дорозі')}</h2>
          <p className="text-sm text-text-secondary">{t('У радіусі 25 км від вас')}</p>
        </div>
        <Badge tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-success" />}>
          {ridingNowCount}
        </Badge>
      </div>

      <Segmented
        options={[
          { value: 'riders', label: t('Райдери') },
          { value: 'events', label: t('Події') },
          { value: 'clubs', label: t('Клуби') },
        ]}
        value={tab}
        onChange={setTab}
      />

      {/* ---- Riders tab ---- */}
      {tab === 'riders' && (
        <>
          {featured && (
            <div className="rounded-lg card-surface p-4">
              <div className="flex items-center gap-3">
                <Avatar src={featured.avatar} alt={featured.name} size={48} ring="primary" />
                <div className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-bold text-text">{featured.name}</span>
                    {featured.verified && <VerifiedBadge size={14} />}
                  </span>
                  <span className="block truncate text-sm text-text-secondary">{featured.bike}</span>
                </div>
                <span className="text-sm font-bold text-text">{formatKm(featured.distanceKm)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  leftIcon={<MessageCircle size={16} />}
                  onClick={() => navigate(`/rider/${featured.id}`)}
                >
                  {t('Написати')}
                </Button>
                <FollowButton riderId={featured.id} riderName={featured.name} size="sm" />
                <IconButton label="Навігація" variant="surface" size="sm" className="text-accent">
                  <Navigation size={16} />
                </IconButton>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {ridingNow.slice(1).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/rider/${r.id}`)}
                className="flex items-center gap-3 border-b border-border py-3 text-left transition-colors last:border-0 hover:bg-surface-2/40"
              >
                <Avatar src={r.avatar} alt={r.name} size={40} online={r.online} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-text">{r.name}</span>
                  <span className="block truncate text-xs text-text-secondary">{r.bike}</span>
                </span>
                <span className="text-sm font-semibold text-accent">{formatKm(r.distanceKm)}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ---- Events tab ---- */}
      {tab === 'events' && (
        <div className="flex flex-col gap-4">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      {/* ---- Clubs tab ---- */}
      {tab === 'clubs' && (
        <div className="flex flex-col gap-3">
          {clubs.map((c) => (
            <ClubCard key={c.id} club={c} />
          ))}
        </div>
      )}
    </aside>
  )
}
