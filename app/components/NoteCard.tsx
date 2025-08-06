import { DocumentTextIcon, FolderIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/outline'
import Card from './ui/Card'
import Button from './ui/Button'

interface Note {
  id: string
  title: string
  content?: string
  folder_id?: string
  created_at: string
  updated_at: string
}

interface NoteCardProps {
  note: Note
  folderName?: string
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}

export default function NoteCard({ note, folderName, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <Card 
      className="transition-all duration-200 hover:shadow-md group cursor-pointer" 
      onClick={() => onEdit(note)}
    >
      <div className="flex items-start space-x-3">
        {/* 노트 아이콘 */}
        <div className="flex-shrink-0 mt-1">
          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
        </div>

        {/* 노트 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {note.title}
              </h3>
              {note.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {truncateContent(note.content)}
                </p>
              )}
            </div>

            {/* 삭제 버튼 */}
            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onDelete(note)
                }}
                className="px-2 py-1 text-xs text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center space-x-2 mt-2">
            {/* 폴더 */}
            {folderName && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <FolderIcon className="h-3 w-3 mr-1" />
                {folderName}
              </span>
            )}

            {/* 수정일 */}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {formatDate(note.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
} 