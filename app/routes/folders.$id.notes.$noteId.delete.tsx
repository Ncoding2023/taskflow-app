import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: folderId, noteId } = params
  const url = new URL(request.url)
  const username = url.searchParams.get('user')

  if (!username) {
    return redirect('/auth/login')
  }

  if (!folderId || !noteId) {
    return redirect(`/?user=${username}&error=true&message=${encodeURIComponent('잘못된 요청입니다.')}`)
  }

  try {
    // 사용자 정보 가져오기
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return redirect('/auth/login')
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

    // 노트 정보 가져오기
    const { data: note, error: noteError } = await supabase
      .from('notes')
      .select('id, title')
      .eq('id', noteId)
      .eq('folder_id', folderId)
      .eq('user_id', user.id)
      .single()

    if (noteError || !note) {
      return redirect(`/folders/${folderId}?user=${username}&error=true&message=${encodeURIComponent('노트를 찾을 수 없습니다.')}`)
    }

    // 노트 삭제
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id)

    if (deleteError) {
      return redirect(`/folders/${folderId}?user=${username}&error=true&message=${encodeURIComponent('노트 삭제에 실패했습니다.')}`)
    }

    return redirect(`/folders/${folderId}?user=${username}&success=true&message=${encodeURIComponent(`"${note.title}" 노트가 삭제되었습니다.`)}`)

  } catch (error) {
    return redirect(`/folders/${folderId}?user=${username}&error=true&message=${encodeURIComponent('서버 오류가 발생했습니다.')}`)
  }
} 