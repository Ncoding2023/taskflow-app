import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'
import { randomUUID } from 'crypto'
import { createHash } from 'crypto'

export async function action({ request }: ActionFunctionArgs) {
  console.log('=== 회원가입 액션 시작 ===')
  
  try {
    const formData = await request.formData()
    const username = formData.get('username') as string
    const displayName = formData.get('displayName') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    console.log('폼 데이터:', { 
      username,
      displayName,
      passwordLength: password?.length,
      confirmPasswordLength: confirmPassword?.length 
    })

    if (!username || !displayName || !password || !confirmPassword) {
      console.log('필수 필드 누락')
      return json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      console.log('비밀번호 불일치')
      return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 400 })
    }

    if (password.length < 6) {
      console.log('비밀번호 길이 부족')
      return json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 })
    }

    if (username.length < 3) {
      console.log('사용자명 길이 부족')
      return json({ error: '사용자명은 최소 3자 이상이어야 합니다.' }, { status: 400 })
    }

    if (displayName.length < 2) {
      console.log('이름 길이 부족')
      return json({ error: '이름은 최소 2자 이상이어야 합니다.' }, { status: 400 })
    }

    // 사용자명 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      return json({ error: '이미 사용 중인 사용자명입니다.' }, { status: 400 })
    }

    // 비밀번호 해시 생성
    const passwordHash = createHash('sha256').update(password).digest('hex')

    // 사용자 프로필 생성 (이메일 없이)
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          username: username,
          password_hash: passwordHash,
          display_name: displayName
        })

      if (profileError) {
        console.error('프로필 생성 오류:', profileError)
        return json({ error: '회원가입 중 오류가 발생했습니다.' }, { status: 400 })
      }

      console.log('사용자 프로필 생성 성공')

      // 회원가입 성공 후 로그인 페이지로 리다이렉트
      return redirect('/auth/login?message=Registration completed. Please login.')
    } catch (profileError) {
      console.error('프로필 생성 중 예상치 못한 오류:', profileError)
      return json({ error: '회원가입 중 오류가 발생했습니다.' }, { status: 500 })
    }
  } catch (error) {
    console.error('예상치 못한 오류:', error)
    console.error('오류 스택:', error instanceof Error ? error.stack : '스택 없음')
    return json({ 
      error: '회원가입 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            TaskFlow 계정 만들기
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            또는{' '}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              기존 계정으로 로그인
            </Link>
          </p>
        </div>
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
                placeholder="사용자명 (최소 3자)"
              />
            </div>
            <div>
              <label htmlFor="displayName" className="sr-only">
                이름
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="이름 또는 별명 (최소 2자)"
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="비밀번호 (최소 6자)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="비밀번호 확인"
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
              {isSubmitting ? '회원가입 중...' : '회원가입'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
} 