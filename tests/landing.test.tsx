import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Landing } from '@/screens/landing/Landing'

describe('Landing', () => {
  it('renders the hero, feature and CTA sections', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /КАТАЙ ПО СВІТУ/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ОДИН ЗАСТОСУНОК ДЛЯ ВСЬОГО ЗАЇЗДУ' })).toBeInTheDocument()
    expect(screen.getByText('Жива карта райдерів')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'РАЙДЕРИ ГОВОРЯТЬ' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Завантажити застосунок' })).toBeInTheDocument()
  })

  it('links download buttons to /auth', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    const appStore = screen.getAllByRole('link', { name: /App Store/i })[0]
    expect(appStore).toHaveAttribute('href', '/auth')
  })
})
