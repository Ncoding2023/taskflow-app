import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: folderId, taskId } = params
  const url = new URL(request.url)
  const username = url.searchParams.get('user')

  if (!username) {
    return json({ error: '사용자 정보가 필요합니다.' }, { status: 400 })
  }

  if (!folderId || !taskId) {
    return json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  try {
    // 사용자 확인
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return json({ error: '사용자를 찾을 수 없습니다.' }, { status: 400 })
    }

    // 태스크 소유권 확인
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, title, completed')
      .eq('id', taskId)
      .eq('folder_id', folderId)
      .eq('user_id', user.id)
      .single()

    if (taskError || !task) {
      return json({ error: '태스크를 찾을 수 없습니다.' }, { status: 400 })
    }

    // 태스크 완료 상태 토글
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ 
        completed: !task.completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      return json({ error: '태스크 상태 변경 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return json({ 
      success: true, 
      task: updatedTask,
      message: updatedTask.completed ? '태스크가 완료되었습니다.' : '태스크가 미완료로 변경되었습니다.'
    })

  } catch (error) {
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
} 