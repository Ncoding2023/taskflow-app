import { ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface PriorityChartProps {
  high: number
  medium: number
  low: number
}

export default function PriorityChart({ high, medium, low }: PriorityChartProps) {
  const total = high + medium + low
  
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      case 'medium':
        return <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <InformationCircleIcon className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return '높음'
      case 'medium':
        return '보통'
      case 'low':
        return '낮음'
      default:
        return ''
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        우선순위별 분포
      </h3>
      
      <div className="space-y-3">
        {/* 높은 우선순위 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPriorityIcon('high')}
            <span className="text-sm text-gray-700 dark:text-gray-300">높음</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(high)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem]">
              {high}
            </span>
          </div>
        </div>

        {/* 보통 우선순위 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPriorityIcon('medium')}
            <span className="text-sm text-gray-700 dark:text-gray-300">보통</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(medium)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem]">
              {medium}
            </span>
          </div>
        </div>

        {/* 낮은 우선순위 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPriorityIcon('low')}
            <span className="text-sm text-gray-700 dark:text-gray-300">낮음</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(low)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem]">
              {low}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>총 {total}개 태스크</span>
          <span>우선순위 분포</span>
        </div>
      </div>
    </div>
  )
} 