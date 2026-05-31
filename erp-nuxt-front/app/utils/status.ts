import type { ErpStatus } from '~/types/erp'

export type WorkflowDataset = 'orders' | 'purchase' | 'production'

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

const workflowStartStatus: Record<WorkflowDataset, ErpStatus[]> = {
  orders: ['대기'],
  purchase: ['대기'],
  production: ['대기']
}

const workflowTransitions: Record<WorkflowDataset, Partial<Record<ErpStatus, ErpStatus[]>>> = {
  orders: {
    대기: ['진행', '취소'],
    진행: ['지연', '완료', '취소'],
    지연: ['진행', '완료', '취소'],
    완료: [],
    취소: []
  },
  purchase: {
    대기: ['진행', '취소'],
    진행: ['지연', '완료', '취소'],
    지연: ['진행', '완료', '취소'],
    완료: [],
    취소: []
  },
  production: {
    대기: ['진행'],
    진행: ['지연', '완료'],
    지연: ['진행', '완료'],
    완료: []
  }
}

export function getStatusClass(status: string) {
  return statusClassMap[status as ErpStatus] || 'status-ready'
}

export function getSelectableWorkflowStatuses(
  dataset: WorkflowDataset,
  currentStatus = '대기',
  mode: 'create' | 'edit' = 'edit'
) {
  if (mode === 'create') {
    return workflowStartStatus[dataset]
  }

  const current = currentStatus as ErpStatus
  const nextStatuses = workflowTransitions[dataset][current] || []
  return [current, ...nextStatuses]
}

export function validateWorkflowStatusTransition(
  dataset: WorkflowDataset,
  fromStatus: string | undefined,
  toStatus: string | undefined,
  mode: 'create' | 'edit' = 'edit'
) {
  const next = String(toStatus || '')

  if (mode === 'create') {
    const allowed = workflowStartStatus[dataset]
    return {
      valid: allowed.includes(next as ErpStatus),
      message: `신규 등록 상태는 ${allowed.join(', ')}만 사용할 수 있습니다.`
    }
  }

  const current = String(fromStatus || '')
  if (current === next) {
    return { valid: true, message: '' }
  }

  const allowed = workflowTransitions[dataset][current as ErpStatus] || []
  return {
    valid: allowed.includes(next as ErpStatus),
    message: allowed.length
      ? `${current} 상태에서는 ${allowed.join(', ')} 상태로만 변경할 수 있습니다.`
      : `${current} 상태는 종료 상태라서 변경할 수 없습니다.`
  }
}

export function assertWorkflowStatusTransition(
  dataset: WorkflowDataset,
  fromStatus: string | undefined,
  toStatus: string | undefined,
  mode: 'create' | 'edit' = 'edit'
) {
  const result = validateWorkflowStatusTransition(dataset, fromStatus, toStatus, mode)
  if (!result.valid) {
    throw new Error(result.message)
  }
}
