import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'surface' | 'glass' | 'primary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  label: string
  children: ReactNode
}

const variants: Record<Variant, string> = {
  surface: 'bg-surface-2 text-text border border-border hover:border-primary/40',
  glass: 'glass text-text hover:text-primary',
  primary: 'bg-primary text-on-primary shadow-glow-sm hover:bg-primary-hover',
  ghost: 'bg-transparent text-text-secondary hover:text-text',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ variant = 'surface', size = 'md', label, className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
          variants[variant],
          sizes[size],
          className
        )}
        {...rest}
      >
        {children}
      </button>
    )
  }
)
