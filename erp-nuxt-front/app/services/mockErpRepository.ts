import { mockDatasets } from '~/data/mock/erp'
import type { ErpRow, ListParams, ListResponse } from '~/types/erp'

const today = new Date('2026-05-30T00:00:00')

export function getMockList(dataset: string, params: ListParams): ListResponse<ErpRow> {
  return filterMockList(mockDatasets[dataset] || [], params)
}

export function filterMockList(sourceRows: ErpRow[], params: ListParams): ListResponse<ErpRow> {
  const rows = sourceRows.filter((row) => {
    const localKeyword = params.keyword?.trim().toLowerCase() || ''
    const globalKeyword = params.globalKeyword?.trim().toLowerCase() || ''
    const keywords = [localKeyword, globalKeyword].filter(Boolean)
    const statusMatch = !params.status || params.status === 'all' || row.status === params.status
    const keywordMatch = keywords.every((keyword) => {
      const rowText = Object.values(row).join(' ').toLowerCase()
      return keyword.split(' ').every((word) => rowText.includes(word))
    })
    const periodMatch = !params.period || params.period === 'all' || isInPeriod(row, params.period)

    return statusMatch && keywordMatch && periodMatch
  })

  return {
    items: rows,
    summary: createSummary(rows)
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

export function createSummary(rows: ErpRow[]) {
  const amountFields = ['amount', 'sales', 'current', 'qty']
  const amountField = amountFields.find((field) => rows.some((row) => typeof row[field] === 'number'))
  const primaryTotal = amountField ? rows.reduce((sum, row) => sum + Number(row[amountField] || 0), 0) : rows.length
  const activeCount = rows.filter((row) => ['정상', '진행', '완료'].includes(row.status)).length
  const warningCount = rows.filter((row) => ['지연', '부족', '중지'].includes(row.status)).length
  const ownerCount = new Set(rows.map((row) => row.owner || row.manager || row.dept || row.warehouse).filter(Boolean)).size

  return {
    totalCount: rows.length,
    primaryTotal,
    activeCount,
    warningCount,
    ownerCount
  }
}
