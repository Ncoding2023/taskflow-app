import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function loader({ request }: LoaderFunctionArgs) {
  // GET 요청 시 노트 페이지로 리다이렉트
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (username) {
    return redirect(`/notes?user=${username}`)
  }
  
  return redirect('/notes')
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const action = formData.get('action') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const folderId = formData.get('folder_id') as string
  const noteId = formData.get('noteId') as string
  
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
    return new Response(JSON.stringify({ error: '노트 제목을 입력해주세요.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!content || content.trim().length === 0) {
    return new Response(JSON.stringify({ error: '노트 내용을 입력해주세요.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    if (action === 'create') {
      // 새 노트 생성
      const noteData: any = {
        title: title.trim(),
        content: content.trim(),
        user_id: user.id
      }

      if (folderId) {
        noteData.folder_id = folderId
      }

      const { data, error } = await supabase
        .from('notes')
        .insert(noteData)
        .select()
        .single()

      if (error) {
        console.error('노트 생성 오류:', error)
        return new Response(JSON.stringify({ error: '노트 생성에 실패했습니다.' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: '노트가 성공적으로 생성되었습니다.',
        note: data 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } else if (action === 'edit') {
      // 노트 수정
      if (!noteId) {
        return new Response(JSON.stringify({ error: '노트 ID가 필요합니다.' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 노트 소유권 확인
      const { data: existingNote, error: fetchError } = await supabase
        .from('notes')
        .select('id')
        .eq('id', noteId)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !existingNote) {
        return new Response(JSON.stringify({ error: '노트를 찾을 수 없거나 수정 권한이 없습니다.' }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const updateData: any = {
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString()
      }

      if (folderId) {
        updateData.folder_id = folderId
      } else {
        updateData.folder_id = null
      }

      const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', noteId)
        .select()
        .single()

      if (error) {
        console.error('노트 수정 오류:', error)
        return new Response(JSON.stringify({ error: '노트 수정에 실패했습니다.' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: '노트가 성공적으로 수정되었습니다.',
        note: data 
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
    console.error('노트 처리 오류:', error)
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 