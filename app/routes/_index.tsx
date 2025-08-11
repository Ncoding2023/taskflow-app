import { json, type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { weatherService } from '~/lib/external-services'

import { supabase } from '~/lib/supabase'
import TaskModal from '~/components/modals/TaskModal'
import FolderModal from '~/components/modals/FolderModal'
import NoteModal from '~/components/modals/NoteModal'

import StatisticsSection from '~/components/dashboard/StatisticsSection'
import QuickActions from '~/components/dashboard/QuickActions'
import FoldersSection from '~/components/dashboard/FoldersSection'
import TasksSection from '~/components/dashboard/TasksSection'
import DeadlineSection from '~/components/dashboard/DeadlineSection'
import Header from '~/components/layout/Header'
import { useToastContext } from '~/contexts/ToastContext'

// 임시 디버깅용 로그 제거
// console.log('🔍 환경 변수 디버깅:')
// console.log('- import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY:', import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY)
// console.log('- import.meta.env:', import.meta.env)

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
    tasks: tasks || []
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
      // 태스크의 폴더 ID 찾기
      const task = localTasks.find(t => t.id === taskId)
      if (!task || !task.folder_id) {
        console.error('태스크 또는 폴더 ID를 찾을 수 없습니다')
        return
      }

      const response = await fetch(`/folders/${task.folder_id}/tasks/${taskId}/toggle?user=${user.username}`, {
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
        showSuccess('성공', '태스크 상태가 업데이트되었습니다.')
      } else {
        console.error('태스크 상태 업데이트 실패')
        showError('오류', '태스크 상태 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error('태스크 상태 업데이트 중 오류:', error)
      showError('오류', '태스크 상태 업데이트 중 오류가 발생했습니다.')
    }
  }





  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header username={user.username} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Statistics Section */}
          <StatisticsSection
            tasks={localTasks}
            folders={folders}
          />

                        {/* External Services Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Removed CalendarWidget as per edit hint */}
              </div>

          {/* Quick Actions - 폴더가 있을 때만 표시 */}
          {folders.length > 0 && (
            <QuickActions
              onCreateFolder={handleCreateFolder}
            />
          )}

          {/* Content Grid - 폴더와 태스크를 세로로 배치 */}
          <div className="space-y-6 sm:space-y-8">
            {/* Folders Section */}
            <FoldersSection
              folders={folders}
              username={user.username}
              onCreateFolder={handleCreateFolder}
            />

            {/* Deadline Section */}
            <DeadlineSection
              tasks={localTasks}
              folders={folders}
              username={user.username}
              onToggleComplete={handleToggleComplete}
              onEditTask={(task) => setTaskModalState({ isOpen: true, mode: 'edit', task })}
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
