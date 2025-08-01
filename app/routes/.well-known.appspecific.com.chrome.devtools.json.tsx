// Chrome DevTools 요청을 위한 더미 라우트
// 경로: /.well-known/appspecific/com.chrome.devtools.json
export async function loader() {
  return new Response('{}', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
} 