import { mockUsers } from '~/data/mock/erp'
import type { ErpRow } from '~/types/erp'

export interface MockSession {
  id: string
  name: string
  role: string
  dept: string
  auth: string
}

const defaultSession: MockSession = {
  id: 'u001',
  name: '김관리',
  role: 'ERP 관리자',
  dept: '경영지원',
  auth: '전체 권한'
}

const rolePermissions: Record<string, string[]> = {
  'ERP 관리자': ['dashboard', 'customers', 'items', 'inventory', 'inventory-transactions', 'orders', 'purchase', 'production', 'users'],
  '영업 담당': ['dashboard', 'customers', 'items', 'orders', 'production'],
  '구매 담당': ['dashboard', 'customers', 'items', 'inventory', 'inventory-transactions', 'purchase'],
  '재고 담당': ['dashboard', 'items', 'inventory', 'inventory-transactions', 'purchase'],
  '생산 담당': ['dashboard', 'items', 'inventory', 'production']
}

const roleActions: Record<string, string[]> = {
  'ERP 관리자': ['*'],
  '영업 담당': ['create:customers', 'edit:customers', 'create:orders', 'edit:orders', 'create:production'],
  '구매 담당': ['create:purchase', 'edit:purchase', 'process:purchase'],
  '재고 담당': ['create:items', 'edit:items', 'process:inventory', 'create:purchase'],
  '생산 담당': ['create:production', 'edit:production', 'process:production']
}

export function useMockAuth() {
  const currentUser = useState<MockSession>('mock-auth-user', () => defaultSession)

  const users = computed(() => mockUsers.map((user) => ({
    id: String(user.id),
    name: String(user.name),
    role: String(user.role),
    dept: String(user.dept),
    auth: String(user.auth)
  })))

  const allowedModules = computed(() => rolePermissions[currentUser.value.role] || rolePermissions['ERP 관리자'])
  const allowedActions = computed(() => roleActions[currentUser.value.role] || roleActions['ERP 관리자'])

  function login(userId: string) {
    const user = mockUsers.find((row: ErpRow) => row.id === userId)
    if (!user) {
      return false
    }

    currentUser.value = {
      id: String(user.id),
      name: String(user.name),
      role: String(user.role),
      dept: String(user.dept),
      auth: String(user.auth)
    }
    return true
  }

  function logout() {
    currentUser.value = defaultSession
  }

  function canAccess(moduleKey: string) {
    return allowedModules.value.includes(moduleKey)
  }

  function canAction(actionKey: string) {
    return allowedActions.value.includes('*') || allowedActions.value.includes(actionKey)
  }

  return {
    currentUser,
    users,
    allowedModules,
    allowedActions,
    login,
    logout,
    canAccess,
    canAction
  }
}
