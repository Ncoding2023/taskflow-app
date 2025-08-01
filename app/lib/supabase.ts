import { createClient } from '@supabase/supabase-js'

// 환경 변수 확인
const supabaseUrl = process.env.SUPABASE_URL || 'https://vlrikezmdmbuaioppmur.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscmlrZXptZG1idWFpb3BwbXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjU3NDUsImV4cCI6MjA2NzYwMTc0NX0._RWLDKbvc33OqpIh6CQsBHKZfhY8UuX0bgHLw4IEcgQ'

// 디버깅용 로그
console.log('=== Supabase 설정 확인 ===')
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key 설정됨:', !!supabaseKey)
console.log('환경 변수 SUPABASE_URL:', process.env.SUPABASE_URL ? '설정됨' : '설정되지 않음')
console.log('환경 변수 SUPABASE_KEY:', process.env.SUPABASE_KEY ? '설정됨' : '설정되지 않음')
console.log('========================')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// 연결 테스트
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase 연결 오류:', error)
  } else {
    console.log('Supabase 연결 성공')
  }
})

// Database types
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
  user_id: string
  folder_id?: string
}

export interface Folder {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  folder_id?: string
} 