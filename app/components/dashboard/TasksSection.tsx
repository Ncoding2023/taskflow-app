import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import TaskItem from './TaskItem'

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

interface TasksSectionProps {
  tasks: Task[]
  folders: Folder[]
  username: string
  onCreateTask: () => void
  onToggleComplete: (taskId: string, completed: boolean) => void
}

export default function TasksSection({ 
  tasks, 
  folders, 
  username, 
  onCreateTask, 
  onToggleComplete 
}: TasksSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          최근 태스크
        </h3>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <CheckCircleIcon className="h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">태스크가 없습니다</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              첫 번째 태스크를 만들어서 작업을 시작해보세요.
            </p>
            <button
              onClick={onCreateTask}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              새 태스크 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                folders={folders}
                username={username}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 