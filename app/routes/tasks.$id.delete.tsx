import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  const taskId = params.id
  
  if (!username) {
    return redirect('/auth/login')
  }

  if (!taskId) {
    return redirect('/tasks')
  }

  // 사용자 정보 가져오기
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return redirect('/auth/login')
  }

  // 태스크 소유권 확인 및 삭제
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('id, title')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single()

  if (taskError || !task) {
    return redirect('/tasks')
  }

  try {
    // 태스크 삭제
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('태스크 삭제 오류:', deleteError)
      return redirect(`/tasks?user=${username}&error=${encodeURIComponent('태스크 삭제에 실패했습니다.')}`)
    }

    console.log('태스크 삭제 성공:', task.title)
    
    // 성공 메시지와 함께 태스크 목록 페이지로 리다이렉트
    return redirect(`/tasks?user=${username}&success=true&message=${encodeURIComponent(`"${task.title}" 태스크가 삭제되었습니다.`)}`)
  } catch (error) {
    console.error('예상치 못한 오류:', error)
    return redirect(`/tasks?user=${username}&error=${encodeURIComponent('태스크 삭제 중 오류가 발생했습니다.')}`)
  }
} 