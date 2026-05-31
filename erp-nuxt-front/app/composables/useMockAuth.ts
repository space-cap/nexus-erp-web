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
  'ERP 관리자': ['dashboard', 'customers', 'items', 'inventory', 'inventory-transactions', 'orders', 'purchase', 'production', 'audit-logs', 'users'],
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

const routeModuleRules = [
  { pattern: /^\/$/, moduleKey: 'dashboard' },
  { pattern: /^\/dashboard(?:\/|$)/, moduleKey: 'dashboard' },
  { pattern: /^\/customers(?:\/|$)/, moduleKey: 'customers' },
  { pattern: /^\/items(?:\/|$)/, moduleKey: 'items' },
  { pattern: /^\/inventory\/transactions(?:\/|$)/, moduleKey: 'inventory-transactions' },
  { pattern: /^\/inventory(?:\/|$)/, moduleKey: 'inventory' },
  { pattern: /^\/orders(?:\/|$)/, moduleKey: 'orders' },
  { pattern: /^\/purchase(?:\/|$)/, moduleKey: 'purchase' },
  { pattern: /^\/production(?:\/|$)/, moduleKey: 'production' },
  { pattern: /^\/audit-logs(?:\/|$)/, moduleKey: 'audit-logs' },
  { pattern: /^\/users(?:\/|$)/, moduleKey: 'users' }
]

const routeActionRules = [
  { pattern: /^\/customers\/new$/, actionKey: 'create:customers' },
  { pattern: /^\/customers\/[^/]+\/edit$/, actionKey: 'edit:customers' },
  { pattern: /^\/items\/new$/, actionKey: 'create:items' },
  { pattern: /^\/items\/[^/]+\/edit$/, actionKey: 'edit:items' },
  { pattern: /^\/orders\/new$/, actionKey: 'create:orders' },
  { pattern: /^\/orders\/[^/]+\/edit$/, actionKey: 'edit:orders' },
  { pattern: /^\/purchase\/new$/, actionKey: 'create:purchase' },
  { pattern: /^\/purchase\/[^/]+\/edit$/, actionKey: 'edit:purchase' },
  { pattern: /^\/production\/new$/, actionKey: 'create:production' },
  { pattern: /^\/production\/[^/]+\/edit$/, actionKey: 'edit:production' }
]

export function useMockAuth() {
  const sessionUserId = useCookie('mock-auth-user-id', {
    default: () => defaultSession.id,
    sameSite: 'lax'
  })
  const currentUser = useState<MockSession>('mock-auth-user', () => sessionFromUserId(sessionUserId.value))

  if (currentUser.value.id !== sessionUserId.value) {
    currentUser.value = sessionFromUserId(sessionUserId.value)
  }

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
    sessionUserId.value = String(user.id)
    return true
  }

  function logout() {
    currentUser.value = defaultSession
    sessionUserId.value = defaultSession.id
  }

  function canAccess(moduleKey: string) {
    return allowedModules.value.includes(moduleKey)
  }

  function canAction(actionKey: string) {
    return allowedActions.value.includes('*') || allowedActions.value.includes(actionKey)
  }

  function routeModuleKey(path: string) {
    return routeModuleRules.find((rule) => rule.pattern.test(path))?.moduleKey || ''
  }

  function routeActionKey(path: string) {
    return routeActionRules.find((rule) => rule.pattern.test(path))?.actionKey || ''
  }

  function canAccessRoute(path: string) {
    if (path === '/login' || path === '/forbidden') {
      return { allowed: true, moduleKey: '', actionKey: '', reason: '' }
    }

    const moduleKey = routeModuleKey(path)
    const actionKey = routeActionKey(path)

    if (moduleKey && !canAccess(moduleKey)) {
      return { allowed: false, moduleKey, actionKey, reason: 'module' }
    }

    if (actionKey && !canAction(actionKey)) {
      return { allowed: false, moduleKey, actionKey, reason: 'action' }
    }

    return { allowed: true, moduleKey, actionKey, reason: '' }
  }

  return {
    currentUser,
    users,
    allowedModules,
    allowedActions,
    login,
    logout,
    canAccess,
    canAction,
    routeModuleKey,
    routeActionKey,
    canAccessRoute
  }
}

function sessionFromUserId(userId?: string | null): MockSession {
  const user = mockUsers.find((row: ErpRow) => row.id === userId) || mockUsers.find((row: ErpRow) => row.id === defaultSession.id)
  if (!user) {
    return defaultSession
  }

  return {
    id: String(user.id),
    name: String(user.name),
    role: String(user.role),
    dept: String(user.dept),
    auth: String(user.auth)
  }
}
