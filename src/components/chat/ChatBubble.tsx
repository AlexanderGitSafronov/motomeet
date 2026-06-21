import { Play } from 'lucide-react'
import type { ChatMessage } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { duration } from '@/lib/format'
import { cn } from '@/lib/cn'

/** Animated bar pattern for voice messages. */
function VoiceWave() {
  const bars = [8, 14, 20, 12, 18, 24, 10, 16, 22, 9, 15, 19, 11, 14]
  return (
    <div className="flex h-6 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span key={i} className="w-[3px] rounded-full bg-current opacity-80" style={{ height: h }} />
      ))}
    </div>
  )
}

export function ChatBubble({ message, showAvatar = true }: { message: ChatMessage; showAvatar?: boolean }) {
  const self = message.self

  return (
    <div className={cn('flex items-end gap-2', self ? 'flex-row-reverse' : 'flex-row')}>
      {!self && showAvatar ? (
        <Avatar src={message.authorAvatar} alt={message.authorName} size={30} />
      ) : (
        !self && <span className="w-[30px] shrink-0" />
      )}

      <div className={cn('flex max-w-[78%] flex-col', self ? 'items-end' : 'items-start')}>
        {!self && message.authorName && (
          <span className="mb-1 px-1 text-xs font-semibold text-primary">{message.authorName}</span>
        )}

        <div
          className={cn(
            'relative overflow-hidden text-[15px] leading-snug shadow-sm',
            message.kind === 'image' ? 'rounded-[20px] p-1' : 'px-3.5 py-2.5',
            self
              ? 'rounded-[20px] rounded-br-md bg-primary text-on-primary'
              : 'rounded-[20px] rounded-bl-md bg-surface-2 text-text'
          )}
        >
          {message.kind === 'text' && <p>{message.text}</p>}

          {message.kind === 'image' && (
            <img src={message.image} alt="" className="max-h-56 w-full rounded-[16px] object-cover" />
          )}

          {message.kind === 'voice' && (
            <div className="flex items-center gap-3 py-0.5">
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full',
                  self ? 'bg-white/25' : 'bg-primary text-white'
                )}
              >
                <Play size={16} fill="currentColor" />
              </span>
              <VoiceWave />
              <span className="text-xs opacity-80">{duration(message.voiceDuration ?? 0)}</span>
            </div>
          )}
        </div>

        <div className={cn('mt-1 flex items-center gap-2 px-1', self ? 'flex-row-reverse' : '')}>
          <span className="text-[11px] text-text-muted">{message.time}</span>
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex items-center gap-1">
              {message.reactions.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-1.5 py-0.5 text-[11px] font-semibold text-text"
                >
                  {r.emoji} {r.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
