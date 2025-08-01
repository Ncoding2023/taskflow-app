import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'
import { useState, useEffect } from 'react'
import TaskModal from '~/components/modals/TaskModal'
import FolderModal from '~/components/modals/FolderModal'
import NoteModal from '~/components/modals/NoteModal'
import StatsCards from '~/components/dashboard/StatsCards'
import QuickActions from '~/components/dashboard/QuickActions'
import FoldersSection from '~/components/dashboard/FoldersSection'
import TasksSection from '~/components/dashboard/TasksSection'
import { useToastContext } from '~/contexts/ToastContext'

export async function loader({ request }: LoaderFunctionArgs) {
  // 세션 확인 (현재는 간단한 방식)
  // TODO: 실제 세션 관리 구현 필요
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

  // 사용자의 태스크들 가져오기
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 각 폴더의 태스크와 노트 개수 가져오기
  const foldersWithCounts = await Promise.all(
    (folders || []).map(async (folder) => {
      // 태스크 개수
      const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('folder_id', folder.id)
      
      // 노트 개수
      const { count: noteCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('folder_id', folder.id)
      
      return {
        ...folder,
        taskCount: taskCount || 0,
        noteCount: noteCount || 0
      }
    })
  )

  return json({
    user,
    folders: foldersWithCounts,
    tasks: tasks || [],
  })
}

export default function Dashboard() {
  const { user, folders, tasks } = useLoaderData<typeof loader>()
  const { showSuccess, showError } = useToastContext()
  const [taskModalState, setTaskModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    task?: any
  }>({
    isOpen: false,
    mode: 'create'
  })

  const [folderModalState, setFolderModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    folder?: any
  }>({
    isOpen: false,
    mode: 'create'
  })

  const [noteModalState, setNoteModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    note?: any
  }>({
    isOpen: false,
    mode: 'create'
  })

  // 로컬 태스크 상태 관리
  const [localTasks, setLocalTasks] = useState(tasks)

  const completedTasks = localTasks.filter(task => task.completed)
  const pendingTasks = localTasks.filter(task => !task.completed)
  const highPriorityTasks = localTasks.filter(task => task.priority === 'high' && !task.completed)

  // URL 파라미터에서 성공/에러 메시지 확인
  useEffect(() => {
    const url = new URL(window.location.href)
    const success = url.searchParams.get('success')
    const message = url.searchParams.get('message')
    const error = url.searchParams.get('error')
    
    if (success === 'true' && message) {
      showSuccess('성공', decodeURIComponent(message))
      // URL에서 파라미터 제거
      url.searchParams.delete('success')
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url.toString())
    }
    
    if (error) {
      showError('오류', decodeURIComponent(error))
      // URL에서 파라미터 제거
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [showSuccess, showError])

  const handleCreateTask = () => {
    setTaskModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  const handleCreateFolder = () => {
    setFolderModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  const handleCreateNote = () => {
    setNoteModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  // 클라이언트 사이드 완료 토글
  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/tasks/${taskId}/toggle?user=${user.username}`, {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                TaskFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.display_name}
              </span>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <StatsCards
            completedTasks={completedTasks.length}
            pendingTasks={pendingTasks.length}
            foldersCount={folders.length}
            highPriorityTasks={highPriorityTasks.length}
          />

          {/* Quick Actions */}
          <QuickActions
            username={user.username}
            onCreateTask={handleCreateTask}
            onCreateFolder={handleCreateFolder}
            onCreateNote={handleCreateNote}
          />

          {/* Content Grid - 폴더와 태스크를 세로로 배치 */}
          <div className="space-y-8">
            {/* Folders Section */}
            <FoldersSection
              folders={folders}
              username={user.username}
              onCreateFolder={handleCreateFolder}
            />

            {/* Tasks Section */}
            <TasksSection
              tasks={localTasks}
              folders={folders}
              username={user.username}
              onCreateTask={handleCreateTask}
              onToggleComplete={handleToggleComplete}
            />
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
        folders={folders}
      />

      {/* 폴더 모달 */}
      <FolderModal
        isOpen={folderModalState.isOpen}
        onClose={() => setFolderModalState({ isOpen: false, mode: 'create' })}
        folder={folderModalState.folder}
        mode={folderModalState.mode}
        username={user.username}
      />

      {/* 노트 모달 */}
      <NoteModal
        isOpen={noteModalState.isOpen}
        onClose={() => setNoteModalState({ isOpen: false, mode: 'create' })}
        note={noteModalState.note}
        mode={noteModalState.mode}
        username={user.username}
        folders={folders}
      />
    </div>
  )
}
