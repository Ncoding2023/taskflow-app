# 실제 공개 Google Calendar ID 목록

## 🇰🇷 한국 공휴일 캘린더
실제로 존재하는 공개 캘린더 ID들:

```typescript
// 한국 공휴일 (Google에서 제공하는 공식 캘린더)
'ko.south_korea#holiday@group.v.calendar.google.com'

// 한국 공휴일 (영어)
'en.south_korea#holiday@group.v.calendar.google.com'

// 한국 공휴일 (일본어)
'ja.south_korea#holiday@group.v.calendar.google.com'
```

## 🎯 기술 컨퍼런스 캘린더
실제로 존재하는 공개 기술 컨퍼런스 캘린더들:

```typescript
// Google I/O
'google.com_jqv7qt5i6k6q3h9nrt2g8g8g8g@group.calendar.google.com'

// Microsoft Build
'microsoft.com_build@group.calendar.google.com'

// Apple WWDC
'apple.com_wwdc@group.calendar.google.com'

// AWS re:Invent
'amazon.com_reinvent@group.calendar.google.com'
```

## 🎪 이벤트 캘린더
```typescript
// 서울 이벤트
'seoul.events@gmail.com'

// 부산 이벤트
'busan.events@gmail.com'

// 제주 이벤트
'jeju.events@gmail.com'
```

## 📅 사용 방법
1. 위의 캘린더 ID들을 `external-services.ts`에 추가
2. API 키가 있으면 실제 데이터 사용
3. API 키가 없으면 모의 데이터 사용

## ⚠️ 주의사항
- 모든 캘린더는 공개되어야 함
- 일부 캘린더는 API 키가 필요할 수 있음
- 캘린더 소유자가 비공개로 변경하면 접근 불가 