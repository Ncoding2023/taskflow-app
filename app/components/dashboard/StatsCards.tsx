import { CheckCircleIcon, ClockIcon, FolderIcon } from '@heroicons/react/24/outline'

interface StatsCardsProps {
  completedTasks: number
  pendingTasks: number
  foldersCount: number
  highPriorityTasks: number
}

export default function StatsCards({ 
  completedTasks, 
  pendingTasks, 
  foldersCount, 
  highPriorityTasks 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  완료된 태스크
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {completedTasks}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  대기 중인 태스크
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {pendingTasks}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  폴더
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {foldersCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 bg-red-600 rounded-full"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  긴급 태스크
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {highPriorityTasks}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 