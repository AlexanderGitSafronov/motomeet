import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { Segmented } from '@/components/ui/Segmented'
import { SectionLabel } from '@/components/ui/ScreenHeader'
import { NotificationRow } from '@/components/cards/NotificationRow'
import { useAppStore } from '@/store/useAppStore'
import type { AppNotification } from '@/data/types'

type Tab = 'all' | 'following' | 'events'

export function NotificationsScreen() {
  const navigate = useNavigate()
  const notifications = useAppStore((s) => s.notifications)
  const [tab, setTab] = useState<Tab>('all')
  const readMap = useAppStore((s) => s.readNotifications)
  const markAll = useAppStore((s) => s.markAllNotificationsRead)
  const markOne = useAppStore((s) => s.markNotificationRead)

  const isRead = (n: AppNotification) => !!readMap.__all__ || !!readMap[n.id]

  const visible = notifications.filter((n) => {
    if (tab === 'all') return true
    if (tab === 'following') return n.filter === 'following'
    return n.filter === 'events'
  })

  const newGroup = visible.filter((n) => n.group === 'new')
  const earlierGroup = visible.filter((n) => n.group === 'earlier')

  const onOpen = (n: AppNotification) => {
    markOne(n.id)
    if (n.kind === 'message') navigate('/community')
    else if (n.kind === 'event') navigate('/events/e-alpine')
    else if (n.kind === 'follow') navigate('/rider/r-lena')
  }

  return (
    <Screen contentClassName="px-0">
      <div className="px-5 pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2">
        <IconButton label="Назад" variant="surface" onClick={() => navigate(-1)} className="border-border bg-transparent">
          <ChevronLeft size={22} />
        </IconButton>
        <h1 className="flex-1 text-2xl font-extrabold text-text">Сповіщення</h1>
        <button onClick={markAll} className="text-sm font-semibold text-primary">
          Прочитати всі
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <Segmented<Tab>
          options={[
            { value: 'all', label: 'Усі' },
            { value: 'following', label: 'Підписки' },
            { value: 'events', label: 'Події' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {/* New */}
      {newGroup.length > 0 && (
        <>
          <SectionLabel className="mt-6">Нові</SectionLabel>
          <div className="mt-3 flex flex-col gap-3 px-5">
            {newGroup.map((n) => (
              <button key={n.id} onClick={() => onOpen(n)} className="text-left">
                <NotificationRow notification={n} read={isRead(n)} />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Earlier */}
      {earlierGroup.length > 0 && (
        <>
          <SectionLabel className="mt-6">Раніше</SectionLabel>
          <div className="mt-3 flex flex-col gap-3 px-5">
            {earlierGroup.map((n) => (
              <button key={n.id} onClick={() => onOpen(n)} className="text-left">
                <NotificationRow notification={n} read={isRead(n)} />
              </button>
            ))}
          </div>
        </>
      )}

      {visible.length === 0 && (
        <p className="px-5 py-12 text-center text-text-secondary">Усе прочитано.</p>
      )}
    </Screen>
  )
}
