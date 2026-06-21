import { cn } from '@/lib/cn'

interface AvatarProps {
  src: string
  alt: string
  size?: number
  ring?: 'primary' | 'success' | 'none'
  online?: boolean
  className?: string
}

export function Avatar({ src, alt, size = 44, ring = 'none', online, className }: AvatarProps) {
  const ringClass =
    ring === 'primary'
      ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg'
      : ring === 'success'
        ? 'ring-2 ring-success ring-offset-2 ring-offset-bg'
        : ''
  return (
    <div className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn('h-full w-full rounded-full object-cover bg-surface-2', ringClass)}
      />
      {online && (
        <span
          className="absolute bottom-0 right-0 block rounded-full border-2 border-bg bg-success"
          style={{ width: Math.max(10, size * 0.26), height: Math.max(10, size * 0.26) }}
        />
      )}
    </div>
  )
}

interface AvatarStackProps {
  avatars: string[]
  size?: number
  max?: number
}

export function AvatarStack({ avatars, size = 24, max = 4 }: AvatarStackProps) {
  const shown = avatars.slice(0, max)
  return (
    <div className="flex items-center">
      {shown.map((a, i) => (
        <img
          key={i}
          src={a}
          alt=""
          className="rounded-full border-2 border-surface object-cover bg-surface-2"
          style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size * 0.36 }}
        />
      ))}
    </div>
  )
}
