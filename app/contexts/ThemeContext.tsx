import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)

  // 초기 테마 설정 (로컬 스토리지 + 시스템 설정)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      // 로컬 스토리지에 저장된 테마가 있으면 사용
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // 시스템 설정 감지
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  // 테마 변경 시 HTML 클래스 및 로컬 스토리지 업데이트
  useEffect(() => {
    if (isDarkMode === null) return // 초기화 중이면 아무것도 하지 않음
    
    const root = window.document.documentElement
    
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 로컬 스토리지에 저장된 테마가 없을 때만 시스템 설정 따름
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 