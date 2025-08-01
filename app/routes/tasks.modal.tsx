import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function loader({ request }: LoaderFunctionArgs) {
  // GET 요청 시 태스크 페이지로 리다이렉트
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (username) {
    return redirect(`/tasks?user=${username}`)
  }
  
  return redirect('/tasks')
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const action = formData.get('action') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const dueDate = formData.get('due_date') as string
  const folderId = formData.get('folder_id') as string
  const taskId = formData.get('taskId') as string
  
  // 사용자 정보 가져오기
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (!username) {
    return new Response(JSON.stringify({ error: '사용자 정보가 없습니다.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

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
  if (!title || title.trim().length === 0) {
    return new Response(JSON.stringify({ error: '태스크 제목을 입력해주세요.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!priority || !['low', 'medium', 'high'].includes(priority)) {
    return new Response(JSON.stringify({ error: '올바른 우선순위를 선택해주세요.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    if (action === 'create') {
      // 새 태스크 생성
      const taskData: any = {
        title: title.trim(),
        description: description?.trim() || null,
        priority,
        user_id: user.id
      }

      if (dueDate) {
        taskData.due_date = new Date(dueDate).toISOString()
      }

      if (folderId) {
        taskData.folder_id = folderId
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) {
        console.error('태스크 생성 오류:', error)
        return new Response(JSON.stringify({ error: '태스크 생성에 실패했습니다.' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: '태스크가 성공적으로 생성되었습니다.',
        task: data 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } else if (action === 'edit') {
      // 태스크 수정
      if (!taskId) {
        return new Response(JSON.stringify({ error: '태스크 ID가 필요합니다.' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 태스크 소유권 확인
      const { data: existingTask, error: fetchError } = await supabase
        .from('tasks')
        .select('id')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !existingTask) {
        return new Response(JSON.stringify({ error: '태스크를 찾을 수 없거나 수정 권한이 없습니다.' }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const updateData: any = {
        title: title.trim(),
        description: description?.trim() || null,
        priority,
        updated_at: new Date().toISOString()
      }

      if (dueDate) {
        updateData.due_date = new Date(dueDate).toISOString()
      } else {
        updateData.due_date = null
      }

      if (folderId) {
        updateData.folder_id = folderId
      } else {
        updateData.folder_id = null
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single()

      if (error) {
        console.error('태스크 수정 오류:', error)
        return new Response(JSON.stringify({ error: '태스크 수정에 실패했습니다.' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: '태스크가 성공적으로 수정되었습니다.',
        task: data 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } else {
      return new Response(JSON.stringify({ error: '잘못된 액션입니다.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('태스크 처리 오류:', error)
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 