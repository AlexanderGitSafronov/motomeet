import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// The store auto-detects language from navigator on first load; pin it to
// Ukrainian so unit tests render the source strings deterministically.
Object.defineProperty(navigator, 'language', { value: 'uk-UA', configurable: true })
Object.defineProperty(navigator, 'languages', { value: ['uk-UA'], configurable: true })

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// jsdom doesn't implement these — stub them for components that use them.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

window.HTMLElement.prototype.scrollIntoView = vi.fn()

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
window.IntersectionObserver = IO as unknown as typeof IntersectionObserver
window.ResizeObserver = IO as unknown as typeof ResizeObserver
