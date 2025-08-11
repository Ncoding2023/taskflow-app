// 간단한 테스트 데이터 생성 스크립트
// 이 스크립트는 수동으로 데이터를 생성하는 방법을 보여줍니다.

console.log('📊 테스트 데이터 생성 가이드')
console.log('=' * 50)

console.log('\n1️⃣ 테스트 사용자 생성:')
console.log('username: testuser')
console.log('display_name: 테스트 사용자')
console.log('email: test@example.com')

console.log('\n2️⃣ 폴더 생성 (5개):')
const folders = [
  { name: '프로젝트 A', color: '#3B82F6' },
  { name: '개인 업무', color: '#10B981' },
  { name: '학습 자료', color: '#F59E0B' },
  { name: '회의 준비', color: '#EF4444' },
  { name: '보고서 작성', color: '#8B5CF6' }
]

folders.forEach((folder, index) => {
  console.log(`${index + 1}. ${folder.name} (${folder.color})`)
})

console.log('\n3️⃣ 태스크 생성 (30개):')
const taskTemplates = [
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
const now = new Date()
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

for (let i = 0; i < 30; i++) {
  const isCompleted = Math.random() > 0.6 // 40% 확률로 완료
  const priority = priorities[Math.floor(Math.random() * priorities.length)]
  const title = taskTemplates[i % taskTemplates.length]
  const folderIndex = Math.floor(Math.random() * folders.length)
  
  console.log(`${i + 1}. ${title}`)
  console.log(`   - 우선순위: ${priority}`)
  console.log(`   - 완료: ${isCompleted ? '예' : '아니오'}`)
  console.log(`   - 폴더: ${folders[folderIndex].name}`)
  console.log(`   - 생성일: ${oneMonthAgo.toISOString().split('T')[0]}`)
  if (isCompleted) {
    console.log(`   - 완료일: ${now.toISOString().split('T')[0]}`)
  }
  console.log('')
}

console.log('\n4️⃣ 노트 생성 (15개):')
const noteTemplates = [
  { title: '회의록', content: '오늘 회의에서 논의된 내용을 정리했습니다.' },
  { title: '아이디어 노트', content: '새로운 아이디어가 떠올라서 기록해둡니다.' },
  { title: '학습 노트', content: '학습한 내용을 정리한 노트입니다.' },
  { title: '문제 해결 과정', content: '문제를 해결하는 과정을 기록했습니다.' },
  { title: '참고 자료', content: '참고할 만한 자료들을 모아둡니다.' },
  { title: '계획서', content: '프로젝트 계획을 세워봤습니다.' },
  { title: '체크리스트', content: '체크해야 할 항목들을 정리했습니다.' },
  { title: '메모', content: '중요한 메모를 기록합니다.' },
  { title: '참고 링크', content: '유용한 링크들을 모아둡니다.' },
  { title: '할 일 목록', content: '해야 할 일들을 정리했습니다.' }
]

for (let i = 0; i < 15; i++) {
  const template = noteTemplates[i % noteTemplates.length]
  const folderIndex = Math.floor(Math.random() * folders.length)
  
  console.log(`${i + 1}. ${template.title}`)
  console.log(`   - 내용: ${template.content}`)
  console.log(`   - 폴더: ${folders[folderIndex].name}`)
  console.log(`   - 생성일: ${oneMonthAgo.toISOString().split('T')[0]}`)
  console.log('')
}

console.log('\n🎯 통계 예상 결과:')
console.log('- 총 태스크: 30개')
console.log('- 완료된 태스크: 약 12개 (40%)')
console.log('- 대기 중인 태스크: 약 18개 (60%)')
console.log('- 폴더: 5개')
console.log('- 노트: 15개')
console.log('- 우선순위 분포: 높음/보통/낮음 랜덤')
console.log('- 마감일: 일부 태스크에만 설정')

console.log('\n🔗 테스트 URL:')
console.log('http://localhost:5173/?user=testuser')

console.log('\n📝 수동으로 데이터를 생성하려면:')
console.log('1. Supabase 대시보드에서 직접 데이터 입력')
console.log('2. SQL 에디터에서 INSERT 문 실행')
console.log('3. 위의 템플릿을 참고하여 데이터 생성')

console.log('\n✅ 이제 통계 기능을 확인할 수 있습니다!') 