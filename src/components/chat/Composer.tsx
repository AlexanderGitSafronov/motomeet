import { useState } from 'react'
import { Plus, Smile, Send } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ComposerProps {
  onSend: (text: string) => void
  onAttach?: () => void
  placeholder?: string
}

const EMOJIS = ['🔥', '🏍️', '👍', '🙌', '😎', '🤘', '🛣️', '⛽', '🗺️', '☕', '🌄', '❤️']

/** Message composer pinned to the bottom of chat screens. */
export function Composer({ onSend, onAttach, placeholder = 'Повідомлення' }: ComposerProps) {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
    setShowEmoji(false)
  }

  return (
    <form onSubmit={submit} className="absolute inset-x-0 bottom-0 z-20 glass px-3 pb-safe pt-2.5">
      {showEmoji && (
        <div className="mx-auto mb-2 grid max-w-app grid-cols-6 gap-1 rounded-2xl bg-surface-2 p-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setText((t) => t + e)
              }}
              className="grid h-9 place-items-center rounded-lg text-xl hover:bg-surface-3"
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <div className="mx-auto flex max-w-app items-center gap-2 pb-2.5">
        <button
          type="button"
          aria-label="Додати вкладення"
          onClick={onAttach}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-text-secondary"
        >
          <Plus size={20} />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setShowEmoji(false)}
            placeholder={placeholder}
            aria-label="Повідомлення"
            className="w-full bg-transparent text-[15px] text-text placeholder:text-text-muted outline-none"
          />
          <button
            type="button"
            aria-label="Емодзі"
            onClick={() => setShowEmoji((v) => !v)}
            className={cn('shrink-0', showEmoji ? 'text-primary' : 'text-text-muted')}
          >
            <Smile size={20} />
          </button>
        </div>
        <button
          type="submit"
          aria-label="Надіслати повідомлення"
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-full text-on-primary shadow-glow-sm transition-transform active:scale-95',
            text.trim() ? 'bg-primary' : 'bg-primary/60'
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  )
}
