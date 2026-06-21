import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll: returns a ref + `shown` flag that flips true once the
 * element enters the viewport (once). Drives the landing's entrance animations.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    // Safety: never leave content hidden if the observer never fires.
    const fallback = setTimeout(() => setShown(true), 2500)
    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [threshold])

  return { ref, shown }
}

/**
 * Parallax: translates the element on scroll relative to its distance from the
 * viewport centre. Writes transform directly to the node (no re-renders, rAF
 * throttled). `axis: 'tilt'` adds a subtle 3D rotation as it scrolls past.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed = 0.15,
  opts: { tilt?: number; scale?: boolean } = {}
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const offset = rect.top + rect.height / 2 - vh / 2
      const ty = (-offset * speed).toFixed(1)
      const rot = opts.tilt ? (offset / vh) * opts.tilt : 0
      const sc = opts.scale ? 1 + Math.max(-0.06, Math.min(0.06, -offset / vh / 8)) : 1
      el.style.transform = `translate3d(0, ${ty}px, 0)${rot ? ` rotate(${rot.toFixed(2)}deg)` : ''}${sc !== 1 ? ` scale(${sc.toFixed(3)})` : ''}`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    el.style.willChange = 'transform'
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed, opts.tilt, opts.scale])

  return ref
}

/** Count-up animation for stat numbers, triggered when `active` becomes true. */
export function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, durationMs])
  return value
}
