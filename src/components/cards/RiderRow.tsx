import { useNavigate } from 'react-router-dom'
import type { Rider } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { FollowButton } from '@/components/ui/FollowButton'
import { VerifiedBadge } from '@/components/ui/Badge'
import { formatKm } from '@/lib/format'

/** A rider list row (search results, riding-now lists). */
export function RiderRow({ rider, showFollow = true }: { rider: Rider; showFollow?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 py-2.5">
      <button onClick={() => navigate(`/rider/${rider.id}`)} aria-label={`Open ${rider.name}`}>
        <Avatar src={rider.avatar} alt={rider.name} size={48} online={rider.online} />
      </button>
      <button
        onClick={() => navigate(`/rider/${rider.id}`)}
        className="min-w-0 flex-1 text-left"
      >
        <span className="flex items-center gap-1.5">
          <span className="truncate font-bold text-text">{rider.name}</span>
          {rider.verified && <VerifiedBadge size={14} className="shrink-0" />}
        </span>
        <span className="block truncate text-[13px] text-text-secondary">
          {rider.bike} · {formatKm(rider.distanceKm)}
        </span>
      </button>
      {showFollow && <FollowButton riderId={rider.id} riderName={rider.name} />}
    </div>
  )
}
