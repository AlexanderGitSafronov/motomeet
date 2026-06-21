import { NavLink, useNavigate } from 'react-router-dom'
import { Map, CalendarDays, Route, Shield, MessageCircle, Plus, ChevronRight } from 'lucide-react'
import { Wordmark } from '@/components/brand/Wordmark'
import { Avatar } from '@/components/ui/Avatar'
import { useCurrentUser } from '@/store/useCurrentUser'
import { cn } from '@/lib/cn'

const items = [
  { to: '/map', label: 'Карта', icon: Map },
  { to: '/events', label: 'Події', icon: CalendarDays },
  { to: '/routes', label: 'Маршрути', icon: Route },
  { to: '/clubs', label: 'Клуби', icon: Shield },
  { to: '/chats', label: 'Повідомлення', icon: MessageCircle },
]

/** Desktop-only left navigation rail (matches the 1440 dashboard mockup). */
export function Sidebar() {
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-surface/40 px-4 py-5 lg:flex">
      <button onClick={() => navigate('/map')} className="mb-7 flex items-center px-2">
        <Wordmark size="sm" withIcon />
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-semibold transition-colors',
                isActive
                  ? 'bg-primary-soft text-primary'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-text'
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        <button
          onClick={() => navigate('/create-event')}
          className="mt-3 flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-[15px] font-semibold text-on-primary shadow-glow-sm transition-colors hover:bg-primary-hover"
        >
          <Plus size={18} /> Створити подію
        </button>
      </nav>

      <button
        onClick={() => navigate('/profile')}
        className="mt-4 flex items-center gap-3 rounded-md border border-border bg-surface-2 px-3 py-2.5 text-left"
      >
        <Avatar src={currentUser.avatar} alt={currentUser.name} size={36} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-text">{currentUser.name}</span>
          <span className="block truncate text-xs text-text-secondary">{currentUser.handle}</span>
        </span>
        <ChevronRight size={16} className="text-text-muted" />
      </button>
    </aside>
  )
}
