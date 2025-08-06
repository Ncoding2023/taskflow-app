import { Form, Link, useActionData, useNavigation, useSearchParams } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'
import { createHash } from 'crypto'
import ThemeToggle from '~/components/ui/ThemeToggle'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return json({ error: '사용자명과 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  try {
    console.log('로그인 시도:', username)
    
    // 비밀번호 해시 생성
    const passwordHash = createHash('sha256').update(password).digest('hex')
    
    // 사용자명과 비밀번호로 로그인 확인
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('id, username, display_name')
      .eq('username', username)
      .eq('password_hash', passwordHash)
      .single()

    if (error || !user) {
      console.error('로그인 오류:', error)
      return json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' }, { status: 400 })
    }

             console.log('로그인 성공:', user.display_name)

         // 세션 생성 (간단한 방식)
         // 실제로는 JWT 토큰이나 세션 쿠키를 사용해야 함
         // 지금은 성공 후 대시보드로 리다이렉트 (사용자명 전달)

         return redirect(`/?user=${encodeURIComponent(user.username)}`)
  } catch (error) {
    console.error('예상치 못한 오류:', error)
    return json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()
  const isSubmitting = navigation.state === 'submitting'
  
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* 테마 토글 버튼 */}
      <div className="absolute top-4 right-4">
        <ThemeToggle size="sm" />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            TaskFlow에 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            또는{' '}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              새 계정 만들기
            </Link>
          </p>
        </div>
        
        {message && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div className="text-sm text-green-700 dark:text-green-400">
              {message === 'Registration completed. Please login.' 
                ? '회원가입이 완료되었습니다. 로그인해주세요.'
                : message
              }
            </div>
          </div>
        )}
        
        <Form method="post" className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                사용자명
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="사용자명"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="비밀번호"
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-700 dark:text-red-400">
                {actionData.error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
} 