import type { ModuleDefinition } from '~/types/erp'

export const moduleDefinitions: Record<string, ModuleDefinition> = {
  customers: {
    key: 'customers',
    title: '거래처 관리',
    eyebrow: '영업 관리',
    dataset: 'customers',
    detailTitle: 'name',
    columns: [
      { key: 'code', label: '거래처 코드' },
      { key: 'name', label: '거래처명' },
      { key: 'manager', label: '담당자' },
      { key: 'phone', label: '연락처' },
      { key: 'lastDate', label: '최근 거래일' },
      { key: 'amount', label: '누적 금액', type: 'numeric' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  },
  items: {
    key: 'items',
    title: '품목 관리',
    eyebrow: '재고 관리',
    dataset: 'items',
    detailTitle: 'name',
    columns: [
      { key: 'code', label: '품목 코드' },
      { key: 'name', label: '품목명' },
      { key: 'spec', label: '규격' },
      { key: 'unit', label: '단위' },
      { key: 'purchase', label: '매입 단가', type: 'numeric' },
      { key: 'sales', label: '판매 단가', type: 'numeric' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  },
  inventory: {
    key: 'inventory',
    title: '재고 현황',
    eyebrow: '창고별 수량',
    dataset: 'inventory',
    detailTitle: 'item',
    columns: [
      { key: 'item', label: '품목' },
      { key: 'warehouse', label: '창고' },
      { key: 'current', label: '현재고', type: 'numeric' },
      { key: 'reserved', label: '예약재고', type: 'numeric' },
      { key: 'available', label: '가용재고', type: 'numeric' },
      { key: 'safety', label: '안전재고', type: 'numeric' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  },
  orders: {
    key: 'orders',
    title: '수주 관리',
    eyebrow: '영업 주문',
    dataset: 'orders',
    detailTitle: 'no',
    columns: [
      { key: 'no', label: '수주 번호' },
      { key: 'customer', label: '거래처' },
      { key: 'item', label: '품목' },
      { key: 'qty', label: '수량', type: 'numeric' },
      { key: 'dueDate', label: '납기일' },
      { key: 'amount', label: '수주 금액', type: 'numeric' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  },
  purchase: {
    key: 'purchase',
    title: '발주 관리',
    eyebrow: '구매 관리',
    dataset: 'purchase',
    detailTitle: 'no',
    columns: [
      { key: 'no', label: '발주 번호' },
      { key: 'vendor', label: '매입처' },
      { key: 'item', label: '품목' },
      { key: 'qty', label: '수량', type: 'numeric' },
      { key: 'dueDate', label: '납기일' },
      { key: 'amount', label: '발주 금액', type: 'numeric' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  },
  production: {
    key: 'production',
    title: '생산 계획',
    eyebrow: '생산 관리',
    dataset: 'production',
    detailTitle: 'no',
    columns: [
      { key: 'no', label: '계획 번호' },
      { key: 'item', label: '품목' },
      { key: 'line', label: '라인' },
      { key: 'start', label: '시작일' },
      { key: 'end', label: '종료일' },
      { key: 'progress', label: '진행률', type: 'progress' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  },
  users: {
    key: 'users',
    title: '사용자 관리',
    eyebrow: '시스템 관리',
    dataset: 'users',
    detailTitle: 'name',
    columns: [
      { key: 'id', label: '사용자 ID' },
      { key: 'name', label: '이름' },
      { key: 'dept', label: '부서' },
      { key: 'role', label: '역할' },
      { key: 'auth', label: '권한' },
      { key: 'lastDate', label: '최근 접속' },
      { key: 'status', label: '상태', type: 'status' }
    ]
  }
}
