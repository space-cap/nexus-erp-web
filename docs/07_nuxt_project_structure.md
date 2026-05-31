# Nuxt ERP Mock 프로젝트 구조 문서

## 1. 문서 목적

이 문서는 `erp-nuxt-front` Nuxt 프로젝트의 현재 구조, 라우트, mock 데이터 흐름을 정리한다. 백엔드는 아직 정해지지 않았으므로 화면 검증은 `app/data/mock/erp.ts`와 `useMockErpStore.ts`를 기준으로 진행한다.

## 2. 실행 방법

```powershell
cd erp-nuxt-front
npm install
npm run dev -- --host 127.0.0.1 --port 3001
```

접속 주소:

```text
http://127.0.0.1:3001/
```

## 3. 주요 폴더 구조

```text
erp-nuxt-front
├─ app
│  ├─ assets/css/main.css
│  ├─ components
│  │  ├─ common
│  │  ├─ customers
│  │  ├─ dashboard
│  │  ├─ data
│  │  ├─ items
│  │  ├─ layout
│  │  ├─ orders
│  │  ├─ production
│  │  └─ purchase
│  ├─ composables
│  ├─ constants
│  ├─ data/mock
│  ├─ pages
│  ├─ services
│  ├─ types
│  └─ utils
├─ package.json
└─ nuxt.config.ts
```

## 4. 화면 라우트

| URL | 화면 | 설명 |
| --- | --- | --- |
| `/` | 대시보드 진입 | 기본 진입 화면 |
| `/dashboard` | 대시보드 | KPI, 매출 흐름, 재고 경고, 생산 일정 |
| `/customers` | 거래처 관리 | 거래처 목록, 검색, 상세 패널 |
| `/customers/new` | 거래처 신규 등록 | mock 거래처 등록 |
| `/customers/[code]` | 거래처 상세 | 거래처 상세 조회 |
| `/customers/[code]/edit` | 거래처 수정 | mock 거래처 수정 |
| `/items` | 품목 관리 | 품목 목록, 검색, 상세 패널 |
| `/items/new` | 품목 신규 등록 | mock 품목 등록 |
| `/items/[code]` | 품목 상세 | 품목 상세 조회 |
| `/items/[code]/edit` | 품목 수정 | mock 품목 수정 |
| `/inventory` | 재고 현황 | 현재고, 예약재고, 가용재고 조회 |
| `/inventory/transactions` | 재고 입출고 | 입고, 출고, 조정 mock 처리 |
| `/orders` | 수주 관리 | 수주 목록 |
| `/orders/new` | 수주 신규 등록 | 거래처, 품목, 수량 기반 mock 수주 등록 |
| `/orders/[no]` | 수주 상세 | 수주 상세와 예약재고 반영 상태 조회 |
| `/orders/[no]/edit` | 수주 수정 | 수주 수정과 예약재고 재계산 |
| `/purchase` | 발주 관리 | 발주 목록 |
| `/purchase/new` | 발주 신규 등록 | 매입처, 품목, 수량 기반 mock 발주 등록 |
| `/purchase/[no]` | 발주 상세 | 발주 상세와 입고 처리 상태 조회 |
| `/purchase/[no]/edit` | 발주 수정 | 발주 수정, 완료 시 재고 입고 반영 |
| `/production` | 생산 계획 | 생산 계획 목록 |
| `/production/new` | 생산 계획 신규 등록 | 품목, 라인, 수량, 일정 기반 생산 계획 등록 |
| `/audit-logs` | 처리 이력 | 수주, 발주, 생산, 재고 감사 로그 |
| `/users` | 사용자 관리 | 사용자 목록 |
| `/login` | 로그인/권한 선택 | mock 사용자 역할 전환 |
| `/forbidden` | 접근 제한 | 권한 없는 URL 접근 시 안내 |

## 5. Mock 데이터 흐름

현재 데이터 흐름:

```text
app/data/mock/erp.ts
  -> useMockErpStore.ts
  -> 화면 컴포넌트
  -> localStorage 저장
```

`useMockErpStore.ts`는 화면 간 공유 mock 상태를 관리한다. 등록/수정/입출고 처리 후에는 브라우저 `localStorage`에 저장하므로 새로고침 후에도 사용자가 만든 mock 데이터가 유지된다.

현재 지원하는 동작:

- 거래처 신규 등록, 수정, 상세 조회
- 품목 신규 등록, 수정, 상세 조회
- 수주 신규 등록, 수정, 상세 조회
- 수주 수량 기반 예약재고 반영과 가용재고 재계산
- 발주 신규 등록, 수정, 상세 조회
- 발주 상태를 `완료`로 저장할 때 재고 입고 자동 반영
- 수주 상태를 `완료`로 저장할 때 예약재고 해제와 출고 자동 반영
- 수주 상세에서 생산 지시 생성
- 생산 계획 신규 등록, 상세 조회, 수정
- 생산 계획 상태를 `진행`으로 저장할 때 자재 출고 자동 반영
- 생산 계획 상태를 `완료`로 저장할 때 제품 입고 자동 반영
- 대시보드 발주 후보 자동 표시
- 대시보드 발주 후보에서 발주 등록 폼 자동 채우기
- 역할별 등록/수정/처리 버튼 노출 제어
- 역할별 URL 직접 접근 제한
- 수주/발주/생산/재고 처리 이력 자동 기록
- 처리 이력 화면에서 업무와 처리 유형별 감사 로그 조회
- 재고 입고, 출고, 조정
- 대시보드 KPI 클릭 이동
- mock 사용자 역할별 메뉴 노출

## 6. 컴포넌트 역할

| 컴포넌트 | 역할 |
| --- | --- |
| `AppShell.vue` | 전체 레이아웃 |
| `Sidebar.vue` | 메뉴와 권한별 메뉴 노출 |
| `Topbar.vue` | 전역 검색, 알림, 현재 사용자 |
| `DashboardView.vue` | 대시보드 KPI와 업무 현황 |
| `ErpModuleView.vue` | ERP 목록, 필터, 상세 패널 공통 화면 |
| `CustomerForm.vue` | 거래처 등록/수정 폼 |
| `ItemForm.vue` | 품목 등록/수정 폼 |
| `OrderForm.vue` | 수주 등록/수정 폼 |
| `PurchaseForm.vue` | 발주 등록/수정 폼 |
| `ProductionForm.vue` | 생산 계획 등록 폼 |
| `StatusBadge.vue` | 상태 배지 |
| `AppToast.vue` | 액션 결과 알림 |

## 7. 권한과 라우트 접근 제어

mock 로그인은 선택한 사용자 ID를 쿠키에 저장한다. 따라서 새로고침하거나 주소창에 직접 URL을 입력해도 선택한 역할 기준으로 접근 가능 여부를 판단한다.

전역 라우트 미들웨어 `app/middleware/auth.global.ts`는 다음 순서로 접근을 검사한다.

| 검사 | 설명 |
| --- | --- |
| 메뉴 권한 | `/users`, `/audit-logs` 등 현재 역할이 볼 수 없는 메뉴 접근 차단 |
| 작업 권한 | `/orders/new`, `/purchase/{no}/edit` 등 신규/수정 URL 직접 접근 차단 |
| 예외 경로 | `/login`, `/forbidden`은 항상 접근 가능 |

권한이 없으면 `/forbidden` 화면으로 이동하고, 요청 경로와 필요한 메뉴/작업 권한을 표시한다.

## 8. 다음 확장 방향

다음 단계는 업무 간 연결 강도를 더 높이는 것이다.

1. 발주 후보에서 매입처 추천 규칙 고도화
2. 수주별 생산 계획 추적 탭 추가
3. 생산 BOM 기준 자재 차감 구조 설계
4. 백엔드 후보가 정해진 뒤 API 계약서 최종화
