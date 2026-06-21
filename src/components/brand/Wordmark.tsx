import { LogoTile } from './Logo'
import { cn } from '@/lib/cn'

const sizes = {
  sm: { logo: 32, text: 'text-xl' },
  md: { logo: 44, text: 'text-3xl' },
  lg: { logo: 64, text: 'text-5xl' },
}

/** MOTOMEET wordmark in the Anton display face. */
export function Wordmark({
  size = 'md',
  withIcon = true,
  className,
}: {
  size?: keyof typeof sizes
  withIcon?: boolean
  className?: string
}) {
  const s = sizes[size]
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {withIcon && <LogoTile size={s.logo} />}
      <span className={cn('font-display tracking-tight text-text', s.text)} style={{ letterSpacing: '0.01em' }}>
        MOTOMEET
      </span>
    </span>
  )
}
