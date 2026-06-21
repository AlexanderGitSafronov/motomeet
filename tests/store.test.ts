import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/store/useAppStore'

const reset = () =>
  useAppStore.setState({
    theme: 'dark',
    authed: false,
    following: {},
    joinedEvents: {},
    joinedClubs: {},
    readNotifications: {},
    threads: {},
    communityMessages: [],
    toasts: [],
    settings: {
      ghostMode: false,
      showDistance: true,
      eventReminders: true,
      nearbyRiders: true,
      pushNotifications: true,
    },
  })

beforeEach(reset)

describe('auth', () => {
  it('signs in (offline demo fallback) and out', async () => {
    expect(useAppStore.getState().authed).toBe(false)
    await useAppStore.getState().signIn('markus@motomeet.cc', 'ridetogether')
    expect(useAppStore.getState().authed).toBe(true)
    useAppStore.getState().logout()
    expect(useAppStore.getState().authed).toBe(false)
  })
})

describe('theme', () => {
  it('toggles between dark and light', () => {
    expect(useAppStore.getState().theme).toBe('dark')
    useAppStore.getState().toggleTheme()
    expect(useAppStore.getState().theme).toBe('light')
    useAppStore.getState().setTheme('dark')
    expect(useAppStore.getState().theme).toBe('dark')
  })
})

describe('social graph', () => {
  it('toggles follow and returns the new state', () => {
    const s = useAppStore.getState()
    expect(s.following['r-diego']).toBeUndefined()
    expect(s.toggleFollow('r-diego')).toBe(true)
    expect(useAppStore.getState().following['r-diego']).toBe(true)
    expect(useAppStore.getState().toggleFollow('r-diego')).toBe(false)
  })

  it('toggles event join', () => {
    expect(useAppStore.getState().toggleEventJoin('e-alpine')).toBe(true)
    expect(useAppStore.getState().joinedEvents['e-alpine']).toBe(true)
    expect(useAppStore.getState().toggleEventJoin('e-alpine')).toBe(false)
  })

  it('toggles club join', () => {
    expect(useAppStore.getState().toggleClubJoin('c-alpine')).toBe(true)
    expect(useAppStore.getState().toggleClubJoin('c-alpine')).toBe(false)
  })
})

describe('settings', () => {
  it('toggles a setting flag', () => {
    expect(useAppStore.getState().settings.ghostMode).toBe(false)
    useAppStore.getState().toggleSetting('ghostMode')
    expect(useAppStore.getState().settings.ghostMode).toBe(true)
  })
})

describe('notifications', () => {
  it('counts unread and marks all read', () => {
    const ids = ['n-1', 'n-2', 'n-3']
    expect(useAppStore.getState().unreadNotificationCount(ids)).toBe(3)
    useAppStore.getState().markNotificationRead('n-1')
    expect(useAppStore.getState().unreadNotificationCount(ids)).toBe(2)
    useAppStore.getState().markAllNotificationsRead()
    expect(useAppStore.getState().unreadNotificationCount(ids)).toBe(0)
  })
})

describe('messaging', () => {
  it('appends sent direct messages to the right thread', () => {
    useAppStore.getState().sendMessage('cv-lena', 'See you at 8!')
    const thread = useAppStore.getState().threads['cv-lena']
    expect(thread).toHaveLength(1)
    expect(thread[0]).toMatchObject({ text: 'See you at 8!', self: true, kind: 'text' })
  })

  it('ignores empty messages', () => {
    useAppStore.getState().sendMessage('cv-lena', '   ')
    expect(useAppStore.getState().threads['cv-lena']).toBeUndefined()
  })

  it('appends community messages', () => {
    useAppStore.getState().sendCommunityMessage('Count me in!')
    expect(useAppStore.getState().communityMessages).toHaveLength(1)
  })
})

describe('toasts', () => {
  it('pushes a toast with an incrementing id', () => {
    useAppStore.getState().pushToast({ title: 'Hello' })
    const toasts = useAppStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Hello')
  })
})
