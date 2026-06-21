import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import type { ReactElement } from 'react'

// Leaflet doesn't run in jsdom — stub the map everywhere.
vi.mock('@/components/map/LiveMap', () => ({
  LiveMap: () => <div data-testid="live-map" />,
}))

import { useAppStore } from '@/store/useAppStore'
import { AuthScreen } from '@/screens/AuthScreen'
import { MapScreen } from '@/screens/MapScreen'
import { EventsScreen } from '@/screens/EventsScreen'
import { EventPageScreen } from '@/screens/EventPageScreen'
import { CreateEventScreen } from '@/screens/CreateEventScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { MessagesScreen } from '@/screens/MessagesScreen'
import { CommunityChatScreen } from '@/screens/CommunityChatScreen'
import { SearchScreen } from '@/screens/SearchScreen'
import { RoutesScreen } from '@/screens/RoutesScreen'
import { ClubsScreen } from '@/screens/ClubsScreen'
import { NotificationsScreen } from '@/screens/NotificationsScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'

function renderAt(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

beforeEach(() => {
  useAppStore.setState({
    authed: false,
    theme: 'dark',
    following: {},
    joinedEvents: {},
    joinedClubs: {},
    readNotifications: {},
    communityMessages: [],
    threads: {},
    toasts: [],
  })
})

describe('AuthScreen', () => {
  it('renders the brand and logs in on submit', async () => {
    renderAt(<AuthScreen />)
    expect(screen.getByText('Знайди свою команду. Катай разом.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Увійти' }))
    await waitFor(() => expect(useAppStore.getState().authed).toBe(true))
  })
})

describe('MapScreen', () => {
  it('shows the live map and riding-now count', () => {
    renderAt(<MapScreen />)
    expect(screen.getAllByTestId('live-map').length).toBeGreaterThan(0)
    expect(screen.getByText(/райдерів зараз у дорозі/i)).toBeInTheDocument()
  })
})

describe('EventsScreen', () => {
  it('lists events and filters by category', () => {
    renderAt(<EventsScreen />)
    expect(screen.getByRole('heading', { name: 'Події' })).toBeInTheDocument()
    expect(screen.getByText('Альпійське ралі «Грім» 2026')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Трек/ }))
    expect(screen.getByText('Трек-день Гоккенгайм GP')).toBeInTheDocument()
    expect(screen.queryByText('Альпійське ралі «Грім» 2026')).not.toBeInTheDocument()
  })
})

describe('EventPageScreen', () => {
  it('renders the event and joins the ride', () => {
    render(
      <MemoryRouter initialEntries={['/events/e-alpine']}>
        <Routes>
          <Route path="/events/:id" element={<EventPageScreen />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Альпійське ралі «Грім» 2026' })).toBeInTheDocument()
    expect(screen.getByText('Про заїзд')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Долучитися' }))
    expect(useAppStore.getState().joinedEvents['e-alpine']).toBe(true)
    expect(screen.getByRole('button', { name: 'Ви учасник' })).toBeInTheDocument()
  })
})

describe('CreateEventScreen', () => {
  it('renders the form and publishes', () => {
    renderAt(<CreateEventScreen />)
    expect(screen.getByRole('heading', { name: 'Створення події' })).toBeInTheDocument()
    expect(screen.getByLabelText('Назва події')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Опублікувати подію/ }))
    expect(useAppStore.getState().toasts.length).toBeGreaterThan(0)
  })
})

describe('ProfileScreen', () => {
  it('renders identity and stats', () => {
    renderAt(<ProfileScreen />)
    expect(screen.getByRole('heading', { name: 'Маркус Раєр' })).toBeInTheDocument()
    expect(screen.getByText('Підписники')).toBeInTheDocument()
    expect(screen.getByText('Досягнення')).toBeInTheDocument()
  })
})

describe('MessagesScreen', () => {
  it('lists conversations and filters by search', () => {
    renderAt(<MessagesScreen />)
    expect(screen.getByRole('heading', { name: 'Повідомлення' })).toBeInTheDocument()
    expect(screen.getAllByText('Дієго Наварро').length).toBeGreaterThan(0)
    fireEvent.change(screen.getByLabelText('Пошук повідомлень'), { target: { value: 'Софія' } })
    expect(screen.getByText('Софія Маренко')).toBeInTheDocument()
    expect(screen.queryByText('Ганс Бауер')).not.toBeInTheDocument()
  })
})

describe('CommunityChatScreen', () => {
  it('renders the channel and sends a message', () => {
    renderAt(<CommunityChatScreen />)
    expect(screen.getByRole('heading', { name: 'Райдери Мюнхена' })).toBeInTheDocument()
    const input = screen.getByRole('textbox', { name: 'Повідомлення' }) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Привіт, Альпи!' } })
    fireEvent.click(screen.getByLabelText('Надіслати повідомлення'))
    expect(useAppStore.getState().communityMessages).toHaveLength(1)
    expect(screen.getByText('Привіт, Альпи!')).toBeInTheDocument()
  })
})

describe('SearchScreen', () => {
  it('switches result tabs', () => {
    renderAt(<SearchScreen />)
    expect(screen.getByText(/поруч/i)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Очистити пошук'))
    fireEvent.click(screen.getByRole('tab', { name: 'Клуби' }))
    expect(screen.getByText('Залізні Вовки MC')).toBeInTheDocument()
  })
})

describe('RoutesScreen', () => {
  it('renders the active route and stops', () => {
    renderAt(<RoutesScreen />)
    expect(screen.getByRole('heading', { name: 'Маршрути' })).toBeInTheDocument()
    expect(screen.getByText('Недільне коло узбережжям')).toBeInTheDocument()
    expect(screen.getByText('Заплановані зупинки')).toBeInTheDocument()
  })
})

describe('ClubsScreen', () => {
  it('renders clubs and shows a joined club', () => {
    renderAt(<ClubsScreen />)
    expect(screen.getByRole('heading', { name: 'Клуби' })).toBeInTheDocument()
    expect(screen.getByText('Нічні Сови CR')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Учасник' })).toBeInTheDocument()
  })
})

describe('NotificationsScreen', () => {
  it('marks all read', () => {
    renderAt(<NotificationsScreen />)
    expect(screen.getByRole('heading', { name: 'Сповіщення' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Прочитати всі' }))
    expect(useAppStore.getState().readNotifications.__all__).toBe(true)
  })
})

describe('SettingsScreen', () => {
  it('switches the theme to light', () => {
    renderAt(<SettingsScreen />)
    expect(screen.getByRole('heading', { name: 'Налаштування' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Світла тема' }))
    expect(useAppStore.getState().theme).toBe('light')
  })
})
