import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/store/useAppStore'

import { AuthScreen } from '@/screens/AuthScreen'
import { MapScreen } from '@/screens/MapScreen'
import { RiderCardScreen } from '@/screens/RiderCardScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { EventsScreen } from '@/screens/EventsScreen'
import { EventPageScreen } from '@/screens/EventPageScreen'
import { CreateEventScreen } from '@/screens/CreateEventScreen'
import { CommunityChatScreen } from '@/screens/CommunityChatScreen'
import { MessagesScreen } from '@/screens/MessagesScreen'
import { DirectMessageScreen } from '@/screens/DirectMessageScreen'
import { SearchScreen } from '@/screens/SearchScreen'
import { RoutesScreen } from '@/screens/RoutesScreen'
import { ClubsScreen } from '@/screens/ClubsScreen'
import { NotificationsScreen } from '@/screens/NotificationsScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'

/** Redirects to /auth when the user is not signed in. */
function RequireAuth() {
  const authed = useAppStore((s) => s.authed)
  if (!authed) return <Navigate to="/auth" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  { path: '/auth', element: <AuthScreen /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/map" replace /> },
          { path: 'map', element: <MapScreen /> },
          { path: 'rider/:id', element: <RiderCardScreen /> },
          { path: 'search', element: <SearchScreen /> },
          { path: 'profile', element: <ProfileScreen /> },
          { path: 'events', element: <EventsScreen /> },
          { path: 'events/:id', element: <EventPageScreen /> },
          { path: 'create-event', element: <CreateEventScreen /> },
          { path: 'chats', element: <MessagesScreen /> },
          { path: 'chats/:id', element: <DirectMessageScreen /> },
          { path: 'community', element: <CommunityChatScreen /> },
          { path: 'routes', element: <RoutesScreen /> },
          { path: 'clubs', element: <ClubsScreen /> },
          { path: 'notifications', element: <NotificationsScreen /> },
          { path: 'settings', element: <SettingsScreen /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/map" replace /> },
])
