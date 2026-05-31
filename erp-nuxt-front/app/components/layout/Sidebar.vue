<script setup lang="ts">
import {
  ArrowLeftRight,
  Building2,
  Factory,
  FileCheck2,
  LayoutDashboard,
  LogIn,
  Package,
  ShieldCheck,
  ShoppingCart,
  Warehouse
} from '@lucide/vue'

const route = useRoute()
const { allowedModules } = useMockAuth()

const navItems = [
  { key: 'dashboard', to: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { key: 'customers', to: '/customers', label: '거래처 관리', icon: Building2 },
  { key: 'items', to: '/items', label: '품목 관리', icon: Package },
  { key: 'inventory', to: '/inventory', label: '재고 현황', icon: Warehouse },
  { key: 'inventory-transactions', to: '/inventory/transactions', label: '재고 입출고', icon: ArrowLeftRight },
  { key: 'orders', to: '/orders', label: '수주 관리', icon: FileCheck2 },
  { key: 'purchase', to: '/purchase', label: '발주 관리', icon: ShoppingCart },
  { key: 'production', to: '/production', label: '생산 계획', icon: Factory },
  { key: 'users', to: '/users', label: '사용자 관리', icon: ShieldCheck },
  { key: 'login', to: '/login', label: '로그인/권한', icon: LogIn }
]

const visibleNavItems = computed(() => navItems.filter((item) => item.key === 'login' || allowedModules.value.includes(item.key)))

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`) || (route.path === '/' && path === '/dashboard')
}
</script>

<template>
  <aside class="sidebar" aria-label="ERP 메뉴">
    <div class="brand">
      <div class="brand-mark">E</div>
      <div>
        <strong>ERP Web</strong>
        <span>Nuxt mock workspace</span>
      </div>
    </div>

    <nav class="nav-list">
      <NuxtLink
        v-for="item in visibleNavItems"
        :key="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
        :to="item.to"
      >
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <span>사업장</span>
      <strong>본사 / 생산1공장</strong>
    </div>
  </aside>
</template>
