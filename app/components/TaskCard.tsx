import { useState } from 'react'
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'
import Card from './ui/Card'
import Button from './ui/Button'

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

interface TaskCardProps {
  task: Task
  folderName?: string
  onToggleComplete: (taskId: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityConfig = {
  low: {
    icon: ClockIcon,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: '낮음'
  },
  medium: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: '보통'
  },
  high: {
    icon: ExclamationTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: '높음'
  }
}

export default function TaskCard({ task, folderName, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const priority = priorityConfig[task.priority]
  const PriorityIcon = priority.icon



  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
        task.completed ? 'opacity-75' : ''
      } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start space-x-3">
        {/* 체크박스 */}
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

        {/* 태스크 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-sm ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {/* 삭제 버튼 */}
            {isHovered && (
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    onDelete(task)
                  }}
                  className="px-2 py-1 text-xs text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center space-x-2 mt-2">
            {/* 우선순위 */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color}`}>
              <PriorityIcon className="h-3 w-3 mr-1" />
              {priority.label}
            </span>

            {/* 폴더 */}
            {folderName && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {folderName}
              </span>
            )}

            {/* 마감일 */}
            {task.due_date && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isOverdue 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {formatDate(task.due_date)}
                {isOverdue && ' (지연)'}
              </span>
            )}
          </div>
                 </div>
       </div>
     </div>
   )
 } 