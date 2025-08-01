import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Chrome DevTools 요청 처리
  if (pathname.includes('.well-known/appspecific/com.chrome.devtools.json')) {
    return new Response('{}', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // 기타 404 요청은 기본 404 페이지로
  throw new Response('Not Found', { status: 404 })
} 