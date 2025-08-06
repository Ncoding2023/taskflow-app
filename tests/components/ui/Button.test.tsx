import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Button from '~/components/ui/Button'

// Wrapper for components that need Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Button Component', () => {
  it('renders button with default props', () => {
    renderWithRouter(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('renders button with custom variant', () => {
    renderWithRouter(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button', { name: /secondary button/i })
    expect(button).toHaveClass('text-gray-700', 'bg-white', 'border', 'border-gray-300')
  })

  it('renders button with custom size', () => {
    renderWithRouter(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button', { name: /large button/i })
    expect(button).toHaveClass('px-6', 'py-3', 'text-base')
  })

  it('renders disabled button', () => {
    renderWithRouter(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:bg-blue-400')
  })

  it('renders link button', () => {
    renderWithRouter(<Button href="/test">Link Button</Button>)
    
    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    renderWithRouter(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    await button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with custom className', () => {
    renderWithRouter(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button', { name: /custom button/i })
    expect(button).toHaveClass('custom-class')
  })
}) 