# TaskFlow 인증 시스템 구현 문서

## 📋 개요
TaskFlow는 **커스텀 인증 시스템**을 사용하여 이메일 없이 사용자명과 비밀번호만으로 회원가입/로그인이 가능한 시스템입니다.

## 🏗️ 시스템 아키텍처

### 1. 데이터베이스 구조
```sql
-- 사용자 프로필 테이블
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  -- 고유 ID
  username VARCHAR(50) UNIQUE NOT NULL,          -- 사용자명 (아이디)
  password_hash VARCHAR(255) NOT NULL,           -- 암호화된 비밀번호
  display_name VARCHAR(100),                     -- 실제 이름/별명
  avatar_url TEXT,                              -- 프로필 이미지 (선택)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 폴더 테이블
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 태스크 테이블
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority priority_level DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 노트 테이블
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 인증 플로우

### 회원가입 과정
1. **사용자 입력**
   - 사용자명 (최소 3자)
   - 이름/별명 (최소 2자)
   - 비밀번호 (최소 6자)
   - 비밀번호 확인

2. **유효성 검사**
   - 필수 필드 확인
   - 비밀번호 일치 확인
   - 길이 제한 확인
   - 사용자명 중복 확인

3. **데이터 처리**
   - 비밀번호 SHA256 해시 생성
   - user_profiles 테이블에 저장

4. **결과**
   - 성공: 로그인 페이지로 리다이렉트
   - 실패: 오류 메시지 표시

### 로그인 과정
1. **사용자 입력**
   - 사용자명
   - 비밀번호

2. **인증 확인**
   - 비밀번호 SHA256 해시 생성
   - user_profiles 테이블에서 사용자명과 해시된 비밀번호 확인

3. **결과**
   - 성공: 대시보드로 리다이렉트
   - 실패: 오류 메시지 표시

## 🛡️ 보안 특징

### 비밀번호 보안
- **SHA256 해시** 사용
- **평문 비밀번호** 데이터베이스에 저장하지 않음
- **솔트** 미사용 (개선 가능)

### 데이터 보안
- **Row Level Security (RLS)** 활성화
- **사용자별 데이터 분리**
- **외래키 제약 조건**으로 데이터 무결성 보장

## 📁 파일 구조

```
app/
├── routes/
│   ├── auth.login.tsx      # 로그인 페이지
│   ├── auth.register.tsx   # 회원가입 페이지
│   └── _index.tsx         # 대시보드 (인증 필요)
├── lib/
│   └── supabase.ts        # Supabase 클라이언트
└── database-schema.sql    # 데이터베이스 스키마
```

## 🔧 기술 스택

### Frontend
- **Remix** (Full-stack framework)
- **React** (UI 라이브러리)
- **TypeScript** (타입 안정성)
- **Tailwind CSS** (스타일링)

### Backend
- **Supabase** (PostgreSQL 데이터베이스)
- **Node.js** (서버 환경)
- **crypto** (비밀번호 해시)

### 데이터베이스
- **PostgreSQL** (Supabase)
- **UUID** (고유 식별자)
- **RLS** (Row Level Security)

## 🚀 사용자 경험

### 회원가입
```
사용자명: nam6113
이름: 홍길동
비밀번호: 123456
→ 회원가입 성공
→ 로그인 페이지로 이동
```

### 로그인
```
사용자명: nam6113
비밀번호: 123456
→ 로그인 성공
→ 대시보드로 이동
```

### 대시보드
```
안녕하세요, 홍길동님!
→ 사용자별 태스크/폴더/노트 관리
```

## 🔄 향후 개선 사항

### 보안 강화
- [ ] **솔트** 추가 (bcrypt 사용)
- [ ] **JWT 토큰** 기반 세션 관리
- [ ] **세션 쿠키** 구현
- [ ] **비밀번호 정책** 강화

### 기능 확장
- [ ] **이메일 인증** (선택사항)
- [ ] **비밀번호 재설정**
- [ ] **프로필 편집**
- [ ] **소셜 로그인**

### 사용자 경험
- [ ] **자동 로그인** (Remember me)
- [ ] **로그인 시도 제한**
- [ ] **계정 잠금** 기능
- [ ] **활동 로그** 기록

## 📊 데이터 흐름

```
회원가입:
사용자 입력 → 유효성 검사 → 비밀번호 해시 → DB 저장 → 로그인 페이지

로그인:
사용자 입력 → 비밀번호 해시 → DB 확인 → 세션 생성 → 대시보드

데이터 관리:
사용자별 폴더/태스크/노트 → RLS로 분리 → 개인 데이터 보호
```

## ✅ 현재 구현 완료 사항

- [x] **회원가입** (사용자명 + 이름 + 비밀번호)
- [x] **로그인** (사용자명 + 비밀번호)
- [x] **비밀번호 해시** (SHA256)
- [x] **사용자명 중복 확인**
- [x] **데이터베이스 스키마**
- [x] **RLS 정책**
- [x] **기본 UI/UX**

## 🎯 핵심 장점

1. **이메일 불필요**: 간단한 회원가입
2. **사용자 친화적**: 이름과 아이디 분리
3. **보안**: 비밀번호 해시 저장
4. **확장성**: 모듈화된 구조
5. **성능**: 효율적인 데이터베이스 설계

---

**작성일**: 2025년 8월 01일
**버전**: 1.0.0
**상태**: 기본 기능 완료 