import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface QuickActionsProps {
  onCreateFolder: () => void
}

export default function QuickActions({ 
  onCreateFolder
}: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 sm:mb-8">
      <div className="px-4 py-4 sm:py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          빠른 작업
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {/* 새 폴더만 표시 - 가장 중요한 액션 */}
          <button
            onClick={onCreateFolder}
            className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            새 폴더 만들기
          </button>
        </div>
        
        <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>팁:</strong> 폴더를 만든 후 해당 폴더에서 태스크와 노트를 생성할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
} 