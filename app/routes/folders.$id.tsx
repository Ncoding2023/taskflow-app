import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { ArrowLeftIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '~/lib/supabase'
import TaskCard from '~/components/TaskCard'
import NoteCard from '~/components/NoteCard'
import Button from '~/components/ui/Button'
import TaskModal from '~/components/modals/TaskModal'
import NoteModal from '~/components/modals/NoteModal'
import ConfirmModal from '~/components/ui/ConfirmModal'
import { useState } from 'react'
import { useToastContext } from '~/contexts/ToastContext'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const folderId = params.id
  
  if (!folderId) {
    return redirect('/folders')
  }

  // 세션 확인
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (!username) {
    return redirect('/auth/login?error=로그인이 필요합니다.')
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

  // 폴더 정보 가져오기
  const { data: folder, error: folderError } = await supabase
    .from('folders')
    .select('*')
    .eq('id', folderId)
    .eq('user_id', user.id)
    .single()

  if (folderError || !folder) {
    return redirect('/folders?error=폴더를 찾을 수 없습니다.')
  }

  // 해당 폴더의 태스크들 가져오기
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('folder_id', folderId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 해당 폴더의 노트들 가져오기
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('folder_id', folderId)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return json({
    user,
    folder,
    tasks: tasks || [],
    notes: notes || []
  })
}

export default function FolderDetail() {
  const { user, folder, tasks, notes } = useLoaderData<typeof loader>()
  const { showSuccess, showError } = useToastContext()
  
  // 로컬 태스크 상태 관리
  const [localTasks, setLocalTasks] = useState(tasks)
  const [taskModalState, setTaskModalState] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; task?: any }>({
    isOpen: false,
    mode: 'create'
  })
  
  // 삭제 확인 모달 상태
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; task?: any; note?: any }>({
    isOpen: false
  })

  // 노트 모달 상태
  const [noteModalState, setNoteModalState] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; note?: any }>({
    isOpen: false,
    mode: 'create'
  })

  const completedTasks = localTasks.filter(task => task.completed)
  const pendingTasks = localTasks.filter(task => !task.completed)

  // 클라이언트 사이드 완료 토글
  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/folders/${folder.id}/tasks/${taskId}/toggle?user=${user.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // 로컬 상태 업데이트
        setLocalTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: !task.completed }
              : task
          )
        )
      } else {
        console.error('태스크 상태 업데이트 실패')
      }
    } catch (error) {
      console.error('태스크 상태 업데이트 중 오류:', error)
    }
  }

  // 태스크 생성 핸들러
  const handleCreateTask = () => {
    setTaskModalState({ isOpen: true, mode: 'create' })
  }

  // 태스크 편집 핸들러
  const handleEditTask = (task: any) => {
    setTaskModalState({ isOpen: true, mode: 'edit', task })
  }

  // 태스크 삭제 확인 핸들러
  const handleDeleteTask = (task: any) => {
    setDeleteModalState({ isOpen: true, task })
  }

  // 노트 생성 핸들러
  const handleCreateNote = () => {
    setNoteModalState({ isOpen: true, mode: 'create' })
  }

  // 노트 편집 핸들러
  const handleEditNote = (note: any) => {
    setNoteModalState({ isOpen: true, mode: 'edit', note })
  }

  // 노트 삭제 확인 핸들러
  const handleDeleteNote = (note: any) => {
    setDeleteModalState({ isOpen: true, note })
  }

  // 실제 삭제 실행 핸들러
  const handleConfirmDelete = async () => {
    const task = deleteModalState.task
    const note = deleteModalState.note

    if (task) {
      try {
        const response = await fetch(`/folders/${folder.id}/tasks/${task.id}/delete?user=${user.username}`, {
          method: 'POST',
        })

        if (response.ok) {
          // 로컬 상태에서 태스크 제거
          setLocalTasks(prevTasks => prevTasks.filter(t => t.id !== task.id))
          showSuccess('성공', '태스크가 삭제되었습니다.')
        } else {
          showError('오류 발생', '태스크 삭제에 실패했습니다.')
        }
      } catch (error) {
        console.error('태스크 삭제 중 오류:', error)
        showError('오류 발생', '태스크 삭제 중 오류가 발생했습니다.')
      }
         } else if (note) {
       try {
         const response = await fetch(`/folders/${folder.id}/notes/${note.id}/delete?user=${user.username}`, {
           method: 'POST',
         })

        if (response.ok) {
          // 페이지 새로고침으로 노트 목록 업데이트
          window.location.reload()
          showSuccess('성공', '노트가 삭제되었습니다.')
        } else {
          showError('오류 발생', '노트 삭제에 실패했습니다.')
        }
      } catch (error) {
        console.error('노트 삭제 중 오류:', error)
        showError('오류 발생', '노트 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/?user=${user.username}`} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: folder.color }}
                >
                  <span className="text-white font-medium text-sm">
                    {folder.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {folder.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: folder.color }}></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        전체 태스크
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {localTasks.length}
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
                    <div className="w-6 h-6 bg-green-600 rounded-full"></div>
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
                    <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
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
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        노트
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {notes.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tasks Section - 태스크 목록과 동일한 UI */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    태스크
                  </h3>
                  <Button
                    onClick={handleCreateTask}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>새 태스크</span>
                  </Button>
                </div>
                
                {localTasks.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    이 폴더에 태스크가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {localTasks.slice(0, 5).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                     노트
                   </h3>
                                       <Button
                      onClick={handleCreateNote}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>새 노트</span>
                    </Button>
                 </div>
                
                                 {notes.length === 0 ? (
                   <p className="text-gray-500 dark:text-gray-400 text-sm">
                     이 폴더에 노트가 없습니다.
                   </p>
                 ) : (
                   <div className="space-y-3">
                     {notes.slice(0, 5).map((note) => (
                       <NoteCard
                         key={note.id}
                         note={note}
                         folderName={folder.name}
                         onEdit={handleEditNote}
                         onDelete={handleDeleteNote}
                       />
                     ))}
                   </div>
                 )}
              </div>
            </div>
                     </div>
         </div>
       </main>

                        {/* 태스크 모달 */}
         <TaskModal
           isOpen={taskModalState.isOpen}
           onClose={() => setTaskModalState({ isOpen: false, mode: 'create' })}
           task={taskModalState.task}
           mode={taskModalState.mode}
           username={user.username}
           folders={[folder]} // 현재 폴더만 전달
         />

         {/* 노트 모달 */}
         <NoteModal
           isOpen={noteModalState.isOpen}
           onClose={() => setNoteModalState({ isOpen: false, mode: 'create' })}
           note={noteModalState.note}
           mode={noteModalState.mode}
           username={user.username}
           folders={[folder]} // 현재 폴더만 전달
         />

         {/* 삭제 확인 모달 */}
         <ConfirmModal
           isOpen={deleteModalState.isOpen}
           onClose={() => setDeleteModalState({ isOpen: false })}
           onConfirm={handleConfirmDelete}
           title={deleteModalState.task ? "🗑️ 태스크 삭제" : "🗑️ 노트 삭제"}
           message={
             deleteModalState.task 
               ? `"${deleteModalState.task.title}" 태스크를 삭제하시겠습니까?`
               : `"${deleteModalState.note?.title}" 노트를 삭제하시겠습니까?`
           }
           confirmText="삭제"
           cancelText="취소"
           type="danger"
         />
      </div>
    )
 } 