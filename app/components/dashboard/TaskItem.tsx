import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Link } from '@remix-run/react'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  folder_id?: string
}

interface Folder {
  id: string
  name: string
}

interface TaskItemProps {
  task: Task
  folders: Folder[]
  username: string
  onToggleComplete: (taskId: string, completed: boolean) => void
}

export default function TaskItem({ task, folders, username, onToggleComplete }: TaskItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      {/* 체크박스 - 태스크 목록과 동일한 스타일 */}
      <button
        onClick={() => onToggleComplete(task.id, !task.completed)}
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
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center space-x-2 mt-2">
          {/* 우선순위 */}
          {task.priority === 'high' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              긴급
            </span>
          )}
          {task.priority === 'medium' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              보통
            </span>
          )}
          {task.priority === 'low' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              낮음
            </span>
          )}
          
          {/* 폴더 */}
          {task.folder_id && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {folders.find(f => f.id === task.folder_id)?.name || 'Unknown'}
            </span>
          )}
          
          {/* 관리 링크 */}
          <Link
            to={`/tasks?user=${username}`}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            관리 →
          </Link>
        </div>
      </div>
    </div>
  )
} 