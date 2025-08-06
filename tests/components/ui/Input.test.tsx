import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '~/components/ui/Input'

describe('Input Component', () => {
  it('renders input with default props', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('block', 'w-full', 'rounded-md')
  })

  it('renders input with label', () => {
    render(<Input label="Test Label" />)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('block', 'text-sm', 'font-medium')
  })

  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text here" />)
    
    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toBeInTheDocument()
  })

  it('renders input with error state', () => {
    render(<Input error="This field is required" />)
    
    const input = screen.getByRole('textbox')
    const errorMessage = screen.getByText('This field is required')
    
    expect(input).toHaveClass('border-red-300', 'focus:border-red-500')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-600', 'text-sm')
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test value')
    
    expect(input).toHaveValue('test value')
  })

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'a')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('bg-gray-50', 'text-gray-500', 'cursor-not-allowed')
  })

  it('renders required input', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })
}) 