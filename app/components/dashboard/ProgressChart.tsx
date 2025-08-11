import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface ProgressChartProps {
  completed: number
  total: number
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ProgressChart({ 
  completed, 
  total, 
  title = '진행률',
  size = 'md' 
}: ProgressChartProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return '우수'
    if (percentage >= 60) return '양호'
    if (percentage >= 40) return '보통'
    return '개선 필요'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {completed}/{total}
        </span>
      </div>
      
      <div className="mb-2">
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
          <div 
            className={`${getProgressColor(percentage)} ${sizeClasses[size]} rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {percentage}%
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          percentage >= 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          percentage >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {getStatusText(percentage)}
        </span>
      </div>
    </div>
  )
} 