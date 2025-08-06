import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  const folderId = url.searchParams.get('folderId')
  
  if (username && folderId) {
    return redirect(`/folders/${folderId}?user=${username}`)
  }
  return redirect('/')
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const action = formData.get('action') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const dueDate = formData.get('due_date') as string
  const folderId = formData.get('folder_id') as string
  const username = formData.get('username') as string

  if (!username) {
    return new Response(JSON.stringify({ error: '사용자 정보가 필요합니다.' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }

  // 사용자 확인
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return new Response(JSON.stringify({ error: '사용자를 찾을 수 없습니다.' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }

  // 입력 검증
  if (!title.trim()) {
    return new Response(JSON.stringify({ error: '태스크 제목을 입력해주세요.' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }

  if (!folderId) {
    return new Response(JSON.stringify({ error: '폴더 정보가 필요합니다.' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }

  try {
    if (action === 'create') {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          description: description?.trim() || '',
          priority: priority || 'medium',
          due_date: dueDate || null,
          folder_id: folderId,
          user_id: user.id,
          completed: false
        })
        .select()
        .single()

      if (error) {
        return new Response(JSON.stringify({ error: '태스크 생성 중 오류가 발생했습니다.' }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: '태스크가 성공적으로 생성되었습니다.',
        task: data
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })

    } else if (action === 'edit') {
      const taskId = formData.get('taskId') as string
      
      if (!taskId) {
        return new Response(JSON.stringify({ error: '태스크 ID가 필요합니다.' }), { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        })
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          description: description?.trim() || '',
          priority: priority || 'medium',
          due_date: dueDate || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return new Response(JSON.stringify({ error: '태스크 수정 중 오류가 발생했습니다.' }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: '태스크가 성공적으로 수정되었습니다.',
        task: data
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })

    } else {
      return new Response(JSON.stringify({ error: '잘못된 액션입니다.' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
} 