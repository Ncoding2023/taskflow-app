import { PlusIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Link } from '@remix-run/react'

interface QuickActionsProps {
  username: string
  onCreateTask: () => void
  onCreateFolder: () => void
  onCreateNote: () => void
}

export default function QuickActions({ 
  username, 
  onCreateTask, 
  onCreateFolder, 
  onCreateNote 
}: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          빠른 작업
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 주요 액션 - 더 큰 버튼 */}
          <button
            onClick={onCreateTask}
            className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            새 태스크
          </button>
          
          <button
            onClick={onCreateFolder}
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            새 폴더
          </button>
          
          <button
            onClick={onCreateNote}
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            새 노트
          </button>
          
          <Link
            to={`/tasks?user=${username}`}
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            태스크 관리
          </Link>
        </div>
        
        {/* 보조 액션 - 작은 버튼들 */}
        <div className="mt-4 flex space-x-3">
          <Link
            to={`/notes?user=${username}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            노트 목록
          </Link>
        </div>
      </div>
    </div>
  )
} 