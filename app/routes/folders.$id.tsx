import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { ArrowLeftIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '~/lib/supabase'
import TaskCard from '~/components/TaskCard'
import NoteCard from '~/components/NoteCard'
import Button from '~/components/ui/Button'
import { useState } from 'react'

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
  
  // 로컬 태스크 상태 관리
  const [localTasks, setLocalTasks] = useState(tasks)

  const completedTasks = localTasks.filter(task => task.completed)
  const pendingTasks = localTasks.filter(task => !task.completed)

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
                  <Link
                    to={`/tasks?user=${user.username}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    모든 태스크 보기 →
                  </Link>
                </div>
                
                {localTasks.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    이 폴더에 태스크가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {localTasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {/* 체크박스 - 태스크 목록과 동일한 스타일 */}
                        <button
                          onClick={() => handleToggleComplete(task.id, !task.completed)}
                          className={`flex-shrink-0 mt-1 p-1 rounded-full transition-colors ${
                            task.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                          }`}
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>

                        {/* 태스크 내용 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`text-sm font-medium ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`mt-1 text-sm ${
                                  task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* 메타 정보 */}
                          <div className="flex items-center space-x-2 mt-2">
                            {/* 우선순위 */}
                            {task.priority === 'high' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                긴급
                              </span>
                            )}
                            {task.priority === 'medium' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                보통
                              </span>
                            )}
                            {task.priority === 'low' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                낮음
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
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
                  <Link
                    to={`/notes?user=${user.username}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    모든 노트 보기 →
                  </Link>
                </div>
                
                {notes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    이 폴더에 노트가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notes.slice(0, 5).map((note) => (
                      <div
                        key={note.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {note.title}
                        </h4>
                        {note.content && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 