import { json, redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const folderId = params.id
  
  if (!folderId) {
    return json({ error: '폴더 ID가 필요합니다.' }, { status: 400 })
  }

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

  try {
    // 폴더가 사용자의 것인지 확인
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('id, name')
      .eq('id', folderId)
      .eq('user_id', user.id)
      .single()

    if (folderError || !folder) {
      return json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 폴더 삭제 (CASCADE로 인해 관련 태스크와 노트도 함께 삭제됨)
    const { error: deleteError } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('폴더 삭제 오류:', deleteError)
      return json({ error: '폴더 삭제 중 오류가 발생했습니다.' }, { status: 500 })
    }

    console.log('폴더 삭제 성공:', folder.name)
    
    // 성공 메시지와 함께 폴더 목록 페이지로 리다이렉트
    return redirect(`/folders?user=${username}&success=true&message=${encodeURIComponent(`"${folder.name}" 폴더가 삭제되었습니다.`)}`)
  } catch (error) {
    console.error('예상치 못한 오류:', error)
    return json({ error: '폴더 삭제 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 