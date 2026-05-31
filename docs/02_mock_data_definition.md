# ERP 웹 UI Mock 데이터 정의서

## 1. 문서 목적

이 문서는 현재 ERP Web Mock UI에서 사용하는 `js/mock-data.js`의 데이터 구조를 정리한 문서이다. 화면에 표시되는 mock 데이터의 의미, 필드 타입, 예시값, 실제 DB/API 전환 시 고려사항을 명확히 해서 이후 개발 단계에서 기준 자료로 사용할 수 있도록 한다.

현재 mock 데이터는 브라우저 전역 객체 `window.erpMock`에 저장되어 있으며, 실제 서버나 데이터베이스와 연결되어 있지 않다.

```javascript
window.erpMock = {
  sales: [],
  customers: [],
  items: [],
  inventory: [],
  orders: [],
  purchase: [],
  production: [],
  users: []
};
```

## 2. 데이터 구성 요약

| 데이터 키 | 화면 | 주요 목적 |
| --- | --- | --- |
| `sales` | 대시보드 | 월별 매출 흐름 차트 표시 |
| `customers` | 거래처 관리 | 거래처 기본 정보 표시 |
| `items` | 품목 관리 | 품목 기준 정보 표시 |
| `inventory` | 재고 현황 | 창고별 품목 재고 표시 |
| `orders` | 수주 관리 | 고객 수주 내역 표시 |
| `purchase` | 발주 관리 | 매입처 발주 내역 표시 |
| `production` | 생산 계획 | 생산 계획과 진행률 표시 |
| `users` | 사용자 관리 | ERP 사용자와 권한 표시 |

## 3. 공통 데이터 타입 기준

| 타입 | 설명 | 예시 |
| --- | --- | --- |
| `string` | 문자 데이터 | `"한빛정밀"` |
| `number` | 금액, 수량, 진행률 등 숫자 데이터 | `78200000` |
| `date string` | `YYYY-MM-DD` 형식의 날짜 문자열 | `"2026-05-30"` |
| `status string` | 업무 상태값 | `"정상"`, `"진행"`, `"지연"` |

현재 mock UI에서는 날짜를 문자열로 관리한다. 실제 API 전환 시에도 응답값은 `YYYY-MM-DD` 또는 ISO 8601 형식으로 통일하는 것이 좋다.

## 4. 상태값 정의

| 상태값 | 의미 | 사용 데이터 |
| --- | --- | --- |
| `정상` | 사용 가능, 문제 없음 | `customers`, `items`, `inventory`, `users` |
| `진행` | 업무 진행 중 | `customers`, `items`, `orders`, `purchase`, `production` |
| `대기` | 처리 또는 승인 전 | `customers`, `items`, `orders`, `purchase`, `production`, `users` |
| `지연` | 납기 또는 일정 초과 | `orders`, `purchase`, `production` |
| `부족` | 안전재고 이하 | `inventory` |
| `완료` | 업무 종료 | `orders`, `purchase`, `production` |
| `중지` | 사용 중지, 비활성 | `customers`, `items`, `users` |

실제 개발 시에는 상태값을 문자열로 직접 저장하기보다 공통 코드 테이블을 두는 것이 좋다.

예시:

| 코드 그룹 | 코드 | 코드명 |
| --- | --- | --- |
| `COMMON_STATUS` | `ACTIVE` | 정상 |
| `COMMON_STATUS` | `WAITING` | 대기 |
| `COMMON_STATUS` | `IN_PROGRESS` | 진행 |
| `COMMON_STATUS` | `DELAYED` | 지연 |
| `COMMON_STATUS` | `LOW_STOCK` | 부족 |
| `COMMON_STATUS` | `DONE` | 완료 |
| `COMMON_STATUS` | `INACTIVE` | 중지 |

## 5. 데이터별 상세 정의

## 5.1 `sales`

### 목적

대시보드의 월간 매출 흐름 차트에 사용하는 집계 데이터이다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `month` | `string` | 표시 월 | `"5월"` |
| `amount` | `number` | 월별 매출 또는 수주 금액 | `193000000` |

### 예시 데이터

```javascript
{ month: "5월", amount: 193000000 }
```

### 실제 전환 고려사항

- 실제 DB에는 월별 집계 테이블을 따로 만들기보다 수주, 매출, 전표 데이터를 기준으로 집계하는 방식이 적합하다.
- 대시보드 API에서 기간 조건을 받아 월별 집계 결과를 내려주는 구조가 좋다.

예상 API:

```text
GET /api/dashboard/monthly-sales?from=2026-01&to=2026-06
```

## 5.2 `customers`

### 목적

거래처 관리 화면에서 고객사, 매입처, 협력사 등의 기본 정보를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `code` | `string` | 거래처 코드 | `"C-1001"` |
| `name` | `string` | 거래처명 | `"한빛정밀"` |
| `ceo` | `string` | 대표자명 | `"박상훈"` |
| `bizNo` | `string` | 사업자번호 | `"123-81-45670"` |
| `manager` | `string` | 내부 담당자 | `"최영업"` |
| `phone` | `string` | 대표 연락처 | `"02-553-1101"` |
| `status` | `status string` | 거래처 상태 | `"정상"` |
| `lastDate` | `date string` | 최근 거래 또는 수정일 | `"2026-05-28"` |
| `amount` | `number` | 누적 거래 금액 | `78200000` |

### 예시 데이터

```javascript
{
  code: "C-1001",
  name: "한빛정밀",
  ceo: "박상훈",
  bizNo: "123-81-45670",
  manager: "최영업",
  phone: "02-553-1101",
  status: "정상",
  lastDate: "2026-05-28",
  amount: 78200000
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `customer` | 거래처 기본 정보 |
| `customer_contact` | 거래처 담당자 연락처 |
| `customer_account` | 세금계산서, 정산, 계좌 정보 |
| `customer_history` | 거래처 변경 이력 |

### 실제 전환 고려사항

- 사업자번호 중복 체크가 필요하다.
- 거래처 유형을 분리해야 한다. 예: 고객사, 매입처, 외주처, 운송사.
- 담당자 한 명만 저장하기보다 내부 담당자 ID를 사용자 테이블과 연결하는 것이 좋다.
- 금액 합계는 거래처 테이블에 직접 저장하기보다 수주/매출 데이터를 집계하는 방식이 적합하다.

예상 API:

```text
GET /api/customers?keyword=한빛&status=ACTIVE
GET /api/customers/{customerCode}
POST /api/customers
PUT /api/customers/{customerCode}
```

## 5.3 `items`

### 목적

품목 관리 화면에서 제품, 반제품, 원자재, 부자재의 기준 정보를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `code` | `string` | 품목 코드 | `"P-2001"` |
| `name` | `string` | 품목명 | `"알루미늄 하우징 A형"` |
| `spec` | `string` | 규격 | `"120x80x35"` |
| `unit` | `string` | 단위 | `"EA"` |
| `purchase` | `number` | 매입 단가 | `18400` |
| `sales` | `number` | 판매 단가 | `28600` |
| `status` | `status string` | 품목 상태 | `"정상"` |
| `owner` | `string` | 품목 담당자 | `"이자재"` |
| `lastDate` | `date string` | 최근 수정일 | `"2026-05-22"` |

### 예시 데이터

```javascript
{
  code: "P-2001",
  name: "알루미늄 하우징 A형",
  spec: "120x80x35",
  unit: "EA",
  purchase: 18400,
  sales: 28600,
  status: "정상",
  owner: "이자재",
  lastDate: "2026-05-22"
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `item` | 품목 기본 정보 |
| `item_price` | 단가 이력 |
| `item_unit` | 단위 코드 |
| `item_file` | 도면, 이미지, 첨부 파일 |
| `bom` | 제품별 자재 구성 |

### 실제 전환 고려사항

- `purchase`, `sales`는 단가 이력이 필요하므로 별도 테이블로 분리하는 것이 좋다.
- 품목 유형이 필요하다. 예: 제품, 반제품, 원자재, 부자재.
- 단위는 문자열보다 공통 코드로 관리하는 것이 좋다.
- 생산 ERP에서는 BOM 연결 여부가 중요하다.

예상 API:

```text
GET /api/items?keyword=PCB&status=ACTIVE
GET /api/items/{itemCode}
POST /api/items
PUT /api/items/{itemCode}
```

## 5.4 `inventory`

### 목적

재고 현황 화면에서 품목별, 창고별 현재고와 안전재고 상태를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `item` | `string` | 품목명 | `"컨트롤 PCB V2"` |
| `warehouse` | `string` | 창고명 | `"전자부품 창고"` |
| `current` | `number` | 현재고 | `312` |
| `safety` | `number` | 안전재고 | `450` |
| `available` | `number` | 가용재고 | `288` |
| `status` | `status string` | 재고 상태 | `"부족"` |
| `lastDate` | `date string` | 최근 입출고 처리일 | `"2026-05-30"` |

### 예시 데이터

```javascript
{
  item: "컨트롤 PCB V2",
  warehouse: "전자부품 창고",
  current: 312,
  safety: 450,
  available: 288,
  status: "부족",
  lastDate: "2026-05-30"
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `warehouse` | 창고 정보 |
| `stock_balance` | 품목별 현재 재고 |
| `stock_transaction` | 입고, 출고, 조정 이력 |
| `stock_reservation` | 수주 또는 생산 예약 재고 |
| `stock_lot` | 로트 또는 시리얼 재고 |

### 실제 전환 고려사항

- 실제 ERP에서는 재고 수량을 직접 수정하지 않고 입고/출고/조정 전표로 변경해야 한다.
- `item`과 `warehouse`는 이름이 아니라 코드로 저장해야 한다.
- `available`은 `current - reservation - hold` 같은 계산값으로 처리하는 것이 좋다.
- 재고 부족 상태는 `current < safety` 기준으로 자동 계산할 수 있다.

예상 API:

```text
GET /api/inventory?itemCode=P-2002&warehouseCode=W-01
GET /api/inventory/alerts
POST /api/stock-transactions
```

## 5.5 `orders`

### 목적

수주 관리 화면에서 고객 주문의 접수일, 납기일, 담당자, 금액, 진행 상태를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `no` | `string` | 수주 번호 | `"SO-260529-001"` |
| `customer` | `string` | 거래처명 | `"한빛정밀"` |
| `orderDate` | `date string` | 수주일 | `"2026-05-29"` |
| `dueDate` | `date string` | 납기일 | `"2026-06-07"` |
| `owner` | `string` | 영업 담당자 | `"최영업"` |
| `amount` | `number` | 수주 금액 | `28600000` |
| `status` | `status string` | 수주 상태 | `"진행"` |

### 예시 데이터

```javascript
{
  no: "SO-260529-001",
  customer: "한빛정밀",
  orderDate: "2026-05-29",
  dueDate: "2026-06-07",
  owner: "최영업",
  amount: 28600000,
  status: "진행"
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `sales_order` | 수주 헤더 |
| `sales_order_line` | 수주 품목 상세 |
| `sales_order_status_history` | 상태 변경 이력 |
| `shipment` | 출고 또는 납품 정보 |
| `sales_invoice` | 매출 전표 |

### 실제 전환 고려사항

- 현재 mock 데이터는 헤더 정보만 있으므로 실제 개발에서는 수주 상세 품목 라인이 필요하다.
- `customer`는 거래처명 대신 거래처 코드를 저장해야 한다.
- 납기 지연은 `dueDate`와 현재 처리 상태를 기준으로 자동 판단할 수 있다.
- 생산 계획, 출고, 매출과 상태가 연결되어야 한다.

예상 API:

```text
GET /api/sales-orders?from=2026-05-01&to=2026-05-31&status=IN_PROGRESS
GET /api/sales-orders/{orderNo}
POST /api/sales-orders
PUT /api/sales-orders/{orderNo}
```

## 5.6 `purchase`

### 목적

발주 관리 화면에서 매입처 발주 내역, 발주일, 납기일, 담당자, 금액, 상태를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `no` | `string` | 발주 번호 | `"PO-260530-002"` |
| `vendor` | `string` | 매입처명 | `"동양소재"` |
| `orderDate` | `date string` | 발주일 | `"2026-05-30"` |
| `dueDate` | `date string` | 납기일 | `"2026-06-03"` |
| `owner` | `string` | 구매 담당자 | `"박구매"` |
| `amount` | `number` | 발주 금액 | `14200000` |
| `status` | `status string` | 발주 상태 | `"대기"` |

### 예시 데이터

```javascript
{
  no: "PO-260530-002",
  vendor: "동양소재",
  orderDate: "2026-05-30",
  dueDate: "2026-06-03",
  owner: "박구매",
  amount: 14200000,
  status: "대기"
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `purchase_order` | 발주 헤더 |
| `purchase_order_line` | 발주 품목 상세 |
| `purchase_request` | 구매 요청 |
| `goods_receipt` | 입고 정보 |
| `purchase_invoice` | 매입 전표 |

### 실제 전환 고려사항

- 발주도 수주와 마찬가지로 헤더와 상세 품목 라인을 분리해야 한다.
- 부분 입고를 지원하려면 발주 수량, 입고 수량, 미입고 수량을 관리해야 한다.
- 발주 승인 권한과 승인 이력이 필요할 수 있다.
- 재고 부족 화면에서 발주 요청으로 연결되는 흐름이 있으면 좋다.

예상 API:

```text
GET /api/purchase-orders?status=WAITING
GET /api/purchase-orders/{purchaseNo}
POST /api/purchase-orders
PUT /api/purchase-orders/{purchaseNo}
```

## 5.7 `production`

### 목적

생산 계획 화면에서 생산 대상 품목, 라인, 기간, 수량, 진행률, 상태를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `no` | `string` | 생산 계획 번호 | `"PL-260530-A1"` |
| `item` | `string` | 생산 품목 | `"컨트롤 PCB V2"` |
| `line` | `string` | 생산 라인 | `"전자조립 1라인"` |
| `start` | `date string` | 계획 시작일 | `"2026-05-30"` |
| `end` | `date string` | 계획 종료일 | `"2026-06-02"` |
| `qty` | `number` | 계획 수량 | `600` |
| `progress` | `number` | 진행률 | `38` |
| `status` | `status string` | 생산 상태 | `"진행"` |

### 예시 데이터

```javascript
{
  no: "PL-260530-A1",
  item: "컨트롤 PCB V2",
  line: "전자조립 1라인",
  start: "2026-05-30",
  end: "2026-06-02",
  qty: 600,
  progress: 38,
  status: "진행"
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `production_plan` | 생산 계획 |
| `work_order` | 작업 지시 |
| `production_result` | 생산 실적 |
| `production_line` | 생산 라인 |
| `defect_result` | 불량 실적 |

### 실제 전환 고려사항

- 생산 계획과 작업 지시를 같은 화면에서 처리할지 분리할지 결정해야 한다.
- 진행률은 수동 입력보다 생산 실적 기준으로 계산하는 것이 좋다.
- 품목은 품목 코드, 라인은 라인 코드로 연결해야 한다.
- 양품 수량, 불량 수량, 작업자, 설비, 작업 시간 필드가 추가될 가능성이 높다.

예상 API:

```text
GET /api/production-plans?status=IN_PROGRESS
GET /api/production-plans/{planNo}
POST /api/production-plans
POST /api/work-orders
POST /api/production-results
```

## 5.8 `users`

### 목적

사용자 관리 화면에서 ERP 사용자 계정, 부서, 역할, 권한, 상태를 표시한다.

### 필드 정의

| 필드 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `id` | `string` | 사용자 ID | `"u001"` |
| `name` | `string` | 사용자 이름 | `"김관리"` |
| `dept` | `string` | 부서 | `"경영지원"` |
| `role` | `string` | 업무 역할 | `"ERP 관리자"` |
| `auth` | `string` | 권한 그룹 | `"전체 권한"` |
| `status` | `status string` | 계정 상태 | `"정상"` |
| `lastDate` | `date string` | 최근 접속일 | `"2026-05-30"` |

### 예시 데이터

```javascript
{
  id: "u001",
  name: "김관리",
  dept: "경영지원",
  role: "ERP 관리자",
  auth: "전체 권한",
  status: "정상",
  lastDate: "2026-05-30"
}
```

### 실제 DB 후보

| 테이블 | 설명 |
| --- | --- |
| `app_user` | 사용자 계정 |
| `department` | 부서 |
| `role` | 역할 |
| `permission` | 권한 |
| `user_role` | 사용자별 역할 매핑 |
| `login_history` | 로그인 이력 |

### 실제 전환 고려사항

- 실제 로그인 ID, 이름, 부서, 권한은 분리해서 관리하는 것이 좋다.
- 비밀번호는 절대 평문 저장하면 안 되며, 안전한 해시로 저장해야 한다.
- 권한은 메뉴 접근 권한과 데이터 접근 권한을 분리할 수 있다.
- 사업장, 창고, 부서별 접근 제한이 필요할 수 있다.

예상 API:

```text
GET /api/users?keyword=김관리&status=ACTIVE
GET /api/users/{userId}
POST /api/users
PUT /api/users/{userId}
PUT /api/users/{userId}/status
```

## 6. 화면과 데이터 연결 관계

| 화면 | 사용하는 데이터 | 비고 |
| --- | --- | --- |
| 대시보드 | `sales`, `orders`, `purchase`, `inventory`, `production` | 여러 업무 데이터를 요약 표시 |
| 거래처 관리 | `customers` | 영업/구매/회계 공통 기준 |
| 품목 관리 | `items` | 재고/수주/발주/생산 공통 기준 |
| 재고 현황 | `inventory` | 품목과 창고 기준 재고 |
| 수주 관리 | `orders` | 거래처와 연결 필요 |
| 발주 관리 | `purchase` | 매입처와 연결 필요 |
| 생산 계획 | `production` | 품목, 라인, 수주와 연결 가능 |
| 사용자 관리 | `users` | 권한, 부서, 메뉴 접근과 연결 |

## 7. 실제 API 응답 구조 제안

목록 API는 모든 화면에서 비슷한 구조를 사용하는 것이 좋다.

```json
{
  "items": [],
  "page": 1,
  "size": 20,
  "totalCount": 132,
  "summary": {
    "totalAmount": 149500000,
    "normalCount": 12,
    "warningCount": 3
  }
}
```

상세 API는 단일 객체를 반환한다.

```json
{
  "code": "C-1001",
  "name": "한빛정밀",
  "status": "ACTIVE",
  "createdAt": "2026-05-01T09:00:00",
  "updatedAt": "2026-05-28T15:20:00"
}
```

## 8. 실제 DB 전환 시 공통 원칙

| 원칙 | 설명 |
| --- | --- |
| 이름보다 코드 저장 | 거래처명, 품목명, 창고명은 변경될 수 있으므로 코드로 연결 |
| 금액은 정수 관리 | 원화 기준이면 소수점 없이 정수로 관리 가능 |
| 날짜 형식 통일 | `DATE`, `DATETIME`, API 응답 형식을 명확히 구분 |
| 상태값 코드화 | 화면 표시명과 DB 저장 코드를 분리 |
| 이력 테이블 고려 | 단가, 상태, 권한, 재고 변경은 이력이 중요 |
| 헤더/상세 분리 | 수주, 발주, 생산은 헤더와 라인 상세를 분리 |
| 집계값 직접 저장 주의 | 대시보드 금액, 누적 금액은 원천 데이터에서 집계 |

## 9. 다음 문서 제안

다음에는 `03_business_flow_definition.md`를 작성하는 것이 좋다. 지금까지 화면과 데이터 구조를 정리했으므로, 다음 문서에서는 수주, 발주, 재고, 생산이 어떤 업무 흐름으로 연결되는지 정의하면 실제 ERP 개발 방향이 훨씬 선명해진다.
