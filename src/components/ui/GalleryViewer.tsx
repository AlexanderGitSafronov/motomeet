import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

interface GalleryViewerProps {
  images: string[]
  index: number
  onClose: () => void
  onDelete?: (index: number) => void
}

/** Full-screen photo viewer with prev/next, counter, delete and keyboard navigation. */
export function GalleryViewer({ images, index, onClose, onDelete }: GalleryViewerProps) {
  const [i, setI] = useState(index)

  const prev = useCallback(() => setI((v) => (v - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setI((v) => (v + 1) % images.length), [images.length])

  // Keep the index valid as photos are deleted; close when none remain.
  useEffect(() => {
    if (images.length === 0) onClose()
    else if (i >= images.length) setI(images.length - 1)
  }, [images.length, i, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  if (images.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-black/95" role="dialog" aria-modal="true" aria-label="Перегляд фото">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-safe">
        <span className="py-4 text-sm font-semibold text-white/80">
          {i + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(i)}
              aria-label="Видалити фото"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-error"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Закрити"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative flex flex-1 items-center justify-center px-3">
        <img src={images[i]} alt={`Фото ${i + 1}`} className="max-h-full max-w-full rounded-lg object-contain" />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Попереднє фото"
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              aria-label="Наступне фото"
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-safe pt-3">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-md ring-2 transition ${
              idx === i ? 'ring-primary' : 'ring-transparent opacity-60'
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  )
}
