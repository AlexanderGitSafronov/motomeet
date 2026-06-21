import { cn } from '@/lib/cn'

export interface SegmentOption<T extends string = string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  className?: string
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex rounded-full bg-surface-2 p-1 border border-border',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200',
              active ? 'bg-primary text-on-primary shadow-glow-sm' : 'text-text-secondary hover:text-text'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
