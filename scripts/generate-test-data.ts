import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const testUser = {
  username: 'testuser',
  display_name: '테스트 사용자',
  email: 'test@example.com'
}

const folderNames = [
  '프로젝트 A',
  '개인 업무',
  '학습 자료',
  '회의 준비',
  '보고서 작성'
]

const taskTitles = [
  'API 문서 작성',
  '데이터베이스 설계',
  'UI 컴포넌트 개발',
  '테스트 코드 작성',
  '코드 리뷰',
  '배포 준비',
  '성능 최적화',
  '보안 검토',
  '문서 업데이트',
  '회의 참석',
  '프로젝트 계획 수립',
  '팀 미팅',
  '클라이언트 미팅',
  '기술 검토',
  '버그 수정',
  '새 기능 개발',
  '테스트 실행',
  '문서화',
  '코드 정리',
  '배포 스크립트 작성',
  '모니터링 설정',
  '백업 정책 수립',
  '로깅 시스템 구축',
  '알림 설정',
  '성능 모니터링',
  '보안 점검',
  '업데이트 계획',
  '훈련 자료 준비',
  '평가 보고서',
  '다음 단계 계획'
]

const priorities = ['high', 'medium', 'low']
const noteTitles = [
  '회의록',
  '아이디어 노트',
  '학습 노트',
  '문제 해결 과정',
  '참고 자료',
  '계획서',
  '체크리스트',
  '메모',
  '참고 링크',
  '할 일 목록'
]

const noteContents = [
  '오늘 회의에서 논의된 내용을 정리했습니다.',
  '새로운 아이디어가 떠올라서 기록해둡니다.',
  '학습한 내용을 정리한 노트입니다.',
  '문제를 해결하는 과정을 기록했습니다.',
  '참고할 만한 자료들을 모아둡니다.',
  '프로젝트 계획을 세워봤습니다.',
  '체크해야 할 항목들을 정리했습니다.',
  '중요한 메모를 기록합니다.',
  '유용한 링크들을 모아둡니다.',
  '해야 할 일들을 정리했습니다.'
]

function getRandomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

async function generateTestData() {
  console.log('테스트 데이터 생성을 시작합니다...')

  try {
    // 1. 사용자 생성 (이미 존재하면 스킵)
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', testUser.username)
      .single()

    if (!existingUser) {
      const { error: userError } = await supabase
        .from('users')
        .insert([testUser])

      if (userError) {
        console.error('사용자 생성 오류:', userError)
        return
      }
      console.log('✅ 테스트 사용자 생성 완료')
    } else {
      console.log('✅ 테스트 사용자 이미 존재')
    }

    // 2. 폴더 생성
    const folders = []
    for (let i = 0; i < folderNames.length; i++) {
      const folder = {
        name: folderNames[i],
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        user_id: testUser.username,
        created_at: getRandomDate(new Date('2024-01-01'), new Date())
      }
      folders.push(folder)
    }

    const { data: createdFolders, error: folderError } = await supabase
      .from('folders')
      .insert(folders)
      .select()

    if (folderError) {
      console.error('폴더 생성 오류:', folderError)
      return
    }
    console.log('✅ 폴더 생성 완료:', createdFolders?.length, '개')

    // 3. 태스크 생성
    const tasks = []
    const now = new Date()
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    for (let i = 0; i < 30; i++) {
      const isCompleted = Math.random() > 0.6 // 40% 확률로 완료
      const createdDate = getRandomDate(oneMonthAgo, now)
      const completedDate = isCompleted ? getRandomDate(new Date(createdDate), now) : null
      const dueDate = Math.random() > 0.3 ? getRandomDate(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) : null

      const task = {
        title: getRandomElement(taskTitles),
        description: `테스트 태스크 ${i + 1}입니다.`,
        priority: getRandomElement(priorities),
        completed: isCompleted,
        due_date: dueDate,
        completed_at: completedDate,
        created_at: createdDate,
        folder_id: getRandomElement(createdFolders!).id,
        user_id: testUser.username
      }
      tasks.push(task)
    }

    const { data: createdTasks, error: taskError } = await supabase
      .from('tasks')
      .insert(tasks)
      .select()

    if (taskError) {
      console.error('태스크 생성 오류:', taskError)
      return
    }
    console.log('✅ 태스크 생성 완료:', createdTasks?.length, '개')

    // 4. 노트 생성
    const notes = []
    for (let i = 0; i < 15; i++) {
      const note = {
        title: getRandomElement(noteTitles),
        content: getRandomElement(noteContents),
        created_at: getRandomDate(oneMonthAgo, now),
        folder_id: getRandomElement(createdFolders!).id,
        user_id: testUser.username
      }
      notes.push(note)
    }

    const { data: createdNotes, error: noteError } = await supabase
      .from('notes')
      .insert(notes)
      .select()

    if (noteError) {
      console.error('노트 생성 오류:', noteError)
      return
    }
    console.log('✅ 노트 생성 완료:', createdNotes?.length, '개')

    console.log('\n🎉 테스트 데이터 생성 완료!')
    console.log(`📊 생성된 데이터:`)
    console.log(`   - 폴더: ${createdFolders?.length}개`)
    console.log(`   - 태스크: ${createdTasks?.length}개`)
    console.log(`   - 노트: ${createdNotes?.length}개`)
    console.log(`\n🔗 테스트 URL: http://localhost:5173/?user=${testUser.username}`)

  } catch (error) {
    console.error('테스트 데이터 생성 중 오류:', error)
  }
}

// 스크립트 실행
generateTestData() 