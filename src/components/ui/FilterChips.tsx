import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ChipOption<T extends string = string> {
  value: T
  label: string
  icon?: ReactNode
}

interface FilterChipsProps<T extends string> {
  options: ChipOption<T>[]
  value: T
  onChange: (v: T) => void
  className?: string
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn('no-scrollbar flex gap-1.5 overflow-x-auto', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-150 active:scale-95',
              active
                ? 'bg-primary text-on-primary shadow-glow-sm'
                : 'bg-surface-2 text-text-secondary border border-border hover:text-text'
            )}
            aria-pressed={active}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
