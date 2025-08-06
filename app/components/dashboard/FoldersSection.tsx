import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import FolderCard from './FolderCard'
import ConfirmModal from '~/components/ui/ConfirmModal'

interface Folder {
  id: string
  name: string
  color: string
  created_at: string
  taskCount: number
  noteCount: number
}

interface FoldersSectionProps {
  folders: Folder[]
  username: string
  onCreateFolder: () => void
}

export default function FoldersSection({ folders, username, onCreateFolder }: FoldersSectionProps) {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    folder?: Folder
  }>({
    isOpen: false
  })

  const handleDelete = (folder: Folder) => {
    setDeleteModal({
      isOpen: true,
      folder
    })
  }

  const confirmDelete = () => {
    if (deleteModal.folder) {
      const form = document.createElement('form')
      form.method = 'post'
      form.action = `/folders/${deleteModal.folder.id}/delete?user=${username}`
      document.body.appendChild(form)
      form.submit()
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-4 sm:py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              폴더
            </h3>
            <button
              onClick={onCreateFolder}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              새 폴더
            </button>
          </div>
          
          {folders.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4">
                <FolderIcon className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">폴더가 없습니다</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-4">
                첫 번째 폴더를 만들어서 태스크와 노트를 정리해보세요.
              </p>
              <button
                onClick={onCreateFolder}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full max-w-xs"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                새 폴더 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  username={username}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="폴더 삭제"
        message={`"${deleteModal.folder?.name}" 폴더를 삭제하시겠습니까?\n\n이 폴더 안의 모든 태스크와 노트도 함께 삭제됩니다.`}
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </>
  )
} 