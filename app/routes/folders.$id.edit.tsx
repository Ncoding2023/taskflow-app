import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'
import FolderForm from '~/components/forms/FolderForm'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const folderId = params.id
  
  if (!folderId) {
    return redirect('/folders')
  }

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

  // 폴더 정보 가져오기
  const { data: folder, error: folderError } = await supabase
    .from('folders')
    .select('*')
    .eq('id', folderId)
    .eq('user_id', user.id)
    .single()

  if (folderError || !folder) {
    return redirect('/folders')
  }

  return json({ user, folder })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const folderId = params.id
  
  if (!folderId) {
    return json({ error: '폴더 ID가 필요합니다.' }, { status: 400 })
  }

  const formData = await request.formData()
  const name = formData.get('name') as string
  const color = formData.get('color') as string

  // 세션 확인
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (!username) {
    return json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  // 사용자 정보 가져오기
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
  }

  // 유효성 검사
  if (!name || name.trim().length === 0) {
    return json({ 
      error: '폴더 이름을 입력해주세요.',
      errors: { name: '폴더 이름은 필수입니다.' }
    }, { status: 400 })
  }

  if (name.trim().length < 2) {
    return json({ 
      error: '폴더 이름은 최소 2자 이상이어야 합니다.',
      errors: { name: '폴더 이름은 최소 2자 이상이어야 합니다.' }
    }, { status: 400 })
  }

  try {
    // 폴더 수정
    const { data: folder, error } = await supabase
      .from('folders')
      .update({
        name: name.trim(),
        color: color || '#3B82F6',
        updated_at: new Date().toISOString()
      })
      .eq('id', folderId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('폴더 수정 오류:', error)
      return json({ error: '폴더 수정 중 오류가 발생했습니다.' }, { status: 500 })
    }

    console.log('폴더 수정 성공:', folder.name)
    
    // 성공 메시지와 함께 폴더 목록 페이지로 리다이렉트
    return redirect(`/folders?user=${username}&success=true&message=${encodeURIComponent(`"${folder.name}" 폴더가 수정되었습니다.`)}`)
  } catch (error) {
    console.error('예상치 못한 오류:', error)
    return json({ error: '폴더 수정 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export default function FoldersEdit() {
  const { user, folder } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <a 
              href={`/folders?user=${user.username}`}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← 폴더 목록
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <FolderForm folder={folder} mode="edit" />
        </div>
      </main>
    </div>
  )
} 