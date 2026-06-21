import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'

interface ScreenHeaderProps {
  title?: ReactNode
  subtitle?: ReactNode
  back?: boolean
  onBack?: () => void
  action?: ReactNode
  large?: boolean
  className?: string
}

/** Top bar with optional back chevron, title block and a trailing action. */
export function ScreenHeader({
  title,
  subtitle,
  back,
  onBack,
  action,
  large,
  className,
}: ScreenHeaderProps) {
  const navigate = useNavigate()
  const handleBack = onBack ?? (() => navigate(-1))
  return (
    <div className={cn('flex items-center gap-3 px-5 py-3', className)}>
      {back && (
        <IconButton
          label="Назад"
          variant="surface"
          size="md"
          onClick={handleBack}
          className="border-border bg-transparent"
        >
          <ChevronLeft size={22} />
        </IconButton>
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className={cn('truncate font-extrabold text-text', large ? 'text-[28px] leading-tight' : 'text-lg')}>
            {title}
          </h1>
        )}
        {subtitle && <p className="truncate text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('px-5 text-xs font-bold uppercase tracking-wider text-text-muted', className)}>
      {children}
    </h2>
  )
}

export function SectionTitle({
  children,
  action,
  className,
}: {
  children: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between px-5', className)}>
      <h2 className="text-lg font-bold text-text">{children}</h2>
      {action}
    </div>
  )
}
