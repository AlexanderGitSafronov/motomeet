import type { ReactNode } from 'react'
import { Apple, Play } from 'lucide-react'
import { useReveal, useParallax } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'

/** Translate children on scroll for a layered parallax effect. */
export function Parallax({
  children,
  speed = 0.15,
  tilt,
  scale,
  className,
}: {
  children: ReactNode
  speed?: number
  tilt?: number
  scale?: boolean
  className?: string
}) {
  const ref = useParallax<HTMLDivElement>(speed, { tilt, scale })
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** A soft animated colour orb used as a parallax background accent. */
export function GlowOrb({
  color,
  size = 520,
  className,
  speed = 0.08,
}: {
  color: string
  size?: number
  className?: string
  speed?: number
}) {
  const ref = useParallax<HTMLDivElement>(speed)
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('animate-glow-pulse pointer-events-none absolute rounded-full', className)}
      style={{ width: size, height: size, background: `radial-gradient(circle, ${color}, transparent 70%)` }}
    />
  )
}

/** Wrap children so they animate up into view on scroll. */
export function Reveal({
  children,
  className,
  delay,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: 1 | 2 | 3 | 4 | 5
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', delay && `reveal-delay-${delay}`, shown && 'is-shown', className)}
    >
      {children}
    </Tag>
  )
}

/** App-store / Google-Play download buttons (white pills). */
export function StoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3.5', className)}>
      <a
        href="/auth"
        className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-[#0F172A] shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Apple size={26} fill="currentColor" />
        <span className="flex flex-col leading-none">
          <span className="text-[11px] font-medium opacity-70">Download on the</span>
          <span className="text-[17px] font-bold">App Store</span>
        </span>
      </a>
      <a
        href="/auth"
        className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-[#0F172A] shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Play size={24} fill="currentColor" />
        <span className="flex flex-col leading-none">
          <span className="text-[11px] font-medium opacity-70">GET IT ON</span>
          <span className="text-[17px] font-bold">Google Play</span>
        </span>
      </a>
    </div>
  )
}

/** A device bezel containing an app-screen image, with a coloured glow. */
export function PhoneFrame({
  src,
  glow,
  className,
}: {
  src: string
  glow: string
  className?: string
}) {
  return (
    <div
      className={cn('relative w-[300px] shrink-0 rounded-[44px] border-2 border-surface bg-[#0B0F1A] p-1.5', className)}
      style={{ boxShadow: `0 40px 90px -24px rgba(0,0,0,0.75), 0 0 70px -10px ${glow}` }}
    >
      <div className="overflow-hidden rounded-[38px]">
        <img src={src} alt="" className="block w-full" loading="lazy" />
      </div>
      {/* notch */}
      <div className="absolute left-1/2 top-3 h-5 w-28 -translate-x-1/2 rounded-full bg-[#0B0F1A]" />
    </div>
  )
}

/** Small glassy floating badge used beside the showcase phones. */
export function FloatChip({
  icon,
  tint,
  title,
  subtitle,
  className,
}: {
  icon: ReactNode
  tint: string
  title: string
  subtitle: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex animate-float items-center gap-3 rounded-2xl border border-white/15 bg-[#0F172A]/85 px-4 py-3 shadow-2xl backdrop-blur-md',
        className
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: tint }}>
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-white">{title}</span>
        <span className="block text-xs text-text-secondary">{subtitle}</span>
      </span>
    </div>
  )
}

/** Eyebrow + Anton title block used by most sections. */
export function SectionHead({
  eyebrow,
  eyebrowColor = '#8B5CF6',
  title,
  subtitle,
  className,
}: {
  eyebrow: string
  eyebrowColor?: string
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <Reveal>
        <p className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: eyebrowColor }}>
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={1}>
        <h2 className="mt-4 max-w-3xl font-display text-[clamp(32px,5vw,54px)] leading-[1.05] tracking-tight text-text">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={2}>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-text-secondary">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
