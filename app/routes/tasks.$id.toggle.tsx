import { json } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  const taskId = params.id
  
  if (!username) {
    return json({ error: '사용자 정보가 없습니다.' }, { status: 400 })
  }

  if (!taskId) {
    return json({ error: '태스크 ID가 없습니다.' }, { status: 400 })
  }

  // 사용자 정보 가져오기
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return json({ error: '사용자를 찾을 수 없습니다.' }, { status: 400 })
  }

  // 태스크 소유권 확인
  const { data: existingTask, error: taskError } = await supabase
    .from('tasks')
    .select('id, title, completed')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single()

  if (taskError || !existingTask) {
    return json({ error: '태스크를 찾을 수 없습니다.' }, { status: 404 })
  }

  try {
    // 태스크 완료 상태 토글
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        completed: !existingTask.completed
      })
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('태스크 상태 변경 오류:', error)
      return json({ error: '태스크 상태 변경에 실패했습니다.' }, { status: 500 })
    }

    console.log('태스크 상태 변경 성공:', task.title, task.completed ? '완료' : '미완료')
    
    return json({ 
      success: true, 
      completed: task.completed,
      message: task.completed ? '태스크가 완료되었습니다.' : '태스크가 미완료로 변경되었습니다.'
    })
  } catch (error) {
    console.error('예상치 못한 오류:', error)
    return json({ error: '태스크 상태 변경 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 