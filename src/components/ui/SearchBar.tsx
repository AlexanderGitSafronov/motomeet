import type { ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  onClear?: () => void
  trailing?: ReactNode
  autoFocus?: boolean
  active?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  onClear,
  trailing,
  autoFocus,
  active,
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-full bg-surface-2 border px-4 h-12 transition-colors',
        active ? 'border-primary' : 'border-border',
        className
      )}
    >
      <Search size={20} className="shrink-0 text-text-muted" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[15px] text-text placeholder:text-text-muted outline-none"
        aria-label={placeholder}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          aria-label="Очистити пошук"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-3 text-text-secondary"
        >
          <X size={14} />
        </button>
      )}
      {trailing}
    </div>
  )
}
