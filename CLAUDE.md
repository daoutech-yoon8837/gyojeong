@AGENTS.md

# CLAUDE.md — 교정(Gyojeong) 밴드 웹사이트

## 프로젝트 개요
인디팝/로파이 밴드 "교정"의 공식 소개 웹사이트.
공연 일정, 갤러리, 음악(앨범/트랙), 멤버 소개를 관리하고 공개한다.
비개발자 밴드 멤버가 관리자 페이지를 사용하므로 UI는 단순해야 한다.
1개 밴드로 시작하되 멀티밴드 확장 가능한 DB 구조.

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)
- Vercel 호스팅 (gyojeong.vercel.app)
- lucide-react (아이콘)
- Node 20+ 필수 (`nvm use 20` or `nvm use 24`)
- 인증: @supabase/ssr 쿠키 기반 세션 + proxy.ts(Next.js 16 middleware) 토큰 자동 갱신

## 환경변수
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `.env.local`에 설정 완료 (Supabase 프로젝트: xnfdzvlbiosjlakrcipi)

## 디자인
- **공개 페이지**: 라이트 미니멀 테마 (wave to earth 벤치마킹)
  - 화이트 배경 (#ffffff) + 블랙 텍스트 (#1a1a1a)
  - 장식 최소화, 타이포그래피 중심
  - 네비게이션: Tour / Gallery / Discography / About (영문)
  - 섹션 구분: `border-t border-border`로 가느다란 라인
  - 버튼/링크: underline 스타일, hover:opacity-60
  - 카드/라운드 제거 → 플랫한 레이아웃
- **관리자 페이지**: 라이트 테마 (화이트 배경, 가독성 우선) — 별도 수정 없음
- 모바일 퍼스트 반응형
- 폰트: Noto Sans KR (weight: 400, 500, 700)

## 페이지 구조

### 공개 페이지 `app/(public)/`
- `/` — 메인 (히어로 → Tour → Gallery → About 미리보기)
- `/about` — 밴드 소개 + 멤버 목록
- `/shows` — 공연 일정 (Upcoming / Past 구분, 리스트형)
- `/shows/[id]` — 공연 상세
- `/gallery` — 갤러리 목록 (그리드)
- `/gallery/[id]` — 갤러리 상세 (이미지 뷰어)
- `/music` — 앨범/디스코그래피
- `/music/[id]` — 앨범 상세 (트랙리스트 + 스트리밍 링크)

### 관리자 페이지 `app/admin/`
- `/admin` — 로그인
- `/admin/dashboard` — 대시보드
- `/admin/shows` — 공연 CRUD (ShowForm 컴포넌트)
- `/admin/gallery` — 갤러리 CRUD (GalleryForm + ImageGrid)
- `/admin/music` — 앨범/트랙 CRUD (AlbumForm)
- `/admin/members` — 멤버 관리 (인라인 편집)
- `/admin/settings` — 사이트 설정

## DB 스키마 (`supabase-setup.sql`)
- `bands` — 밴드 정보 (멀티밴드 확장용)
- `members` — 멤버 (band_id FK, sort_order)
- `shows` — 공연 일정 (show_date, poster_image, ticket_url, is_published)
- `albums` — 앨범 (cover_image, streaming_links jsonb)
- `tracks` — 트랙 (album_id FK, track_number)
- `gallery` — 갤러리 (images text[], is_published)
- `site_settings` — 사이트 설정 (단일 행, id=1 CHECK)
- Storage 버킷: `band-images` (public)
- RLS: 공개 SELECT + 인증 사용자 전체 권한

## 공용 컴포넌트
- `app/components/Header.tsx` — 고정 네비게이션 (화이트, 투명 blur)
- `app/components/Footer.tsx` — 푸터 (SNS 링크, 미니멀)
- `app/admin/ImageGrid.tsx` — 멀티 이미지 업로드/드래그 정렬
- `app/admin/SingleImageUpload.tsx` — 단일 이미지 업로드
- `app/admin/upload.ts` — 이미지 압축 + Storage 업로드 유틸

## Supabase 클라이언트 패턴
- 브라우저: `lib/supabase.ts` → `import { supabase } from "@/lib/supabase"`
- 서버: `lib/supabase-server.ts` → `import { createSupabaseServer } from "@/lib/supabase-server"`
- 설정: `lib/settings.ts` → `import { getSiteSettings } from "@/lib/settings"`

## 작업 진행 현황

| 단계 | 작업 | 상태 |
|------|------|------|
| 1 | 프로젝트 셋업 (Next.js + Supabase 패키지) | ✅ 완료 |
| 2 | DB 스키마 SQL 작성 | ✅ 완료 (supabase-setup.sql) |
| 3 | 공개 페이지 전체 구현 | ✅ 완료 |
| 4 | 관리자 페이지 전체 구현 | ✅ 완료 |
| 5 | 빌드 검증 | ✅ 성공 |
| - | Supabase 프로젝트 생성 | ✅ 완료 |
| - | supabase-setup.sql 실행 | ✅ 완료 |
| - | .env.local 실제 값 설정 | ✅ 완료 |
| - | Supabase Auth 관리자 계정 생성 | ✅ 완료 |
| - | GitHub repo push | ✅ 완료 (daoutech-yoon8837/gyojeong) |
| - | 공개 페이지 디자인 리뉴얼 (라이트 미니멀) | ✅ 완료 |
| - | Vercel 배포 + 환경변수 등록 | ⬜ 미완료 |
| - | SEO (sitemap, robots.txt, OG이미지) | ⬜ 미완료 |
| - | 관리자 페이지 디자인 검수 | ⬜ 미완료 |

## 남은 작업

### 즉시 필요
1. Vercel import + 환경변수 등록 + 배포
2. bands 테이블 genre "록/인디록" → "인디팝/로파이"로 업데이트

### 이후 작업
3. SEO 마무리 (sitemap.ts, robots.ts, OG이미지)
4. 관리자 페이지 디자인 검수
5. 밴드 사진 추가 시 히어로/about 페이지에 사진 배치
