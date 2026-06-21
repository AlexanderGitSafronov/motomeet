import { UserPlus, CalendarPlus, Flame, Heart, Award, MessageCircle, Check } from 'lucide-react'
import type { AppNotification, NotificationKind } from '@/data/types'
import { cn } from '@/lib/cn'

const config: Record<
  NotificationKind,
  { icon: typeof UserPlus; fg: string; bg: string }
> = {
  follow: { icon: UserPlus, fg: 'text-primary', bg: 'bg-primary-soft' },
  event: { icon: CalendarPlus, fg: 'text-accent', bg: 'bg-accent-soft' },
  nearby: { icon: Flame, fg: 'text-primary', bg: 'bg-primary-soft' },
  like: { icon: Heart, fg: 'text-error', bg: 'bg-error-soft' },
  badge: { icon: Award, fg: 'text-warning', bg: 'bg-[color:var(--mm-warning)]/15' },
  message: { icon: MessageCircle, fg: 'text-accent', bg: 'bg-accent-soft' },
  approved: { icon: Check, fg: 'text-success', bg: 'bg-success-soft' },
}

export function NotificationRow({
  notification,
  read,
}: {
  notification: AppNotification
  read: boolean
}) {
  const { icon: Icon, fg, bg } = config[notification.kind]
  const unread = notification.unread && !read

  return (
    <div className="flex items-center gap-3.5 rounded-lg card-surface px-4 py-3.5">
      <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full', bg)}>
        <Icon size={20} className={fg} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium leading-snug text-text">{notification.text}</p>
        <p className="mt-0.5 text-xs text-text-muted">{notification.time}</p>
      </div>
      {unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
    </div>
  )
}
