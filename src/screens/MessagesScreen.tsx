import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenSquare } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { SearchBar } from '@/components/ui/SearchBar'
import { Avatar } from '@/components/ui/Avatar'
import { ConversationRow } from '@/components/cards/ConversationRow'
import { conversations } from '@/data/mock'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'

export function MessagesScreen() {
  const navigate = useNavigate()
  const riders = useAppStore((s) => s.riders)
  const threads = useAppStore((s) => s.threads)
  const readConversations = useAppStore((s) => s.readConversations)
  const t = useT()
  const [query, setQuery] = useState('')
  const online = riders.filter((r) => r.online).slice(0, 6)

  // Reflect the user's own last message + read state in each conversation row.
  const enriched = conversations.map((c) => {
    const sent = threads[c.id]
    const last = sent && sent.length ? sent[sent.length - 1] : null
    return {
      ...c,
      lastMessage: last ? (last.kind === 'image' ? 'Фото' : last.text ?? c.lastMessage) : c.lastMessage,
      lastKind: last ? last.kind : c.lastKind,
      time: last ? last.time : c.time,
      unread: readConversations[c.id] || (sent && sent.length) ? 0 : c.unread,
    }
  })

  const filtered = enriched.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Screen contentClassName="px-0">
      <div className="px-5 pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <h1 className="text-[28px] font-extrabold text-text">{t('Повідомлення')}</h1>
        <IconButton label="Нове повідомлення" variant="primary" onClick={() => navigate('/community')}>
          <PenSquare size={20} />
        </IconButton>
      </div>

      {/* Search */}
      <div className="px-5 pt-4">
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} placeholder={t('Пошук повідомлень')} />
      </div>

      {/* Online row */}
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto px-5 pb-2">
        {online.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/rider/${r.id}`)}
            className="flex w-14 shrink-0 flex-col items-center gap-1.5"
          >
            <Avatar src={r.avatar} alt={r.name} size={56} online ring="success" />
            <span className="w-full truncate text-center text-xs text-text-secondary">
              {r.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Conversations */}
      <div className="mt-2">
        {filtered.map((c) => (
          <ConversationRow key={c.id} conversation={c} />
        ))}
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-text-secondary">Діалогів не знайдено.</p>
        )}
      </div>
    </Screen>
  )
}
