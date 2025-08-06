import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsCards from '~/components/dashboard/StatsCards'

describe('StatsCards Component', () => {
  const defaultProps = {
    completedTasks: 5,
    pendingTasks: 10,
    foldersCount: 3,
    highPriorityTasks: 2,
  }

  it('renders all four stat cards', () => {
    render(<StatsCards {...defaultProps} />)
    
    expect(screen.getByText('완료된 태스크')).toBeInTheDocument()
    expect(screen.getByText('대기 중인 태스크')).toBeInTheDocument()
    expect(screen.getByText('폴더')).toBeInTheDocument()
    expect(screen.getByText('긴급 태스크')).toBeInTheDocument()
  })

  it('displays correct values', () => {
    render(<StatsCards {...defaultProps} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders with zero values', () => {
    const zeroProps = {
      completedTasks: 0,
      pendingTasks: 0,
      foldersCount: 0,
      highPriorityTasks: 0,
    }
    
    render(<StatsCards {...zeroProps} />)
    
    const zeroElements = screen.getAllByText('0')
    expect(zeroElements).toHaveLength(4)
  })

  it('renders with large values', () => {
    const largeProps = {
      completedTasks: 999,
      pendingTasks: 1000,
      foldersCount: 50,
      highPriorityTasks: 25,
    }
    
    render(<StatsCards {...largeProps} />)
    
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('has correct responsive classes', () => {
    render(<StatsCards {...defaultProps} />)
    
    const container = screen.getByText('완료된 태스크').closest('div')?.parentElement?.parentElement?.parentElement
    expect(container).toHaveClass('grid', 'grid-cols-2', 'lg:grid-cols-4')
  })

  it('has correct card styling', () => {
    render(<StatsCards {...defaultProps} />)
    
    const cards = screen.getAllByText(/완료된 태스크|대기 중인 태스크|폴더|긴급 태스크/)
    cards.forEach(card => {
      const cardContainer = card.closest('div')?.parentElement?.parentElement?.parentElement
      expect(cardContainer).toHaveClass('bg-white', 'dark:bg-gray-800', 'shadow', 'rounded-lg')
    })
  })
}) 