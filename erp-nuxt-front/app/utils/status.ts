import type { ErpStatus } from '~/types/erp'

export const statusClassMap: Record<ErpStatus, string> = {
  정상: 'status-normal',
  완료: 'status-complete',
  진행: 'status-progress',
  대기: 'status-wait',
  지연: 'status-delay',
  부족: 'status-low',
  중지: 'status-inactive',
  취소: 'status-cancel'
}

export function getStatusClass(status: string) {
  return statusClassMap[status as ErpStatus] || 'status-ready'
}
