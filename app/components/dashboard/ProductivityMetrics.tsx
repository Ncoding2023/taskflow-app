import { ClockIcon, CalendarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface ProductivityMetricsProps {
  averageCompletionTime: number // 평균 완료 시간 (시간)
  tasksCompletedThisWeek: number
  tasksCompletedLastWeek: number
  overdueTasks: number
  upcomingDeadlines: number
}

export default function ProductivityMetrics({
  averageCompletionTime,
  tasksCompletedThisWeek,
  tasksCompletedLastWeek,
  overdueTasks,
  upcomingDeadlines
}: ProductivityMetricsProps) {
  const weeklyChange = tasksCompletedThisWeek - tasksCompletedLastWeek
  const weeklyChangePercent = tasksCompletedLastWeek > 0 
    ? Math.round((weeklyChange / tasksCompletedLastWeek) * 100)
    : 0

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    } else if (change < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    }
    return <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}분`
    if (hours < 24) return `${Math.round(hours)}시간`
    return `${Math.round(hours / 24)}일`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        생산성 지표
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 평균 완료 시간 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTime(averageCompletionTime)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            평균 완료 시간
          </div>
        </div>

        {/* 이번 주 완료 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <CalendarIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {tasksCompletedThisWeek}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            이번 주 완료
          </div>
        </div>
      </div>

      {/* 주간 변화 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            지난 주 대비
          </span>
          <div className="flex items-center space-x-1">
            {getTrendIcon(weeklyChange)}
            <span className={`text-sm font-medium ${getTrendColor(weeklyChange)}`}>
              {weeklyChange > 0 ? '+' : ''}{weeklyChangePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 경고 지표 */}
      <div className="mt-4 space-y-2">
        {overdueTasks > 0 && (
          <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span className="text-sm text-red-700 dark:text-red-300">
              지연된 태스크
            </span>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {overdueTasks}개
            </span>
          </div>
        )}
        
        {upcomingDeadlines > 0 && (
          <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              다가오는 마감일
            </span>
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              {upcomingDeadlines}개
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 