# nexus-erp-web

Delphi 기반으로 사용 중인 사내 ERP를 웹 화면으로 전환하기 전에 업무 흐름, 화면 구성, 데이터 구조를 검토하기 위한 Nuxt 기반 ERP mock 프로젝트입니다.

현재 백엔드는 연결하지 않았고, 화면은 mock 데이터와 브라우저 `localStorage`를 사용합니다.

## 실행

```powershell
cd erp-nuxt-front
npm install
npm run dev -- --host 127.0.0.1 --port 3001
```

접속 주소:

```text
http://127.0.0.1:3001/
```

## 주요 화면

- 대시보드
- 거래처 관리
- 품목 관리
- 재고 현황
- 재고 입출고
- 수주 관리
- 발주 관리
- 생산 계획
- 처리 이력
- 사용자 관리
- mock 로그인/권한 선택

## 구현된 mock 흐름

- 거래처, 품목, 수주, 발주, 생산 데이터 조회/등록/수정
- 수주 등록 및 수정 시 예약 재고 반영
- 수주 완료 시 출고 이력 생성
- 재고 부족 품목에서 발주 등록 폼 자동 채움
- 발주 완료 시 재고 입고 반영
- 수주 상세에서 생산 지시 생성
- 생산 진행 시 자재 출고 반영
- 생산 완료 시 제품 입고 반영
- 수주/발주/생산/재고 처리 이력 자동 기록
- 역할별 메뉴, 버튼, URL 직접 접근 제어
- 목록 검색, 상태/기간/담당 필터, 컬럼 정렬
- CSV 내보내기/가져오기, 미리보기 검증, 정상 행 반영

## 문서

- [ERP 웹 UI Mock 데이터 기반 화면 설계 계획서](docs/00_erp_mock_ui_plan.md)
- [ERP 웹 UI 화면 목록 정의](docs/01_screen_definition.md)
- [ERP 웹 UI Mock 데이터 정의](docs/02_mock_data_definition.md)
- [ERP 웹 UI 업무 흐름 정의](docs/03_business_flow_definition.md)
- [ERP 웹 UI 컴포넌트 가이드](docs/04_ui_component_guide.md)
- [ERP 웹 UI 실제 개발 전환 계획](docs/05_development_transition_plan.md)
- [Nuxt 기반 ERP Mock 프론트엔드 전환 계획](docs/06_nuxt_mock_frontend_plan.md)
- [Nuxt ERP Mock 프로젝트 구조 문서](docs/07_nuxt_project_structure.md)
- [ERP Web API 계약서 초안](docs/08_api_contract_draft.md)

## 프로젝트 구조

```text
erp-nuxt-front/
  app/
    components/
    composables/
    data/mock/erp.ts
    pages/
  package.json
  nuxt.config.ts
docs/
index.html
css/
js/
```

## 현재 범위

이 프로젝트는 실제 ERP를 대체하는 운영 시스템이 아니라, 웹 전환 전에 화면과 업무 흐름을 빠르게 검증하기 위한 mock UI입니다. 이후 백엔드가 정해지면 API 계약서 기준으로 mock store를 실제 API 호출 계층으로 교체하는 방향을 권장합니다.
