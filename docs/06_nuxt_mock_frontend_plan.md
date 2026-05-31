# Nuxt 기반 ERP Mock 프론트엔드 전환 계획서

## 1. 문서 목적

이 문서는 현재 정적 HTML/CSS/JavaScript로 만든 ERP Web Mock UI를 Nuxt 기반 프론트엔드 프로젝트로 전환하기 위한 계획서이다. 아직 백엔드는 정해지지 않았으므로, 실제 API 연동 전까지는 mock 데이터를 계속 사용한다.

중요한 기준은 다음과 같다.

- 프론트엔드는 Nuxt 기반으로 설계한다.
- 백엔드는 아직 확정하지 않는다.
- 화면 개발은 mock 데이터로 계속 진행한다.
- 나중에 백엔드가 정해져도 화면 코드를 크게 바꾸지 않도록 데이터 접근 계층을 분리한다.

## 2. 현재 상태와 목표 상태

| 구분 | 현재 상태 | 목표 상태 |
| --- | --- | --- |
| 화면 기술 | 정적 HTML/CSS/JavaScript | Nuxt |
| 데이터 | `js/mock-data.js` | Nuxt 내부 mock 데이터 |
| 라우팅 | JavaScript 상태 전환 | Nuxt pages 라우팅 |
| 컴포넌트 | HTML 구조 중심 | Vue 컴포넌트 |
| 백엔드 | 없음 | 미정 |
| API 연동 | 없음 | 나중에 교체 가능하게 준비 |

## 3. Nuxt를 선택하는 이유

ERP 프론트엔드는 화면 수가 많고, 메뉴/목록/상세/필터/권한 같은 반복 구조가 많다. Nuxt는 다음 이유로 적합하다.

| 이유 | 설명 |
| --- | --- |
| 파일 기반 라우팅 | `pages` 폴더 구조만으로 화면 URL 관리 가능 |
| 컴포넌트 재사용 | 표, 필터, 상세 패널, 상태 배지를 공통화하기 좋음 |
| 프로젝트 구조화 | 업무별 화면이 늘어나도 폴더 기준을 잡기 쉬움 |
| Vue 기반 | 화면 상태와 데이터 표시가 직관적 |
| 추후 API 전환 용이 | composable 또는 service 계층을 통해 mock/API 교체 가능 |

## 4. 개발 원칙

## 4.1 mock 데이터 우선

백엔드가 정해지기 전에는 화면 개발을 멈추지 않고 mock 데이터로 계속 진행한다.

```text
Nuxt 화면
  → composable
  → mock service
  → mock data
```

나중에 백엔드가 생기면 아래처럼 바꾼다.

```text
Nuxt 화면
  → composable
  → api service
  → backend API
```

화면 컴포넌트는 mock인지 API인지 최대한 알지 못하게 만든다.

## 4.2 API 형태를 미리 흉내 낸다

mock 데이터를 단순 배열로 바로 import해서 화면에서 직접 필터링할 수도 있지만, 실제 전환을 생각하면 API 응답과 비슷한 형태로 감싸는 것이 좋다.

예시:

```javascript
{
  items: [],
  summary: {
    totalCount: 0,
    warningCount: 0
  }
}
```

## 4.3 화면은 업무 단위로 나눈다

Nuxt 라우팅은 ERP 메뉴 구조와 맞춘다.

```text
/dashboard
/customers
/items
/inventory
/orders
/purchase
/production
/users
```

처음 진입 주소 `/`는 `/dashboard`로 이동시키는 방식이 좋다.

## 5. 추천 Nuxt 프로젝트 구조

```text
erp-nuxt-front/
├─ app.vue
├─ nuxt.config.ts
├─ package.json
├─ assets/
│  └─ css/
│     └─ main.css
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.vue
│  │  ├─ Sidebar.vue
│  │  └─ Topbar.vue
│  ├─ common/
│  │  ├─ AppButton.vue
│  │  ├─ IconButton.vue
│  │  ├─ StatusBadge.vue
│  │  ├─ AppModal.vue
│  │  └─ AppToast.vue
│  ├─ data/
│  │  ├─ FilterBar.vue
│  │  ├─ DataTable.vue
│  │  ├─ DetailPanel.vue
│  │  └─ SummaryStrip.vue
│  └─ dashboard/
│     ├─ KpiCard.vue
│     ├─ BarChart.vue
│     ├─ TaskList.vue
│     └─ TimelineList.vue
├─ composables/
│  ├─ useErpModule.ts
│  ├─ useDashboard.ts
│  └─ useToast.ts
├─ data/
│  └─ mock/
│     ├─ dashboard.ts
│     ├─ customers.ts
│     ├─ items.ts
│     ├─ inventory.ts
│     ├─ orders.ts
│     ├─ purchase.ts
│     ├─ production.ts
│     └─ users.ts
├─ pages/
│  ├─ index.vue
│  ├─ dashboard.vue
│  ├─ customers.vue
│  ├─ items.vue
│  ├─ inventory.vue
│  ├─ orders.vue
│  ├─ purchase.vue
│  ├─ production.vue
│  └─ users.vue
├─ services/
│  ├─ erpRepository.ts
│  ├─ mockErpRepository.ts
│  └─ apiErpRepository.ts
├─ types/
│  └─ erp.ts
└─ utils/
   ├─ format.ts
   └─ status.ts
```

## 6. 폴더별 역할

| 폴더 | 역할 |
| --- | --- |
| `assets/css` | 전체 스타일 |
| `components/layout` | 전체 레이아웃 |
| `components/common` | 버튼, 배지, 모달 등 공통 UI |
| `components/data` | ERP 목록 화면 공통 컴포넌트 |
| `components/dashboard` | 대시보드 전용 컴포넌트 |
| `composables` | 화면에서 사용하는 상태와 기능 |
| `data/mock` | mock 데이터 |
| `pages` | Nuxt 화면 라우팅 |
| `services` | mock/API 데이터 접근 계층 |
| `types` | TypeScript 타입 |
| `utils` | 포맷팅, 상태 변환 함수 |

## 7. Mock 데이터 관리 방식

## 7.1 현재 방식

현재는 `js/mock-data.js`에 모든 데이터가 하나의 객체로 들어 있다.

```javascript
window.erpMock = {
  customers: [],
  items: [],
  inventory: []
};
```

## 7.2 Nuxt 전환 후 권장 방식

Nuxt에서는 업무별 파일로 나눈다.

```text
data/mock/customers.ts
data/mock/items.ts
data/mock/inventory.ts
```

예시:

```typescript
export const mockCustomers = [
  {
    code: "C-1001",
    name: "한빛정밀",
    status: "정상"
  }
];
```

## 7.3 mock 데이터 작성 원칙

| 원칙 | 설명 |
| --- | --- |
| 업무별 분리 | 한 파일에 모든 데이터를 넣지 않는다 |
| 타입 지정 | TypeScript interface를 사용한다 |
| 실제 필드명 후보 반영 | 나중에 API와 DB로 옮기기 쉽게 한다 |
| 예외 데이터 포함 | 지연, 부족, 중지 같은 상태를 일부러 넣는다 |
| 날짜 형식 통일 | `YYYY-MM-DD` 기준으로 작성한다 |

## 8. TypeScript 타입 설계

Nuxt로 전환할 때는 mock 데이터에도 타입을 붙이는 것이 좋다.

```typescript
export type ErpStatus =
  | "정상"
  | "진행"
  | "대기"
  | "지연"
  | "부족"
  | "완료"
  | "중지";

export interface Customer {
  code: string;
  name: string;
  ceo: string;
  bizNo: string;
  manager: string;
  phone: string;
  status: ErpStatus;
  lastDate: string;
  amount: number;
}
```

백엔드가 확정되면 한글 상태값을 API 코드값으로 바꿀 수 있다.

예시:

```typescript
export type ApiStatus =
  | "ACTIVE"
  | "IN_PROGRESS"
  | "WAITING"
  | "DELAYED"
  | "LOW_STOCK"
  | "DONE"
  | "INACTIVE";
```

## 9. 데이터 접근 계층 설계

## 9.1 Repository 인터페이스

화면에서 mock 데이터를 직접 import하지 않고 repository를 통해 가져오게 만든다.

```typescript
export interface ErpRepository {
  getCustomers(params: ListParams): Promise<ListResponse<Customer>>;
  getItems(params: ListParams): Promise<ListResponse<Item>>;
  getInventory(params: ListParams): Promise<ListResponse<InventoryStock>>;
  getOrders(params: ListParams): Promise<ListResponse<SalesOrder>>;
  getPurchaseOrders(params: ListParams): Promise<ListResponse<PurchaseOrder>>;
  getProductionPlans(params: ListParams): Promise<ListResponse<ProductionPlan>>;
  getUsers(params: ListParams): Promise<ListResponse<AppUser>>;
}
```

## 9.2 Mock Repository

백엔드가 없을 때는 mock repository를 사용한다.

```typescript
export const mockErpRepository: ErpRepository = {
  async getCustomers(params) {
    return filterMockList(mockCustomers, params);
  }
};
```

## 9.3 API Repository

백엔드가 정해진 뒤에는 같은 인터페이스를 유지하고 내부만 API 호출로 바꾼다.

```typescript
export const apiErpRepository: ErpRepository = {
  async getCustomers(params) {
    return await $fetch("/api/customers", { query: params });
  }
};
```

## 10. Composable 설계

## 10.1 `useErpModule`

목록 화면에서 공통으로 사용하는 검색, 필터, 선택 행, 상세 패널 상태를 관리한다.

담당 기능:

- 검색어
- 상태 필터
- 기간 필터
- 목록 데이터
- 선택한 행
- 요약 데이터
- CSV 다운로드

## 10.2 `useDashboard`

대시보드 데이터를 관리한다.

담당 기능:

- KPI 데이터
- 월별 매출 흐름
- 처리 필요 목록
- 재고 경고
- 생산 일정

## 10.3 `useToast`

저장, 처리, 다운로드 같은 사용자 액션 결과 메시지를 관리한다.

## 11. 화면 라우팅 계획

| URL | 화면 | 현재 정적 UI 메뉴 |
| --- | --- | --- |
| `/` | 대시보드로 리다이렉트 | 대시보드 |
| `/dashboard` | 대시보드 | 대시보드 |
| `/customers` | 거래처 관리 | 거래처 관리 |
| `/items` | 품목 관리 | 품목 관리 |
| `/inventory` | 재고 현황 | 재고 현황 |
| `/orders` | 수주 관리 | 수주 관리 |
| `/purchase` | 발주 관리 | 발주 관리 |
| `/production` | 생산 계획 | 생산 계획 |
| `/users` | 사용자 관리 | 사용자 관리 |

상세 화면이 커지면 다음처럼 확장할 수 있다.

```text
/customers/[code]
/items/[code]
/orders/[no]
/purchase/[no]
/production/[no]
/users/[id]
```

## 12. UI 컴포넌트 전환 기준

| 현재 정적 UI | Nuxt 컴포넌트 |
| --- | --- |
| `.sidebar` | `Sidebar.vue` |
| `.topbar` | `Topbar.vue` |
| `.kpi-card` | `KpiCard.vue` |
| `.filter-bar` | `FilterBar.vue` |
| `table` | `DataTable.vue` |
| `.detail-panel` | `DetailPanel.vue` |
| `.status` | `StatusBadge.vue` |
| `.modal` | `AppModal.vue` |
| `.toast` | `AppToast.vue` |

## 13. 백엔드 미정 상태에서 하지 말아야 할 것

| 하지 말아야 할 것 | 이유 |
| --- | --- |
| 화면에서 API URL을 직접 박아넣기 | 백엔드 결정 시 전체 수정 필요 |
| 컴포넌트 안에서 mock 배열 직접 수정 | 실제 API 전환이 어려워짐 |
| DB 테이블명을 화면 코드에 고정 | DB가 바뀌면 프론트도 같이 흔들림 |
| 로그인/권한을 임시로 너무 깊게 구현 | 백엔드 인증 방식에 따라 다시 만들 가능성 높음 |
| 실제 저장처럼 보이는 기능을 과하게 만들기 | mock과 실제 데이터의 경계가 흐려짐 |

## 14. 백엔드 확정 전 개발 가능한 범위

백엔드가 없어도 다음 작업은 충분히 진행할 수 있다.

| 작업 | 가능 여부 | 설명 |
| --- | --- | --- |
| Nuxt 프로젝트 생성 | 가능 | 프론트엔드 구조 확정 |
| 레이아웃 구현 | 가능 | Sidebar, Topbar, AppShell |
| 화면 라우팅 | 가능 | pages 기반 |
| 목록/상세 UI | 가능 | mock 데이터로 구현 |
| 검색/필터 | 가능 | mock 데이터 기준 |
| CSV 다운로드 | 가능 | 클라이언트 처리 |
| 신규/수정 모달 | 가능 | mock 저장 처리 |
| 로그인 화면 | 가능 | 실제 인증 전 UI만 |
| 권한별 메뉴 노출 | 일부 가능 | mock user/role 기준 |
| 실제 저장 | 보류 | 백엔드 필요 |
| 실시간 재고 반영 | 보류 | 백엔드/DB 필요 |

## 15. 1차 Nuxt 전환 작업 순서

```text
1. Nuxt 프로젝트 생성
2. 현재 CSS를 Nuxt assets/css/main.css로 이동
3. AppShell, Sidebar, Topbar 컴포넌트 생성
4. mock 데이터를 data/mock 폴더로 분리
5. types/erp.ts 작성
6. services/mockErpRepository.ts 작성
7. 대시보드 페이지 전환
8. 업무 목록 공통 컴포넌트 전환
9. 거래처/품목/재고 화면 전환
10. 수주/발주/생산/사용자 화면 전환
11. README에 Nuxt 실행 방법 추가
```

## 16. Nuxt 실행 명령 예시

Nuxt 프로젝트를 만든 뒤에는 일반적으로 다음 명령을 사용한다.

```powershell
npm install
npm run dev
```

기본 접속 주소는 보통 다음과 같다.

```text
http://localhost:3000/
```

포트가 이미 사용 중이면 Nuxt가 다른 포트를 안내하거나, 실행 옵션으로 포트를 지정할 수 있다.

```powershell
npm run dev -- --port 3001
```

## 17. 백엔드 확정 후 교체 지점

백엔드가 정해졌을 때 바꿔야 할 부분은 최대한 `services` 폴더로 제한한다.

| 현재 | 백엔드 확정 후 |
| --- | --- |
| `mockErpRepository.ts` | `apiErpRepository.ts` |
| `data/mock/*.ts` | API 응답 |
| 한글 상태값 | 코드값 + 표시명 매핑 |
| 클라이언트 필터 | 서버 필터 |
| mock 저장 | POST/PUT/DELETE API |

화면 컴포넌트와 페이지는 같은 composable을 계속 사용하도록 유지한다.

## 18. 다음 작업 제안

다음 실제 작업은 Nuxt 프로젝트를 새로 만들고, 현재 mock UI를 Nuxt 컴포넌트 구조로 옮기는 것이다. 백엔드가 없어도 문제없이 진행할 수 있으며, 처음에는 현재 정적 UI와 동일한 화면을 Nuxt에서 재현하는 것을 1차 목표로 삼는 것이 좋다.
