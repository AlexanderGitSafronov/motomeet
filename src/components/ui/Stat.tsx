import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A single number-over-label stat (Followers / Rides / Events …). */
export function Stat({
  value,
  label,
  icon,
  className,
  valueClassName,
}: {
  value: ReactNode
  label: string
  icon?: ReactNode
  className?: string
  valueClassName?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      {icon && <span className="mb-1">{icon}</span>}
      <span className={cn('text-xl font-extrabold text-text', valueClassName)}>{value}</span>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  )
}

/** A row of stats divided into equal cells, used on the user card. */
export function StatRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-3 gap-2', className)}>{children}</div>
}
