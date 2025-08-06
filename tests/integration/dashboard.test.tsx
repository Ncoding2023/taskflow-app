import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '~/contexts/ThemeContext'
import { ToastProvider } from '~/contexts/ToastContext'
import StatsCards from '~/components/dashboard/StatsCards'
import QuickActions from '~/components/dashboard/QuickActions'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Components Integration', () => {
  it('renders stats cards correctly', () => {
    const statsProps = {
      completedTasks: 5,
      pendingTasks: 10,
      foldersCount: 3,
      highPriorityTasks: 2,
    }
    
    render(<StatsCards {...statsProps} />)
    
    expect(screen.getByText('완료된 태스크')).toBeInTheDocument()
    expect(screen.getByText('대기 중인 태스크')).toBeInTheDocument()
    expect(screen.getByText('폴더')).toBeInTheDocument()
    expect(screen.getByText('긴급 태스크')).toBeInTheDocument()
  })

  it('renders quick actions correctly', () => {
    const mockOnCreateFolder = vi.fn()
    renderWithProviders(<QuickActions onCreateFolder={mockOnCreateFolder} />)
    
    expect(screen.getByText('빠른 작업')).toBeInTheDocument()
    expect(screen.getByText('새 폴더 만들기')).toBeInTheDocument()
    expect(screen.getByText(/폴더를 만든 후/)).toBeInTheDocument()
  })

  it('has responsive layout classes', () => {
    const statsProps = {
      completedTasks: 5,
      pendingTasks: 10,
      foldersCount: 3,
      highPriorityTasks: 2,
    }
    
    render(<StatsCards {...statsProps} />)
    
    const container = screen.getByText('완료된 태스크').closest('div')?.parentElement?.parentElement
    expect(container).toHaveClass('grid', 'grid-cols-2', 'lg:grid-cols-4')
  })
}) 