-- 테스트 사용자 비밀번호 설정
-- 비밀번호: test123 (SHA256 해시)
-- testuser
-- test123

-- 기존 테스트 사용자 삭제 (있다면)
DELETE FROM user_profiles WHERE username = 'testuser';

-- 새로운 테스트 사용자 생성 (올바른 비밀번호 해시 포함)
INSERT INTO user_profiles (username, display_name, password_hash) 
VALUES (
  'testuser', 
  '테스트 사용자', 
  'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae'
);

-- 확인
SELECT username, display_name FROM user_profiles WHERE username = 'testuser'; 