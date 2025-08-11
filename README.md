# TaskFlow - Task Management App

TaskFlow는 개인 작업 관리를 위한 웹 애플리케이션입니다.

## 기능

- ✅ **태스크 관리**: 생성, 편집, 삭제, 완료 상태 관리
- ✅ **폴더 관리**: 태스크와 노트를 폴더로 정리
- ✅ **노트 관리**: 아이디어와 메모 기록
- ✅ **사용자 인증**: 사용자명 기반 로그인/회원가입
- ✅ **모달 기반 UX**: 모든 CRUD 작업이 모달로 통일
- ✅ **외부 서비스 연동**: 날씨 정보와 공개 캘린더 이벤트 표시

## 기술 스택

- **Frontend**: Remix, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth)
- **Deployment**: Vercel (권장)

## 개발 환경 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# OpenWeather API (선택사항 - 날씨 기능 사용 시)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# 앱 설정
APP_URL=http://localhost:5173
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `database-schema.sql` 파일의 내용을 Supabase SQL Editor에서 실행
3. Settings > API에서 URL과 anon key를 복사하여 `.env` 파일에 설정

### 3. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

## 배포

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 연결
3. 환경변수 설정 (Vercel 대시보드에서)
4. 자동 배포 완료

### 수동 배포

```bash
npm run build
npm start
```

## 프로젝트 구조

```
taskflow-app/
├── app/
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── routes/             # Remix 라우트
│   ├── contexts/           # React Context
│   └── lib/               # 유틸리티 함수
├── database-schema.sql     # 데이터베이스 스키마
├── AUTH_SYSTEM.md         # 인증 시스템 문서
├── TASK_SYSTEM.md         # 태스크 시스템 문서
└── DAILY_LOG.md           # 개발 로그
```

## 문서

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Supabase docs](https://supabase.com/docs)
- 📖 [Tailwind CSS docs](https://tailwindcss.com/docs)

## Development

Run the dev server:

```sh
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
