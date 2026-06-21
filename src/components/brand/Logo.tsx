import { cn } from '@/lib/cn'

/** Stylized motorcycle-helmet logo glyph used in the brand tile. */
export function HelmetGlyph({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 5C9.9 5 5 9.7 5 15.6c0 1.5.3 2.6.7 3.6.3.8 1.1 1.3 2 1.3h2.6c.5 0 1-.3 1.2-.8l.6-1.4c.2-.5.7-.8 1.2-.8h8.3c2.9 0 5.2-2.3 5.2-5.1C27 9.2 22.1 5 16 5Z"
        fill="currentColor"
      />
      <path
        d="M9 19.5h11.3c.6 0 1.1.4 1.3 1l.5 1.6c.2.7-.3 1.4-1 1.4H12c-1.4 0-2.7-.8-3.4-2l-.5-1c-.3-.5.1-1 .9-1Z"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="13" cy="13" r="2" fill="#0F172A" opacity="0.35" />
    </svg>
  )
}

/** The rounded gradient tile holding the helmet glyph (Material Symbols `sports_motorsports`, as in MotoMeet.pen). */
export function LogoTile({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        'grid place-items-center rounded-[28%] text-white shadow-glow',
        className
      )}
      // Gradient from MotoMeet.pen logoMark: #A78BFA → #7C3AED at 135°
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)' }}
    >
      <span className="material-symbols-rounded" style={{ fontSize: Math.round(size * 0.56) }}>
        sports_motorsports
      </span>
    </span>
  )
}
