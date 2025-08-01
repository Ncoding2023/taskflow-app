import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { supabase } from '~/lib/supabase'

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Supabase 연결 테스트
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return json({ 
        success: false, 
        error: error.message,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY ? '설정됨' : '설정되지 않음'
      })
    }

    return json({ 
      success: true, 
      message: 'Supabase 연결 성공',
      session: data.session,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY ? '설정됨' : '설정되지 않음'
    })
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY ? '설정됨' : '설정되지 않음'
    })
  }
}

export default function Test() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase 연결 테스트</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">환경 변수:</h2>
          <p>SUPABASE_URL: {data.supabaseUrl || '설정되지 않음'}</p>
          <p>SUPABASE_KEY: {data.supabaseKey}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">연결 상태:</h2>
          {data.success ? (
            <div className="text-green-600">
              ✅ {'message' in data ? data.message : '연결 성공'}
            </div>
          ) : (
            <div className="text-red-600">
              ❌ 오류: {'error' in data ? data.error : '알 수 없는 오류'}
            </div>
          )}
        </div>

        {'session' in data && data.session && (
          <div className="p-4 border rounded">
            <h2 className="font-semibold">세션 정보:</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(data.session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 