import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: folderId, taskId } = params
  const url = new URL(request.url)
  const username = url.searchParams.get('user')

  if (!username) {
    return redirect('/auth/login')
  }

  if (!folderId || !taskId) {
    return redirect(`/?user=${username}&error=true&message=${encodeURIComponent('잘못된 요청입니다.')}`)
  }

  try {
    // 사용자 확인
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return redirect(`/?user=${username}&error=true&message=${encodeURIComponent('사용자를 찾을 수 없습니다.')}`)
    }

    // 폴더 소유권 확인
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('id, name')
      .eq('id', folderId)
      .eq('user_id', user.id)
      .single()

    if (folderError || !folder) {
      return redirect(`/?user=${username}&error=true&message=${encodeURIComponent('폴더를 찾을 수 없습니다.')}`)
    }

    // 태스크 소유권 확인
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, title')
      .eq('id', taskId)
      .eq('folder_id', folderId)
      .eq('user_id', user.id)
      .single()

    if (taskError || !task) {
      return redirect(`/folders/${folderId}?user=${username}&error=true&message=${encodeURIComponent('태스크를 찾을 수 없습니다.')}`)
    }

    // 태스크 삭제
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id)

    if (deleteError) {
      return redirect(`/folders/${folderId}?user=${username}&error=true&message=${encodeURIComponent('태스크 삭제 중 오류가 발생했습니다.')}`)
    }

    return redirect(`/folders/${folderId}?user=${username}&success=true&message=${encodeURIComponent(`"${task.title}" 태스크가 삭제되었습니다.`)}`)

  } catch (error) {
    return redirect(`/folders/${folderId}?user=${username}&error=true&message=${encodeURIComponent('서버 오류가 발생했습니다.')}`)
  }
} 