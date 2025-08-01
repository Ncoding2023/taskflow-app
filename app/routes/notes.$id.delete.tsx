import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const noteId = params.id
  
  if (!noteId) {
    return redirect('/notes?error=노트 ID가 없습니다.')
  }

  // 사용자 정보 가져오기
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (!username) {
    return redirect('/auth/login')
  }

  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (userError || !user) {
    return redirect('/auth/login')
  }

  try {
    // 노트 소유권 확인
    const { data: existingNote, error: fetchError } = await supabase
      .from('notes')
      .select('id, title')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingNote) {
      return redirect('/notes?error=노트를 찾을 수 없거나 삭제 권한이 없습니다.')
    }

    // 노트 삭제
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('노트 삭제 오류:', deleteError)
      return redirect('/notes?error=노트 삭제에 실패했습니다.')
    }

    return redirect(`/notes?user=${username}&success=true&message=${encodeURIComponent('노트가 성공적으로 삭제되었습니다.')}`)

  } catch (error) {
    console.error('노트 삭제 처리 오류:', error)
    return redirect('/notes?error=서버 오류가 발생했습니다.')
  }
} 