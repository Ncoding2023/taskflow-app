import { createClient } from '@supabase/supabase-js'

// 환경 변수 확인
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_KEY must be set')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

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