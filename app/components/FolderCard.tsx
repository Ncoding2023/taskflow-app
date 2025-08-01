import { Link } from '@remix-run/react'
import { FolderIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Card from './ui/Card'
import Button from './ui/Button'

interface Folder {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
  user_id: string
}

interface FolderCardProps {
  folder: Folder
  taskCount?: number
  username?: string
  onEdit?: (folder: Folder) => void
  onDelete?: (folder: Folder) => void
}

const FolderCard = ({ folder, taskCount = 0, username, onEdit, onDelete }: FolderCardProps) => {
  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: folder.color }}
          >
            <FolderIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Link 
              to={username ? `/folders/${folder.id}?user=${username}` : `/folders/${folder.id}`}
              className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block"
            >
              {folder.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {taskCount}개의 태스크
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(folder)}
            className="p-1"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(folder)}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default FolderCard 