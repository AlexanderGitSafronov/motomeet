import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightIcon, className, ...rest },
  ref
) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md bg-surface-2 border border-border px-4 h-13 min-h-[52px] focus-within:border-primary/60 transition-colors',
        className
      )}
    >
      {leftIcon && <span className="text-text-muted shrink-0">{leftIcon}</span>}
      <input
        ref={ref}
        className="w-full bg-transparent text-[15px] text-text placeholder:text-text-muted outline-none"
        {...rest}
      />
      {rightIcon && <span className="text-text-muted shrink-0">{rightIcon}</span>}
    </div>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-md bg-surface-2 border border-border px-4 py-3 text-[15px] text-text placeholder:text-text-muted outline-none focus:border-primary/60 transition-colors resize-none',
        className
      )}
      {...rest}
    />
  )
})

/** Small field-label used above inputs on forms. */
export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-semibold text-text-secondary">{children}</label>
}
