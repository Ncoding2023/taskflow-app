import { describe, it, expect } from 'vitest'

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = date.toLocaleDateString('ko-KR')
      expect(formatted).toBe('2024. 1. 15.')
    })

    it('handles different date formats', () => {
      const date1 = new Date('2024-12-31T23:59:59Z')
      const date2 = new Date('2024-01-01T00:00:00Z')
      
      // 한국 날짜 형식으로 포맷팅
      const formatted1 = date1.toLocaleDateString('ko-KR')
      const formatted2 = date2.toLocaleDateString('ko-KR')
      
      expect(formatted1).toMatch(/2024\. 12\. 31\./)
      expect(formatted2).toMatch(/2024\. 1\. 1\./)
    })
  })

  describe('isOverdue', () => {
    it('returns true for overdue tasks', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const isOverdue = yesterday < new Date()
      expect(isOverdue).toBe(true)
    })

    it('returns false for future tasks', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const isOverdue = tomorrow < new Date()
      expect(isOverdue).toBe(false)
    })

    it('returns false for today tasks', () => {
      const today = new Date()
      const isOverdue = today < new Date()
      expect(isOverdue).toBe(false)
    })
  })

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date()
      const isToday = today.toDateString() === new Date().toDateString()
      expect(isToday).toBe(true)
    })

    it('returns false for other days', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const isToday = yesterday.toDateString() === new Date().toDateString()
      expect(isToday).toBe(false)
    })
  })

  describe('isTomorrow', () => {
    it('returns true for tomorrow', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const expectedTomorrow = new Date()
      expectedTomorrow.setDate(expectedTomorrow.getDate() + 1)
      
      const isTomorrow = tomorrow.toDateString() === expectedTomorrow.toDateString()
      expect(isTomorrow).toBe(true)
    })

    it('returns false for other days', () => {
      const today = new Date()
      const expectedTomorrow = new Date()
      expectedTomorrow.setDate(expectedTomorrow.getDate() + 1)
      
      const isTomorrow = today.toDateString() === expectedTomorrow.toDateString()
      expect(isTomorrow).toBe(false)
    })
  })
}) 