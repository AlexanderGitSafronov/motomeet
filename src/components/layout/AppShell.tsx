import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Toaster } from '@/components/ui/Toaster'

/**
 * Root chrome for the authenticated app.
 * - < lg: mobile shell — content column + floating bottom nav.
 * - >= lg: desktop dashboard — left sidebar + content (bottom nav hidden).
 */
export function AppShell() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-bg text-text">
      <Sidebar />
      <main className="relative flex-1 overflow-hidden">
        <Outlet />
        <BottomNav />
      </main>
      <Toaster />
    </div>
  )
}
