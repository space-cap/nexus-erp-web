export type ErpStatus = '정상' | '진행' | '대기' | '지연' | '부족' | '완료' | '중지' | '취소'

export interface ErpRow {
  [key: string]: string | number | boolean | undefined
  status: ErpStatus
}

export interface SalesPoint {
  month: string
  amount: number
}

export interface ListParams {
  keyword?: string
  globalKeyword?: string
  status?: string
  period?: string
  group?: string
  groupKey?: string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
}

export interface ListResponse<T extends ErpRow> {
  items: T[]
  summary: {
    totalCount: number
    primaryTotal: number
    activeCount: number
    warningCount: number
    ownerCount: number
  }
}

export interface ColumnDefinition {
  key: string
  label: string
  type?: 'text' | 'numeric' | 'status' | 'progress'
}

export interface ModuleDefinition {
  key: string
  title: string
  eyebrow: string
  dataset: string
  detailTitle: string
  columns: ColumnDefinition[]
}
