import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Users } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { ClubIcon } from '@/components/ui/IconTile'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { Composer } from '@/components/chat/Composer'
import { communityChannel, communitySeedMessages, gallery } from '@/data/mock'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'

export function CommunityChatScreen() {
  const navigate = useNavigate()
  const [channel, setChannel] = useState(communityChannel.channels[0])
  const sent = useAppStore((s) => s.communityMessages)
  const send = useAppStore((s) => s.sendCommunityMessage)
  const messages = [...communitySeedMessages, ...sent]
  const attachPhoto = () => send('', gallery[sent.length % gallery.length])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sent.length])

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-bg">
      {/* Header */}
      <div className="z-10 glass">
        <div className="mx-auto w-full max-w-app">
          <div className="pt-safe">
            <StatusBar />
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <IconButton label="Назад" variant="surface" onClick={() => navigate(-1)} className="border-border bg-transparent">
              <ChevronLeft size={22} />
            </IconButton>
            <ClubIcon icon={communityChannel.icon} gradient="from-violet-500 to-purple-700" size={40} />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-bold text-text">{communityChannel.name}</h1>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {formatNumber(communityChannel.members)} учасників · {communityChannel.online} онлайн
              </p>
            </div>
            <IconButton label="Учасники" variant="surface" className="border-border bg-transparent">
              <Users size={20} />
            </IconButton>
          </div>

          {/* Channel chips */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {communityChannel.channels.map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold',
                  ch === channel ? 'bg-primary text-on-primary' : 'bg-surface-2 text-text-secondary'
                )}
              >
                #{ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <div className="mx-auto flex w-full max-w-app flex-col gap-3.5">
          <div className="flex justify-center">
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-text-muted">Сьогодні</span>
          </div>
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          <div ref={endRef} className="h-24" />
        </div>
      </div>

      <Composer onSend={send} onAttach={attachPhoto} placeholder={`Повідомлення в #${communityChannel.channels[0]}`} />
    </div>
  )
}
