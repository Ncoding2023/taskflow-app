import { useState, useEffect } from 'react'
import { CloudIcon, SunIcon, BoltIcon } from '@heroicons/react/24/outline'
import { weatherService, type WeatherData } from '~/lib/external-services'

interface WeatherWidgetProps {
  city?: string
  className?: string
  compact?: boolean
}

export default function WeatherWidget({ city = 'Seoul', className = '', compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const weatherData = await weatherService.getWeatherByCity(city)
        setWeather(weatherData)
      } catch (err) {
        setError('날씨 정보를 가져올 수 없습니다.')
        console.error('날씨 정보 가져오기 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  const getWeatherIcon = (description: string) => {
    // description이 undefined일 경우 기본값 제공
    const conditionLower = (description || '').toLowerCase()
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <BoltIcon className="h-4 w-4 text-blue-500" />
    }
    
    if (conditionLower.includes('snow')) {
      return <CloudIcon className="h-4 w-4 text-blue-400" />
    }
    
    if (conditionLower.includes('cloud')) {
      return <CloudIcon className="h-4 w-4 text-gray-500" />
    }
    
    return <SunIcon className="h-4 w-4 text-yellow-500" />
  }

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // 컴팩트 모드 (헤더용)
  if (compact) {
    if (loading) {
      return (
        <div className={`flex items-center space-x-2 ${className}`}>
          <div className="animate-pulse">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )
    }

    if (error || !weather) {
      return (
        <div className={`flex items-center space-x-2 text-gray-400 ${className}`}>
          <CloudIcon className="h-4 w-4" />
          <span className="text-xs">날씨</span>
        </div>
      )
    }

    const priority = weatherService.getWeatherBasedPriority(weather)

    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getWeatherIcon(weather.description)}
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {weather.temperature}°
          </span>
          <span className={`text-xs px-1 py-0.5 rounded-full ${getPriorityColor(priority)}`}>
            {priority === 'high' ? '높음' : priority === 'medium' ? '보통' : '낮음'}
          </span>
        </div>
      </div>
    )
  }

  // 전체 모드 (기존 대시보드용)
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}>
        <div className="text-center">
          <CloudIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            날씨 정보를 불러올 수 없습니다
          </p>
        </div>
      </div>
    )
  }

  const priority = weatherService.getWeatherBasedPriority(weather)
  const recommendation = weatherService.getWeatherRecommendation(weather)

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {city} 날씨
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(priority)}`}>
          {priority === 'high' ? '높음' : priority === 'medium' ? '보통' : '낮음'}
        </span>
      </div>

      <div className="flex items-center space-x-3 mb-3">
        {getWeatherIcon(weather.description)}
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {weather.temperature}°C
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {weather.description}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <div>습도: {weather.humidity}%</div>
        <div>풍속: {weather.windSpeed}m/s</div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 {recommendation}
        </p>
      </div>
    </div>
  )
} 