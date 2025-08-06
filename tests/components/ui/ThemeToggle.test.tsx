import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '~/contexts/ThemeContext'
import ThemeToggle from '~/components/ui/ThemeToggle'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Reset localStorage mock
    vi.clearAllMocks()
  })

  it('renders theme toggle button', () => {
    renderWithTheme(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('shows sun icon in light mode', () => {
    renderWithTheme(<ThemeToggle />)
    
    // Initially should show sun icon (light mode)
    const sunIcon = screen.getByTestId('sun-icon')
    expect(sunIcon).toBeInTheDocument()
  })

  it('shows moon icon in dark mode', () => {
    renderWithTheme(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // After click should show moon icon (dark mode)
    const moonIcon = screen.getByTestId('moon-icon')
    expect(moonIcon).toBeInTheDocument()
  })

  it('toggles theme when clicked', () => {
    renderWithTheme(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Initial state (light mode)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    
    // Click to toggle to dark mode
    fireEvent.click(button)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    
    // Click again to toggle back to light mode
    fireEvent.click(button)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<ThemeToggle size="sm" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('w-8', 'h-8')
    
    rerender(<ThemeToggle size="md" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('w-10', 'h-10')
    
    rerender(<ThemeToggle size="lg" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('w-12', 'h-12')
  })

  it('applies custom className', () => {
    renderWithTheme(<ThemeToggle className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('has correct accessibility attributes', () => {
    renderWithTheme(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
  })

  it('shows loading state initially', () => {
    // Mock localStorage to return null (initial state)
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    renderWithTheme(<ThemeToggle />)
    
    // Should show loading state
    const loadingElement = screen.getByRole('button')
    expect(loadingElement).toHaveClass('animate-pulse', 'bg-gray-200')
  })
}) 