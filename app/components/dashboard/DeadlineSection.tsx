import { useState } from 'react'
import { CalendarIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useToastContext } from '~/contexts/ToastContext'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  folder_id?: string
  created_at: string
  updated_at: string
}

interface Folder {
  id: string
  name: string
  color: string
}

interface DeadlineSectionProps {
  tasks: Task[]
  folders: Folder[]
  username: string
  onToggleComplete: (taskId: string, completed: boolean) => void
  onEditTask: (task: Task) => void
}

export default function DeadlineSection({ 
  tasks, 
  folders, 
  username, 
  onToggleComplete, 
  onEditTask 
}: DeadlineSectionProps) {
  const [sortBy, setSortBy] = useState<'due_date' | 'priority' | 'created_at'>('due_date')
  const [filterCompleted, setFilterCompleted] = useState(false)
  const { showSuccess, showError } = useToastContext()

  // 마감일별로 태스크 분류
  const categorizeTasks = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const overdue = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < today && 
      !task.completed
    )

    const todayTasks = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date).toDateString() === today.toDateString() &&
      !task.completed
    )

    const tomorrowTasks = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date).toDateString() === tomorrow.toDateString() &&
      !task.completed
    )

    const thisWeek = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) > tomorrow &&
      new Date(task.due_date) <= nextWeek &&
      !task.completed
    )

    const later = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) > nextWeek &&
      !task.completed
    )

    const noDeadline = tasks.filter(task => 
      !task.due_date && !task.completed
    )

    return { overdue, todayTasks, tomorrowTasks, thisWeek, later, noDeadline }
  }

  const { overdue, todayTasks, tomorrowTasks, thisWeek, later, noDeadline } = categorizeTasks()

  const getFolderName = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    return folder?.name || '알 수 없음'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const renderTaskList = (tasks: Task[], title: string, IconComponent: any, color: string) => {
    if (tasks.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title} ({tasks.length})
          </h3>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                task.completed 
                  ? 'bg-gray-50 dark:bg-gray-800 opacity-75' 
                  : 'bg-white dark:bg-gray-700'
              }`}
              onClick={() => onEditTask(task)}
            >
              <div className="flex items-start space-x-3">
                                 <button
                   onClick={(e) => {
                     e.stopPropagation()
                     onToggleComplete(task.id, !task.completed)
                   }}
                   className={`flex-shrink-0 mt-1 p-1 rounded-full transition-colors ${
                     task.completed
                       ? 'bg-green-500 text-white'
                       : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                   }`}
                 >
                   <CheckCircleIcon className="h-4 w-4" />
                 </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      task.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className={`mt-1 text-sm ${
                      task.completed 
                        ? 'line-through text-gray-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      📁 {getFolderName(task.folder_id || '')}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        📅 {new Date(task.due_date).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          마감일별 태스크
        </h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              완료된 태스크 숨기기
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-6">
        {/* 지연된 태스크 */}
        {renderTaskList(
          overdue, 
          '지연된 태스크', 
          ExclamationTriangleIcon, 
          'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
        )}

        {/* 오늘 마감 */}
        {renderTaskList(
          todayTasks, 
          '오늘 마감', 
          CalendarIcon, 
          'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
        )}

        {/* 내일 마감 */}
        {renderTaskList(
          tomorrowTasks, 
          '내일 마감', 
          ClockIcon, 
          'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
        )}

        {/* 이번 주 */}
        {renderTaskList(
          thisWeek, 
          '이번 주', 
          CalendarIcon, 
          'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
        )}

        {/* 나중에 */}
        {renderTaskList(
          later, 
          '나중에', 
          ClockIcon, 
          'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
        )}

        {/* 마감일 없음 */}
        {renderTaskList(
          noDeadline, 
          '마감일 없음', 
          ClockIcon, 
          'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
        )}
      </div>
    </div>
  )
} 