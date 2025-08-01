import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const folderId = params.id
  
  if (!folderId) {
    return redirect('/?error=폴더 ID가 필요합니다.')
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
    .select('id, username')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return redirect('/auth/login')
  }

  try {
    // 폴더가 사용자의 것인지 확인
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('id, name')
      .eq('id', folderId)
      .eq('user_id', user.id)
      .single()

    if (folderError || !folder) {
      return redirect('/?error=폴더를 찾을 수 없습니다.')
    }

    // 폴더 내의 모든 태스크와 노트 삭제 (CASCADE가 설정되어 있지 않다면)
    await supabase
      .from('tasks')
      .delete()
      .eq('folder_id', folderId)
      .eq('user_id', user.id)

    await supabase
      .from('notes')
      .delete()
      .eq('folder_id', folderId)
      .eq('user_id', user.id)

    // 폴더 삭제
    const { error: deleteError } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('폴더 삭제 오류:', deleteError)
      return redirect('/?error=폴더 삭제 중 오류가 발생했습니다.')
    }

    return redirect(`/?user=${username}&success=true&message=${encodeURIComponent(`"${folder.name}" 폴더가 삭제되었습니다.`)}`)
  } catch (error) {
    console.error('폴더 삭제 중 오류:', error)
    return redirect('/?error=폴더 삭제 중 오류가 발생했습니다.')
  }
} 