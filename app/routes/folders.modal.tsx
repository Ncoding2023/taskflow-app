
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function loader({ request }: LoaderFunctionArgs) {
  // GET 요청 시 폴더 페이지로 리다이렉트
  const url = new URL(request.url)
  const username = url.searchParams.get('user')
  
  if (username) {
    return redirect(`/folders?user=${username}`)
  }
  
  return redirect('/folders')
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const action = formData.get('action') as string
  const name = formData.get('name') as string
  const color = formData.get('color') as string
  const folderId = formData.get('folderId') as string
  
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
  if (!name || name.trim().length === 0) {
    return new Response(JSON.stringify({ error: '폴더 이름을 입력해주세요.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!color) {
    return new Response(JSON.stringify({ error: '폴더 색상을 선택해주세요.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    if (action === 'create') {
      // 새 폴더 생성
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: name.trim(),
          color,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('폴더 생성 오류:', error)
        return new Response(JSON.stringify({ error: '폴더 생성에 실패했습니다.' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: '폴더가 성공적으로 생성되었습니다.',
        folder: data 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } else if (action === 'edit') {
      // 폴더 수정
      if (!folderId) {
        return new Response(JSON.stringify({ error: '폴더 ID가 필요합니다.' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 폴더 소유권 확인
      const { data: existingFolder, error: fetchError } = await supabase
        .from('folders')
        .select('id')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !existingFolder) {
        return new Response(JSON.stringify({ error: '폴더를 찾을 수 없거나 수정 권한이 없습니다.' }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('folders')
        .update({
          name: name.trim(),
          color,
          updated_at: new Date().toISOString()
        })
        .eq('id', folderId)
        .select()
        .single()

      if (error) {
        console.error('폴더 수정 오류:', error)
        return new Response(JSON.stringify({ error: '폴더 수정에 실패했습니다.' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: '폴더가 성공적으로 수정되었습니다.',
        folder: data 
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
    console.error('폴더 처리 오류:', error)
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 