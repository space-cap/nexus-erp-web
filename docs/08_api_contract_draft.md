# ERP Web API 계약서 초안

## 1. 문서 목적

이 문서는 Nuxt mock 화면을 실제 백엔드 API로 전환할 때 필요한 API 계약 초안이다. 백엔드 기술은 아직 결정하지 않았으므로 REST 기준의 URL, 요청/응답 필드, 에러 형식, 권한 기준을 먼저 정의한다.

## 2. 공통 규칙

Base URL 예시:

```text
/api
```

인증 헤더:

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

기본 응답:

```json
{
  "data": {},
  "message": "OK",
  "timestamp": "2026-05-31T09:00:00+09:00"
}
```

목록 응답:

```json
{
  "data": {
    "items": [],
    "page": 1,
    "size": 20,
    "totalCount": 0,
    "summary": {
      "primaryTotal": 0,
      "activeCount": 0,
      "warningCount": 0
    }
  },
  "message": "OK"
}
```

에러 응답:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "필수 입력값이 누락되었습니다.",
    "fields": [
      { "name": "item", "message": "품목은 필수입니다." }
    ]
  },
  "timestamp": "2026-05-31T09:00:00+09:00"
}
```

공통 에러 코드:

| 코드 | HTTP | 설명 |
| --- | --- | --- |
| `UNAUTHORIZED` | 401 | 로그인 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 대상 데이터 없음 |
| `VALIDATION_ERROR` | 400 | 입력값 오류 |
| `CONFLICT` | 409 | 이미 처리된 전표 또는 중복 코드 |
| `SERVER_ERROR` | 500 | 서버 오류 |

공통 쿼리:

| 이름 | 설명 |
| --- | --- |
| `keyword` | 화면 검색어 |
| `status` | 상태 필터 |
| `period` | `all`, `week`, `month` |
| `page` | 페이지 번호 |
| `size` | 페이지 크기 |

공통 상태값:

```text
정상, 진행, 대기, 지연, 부족, 완료, 중지, 취소
```

## 3. 대시보드

| Method | URL | 설명 |
| --- | --- | --- |
| `GET` | `/api/dashboard/summary` | KPI, 발주 후보, 생산 진행, 승인 대기 요약 |

응답 예시:

```json
{
  "data": {
    "orderAmount": 158000000,
    "purchaseCandidateCount": 2,
    "activeProductionCount": 3,
    "pendingPurchaseCount": 4,
    "purchaseCandidates": [
      {
        "item": "컨트롤 PCB V2",
        "warehouse": "전자부품 창고",
        "current": 312,
        "reserved": 24,
        "available": 288,
        "safety": 450,
        "recommendedQty": 162,
        "status": "부족"
      }
    ]
  },
  "message": "OK"
}
```

## 4. 거래처

| Method | URL | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/customers` | 거래처 목록 | 거래처 조회 |
| `POST` | `/api/customers` | 거래처 신규 등록 | 거래처 등록 |
| `GET` | `/api/customers/{code}` | 거래처 상세 | 거래처 조회 |
| `PUT` | `/api/customers/{code}` | 거래처 수정 | 거래처 수정 |

등록 요청 예시:

```json
{
  "name": "한빛정밀",
  "ceo": "박상훈",
  "bizNo": "123-81-45670",
  "manager": "최영업",
  "phone": "02-553-1101",
  "status": "정상",
  "amount": 78200000
}
```

## 5. 품목과 재고

| Method | URL | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/items` | 품목 목록 | 품목 조회 |
| `POST` | `/api/items` | 품목 신규 등록 | 품목 등록 |
| `GET` | `/api/items/{code}` | 품목 상세 | 품목 조회 |
| `PUT` | `/api/items/{code}` | 품목 수정 | 품목 수정 |
| `GET` | `/api/inventory` | 창고별 재고 목록 | 재고 조회 |
| `GET` | `/api/inventory/purchase-candidates` | 발주 후보 품목 목록 | 재고 조회 |
| `POST` | `/api/inventory/transactions` | 입고, 출고, 조정 처리 | 재고 처리 |

입출고 요청 예시:

```json
{
  "type": "출고",
  "item": "알루미늄 하우징 A형",
  "warehouse": "원자재 창고",
  "qty": 100,
  "owner": "김관리",
  "memo": "수주 완료 출고"
}
```

재고 처리 규칙:

| 유형 | 처리 |
| --- | --- |
| `입고` | 현재고 증가, 가용재고 재계산 |
| `출고` | 현재고 감소, 가용재고 재계산 |
| `조정` | 현재고를 입력 수량으로 변경 |
| 수주 예약 | 예약재고 증가, 가용재고 감소 |
| 수주 완료 | 예약재고 해제, 출고 전표 생성 |

## 6. 수주

| Method | URL | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/orders` | 수주 목록 | 수주 조회 |
| `POST` | `/api/orders` | 수주 신규 등록 및 예약재고 반영 | 수주 등록 |
| `GET` | `/api/orders/{no}` | 수주 상세 | 수주 조회 |
| `PUT` | `/api/orders/{no}` | 수주 수정 및 예약재고 재계산 | 수주 수정 |
| `POST` | `/api/orders/{no}/complete` | 수주 완료, 예약 해제, 출고 전표 생성 | 수주 처리 |
| `POST` | `/api/orders/{no}/production-plan` | 수주 기준 생산 계획 생성 | 생산 등록 |

수주 등록 요청 예시:

```json
{
  "customer": "한빛정밀",
  "item": "알루미늄 하우징 A형",
  "qty": 1000,
  "orderDate": "2026-05-31",
  "dueDate": "2026-06-07",
  "owner": "최영업",
  "amount": 28600000,
  "status": "진행"
}
```

수주 완료 응답 예시:

```json
{
  "data": {
    "order": {
      "no": "SO-260529-001",
      "status": "완료",
      "reservedQty": 0,
      "shipped": true,
      "shippedDate": "2026-05-31"
    },
    "stockTransaction": {
      "no": "ST-260531-003",
      "type": "출고",
      "item": "알루미늄 하우징 A형",
      "qty": 1000
    }
  },
  "message": "OK"
}
```

## 7. 발주

| Method | URL | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/purchase-orders` | 발주 목록 | 발주 조회 |
| `POST` | `/api/purchase-orders` | 발주 신규 등록 | 발주 등록 |
| `GET` | `/api/purchase-orders/{no}` | 발주 상세 | 발주 조회 |
| `PUT` | `/api/purchase-orders/{no}` | 발주 수정 | 발주 수정 |
| `POST` | `/api/purchase-orders/{no}/complete` | 발주 완료 및 입고 전표 생성 | 발주 처리 |

발주 후보 기반 등록 요청 예시:

```json
{
  "vendor": "동양소재",
  "item": "컨트롤 PCB V2",
  "qty": 162,
  "orderDate": "2026-05-31",
  "dueDate": "2026-06-05",
  "owner": "박구매",
  "amount": 8294400,
  "status": "대기"
}
```

## 8. 생산

| Method | URL | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/production-plans` | 생산 계획 목록 | 생산 조회 |
| `POST` | `/api/production-plans` | 생산 계획 신규 등록 | 생산 등록 |
| `GET` | `/api/production-plans/{no}` | 생산 계획 상세 | 생산 조회 |
| `PUT` | `/api/production-plans/{no}` | 생산 계획 수정 | 생산 수정 |
| `POST` | `/api/production-plans/{no}/start` | 생산 진행 처리 및 자재 출고 전표 생성 | 생산 처리 |
| `POST` | `/api/production-plans/{no}/complete` | 생산 완료 처리 및 제품 입고 전표 생성 | 생산 처리 |

생산 계획 요청 예시:

```json
{
  "item": "컨트롤 PCB V2",
  "line": "전자조립 1라인",
  "start": "2026-05-31",
  "end": "2026-06-07",
  "qty": 600,
  "progress": 0,
  "status": "대기",
  "sourceOrder": "SO-260529-001"
}
```

생산 처리 규칙:

| 상태 변경 | 처리 |
| --- | --- |
| `대기` → `진행` | 자재 출고 전표 생성 |
| `진행` → `완료` | 제품 입고 전표 생성, 진행률 100으로 변경 |
| 이미 처리됨 | 중복 전표 생성을 막고 기존 처리 결과 반환 |

## 9. 사용자와 권한

| Method | URL | 설명 |
| --- | --- | --- |
| `GET` | `/api/users` | 사용자 목록 |
| `GET` | `/api/auth/me` | 현재 사용자 정보 |
| `POST` | `/api/auth/login` | 로그인 |
| `POST` | `/api/auth/logout` | 로그아웃 |

역할별 기본 권한:

| 역할 | 메뉴 | 주요 작업 |
| --- | --- | --- |
| ERP 관리자 | 전체 메뉴 | 전체 등록, 수정, 처리 |
| 영업 담당 | 대시보드, 거래처, 품목, 수주, 생산 | 거래처/수주 등록, 수주 기준 생산 지시 |
| 구매 담당 | 대시보드, 거래처, 품목, 재고, 발주 | 발주 등록, 발주 완료 |
| 재고 담당 | 대시보드, 품목, 재고, 입출고, 발주 | 재고 입출고, 품목/발주 등록 |
| 생산 담당 | 대시보드, 품목, 재고, 생산 | 생산 계획 등록, 진행, 완료 |

## 10. 백엔드 결정 후 보완할 항목

- 기존 Delphi ERP 코드 체계와 전표 번호 생성 규칙
- 실제 DB 테이블과 화면 필드 매핑
- 인증 방식: 세션, JWT, 사내 SSO 여부
- 파일 첨부, 엑셀 다운로드, CSV 다운로드 방식
- 수주 완료 출고, 발주 완료 입고, 생산 투입/완료 입고의 트랜잭션 경계
- 낙관적 잠금 또는 전표 중복 처리 방식
- 감사 로그: 누가, 언제, 어떤 값을 변경했는지 기록
