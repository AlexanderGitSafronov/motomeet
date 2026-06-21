import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  ChatMessage,
  Rider,
  RideEvent,
  Club,
  AppNotification,
  SavedRoute,
} from '@/data/types'
import {
  riders as seedRiders,
  events as seedEvents,
  clubs as seedClubs,
  notifications as seedNotifications,
  gallery as gallerySeed,
  currentUser as seedCurrentUser,
} from '@/data/mock'
import { api, setAuthToken, ApiError } from '@/api/client'

export type Theme = 'dark' | 'light'
export type Lang = 'uk' | 'en' | 'ru'

export interface ToastMsg {
  id: number
  title: string
  body?: string
  icon?: 'success' | 'info' | 'bell' | 'flame'
}

export interface GalleryItem {
  id: string
  url: string
}

interface AppState {
  // ---- theme / language ----
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  lang: Lang
  setLang: (l: Lang) => void

  // ---- auth ----
  token: string | null
  authed: boolean
  currentUser: Rider
  authError: string | null
  initAuth: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (p: Partial<{ name: string; bike: string; location: string }>) => void

  // ---- server-backed data ----
  riders: Rider[]
  events: RideEvent[]
  clubs: Club[]
  notifications: AppNotification[]
  galleryItems: GalleryItem[]
  customRoutes: SavedRoute[]
  loadAll: () => Promise<void>

  // ---- social graph (optimistic maps, synced to API) ----
  following: Record<string, boolean>
  toggleFollow: (riderId: string) => boolean
  joinedEvents: Record<string, boolean>
  toggleEventJoin: (eventId: string) => boolean
  joinedClubs: Record<string, boolean>
  toggleClubJoin: (clubId: string) => boolean
  savedEvents: Record<string, boolean>
  toggleSaveEvent: (eventId: string) => boolean

  // ---- gallery ----
  addGalleryPhoto: (url: string) => void
  removeGalleryPhoto: (id: string) => void

  // ---- routes / rides ----
  rideActive: boolean
  toggleRide: () => boolean
  visitedStops: Record<string, boolean>
  toggleStopVisited: (stopId: string) => void
  addRoute: (r: Omit<SavedRoute, 'id'>) => void
  removeRoute: (id: string) => void

  // ---- settings ----
  settings: {
    ghostMode: boolean
    showDistance: boolean
    eventReminders: boolean
    nearbyRiders: boolean
    pushNotifications: boolean
  }
  toggleSetting: (key: keyof AppState['settings']) => void

  // ---- notifications ----
  readNotifications: Record<string, boolean>
  markAllNotificationsRead: () => void
  markNotificationRead: (id: string) => void
  unreadNotificationCount: (allIds: string[]) => number

  // ---- direct + community messages (client-side, persisted) ----
  threads: Record<string, ChatMessage[]>
  sendMessage: (conversationId: string, text: string, image?: string) => void
  readConversations: Record<string, boolean>
  markConversationRead: (conversationId: string) => void
  communityMessages: ChatMessage[]
  sendCommunityMessage: (text: string, image?: string) => void

  // ---- toasts ----
  toasts: ToastMsg[]
  pushToast: (t: Omit<ToastMsg, 'id'>) => void
  dismissToast: (id: number) => void
}

let seq = 1
const TOKEN_KEY = 'mm-token'

function mapFromList<T extends { id: string }>(list: T[], pick: (t: T) => boolean): Record<string, boolean> {
  return Object.fromEntries(list.map((x) => [x.id, pick(x)]))
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      lang: 'uk',
      setLang: (lang) => set({ lang }),

      // ---- auth ----
      token: null,
      authed: false,
      currentUser: seedCurrentUser,
      authError: null,

      initAuth: async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) return
        setAuthToken(token)
        set({ token, authed: true }) // optimistic — avoids a redirect flash
        try {
          const { user } = await api.get<{ user: Rider }>('/auth/me')
          set({ currentUser: user })
          await get().loadAll()
        } catch {
          /* keep optimistic session offline; clear only on explicit auth error */
        }
      },

      signIn: async (email, password) => {
        set({ authError: null })
        try {
          const { token, user } = await api.post<{ token: string; user: Rider }>('/auth/login', { email, password })
          localStorage.setItem(TOKEN_KEY, token)
          setAuthToken(token)
          set({ token, authed: true, currentUser: user })
          await get().loadAll()
        } catch (e) {
          // Only real credential errors (400/401) should block sign-in;
          // anything else (no API / offline / preview) falls back to demo mode.
          if (e instanceof ApiError && (e.status === 400 || e.status === 401)) {
            set({ authError: e.message })
            throw e
          }
          set({ authed: true, authError: null })
        }
      },

      register: async (name, email, password) => {
        set({ authError: null })
        try {
          const { token, user } = await api.post<{ token: string; user: Rider }>('/auth/register', { name, email, password })
          localStorage.setItem(TOKEN_KEY, token)
          setAuthToken(token)
          set({ token, authed: true, currentUser: user })
          await get().loadAll()
        } catch (e) {
          if (e instanceof ApiError && (e.status === 400 || e.status === 401)) {
            set({ authError: e.message })
            throw e
          }
          set({ authed: true, currentUser: { ...seedCurrentUser, name }, authError: null })
        }
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        setAuthToken(null)
        set({ token: null, authed: false, currentUser: seedCurrentUser })
      },

      updateProfile: (p) => {
        set((s) => ({ currentUser: { ...s.currentUser, ...p } }))
        api.patch('/profile', p).catch(() => {})
      },

      // ---- data ----
      riders: seedRiders,
      events: seedEvents,
      clubs: seedClubs,
      notifications: seedNotifications,
      galleryItems: gallerySeed.map((url, i) => ({ id: `seed-${i}`, url })),
      customRoutes: [],

      loadAll: async () => {
        try {
          const [r, e, c, n, g, rt] = await Promise.all([
            api.get<{ riders: (Rider & { isFollowing?: boolean })[] }>('/riders'),
            api.get<{ events: (RideEvent & { joined?: boolean })[] }>('/events'),
            api.get<{ clubs: (Club & { joined?: boolean })[] }>('/clubs'),
            api.get<{ notifications: AppNotification[] }>('/notifications'),
            api.get<{ gallery: GalleryItem[] }>('/gallery'),
            api.get<{ routes: SavedRoute[] }>('/routes'),
          ])
          set({
            riders: r.riders,
            events: e.events,
            clubs: c.clubs,
            notifications: n.notifications,
            galleryItems: g.gallery.length ? g.gallery : get().galleryItems,
            customRoutes: rt.routes.filter((x) => x.id !== 'rt-coastal'),
            following: mapFromList(r.riders, (x) => !!(x as { isFollowing?: boolean }).isFollowing),
            joinedEvents: mapFromList(e.events, (x) => !!(x as { joined?: boolean }).joined),
            joinedClubs: mapFromList(c.clubs, (x) => !!(x as { joined?: boolean }).joined),
          })
        } catch {
          /* offline → keep seed data */
        }
      },

      // ---- social graph ----
      following: { 'r-diego': true },
      toggleFollow: (riderId) => {
        const next = !get().following[riderId]
        set((s) => ({ following: { ...s.following, [riderId]: next } }))
        ;(next ? api.post(`/follow/${riderId}`) : api.del(`/follow/${riderId}`)).catch(() => {})
        return next
      },

      joinedEvents: {},
      toggleEventJoin: (eventId) => {
        const next = !get().joinedEvents[eventId]
        set((s) => ({ joinedEvents: { ...s.joinedEvents, [eventId]: next } }))
        ;(next ? api.post(`/events/${eventId}/join`) : api.del(`/events/${eventId}/join`)).catch(() => {})
        return next
      },

      joinedClubs: { 'c-nightowls': true },
      toggleClubJoin: (clubId) => {
        const next = !get().joinedClubs[clubId]
        set((s) => ({ joinedClubs: { ...s.joinedClubs, [clubId]: next } }))
        ;(next ? api.post(`/clubs/${clubId}/join`) : api.del(`/clubs/${clubId}/join`)).catch(() => {})
        return next
      },

      savedEvents: {},
      toggleSaveEvent: (eventId) => {
        const next = !get().savedEvents[eventId]
        set((s) => ({ savedEvents: { ...s.savedEvents, [eventId]: next } }))
        return next
      },

      // ---- gallery ----
      addGalleryPhoto: (url) => {
        const tempId = `tmp-${seq++}`
        set((s) => ({ galleryItems: [{ id: tempId, url }, ...s.galleryItems] }))
        api.post<{ id: string }>('/gallery', { url }).catch(() => {})
      },
      removeGalleryPhoto: (id) => {
        set((s) => ({ galleryItems: s.galleryItems.filter((g) => g.id !== id) }))
        if (!id.startsWith('seed-') && !id.startsWith('tmp-')) api.del(`/gallery/${id}`).catch(() => {})
      },

      // ---- routes ----
      rideActive: false,
      toggleRide: () => {
        const next = !get().rideActive
        set({ rideActive: next })
        return next
      },
      visitedStops: {},
      toggleStopVisited: (stopId) =>
        set((s) => ({ visitedStops: { ...s.visitedStops, [stopId]: !s.visitedStops[stopId] } })),
      addRoute: (r) => {
        const id = `rt-${seq++}`
        set((s) => ({ customRoutes: [{ ...r, id }, ...s.customRoutes] }))
        api.post('/routes', r).catch(() => {})
      },
      removeRoute: (id) => {
        set((s) => ({ customRoutes: s.customRoutes.filter((r) => r.id !== id) }))
        api.del(`/routes/${id}`).catch(() => {})
      },

      // ---- settings ----
      settings: {
        ghostMode: false,
        showDistance: true,
        eventReminders: true,
        nearbyRiders: true,
        pushNotifications: true,
      },
      toggleSetting: (key) => set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),

      // ---- notifications ----
      readNotifications: {},
      markAllNotificationsRead: () => {
        set({ readNotifications: { __all__: true } })
        api.post('/notifications/read-all').catch(() => {})
      },
      markNotificationRead: (id) => {
        set((s) => ({ readNotifications: { ...s.readNotifications, [id]: true } }))
        api.post(`/notifications/${id}/read`).catch(() => {})
      },
      unreadNotificationCount: (allIds) => {
        const read = get().readNotifications
        if (read.__all__) return 0
        return allIds.filter((id) => !read[id]).length
      },

      // ---- messaging (client-side) ----
      threads: {},
      sendMessage: (conversationId, text, image) => {
        const trimmed = text.trim()
        if (!trimmed && !image) return
        const msg: ChatMessage = {
          id: `m-${seq++}-${conversationId}`,
          authorId: 'me',
          authorName: 'Ви',
          authorAvatar: '',
          time: 'зараз',
          self: true,
          kind: image ? 'image' : 'text',
          text: image ? undefined : trimmed,
          image,
        }
        set((s) => ({
          threads: { ...s.threads, [conversationId]: [...(s.threads[conversationId] ?? []), msg] },
          readConversations: { ...s.readConversations, [conversationId]: true },
        }))
      },
      readConversations: {},
      markConversationRead: (conversationId) =>
        set((s) => ({ readConversations: { ...s.readConversations, [conversationId]: true } })),
      communityMessages: [],
      sendCommunityMessage: (text, image) => {
        const trimmed = text.trim()
        if (!trimmed && !image) return
        const msg: ChatMessage = {
          id: `cmo-${seq++}`,
          authorId: 'me',
          authorName: 'Ви',
          authorAvatar: '',
          time: 'зараз',
          self: true,
          kind: image ? 'image' : 'text',
          text: image ? undefined : trimmed,
          image,
        }
        set((s) => ({ communityMessages: [...s.communityMessages, msg] }))
      },

      // ---- toasts ----
      toasts: [],
      pushToast: (t) => {
        const id = seq++
        set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
        setTimeout(() => get().dismissToast(id), 3200)
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'motomeet-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        lang: s.lang,
        authed: s.authed,
        settings: s.settings,
        savedEvents: s.savedEvents,
        visitedStops: s.visitedStops,
        customRoutes: s.customRoutes,
        threads: s.threads,
        communityMessages: s.communityMessages,
        readConversations: s.readConversations,
      }),
    }
  )
)
