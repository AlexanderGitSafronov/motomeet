import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { FollowButton } from '@/components/ui/FollowButton'
import { Toggle } from '@/components/ui/Toggle'
import { Segmented } from '@/components/ui/Segmented'
import { Composer } from '@/components/chat/Composer'
import { EventCard } from '@/components/cards/EventCard'
import { ClubCard } from '@/components/cards/ClubCard'
import { ConversationRow } from '@/components/cards/ConversationRow'
import { NotificationRow } from '@/components/cards/NotificationRow'
import { events, clubs, conversations, notifications } from '@/data/mock'

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

beforeEach(() => {
  useAppStore.setState({ following: {}, joinedEvents: {}, joinedClubs: {}, toasts: [] })
})

describe('FollowButton', () => {
  it('toggles between Стежити and Ви стежите', () => {
    renderWithRouter(<FollowButton riderId="r-test" riderName="Тестовий Райдер" />)
    const btn = screen.getByRole('button', { name: 'Стежити' })
    fireEvent.click(btn)
    expect(screen.getByRole('button')).toHaveTextContent('Ви стежите')
    expect(useAppStore.getState().following['r-test']).toBe(true)
  })
})

describe('Toggle', () => {
  it('reflects and flips checked state', () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} label="Тест" />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(sw)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})

describe('Segmented', () => {
  it('selects a different option', () => {
    const onChange = vi.fn()
    render(
      <Segmented
        options={[
          { value: 'a', label: 'Альфа' },
          { value: 'b', label: 'Бета' },
        ]}
        value="a"
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByText('Бета'))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})

describe('Composer', () => {
  it('sends a trimmed message and clears the input', () => {
    const onSend = vi.fn()
    render(<Composer onSend={onSend} />)
    const input = screen.getByRole('textbox', { name: 'Повідомлення' }) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Виїжджаю о 8' } })
    fireEvent.click(screen.getByLabelText('Надіслати повідомлення'))
    expect(onSend).toHaveBeenCalledWith('Виїжджаю о 8')
    expect(input.value).toBe('')
  })

  it('does not send empty messages', () => {
    const onSend = vi.fn()
    render(<Composer onSend={onSend} />)
    fireEvent.click(screen.getByLabelText('Надіслати повідомлення'))
    expect(onSend).not.toHaveBeenCalled()
  })
})

describe('EventCard', () => {
  it('renders event details and toggles join', () => {
    renderWithRouter(<EventCard event={events[0]} />)
    expect(screen.getByText(events[0].title)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Піду' }))
    expect(useAppStore.getState().joinedEvents[events[0].id]).toBe(true)
    expect(screen.getByRole('button', { name: 'Іду' })).toBeInTheDocument()
  })
})

describe('ClubCard', () => {
  it('renders club details and toggles join', () => {
    renderWithRouter(<ClubCard club={clubs[0]} />)
    expect(screen.getByText(clubs[0].name)).toBeInTheDocument()
    expect(screen.getByText(/учасників/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Вступити' }))
    expect(screen.getByRole('button', { name: 'Учасник' })).toBeInTheDocument()
  })
})

describe('ConversationRow', () => {
  it('shows the name, preview and unread badge', () => {
    const cv = conversations.find((c) => (c.unread ?? 0) > 0)!
    renderWithRouter(<ConversationRow conversation={cv} />)
    expect(screen.getByText(cv.name)).toBeInTheDocument()
    expect(screen.getByText(String(cv.unread))).toBeInTheDocument()
  })
})

describe('NotificationRow', () => {
  it('renders the notification text', () => {
    renderWithRouter(<NotificationRow notification={notifications[0]} read={false} />)
    expect(screen.getByText(notifications[0].text)).toBeInTheDocument()
  })
})
