import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Club } from '@/data/types'
import { ClubIcon } from '@/components/ui/IconTile'
import { VerifiedBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { formatNumber } from '@/lib/format'

export function ClubCard({ club }: { club: Club }) {
  const navigate = useNavigate()
  const joined = useAppStore((s) => s.joinedClubs[club.id] ?? club.joined ?? false)
  const toggleJoin = useAppStore((s) => s.toggleClubJoin)
  const pushToast = useAppStore((s) => s.pushToast)

  const onJoin = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = toggleJoin(club.id)
    pushToast({
      title: next ? `Ви вступили до «${club.name}»` : `Ви вийшли з «${club.name}»`,
      icon: next ? 'success' : 'info',
    })
  }

  return (
    <article
      onClick={() => navigate('/community')}
      className="flex cursor-pointer items-center gap-3 rounded-lg card-surface p-3.5 shadow-card transition-transform active:scale-[0.99]"
    >
      <ClubIcon icon={club.icon} gradient={club.gradient} size={52} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-base font-bold text-text">{club.name}</h3>
          {club.verified && <VerifiedBadge size={15} className="shrink-0" />}
        </div>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-text-secondary">
          <MapPin size={13} className="shrink-0 text-text-muted" />
          <span className="truncate">
            {club.city} · {formatNumber(club.members)} учасників
          </span>
        </p>
      </div>
      <Button size="sm" variant={joined ? 'primary' : 'soft'} onClick={onJoin} className="shrink-0">
        {joined ? 'Учасник' : 'Вступити'}
      </Button>
    </article>
  )
}
