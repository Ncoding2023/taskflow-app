import { FolderIcon, CheckCircleIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link } from '@remix-run/react'
import { useState } from 'react'

interface Folder {
  id: string
  name: string
  color: string
  created_at: string
  taskCount: number
  noteCount: number
}

interface FolderCardProps {
  folder: Folder
  username: string
  onDelete?: (folder: Folder) => void
}

export default function FolderCard({ folder, username, onDelete }: FolderCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: folder.color }}
        >
          <FolderIcon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <Link
            to={`/folders/${folder.id}?user=${username}`}
            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block"
          >
            {folder.name}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(folder.created_at).toLocaleDateString('ko-KR')}
          </p>
          
          {/* 태스크와 노트 개수 */}
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {folder.taskCount}개 태스크
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DocumentTextIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {folder.noteCount}개 노트
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <Link
          to={`/folders/${folder.id}?user=${username}`}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          상세 보기 →
        </Link>
        
        {/* 삭제 버튼 - 호버 시 나타남 */}
        {isHovered && onDelete && (
          <button
            onClick={() => onDelete(folder)}
            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            title="폴더 삭제"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
} 