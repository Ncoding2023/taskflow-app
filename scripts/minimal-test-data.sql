-- 최소한의 테스트 데이터 생성
-- 현재 앱 구조에 맞춰 수정됨

-- 1. 테스트 사용자 생성
INSERT INTO user_profiles (username, display_name, password_hash) 
VALUES ('testuser', '테스트 사용자', 'dummy_hash_for_testing')
ON CONFLICT (username) DO NOTHING;

-- 2. 폴더 생성 (2개만)
INSERT INTO folders (name, color, user_id, created_at) VALUES
('프로젝트 A', '#3B82F6', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-01T00:00:00Z'),
('개인 업무', '#10B981', (SELECT id FROM user_profiles WHERE username = 'testuser'), '2024-01-02T00:00:00Z');

-- 3. 태스크 생성 (10개만)
INSERT INTO tasks (title, description, priority, completed, due_date, created_at, user_id, folder_id) VALUES
-- 완료된 태스크들 (4개)
('API 문서 작성', '테스트 태스크 1입니다.', 'high', true, '2024-12-15', '2024-11-15T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('데이터베이스 설계', '테스트 태스크 2입니다.', 'medium', true, '2024-12-20', '2024-11-20T08:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('UI 컴포넌트 개발', '테스트 태스크 3입니다.', 'low', true, '2024-12-25', '2024-11-25T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('테스트 코드 작성', '테스트 태스크 4입니다.', 'high', true, '2024-12-30', '2024-11-30T13:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),

-- 대기 중인 태스크들 (6개)
('코드 리뷰', '테스트 태스크 5입니다.', 'medium', false, '2025-01-05', '2024-12-05T09:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('배포 준비', '테스트 태스크 6입니다.', 'high', false, '2025-01-10', '2024-12-10T14:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('성능 최적화', '테스트 태스크 7입니다.', 'low', false, '2025-01-15', '2024-12-15T11:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('보안 검토', '테스트 태스크 8입니다.', 'high', false, '2025-01-20', '2024-12-20T08:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('문서 업데이트', '테스트 태스크 9입니다.', 'medium', false, '2025-01-25', '2024-12-25T15:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('회의 참석', '테스트 태스크 10입니다.', 'low', false, '2025-01-30', '2024-12-30T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1));

-- 4. 노트 생성 (5개만)
INSERT INTO notes (title, content, created_at, user_id, folder_id) VALUES
('회의록', '오늘 회의에서 논의된 내용을 정리했습니다.', '2024-11-15T10:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('아이디어 노트', '새로운 아이디어가 떠올라서 기록해둡니다.', '2024-11-20T14:30:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('학습 노트', '학습한 내용을 정리한 노트입니다.', '2024-11-25T16:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('참고 자료', '참고할 만한 자료들을 모아둡니다.', '2024-12-05T15:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '개인 업무' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1)),
('계획서', '프로젝트 계획을 세워봤습니다.', '2024-12-10T12:00:00Z', (SELECT id FROM user_profiles WHERE username = 'testuser'), (SELECT id FROM folders WHERE name = '프로젝트 A' AND user_id = (SELECT id FROM user_profiles WHERE username = 'testuser') LIMIT 1));

-- 확인 쿼리
SELECT 'User Profiles' as table_name, COUNT(*) as count FROM user_profiles WHERE username = 'testuser'
UNION ALL
SELECT 'Folders' as table_name, COUNT(*) as count FROM folders WHERE user_id = (SELECT id FROM user_profiles WHERE username = 'testuser')
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as count FROM tasks WHERE user_id = (SELECT id FROM user_profiles WHERE username = 'testuser')
UNION ALL
SELECT 'Notes' as table_name, COUNT(*) as count FROM notes WHERE user_id = (SELECT id FROM user_profiles WHERE username = 'testuser'); 