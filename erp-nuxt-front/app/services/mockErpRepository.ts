import { mockDatasets } from '~/data/mock/erp'
import type { ErpRow, ListParams, ListResponse } from '~/types/erp'

const today = new Date('2026-05-30T00:00:00')
const groupFieldsByDataset: Record<string, string[]> = {
  customers: ['manager'],
  items: ['owner'],
  inventory: ['warehouse'],
  orders: ['customer'],
  purchase: ['vendor'],
  production: ['line'],
  users: ['dept']
}

export function getMockList(dataset: string, params: ListParams): ListResponse<ErpRow> {
  return filterMockList(mockDatasets[dataset] || [], { ...params, groupKey: params.groupKey || dataset })
}

export function filterMockList(sourceRows: ErpRow[], params: ListParams): ListResponse<ErpRow> {
  const rows = sourceRows.filter((row) => {
    const localKeyword = params.keyword?.trim().toLowerCase() || ''
    const globalKeyword = params.globalKeyword?.trim().toLowerCase() || ''
    const keywords = [localKeyword, globalKeyword].filter(Boolean)
    const statusMatch = !params.status || params.status === 'all' || row.status === params.status
    const groupMatch = !params.group || params.group === 'all' || getGroupValue(row, params.groupKey) === params.group
    const keywordMatch = keywords.every((keyword) => {
      const rowText = Object.values(row).join(' ').toLowerCase()
      return keyword.split(' ').every((word) => rowText.includes(word))
    })
    const periodMatch = !params.period || params.period === 'all' || isInPeriod(row, params.period)

    return statusMatch && groupMatch && keywordMatch && periodMatch
  })

  const sortedRows = sortRows(rows, params.sortKey, params.sortDir)

  return {
    items: sortedRows,
    summary: createSummary(rows, params.groupKey)
  }
}

export function getStatusOptions(dataset: string) {
  return [...new Set((mockDatasets[dataset] || []).map((row) => row.status))]
}

function isInPeriod(row: ErpRow, period: string) {
  const dateValue = String(row.lastDate || row.orderDate || row.start || '')
  if (!dateValue) {
    return true
  }

  const date = new Date(`${dateValue}T00:00:00`)
  const diffDays = Math.floor((today.getTime() - date.getTime()) / 86400000)

  if (period === 'week') {
    return diffDays >= 0 && diffDays <= 7
  }

  if (period === 'month') {
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()
  }

  return true
}

export function getGroupValue(row: ErpRow, groupKey?: string) {
  const fields = groupFieldsByDataset[groupKey || ''] || ['owner', 'manager', 'dept', 'warehouse', 'customer', 'vendor', 'line']
  const value = fields.map((field) => row[field]).find(Boolean)
  return String(value || '')
}

function sortRows(rows: ErpRow[], sortKey?: string, sortDir: 'asc' | 'desc' = 'asc') {
  if (!sortKey) {
    return rows
  }

  const direction = sortDir === 'desc' ? -1 : 1
  return [...rows].sort((left, right) => compareValues(left[sortKey], right[sortKey]) * direction)
}

function compareValues(left: unknown, right: unknown) {
  if (typeof left === 'number' || typeof right === 'number') {
    return Number(left || 0) - Number(right || 0)
  }

  return String(left || '').localeCompare(String(right || ''), 'ko-KR', {
    numeric: true,
    sensitivity: 'base'
  })
}

export function createSummary(rows: ErpRow[], groupKey?: string) {
  const amountFields = ['amount', 'sales', 'current', 'qty']
  const amountField = amountFields.find((field) => rows.some((row) => typeof row[field] === 'number'))
  const primaryTotal = amountField ? rows.reduce((sum, row) => sum + Number(row[amountField] || 0), 0) : rows.length
  const activeCount = rows.filter((row) => ['정상', '진행', '완료'].includes(row.status)).length
  const warningCount = rows.filter((row) => ['지연', '부족', '중지'].includes(row.status)).length
  const ownerCount = new Set(rows.map((row) => getGroupValue(row, groupKey)).filter(Boolean)).size

  return {
    totalCount: rows.length,
    primaryTotal,
    activeCount,
    warningCount,
    ownerCount
  }
}
