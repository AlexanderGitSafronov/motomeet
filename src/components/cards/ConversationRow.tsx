import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, Mic } from 'lucide-react'
import type { Conversation } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'

export function ConversationRow({ conversation }: { conversation: Conversation }) {
  const navigate = useNavigate()
  const c = conversation
  const unread = (c.unread ?? 0) > 0

  return (
    <button
      onClick={() => navigate(`/chats/${c.id}`)}
      className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface-2/60"
    >
      <Avatar src={c.avatar} alt={c.name} size={54} online={c.online} />
      <span className="min-w-0 flex-1 border-b border-border pb-3">
        <span className="flex items-center justify-between gap-2">
          <span className={cn('truncate font-bold', unread ? 'text-text' : 'text-text')}>{c.name}</span>
          <span className="shrink-0 text-xs text-text-muted">{c.time}</span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 text-sm text-text-secondary">
            {c.lastKind === 'image' && <ImageIcon size={14} className="shrink-0 text-text-muted" />}
            {c.lastKind === 'voice' && <Mic size={14} className="shrink-0 text-text-muted" />}
            <span className="truncate">{c.lastMessage}</span>
          </span>
          {unread && (
            <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-on-primary">
              {c.unread}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}
