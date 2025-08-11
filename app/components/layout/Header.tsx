import { Link } from '@remix-run/react'
import ThemeToggle from '~/components/ui/ThemeToggle'
import WeatherWidget from '~/components/dashboard/WeatherWidget'

interface HeaderProps {
  username?: string
}

export default function Header({ username }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 네비게이션 */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                TaskFlow
              </span>
            </Link>
            
            {username && (
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  대시보드
                </Link>
                <Link
                  to="/folders"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  폴더
                </Link>
              </nav>
            )}
          </div>

          {/* 우측 영역: 사용자 정보, 날씨, 테마 토글 */}
          <div className="flex items-center space-x-4">
            {/* 날씨 위젯 (컴팩트 모드) */}
            <div className="hidden lg:block">
              <WeatherWidget city="Seoul" compact={true} />
            </div>
            
            {/* 사용자 정보 */}
            {username && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                  {username}
                </span>
              </div>
            )}
            
            {/* 테마 토글 */}
            <ThemeToggle />
            
            {/* 로그아웃 버튼 */}
            {username && (
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  로그아웃
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 