import type { ReactNode } from 'react'
import { BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'primary' | 'accent' | 'success' | 'error' | 'warning' | 'neutral' | 'glass'

const tones: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  error: 'bg-error-soft text-error',
  warning: 'bg-[color:var(--mm-warning)]/15 text-warning',
  neutral: 'bg-surface-2 text-text-secondary',
  glass: 'glass text-text',
}

export function Badge({
  children,
  tone = 'neutral',
  icon,
  className,
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/** The blue scalloped "verified" check used next to names & clubs. */
export function VerifiedBadge({ size = 16, className }: { size?: number; className?: string }) {
  return <BadgeCheck size={size} className={cn('text-accent shrink-0', className)} aria-label="Підтверджено" />
}
