import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** When true the sheet floats with rounded corners (card style). */
  className?: string
  labelledBy?: string
}

/** Glassmorphic bottom sheet with a backdrop and grab handle. */
export function Sheet({ open, onClose, children, className, labelledBy }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <button
        aria-label="Закрити"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in backdrop-blur-[2px]"
      />
      <div
        className={cn(
          'relative w-full max-w-app animate-sheet-up rounded-t-[28px] glass shadow-sheet pb-safe',
          className
        )}
      >
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
