import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { PlusIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { supabase } from '~/lib/supabase'
import TaskCard from '~/components/TaskCard'
import Button from '~/components/ui/Button'
import { useToastContext } from '~/contexts/ToastContext'
import { useEffect, useState } from 'react'
import ConfirmModal from '~/components/ui/ConfirmModal'
import TaskModal from '~/components/modals/TaskModal'

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

  // 사용자의 태스크들 가져오기
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 사용자의 폴더들 가져오기 (폴더명 매핑용)
  const { data: folders } = await supabase
    .from('folders')
    .select('id, name')
    .eq('user_id', user.id)

  // 태스크에 폴더명 추가
  const tasksWithFolderNames = (tasks || []).map(task => {
    const folder = folders?.find(f => f.id === task.folder_id)
    return {
      ...task,
      folderName: folder?.name
    }
  })

  return json({
    user,
    tasks: tasksWithFolderNames,
    folders
  })
}

export default function TasksIndex() {
  const { user, tasks, folders } = useLoaderData<typeof loader>()
  const { showSuccess, showError, showInfo } = useToastContext()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    task?: any
  }>({
    isOpen: false,
    mode: 'create'
  })

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; task: any | null }>({
    isOpen: false,
    task: null
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

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/tasks/${taskId}/toggle?user=${user.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed })
      })

      if (response.ok) {
        // 페이지 새로고침으로 상태 업데이트
        window.location.reload()
      } else {
        showError('오류 발생', '태스크 상태 변경에 실패했습니다.')
      }
    } catch (error) {
      showError('오류 발생', '태스크 상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleCreate = () => {
    setModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  const handleEdit = (task: any) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      task
    })
  }

  const handleDelete = (task: any) => {
    setDeleteModal({ isOpen: true, task })
  }

  const confirmDelete = () => {
    if (deleteModal.task) {
      const form = document.createElement('form')
      form.method = 'post'
      form.action = `/tasks/${deleteModal.task.id}/delete?user=${user.username}`
      document.body.appendChild(form)
      form.submit()
      
      showInfo('처리 중', '태스크를 삭제하고 있습니다...')
    }
  }

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed)

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
                태스크
              </h1>
            </div>
            <Button onClick={handleCreate}>
              <PlusIcon className="w-4 h-4 mr-2" />
              새 태스크
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        전체 태스크
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {tasks.length}
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
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        완료된 태스크
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {completedTasks.length}
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
                        {pendingTasks.length}
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
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        긴급 태스크
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {highPriorityTasks.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">태스크가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                첫 번째 태스크를 만들어서 작업을 시작해보세요.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  새 태스크 만들기
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  folderName={task.folderName}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 태스크 모달 */}
      <TaskModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        task={modalState.task}
        mode={modalState.mode}
        username={user.username}
        folders={folders}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, task: null })}
        onConfirm={confirmDelete}
        title="태스크 삭제"
        message={`"${deleteModal.task?.title}" 태스크를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </div>
  )
} 