-- 간단한 테스트 데이터 생성 SQL 스크립트
-- 현재 앱 구조에 맞춰 수정됨

-- 1. 테스트 사용자 생성 (user_profiles 테이블 사용)
INSERT INTO user_profiles (username, display_name, password_hash) 
VALUES ('testuser', '테스트 사용자', 'dummy_hash_for_testing')
ON CONFLICT (username) DO NOTHING;

-- 2. 폴더 생성 (user_id는 UUID로 변경)
INSERT INTO folders (name, color, user_id, created_at) VALUES
('프로젝트 A', '#3B82F6', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-01T00:00:00Z'),
('개인 업무', '#10B981', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-02T00:00:00Z'),
('학습 자료', '#F59E0B', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-03T00:00:00Z'),
('회의 준비', '#EF4444', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-04T00:00:00Z'),
('보고서 작성', '#8B5CF6', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-05T00:00:00Z');

-- 3. 태스크 생성 (30개) - user_id와 folder_id를 UUID로 변경
INSERT INTO tasks (title, description, priority, completed, due_date, created_at, user_id, folder_id) VALUES
-- 완료된 태스크들 (12개)
('API 문서 작성', '테스트 태스크 1입니다.', 'high', true, '2024-12-15', '2024-11-15T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('데이터베이스 설계', '테스트 태스크 2입니다.', 'medium', true, '2024-12-20', '2024-11-20T08:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('UI 컴포넌트 개발', '테스트 태스크 3입니다.', 'low', true, '2024-12-25', '2024-11-25T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('테스트 코드 작성', '테스트 태스크 4입니다.', 'high', true, '2024-12-30', '2024-11-30T13:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('코드 리뷰', '테스트 태스크 5입니다.', 'medium', true, '2025-01-05', '2024-12-05T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('배포 준비', '테스트 태스크 6입니다.', 'high', true, '2025-01-10', '2024-12-10T14:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('성능 최적화', '테스트 태스크 7입니다.', 'low', true, '2025-01-15', '2024-12-15T11:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('보안 검토', '테스트 태스크 8입니다.', 'high', true, '2025-01-20', '2024-12-20T08:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('문서 업데이트', '테스트 태스크 9입니다.', 'medium', true, '2025-01-25', '2024-12-25T15:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('회의 참석', '테스트 태스크 10입니다.', 'low', true, '2025-01-30', '2024-12-30T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('프로젝트 계획 수립', '테스트 태스크 11입니다.', 'high', true, '2025-02-05', '2025-01-05T11:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('팀 미팅', '테스트 태스크 12입니다.', 'medium', true, '2025-02-10', '2025-01-10T13:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),

-- 대기 중인 태스크들 (18개)
('클라이언트 미팅', '테스트 태스크 13입니다.', 'high', false, '2025-02-15', '2025-01-15T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('기술 검토', '테스트 태스크 14입니다.', 'medium', false, '2025-02-20', '2025-01-20T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('버그 수정', '테스트 태스크 15입니다.', 'low', false, '2025-02-25', '2025-01-25T14:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('새 기능 개발', '테스트 태스크 16입니다.', 'high', false, '2025-03-01', '2025-01-30T11:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('테스트 실행', '테스트 태스크 17입니다.', 'medium', false, '2025-03-05', '2025-02-05T15:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('문서화', '테스트 태스크 18입니다.', 'low', false, '2025-03-10', '2025-02-10T12:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('코드 정리', '테스트 태스크 19입니다.', 'high', false, '2025-03-15', '2025-02-15T13:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('배포 스크립트 작성', '테스트 태스크 20입니다.', 'medium', false, '2025-03-20', '2025-02-20T16:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('모니터링 설정', '테스트 태스크 21입니다.', 'low', false, '2025-03-25', '2025-02-25T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('백업 정책 수립', '테스트 태스크 22입니다.', 'high', false, '2025-03-30', '2025-03-01T10:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('로깅 시스템 구축', '테스트 태스크 23입니다.', 'medium', false, '2025-04-05', '2025-03-05T14:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('알림 설정', '테스트 태스크 24입니다.', 'low', false, '2025-04-10', '2025-03-10T11:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('성능 모니터링', '테스트 태스크 25입니다.', 'high', false, '2025-04-15', '2025-03-15T15:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('보안 점검', '테스트 태스크 26입니다.', 'medium', false, '2025-04-20', '2025-03-20T12:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('업데이트 계획', '테스트 태스크 27입니다.', 'low', false, '2025-04-25', '2025-03-25T13:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('훈련 자료 준비', '테스트 태스크 28입니다.', 'high', false, '2025-04-30', '2025-03-30T16:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('평가 보고서', '테스트 태스크 29입니다.', 'medium', false, '2025-05-05', '2025-04-01T09:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('다음 단계 계획', '테스트 태스크 30입니다.', 'low', false, '2025-05-10', '2025-04-05T14:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1));

-- 4. 노트 생성 (15개)
INSERT INTO notes (title, content, created_at, user_id, folder_id) VALUES
('회의록', '오늘 회의에서 논의된 내용을 정리했습니다.', '2024-11-15T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('아이디어 노트', '새로운 아이디어가 떠올라서 기록해둡니다.', '2024-11-20T14:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('학습 노트', '학습한 내용을 정리한 노트입니다.', '2024-11-25T16:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('문제 해결 과정', '문제를 해결하는 과정을 기록했습니다.', '2024-11-30T11:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('참고 자료', '참고할 만한 자료들을 모아둡니다.', '2024-12-05T15:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('계획서', '프로젝트 계획을 세워봤습니다.', '2024-12-10T12:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('체크리스트', '체크해야 할 항목들을 정리했습니다.', '2024-12-15T10:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('메모', '중요한 메모를 기록합니다.', '2024-12-20T16:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('참고 링크', '유용한 링크들을 모아둡니다.', '2024-12-25T13:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('할 일 목록', '해야 할 일들을 정리했습니다.', '2024-12-30T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('회의 준비 자료', '다음 회의를 위한 자료를 준비했습니다.', '2025-01-05T14:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('기술 문서', '기술적인 내용을 정리한 문서입니다.', '2025-01-10T16:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('학습 계획', '앞으로의 학습 계획을 세워봤습니다.', '2025-01-15T11:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '학습 자료' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('프로젝트 요약', '프로젝트 진행 상황을 요약했습니다.', '2025-01-20T15:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '회의 준비' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('개선 아이디어', '시스템 개선을 위한 아이디어들을 모았습니다.', '2025-01-25T12:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '보고서 작성' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1));

-- 확인 쿼리
SELECT 'User Profiles' as table_name, COUNT(*) as count FROM user_profiles WHERE username = 'testuser'
UNION ALL
SELECT 'Folders' as table_name, COUNT(*) as count FROM folders WHERE user_id = (SELECT id FROM user_profiles WHERE username = 'testuser')
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as count FROM tasks WHERE user_id = (SELECT id FROM user_profiles WHERE username = 'testuser')
UNION ALL
SELECT 'Notes' as table_name, COUNT(*) as count FROM notes WHERE user_id = (SELECT id FROM user_profiles WHERE username = 'testuser'); 