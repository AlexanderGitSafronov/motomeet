import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAppStore } from './store/useAppStore'

/** Applies the active theme to <html> and renders the router. */
export default function App() {
  const theme = useAppStore((s) => s.theme)
  const initAuth = useAppStore((s) => s.initAuth)

  useEffect(() => {
    void initAuth()
  }, [initAuth])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'light' ? '#EEF2F7' : '#0F172A')
  }, [theme])

  return <RouterProvider router={router} />
}
