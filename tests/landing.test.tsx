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
    expect(screen.getByRole('heading', { name: /RIDE THE WORLD/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ONE APP FOR THE WHOLE RIDE' })).toBeInTheDocument()
    expect(screen.getByText('Live rider map')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'RIDERS ARE TALKING' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get the app' })).toBeInTheDocument()
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
