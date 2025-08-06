import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '~/contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  // 초기화 중이면 로딩 상태 표시
  if (isDarkMode === null) {
    return (
      <div className={`${sizeClasses[size]} ${className} animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg`} />
    )
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${sizeClasses[size]} ${className}`}
      aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <div className="relative">
        {/* 라이트 모드 아이콘 */}
        <SunIcon 
          data-testid="sun-icon"
          className={`absolute inset-0 transition-all duration-300 ${iconSizes[size]} ${
            isDarkMode 
              ? 'text-gray-400 rotate-90 scale-0' 
              : 'text-yellow-500 rotate-0 scale-100'
          }`}
        />
        
        {/* 다크 모드 아이콘 */}
        <MoonIcon 
          data-testid="moon-icon"
          className={`absolute inset-0 transition-all duration-300 ${iconSizes[size]} ${
            isDarkMode 
              ? 'text-blue-400 rotate-0 scale-100' 
              : 'text-gray-400 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  )
} 