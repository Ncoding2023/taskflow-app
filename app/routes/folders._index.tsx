import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { PlusIcon } from '@heroicons/react/24/outline'
import { supabase } from '~/lib/supabase'
import FolderCard from '~/components/FolderCard'
import Button from '~/components/ui/Button'
import { useToastContext } from '~/contexts/ToastContext'
import { useEffect, useState } from 'react'
import ConfirmModal from '~/components/ui/ConfirmModal'

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

  // 사용자의 폴더들 가져오기
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 각 폴더의 태스크 개수 가져오기
  const foldersWithTaskCount = await Promise.all(
    (folders || []).map(async (folder) => {
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('folder_id', folder.id)
      
      return {
        ...folder,
        taskCount: count || 0
      }
    })
  )

  return json({
    user,
    folders: foldersWithTaskCount,
  })
}

export default function FoldersIndex() {
  const { user, folders } = useLoaderData<typeof loader>()
  const { showSuccess, showError, showInfo } = useToastContext()
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; folder: any | null }>({
    isOpen: false,
    folder: null
  })

  // URL 파라미터에서 성공 메시지 확인
  useEffect(() => {
    const url = new URL(window.location.href)
    const success = url.searchParams.get('success')
    const message = url.searchParams.get('message')
    
    if (success === 'true' && message) {
      showSuccess('성공', decodeURIComponent(message))
      // URL에서 파라미터 제거
      url.searchParams.delete('success')
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url.toString())
    }
  }, [showSuccess])

  const handleEdit = (folder: any) => {
    // 편집 페이지로 이동
    window.location.href = `/folders/${folder.id}/edit?user=${user.username}`
  }

  const handleDelete = (folder: any) => {
    setDeleteModal({ isOpen: true, folder })
  }

  const confirmDelete = () => {
    if (deleteModal.folder) {
      // 폴더 삭제 액션 호출
      const form = document.createElement('form')
      form.method = 'post'
      form.action = `/folders/${deleteModal.folder.id}/delete?user=${user.username}`
      document.body.appendChild(form)
      form.submit()
      
      // 삭제 진행 중 토스트 표시
      showInfo('처리 중', '폴더를 삭제하고 있습니다...')
    }
  }

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
                폴더
              </h1>
            </div>
            <Button href={`/folders/new?user=${user.username}`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              새 폴더
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {folders.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">폴더가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                첫 번째 폴더를 만들어서 태스크와 노트를 정리해보세요.
              </p>
              <div className="mt-6">
                <Button href={`/folders/new?user=${user.username}`}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  새 폴더 만들기
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  taskCount={folder.taskCount}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, folder: null })}
        onConfirm={confirmDelete}
        title="폴더 삭제"
        message={`"${deleteModal.folder?.name}" 폴더를 삭제하시겠습니까?\n\n이 폴더 안의 모든 태스크와 노트도 함께 삭제됩니다.`}
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </div>
  )
} 