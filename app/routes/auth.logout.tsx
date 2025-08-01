import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function action({ request }: ActionFunctionArgs) {
  // 커스텀 인증 시스템에서는 세션 쿠키나 토큰을 삭제해야 함
  // 현재는 간단히 로그인 페이지로 리다이렉트
  console.log('로그아웃 처리')
  
  return redirect('/auth/login')
} 