import { createPortal } from 'react-dom'
import { CheckCircle2, Info, Bell, Flame } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const icons = {
  success: <CheckCircle2 size={20} className="text-success" />,
  info: <Info size={20} className="text-accent" />,
  bell: <Bell size={20} className="text-primary" />,
  flame: <Flame size={20} className="text-primary" />,
}

/** Glassmorphic toasts pinned to the top of the viewport. */
export function Toaster() {
  const toasts = useAppStore((s) => s.toasts)
  const dismiss = useAppStore((s) => s.dismissToast)

  if (toasts.length === 0) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-3 pt-safe">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="pointer-events-auto flex w-full max-w-app animate-toast-in items-center gap-3 rounded-full glass px-4 py-3 text-left shadow-card"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2">
            {icons[t.icon ?? 'success']}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-text">{t.title}</span>
            {t.body && <span className="block truncate text-xs text-text-secondary">{t.body}</span>}
          </span>
        </button>
      ))}
    </div>,
    document.body
  )
}
