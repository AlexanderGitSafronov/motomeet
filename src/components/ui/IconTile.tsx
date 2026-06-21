import { Shield, Mountain, Moon, Compass, Gauge } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Club } from '@/data/types'

const iconMap = {
  shield: Shield,
  mountain: Mountain,
  moon: Moon,
  compass: Compass,
  gauge: Gauge,
}

/** Rounded gradient square holding a club icon. */
export function ClubIcon({
  icon,
  gradient,
  size = 64,
  className,
}: {
  icon: Club['icon']
  gradient: string
  size?: number
  className?: string
}) {
  const Icon = iconMap[icon]
  return (
    <span
      className={cn('grid shrink-0 place-items-center rounded-[24%] bg-gradient-to-br text-white', gradient, className)}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.45} strokeWidth={2} />
    </span>
  )
}
