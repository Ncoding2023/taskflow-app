import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { PlusIcon, DocumentTextIcon, FolderIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { supabase } from '~/lib/supabase'
import NoteCard from '~/components/NoteCard'
import Button from '~/components/ui/Button'
import { useToastContext } from '~/contexts/ToastContext'
import { useEffect, useState } from 'react'
import ConfirmModal from '~/components/ui/ConfirmModal'
import NoteModal from '~/components/modals/NoteModal'

export async function loader({ request }: LoaderFunctionArgs) {
  // 세션 확인 (현재는 간단한 방식)
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (!username) {
    return redirect('/auth/login')
  }

  // 사용자 정보 가져오기
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id, username, display_name')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return redirect('/auth/login')
  }

  // 사용자의 노트들 가져오기
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // 사용자의 폴더들 가져오기 (폴더명 매핑용)
  const { data: folders } = await supabase
    .from('folders')
    .select('id, name')
    .eq('user_id', user.id)

  // 노트에 폴더명 추가
  const notesWithFolderNames = (notes || []).map(note => {
    const folder = folders?.find(f => f.id === note.folder_id)
    return {
      ...note,
      folderName: folder?.name
    }
  })

  return json({
    user,
    notes: notesWithFolderNames,
    folders
  })
}

export default function NotesIndex() {
  const { user, notes, folders } = useLoaderData<typeof loader>()
  const { showSuccess, showError, showInfo } = useToastContext()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    note?: any
  }>({
    isOpen: false,
    mode: 'create'
  })

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; note: any | null }>({
    isOpen: false,
    note: null
  })

  const handleCreate = () => {
    setModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  const handleEdit = (note: any) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      note
    })
  }

  const handleDelete = (note: any) => {
    setDeleteModal({ isOpen: true, note })
  }

  const confirmDelete = () => {
    if (deleteModal.note) {
      const form = document.createElement('form')
      form.method = 'post'
      form.action = `/notes/${deleteModal.note.id}/delete?user=${user.username}`
      document.body.appendChild(form)
      form.submit()
      
      showInfo('처리 중', '노트를 삭제하고 있습니다...')
    }
  }

  const recentNotes = notes.slice(0, 5)
  const totalNotes = notes.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to={`/?user=${user.username}`} className="text-gray-500 hover:text-gray-700">
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                노트
              </h1>
            </div>
            <Button onClick={handleCreate}>
              <PlusIcon className="w-4 h-4 mr-2" />
              새 노트
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        전체 노트
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {totalNotes}
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
                    <FolderIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        폴더 수
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {folders.length}
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
                    <CalendarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        최근 노트
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {recentNotes.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <DocumentTextIcon className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">노트가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                첫 번째 노트를 만들어서 아이디어를 기록해보세요.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  새 노트 만들기
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  folderName={note.folderName}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 노트 모달 */}
      <NoteModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        note={modalState.note}
        mode={modalState.mode}
        username={user.username}
        folders={folders}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onConfirm={confirmDelete}
        title="노트 삭제"
        message={`"${deleteModal.note?.title}" 노트를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </div>
  )
} 