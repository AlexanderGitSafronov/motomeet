import { NavLink, useLocation } from 'react-router-dom'
import { Map, CalendarDays, MessageCircle, Route, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const tabs = [
  { to: '/map', label: 'Карта', icon: Map },
  { to: '/events', label: 'Події', icon: CalendarDays },
  { to: '/chats', label: 'Чати', icon: MessageCircle },
  { to: '/routes', label: 'Маршрути', icon: Route },
  { to: '/profile', label: 'Профіль', icon: User },
]

/** Only the five primary tab screens show the bottom nav (detail screens don't). */
const primaryPaths = new Set(['/map', '/events', '/chats', '/routes', '/profile'])

export function BottomNav() {
  const { pathname } = useLocation()
  if (!primaryPaths.has(pathname)) return null
  return (
    <nav
      aria-label="Головна навігація"
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 px-3 pb-safe lg:hidden"
    >
      <div className="mx-auto mb-2 flex max-w-app items-center justify-between gap-1 rounded-full glass px-2 py-2 shadow-card">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex-1"
            aria-label={label}
          >
            {({ isActive }) => (
              <span
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-full py-1.5 transition-all duration-200',
                  isActive ? 'bg-primary text-on-primary shadow-glow-sm' : 'text-text-muted'
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.6 : 2} />
                <span className={cn('text-[10px] font-semibold', isActive ? 'opacity-100' : 'opacity-90')}>
                  {label}
                </span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
