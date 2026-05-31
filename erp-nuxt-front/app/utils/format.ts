export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value)
}

export function formatCellValue(value: string | number, type?: string) {
  if (typeof value === 'number') {
    return type === 'numeric' && value >= 100000 ? formatCurrency(value) : formatNumber(value)
  }

  return value
}
