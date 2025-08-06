import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: folderId } = params
  const url = new URL(request.url)
  const username = url.searchParams.get('user')

  if (!username) {
    return redirect('/auth/login')
  }

  if (!folderId) {
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
      .select('id')
      .eq('id', folderId)
      .eq('user_id', user.id)
      .single()

    if (folderError || !folder) {
      return redirect(`/?user=${username}&error=true&message=${encodeURIComponent('폴더를 찾을 수 없습니다.')}`)
    }

    const formData = await request.formData()
    const action = formData.get('action') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title.trim()) {
      return new Response(JSON.stringify({ error: '제목을 입력해주세요.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'create') {
      // 노트 생성
      const { error: createError } = await supabase
        .from('notes')
        .insert({
          title: title.trim(),
          content: content?.trim() || '',
          folder_id: folderId,
          user_id: user.id
        })

      if (createError) {
        return new Response(JSON.stringify({ error: '노트 생성에 실패했습니다.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ success: true, message: '노트가 생성되었습니다.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } else if (action === 'edit') {
      const noteId = formData.get('noteId') as string

      if (!noteId) {
        return new Response(JSON.stringify({ error: '노트 ID가 필요합니다.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 노트 수정
      const { error: updateError } = await supabase
        .from('notes')
        .update({
          title: title.trim(),
          content: content?.trim() || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .eq('folder_id', folderId)

      if (updateError) {
        return new Response(JSON.stringify({ error: '노트 수정에 실패했습니다.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ success: true, message: '노트가 수정되었습니다.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// GET 요청 시 폴더 상세 페이지로 리다이렉트
export async function loader() {
  return redirect('/')
} 