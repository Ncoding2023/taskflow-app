import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import FolderCard from '~/components/dashboard/FolderCard'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('FolderCard Component', () => {
  const mockFolder = {
    id: '1',
    name: 'Test Folder',
    color: '#3B82F6',
    created_at: '2024-01-01T00:00:00Z',
    taskCount: 5,
    noteCount: 3,
  }

  const defaultProps = {
    folder: mockFolder,
    username: 'testuser',
    onDelete: vi.fn(),
  }

  it('renders folder information correctly', () => {
    renderWithRouter(<FolderCard {...defaultProps} />)
    
    expect(screen.getByText('Test Folder')).toBeInTheDocument()
    expect(screen.getByText('5개')).toBeInTheDocument()
    expect(screen.getByText('3개')).toBeInTheDocument()
    expect(screen.getByText('상세 보기 →')).toBeInTheDocument()
  })

  it('displays formatted date', () => {
    renderWithRouter(<FolderCard {...defaultProps} />)
    
    // 한국 날짜 형식으로 표시되는지 확인
    const dateElement = screen.getByText(/2024\. 1\. 1\./)
    expect(dateElement).toBeInTheDocument()
  })

  it('renders folder icon with correct color', () => {
    renderWithRouter(<FolderCard {...defaultProps} />)
    
    const iconContainer = screen.getByText('Test Folder').closest('div')?.previousElementSibling
    expect(iconContainer).toHaveStyle({ backgroundColor: '#3B82F6' })
  })

  it('has correct link to folder detail', () => {
    renderWithRouter(<FolderCard {...defaultProps} />)
    
    const link = screen.getByRole('link', { name: /test folder/i })
    expect(link).toHaveAttribute('href', '/folders/1?user=testuser')
  })

  it('shows delete button on hover', () => {
    renderWithRouter(<FolderCard {...defaultProps} />)
    
    const card = screen.getByText('Test Folder').closest('div')?.parentElement?.parentElement
    expect(card).toBeInTheDocument()
    
    if (card) {
      fireEvent.mouseEnter(card)
      
      // delete button should be visible after hover
      const deleteButton = screen.getByTitle('폴더 삭제')
      expect(deleteButton).toBeInTheDocument()
    }
  })

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = vi.fn()
    renderWithRouter(<FolderCard {...defaultProps} onDelete={mockOnDelete} />)
    
    const card = screen.getByText('Test Folder').closest('div')?.parentElement?.parentElement
    if (card) {
      fireEvent.mouseEnter(card)
      
      const deleteButton = screen.getByTitle('폴더 삭제')
      fireEvent.click(deleteButton)
      
      expect(mockOnDelete).toHaveBeenCalledWith(mockFolder)
    }
  })

  it('renders with zero counts', () => {
    const folderWithZeroCounts = {
      ...mockFolder,
      taskCount: 0,
      noteCount: 0,
    }
    
    renderWithRouter(<FolderCard {...defaultProps} folder={folderWithZeroCounts} />)
    
    const zeroElements = screen.getAllByText('0개')
    expect(zeroElements).toHaveLength(2)
  })

  it('renders with large counts', () => {
    const folderWithLargeCounts = {
      ...mockFolder,
      taskCount: 999,
      noteCount: 1000,
    }
    
    renderWithRouter(<FolderCard {...defaultProps} folder={folderWithLargeCounts} />)
    
    expect(screen.getByText('999개')).toBeInTheDocument()
    expect(screen.getByText('1000개')).toBeInTheDocument()
  })

  it('has correct responsive classes', () => {
    renderWithRouter(<FolderCard {...defaultProps} />)
    
    const card = screen.getByText('Test Folder').closest('div')?.parentElement?.parentElement
    expect(card).toHaveClass('p-3', 'sm:p-4', 'border', 'rounded-lg')
  })
}) 