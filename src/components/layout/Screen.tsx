import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Width = 'app' | 'wide' | 'full'

const widths: Record<Width, string> = {
  app: 'max-w-app',
  wide: 'max-w-app md:max-w-3xl',
  full: 'max-w-none',
}

interface ScreenProps {
  children: ReactNode
  /** Content column width. */
  width?: Width
  /** Reserve space for the floating bottom nav. */
  padNav?: boolean
  /** Disable the scroll container (used by the full-bleed map). */
  scroll?: boolean
  className?: string
  contentClassName?: string
}

/**
 * Standard scrollable screen container: a centered, width-capped column that
 * fills the shell's main area and reserves space for the bottom nav.
 */
export function Screen({
  children,
  width = 'app',
  padNav = true,
  scroll = true,
  className,
  contentClassName,
}: ScreenProps) {
  return (
    <div
      className={cn(
        'h-full bg-bg',
        scroll ? 'overflow-y-auto no-scrollbar' : 'overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto flex min-h-full w-full flex-col',
          widths[width],
          padNav && 'pb-28 lg:pb-10',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
