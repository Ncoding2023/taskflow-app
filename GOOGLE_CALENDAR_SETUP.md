# Google Calendar API 설정 가이드

## 🔑 API 키 생성 (무료)

### 1. Google Cloud Console 접속
- https://console.cloud.google.com/ 접속
- Google 계정으로 로그인

### 2. 프로젝트 생성
- "프로젝트 선택" → "새 프로젝트"
- 프로젝트 이름: `taskflow-calendar-api`
- "만들기" 클릭

### 3. Calendar API 활성화
- 왼쪽 메뉴 → "API 및 서비스" → "라이브러리"
- 검색창에 "Google Calendar API" 입력
- "Google Calendar API" 선택 → "사용" 클릭

### 4. API 키 생성
- 왼쪽 메뉴 → "API 및 서비스" → "사용자 인증 정보"
- "사용자 인증 정보 만들기" → "API 키"
- 생성된 API 키 복사

### 5. API 키 제한 설정 (보안)
- 생성된 API 키 클릭
- "애플리케이션 제한사항" → "HTTP 리퍼러"
- "웹사이트 제한사항" 추가:
  - `http://localhost:5173/*`
  - `http://localhost:5174/*`
  - `https://your-domain.com/*` (배포 시)
  https://console.cloud.google.com/apis/credentials/key/62ff180f-d16d-4d27-8495-800a4bad8ab9?inv=1&invt=Ab401Q&project=taskflow-calendar-api

### 6. 환경 변수 설정
`.env` 파일에 추가:
```bash
VITE_GOOGLE_CALENDAR_API_KEY=your_api_key_here
```

## 💰 비용
- **무료 플랜**: 1,000,000 requests/day
- **유료 플랜**: $5 per 1,000 requests (초과 시)

## 🔒 보안
- API 키는 클라이언트에 노출되지만 제한된 권한
- 공개 캘린더만 읽기 가능
- 민감한 개인 정보 접근 불가

## 🎯 사용 목적
- 한국 공휴일 정보 표시
- 기술 컨퍼런스 일정 표시
- 사용자에게 유용한 이벤트 정보 제공 