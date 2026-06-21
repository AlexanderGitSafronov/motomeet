import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Phone, Video } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { Avatar } from '@/components/ui/Avatar'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { Composer } from '@/components/chat/Composer'
import { conversationsById, dmSeedThreads } from '@/data/mock'
import { useAppStore } from '@/store/useAppStore'

export function DirectMessageScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const conversation = id ? conversationsById[id] : undefined
  const threads = useAppStore((s) => s.threads)
  const send = useAppStore((s) => s.sendMessage)
  const markConversationRead = useAppStore((s) => s.markConversationRead)
  const endRef = useRef<HTMLDivElement>(null)

  const sent = (id && threads[id]) || []
  const seed = (id && dmSeedThreads[id]) || []
  const messages = [...seed, ...sent]

  // Opening a conversation clears its unread badge.
  useEffect(() => {
    if (id) markConversationRead(id)
  }, [id, markConversationRead])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sent.length])

  if (!conversation) {
    return <div className="grid h-full place-items-center text-text-secondary">Діалог не знайдено.</div>
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-bg">
      {/* Header */}
      <div className="z-10 glass">
        <div className="mx-auto w-full max-w-app">
          <div className="px-5 pt-safe">
            <StatusBar />
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <IconButton label="Назад" variant="surface" onClick={() => navigate('/chats')} className="border-border bg-transparent">
              <ChevronLeft size={22} />
            </IconButton>
            <Avatar src={conversation.avatar} alt={conversation.name} size={40} online={conversation.online} />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-bold text-text">{conversation.name}</h1>
              <p className="text-xs text-text-secondary">{conversation.online ? 'У мережі' : 'Не в мережі'}</p>
            </div>
            <IconButton label="Дзвінок" variant="surface" className="border-border bg-transparent">
              <Phone size={18} />
            </IconButton>
            <IconButton label="Відеодзвінок" variant="surface" className="border-border bg-transparent">
              <Video size={18} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <div className="mx-auto flex w-full max-w-app flex-col gap-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} showAvatar={false} />
          ))}
          {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-text-muted">
              Привітайся з {conversation.name.split(' ')[0]} 👋
            </p>
          )}
          <div ref={endRef} className="h-24" />
        </div>
      </div>

      <Composer onSend={(t) => id && send(id, t)} placeholder={`Повідомлення для ${conversation.name.split(' ')[0]}`} />
    </div>
  )
}
