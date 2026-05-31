<script setup lang="ts">
import { ClipboardCheck, Download, Factory, Plus, RefreshCw, TrendingUp, TriangleAlert } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { mockSales } from '~/data/mock/erp'
import { formatCurrency, formatNumber } from '~/utils/format'

const { showToast } = useToast()
const store = useMockErpStore()
const inventoryRows = computed(() => store.datasets.value.inventory || [])
const orderRows = computed(() => store.datasets.value.orders || [])
const purchaseRows = computed(() => store.datasets.value.purchase || [])
const productionRows = computed(() => store.datasets.value.production || [])
const purchaseCandidates = computed(() => store.purchaseCandidates.value)

const orderTotal = computed(() => orderRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0))
const lowStock = computed(() => purchaseCandidates.value.length)
const activeProduction = computed(() => productionRows.value.filter((row) => row.status === '진행').length)
const pendingApproval = computed(() => purchaseRows.value.filter((row) => ['대기', '지연'].includes(String(row.status))).length)
const maxSales = Math.max(...mockSales.map((row) => row.amount))

const kpiCards = computed(() => [
  { type: 'sales', label: '수주 금액', value: formatCurrency(orderTotal.value), note: '이번 달 mock 수주 합계', icon: TrendingUp, to: '/orders' },
  { type: 'inventory', label: '발주 후보', value: `${lowStock.value}건`, note: '안전재고 이하 품목', icon: TriangleAlert, to: '/inventory' },
  { type: 'production', label: '생산 진행', value: `${activeProduction.value}라인`, note: '현재 진행 중인 생산 계획', icon: Factory, to: '/production' },
  { type: 'approval', label: '승인 대기', value: `${pendingApproval.value}건`, note: '발주 및 예외 처리', icon: ClipboardCheck, to: '/purchase' }
])

const tasks = computed(() => [
  ...orderRows.value.filter((row) => row.status === '지연').slice(0, 1).map((row) => ({
    title: `${row.customer} 수주 납기 확인`,
    meta: String(row.no),
    status: String(row.status)
  })),
  ...purchaseRows.value.filter((row) => ['대기', '지연'].includes(String(row.status))).slice(0, 1).map((row) => ({
    title: `${row.vendor} 발주 확인`,
    meta: String(row.no),
    status: String(row.status)
  })),
  ...purchaseCandidates.value.slice(0, 1).map((row) => ({
    title: `${row.item} 발주 필요`,
    meta: String(row.warehouse),
    status: String(row.status)
  }))
])

function purchaseCandidateTo(row: Record<string, unknown>) {
  const recommendedQty = Math.max(1, Number(row.safety || 0) - Number(row.available || 0))
  return {
    path: '/purchase/new',
    query: {
      item: String(row.item || ''),
      qty: String(recommendedQty),
      warehouse: String(row.warehouse || '')
    }
  }
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">ERP 통합 현황</p>
      <h1>대시보드</h1>
    </div>
    <div class="hero-actions">
      <button class="secondary-button" type="button" disabled>
        <Download />
        <span>CSV</span>
      </button>
      <button class="primary-button" type="button" @click="showToast('대시보드 mock 신규 액션입니다.')">
        <Plus />
        <span>신규</span>
      </button>
    </div>
  </section>

  <section class="dashboard-view" aria-label="대시보드">
    <div class="kpi-grid">
      <NuxtLink v-for="card in kpiCards" :key="card.label" class="kpi-card" :to="card.to">
        <div class="kpi-top">
          <span class="kpi-label">{{ card.label }}</span>
          <span class="kpi-icon" :class="card.type">
            <component :is="card.icon" />
          </span>
        </div>
        <strong class="kpi-value">{{ card.value }}</strong>
        <span class="kpi-note">{{ card.note }}</span>
      </NuxtLink>
    </div>

    <div class="dashboard-grid">
      <section class="panel wide-panel">
        <div class="panel-header">
          <div>
            <h2>월간 매출 흐름</h2>
            <p>수주와 매출 mock 집계</p>
          </div>
          <button class="icon-button" type="button" aria-label="새로고침" @click="showToast('대시보드 데이터를 새로고침했습니다.')">
            <RefreshCw />
          </button>
        </div>
        <div class="bar-chart">
          <div v-for="row in mockSales" :key="row.month" class="bar-item">
            <div class="bar" :style="{ height: `${Math.max(28, (row.amount / maxSales) * 100)}%` }">
              {{ Math.round(row.amount / 1000000) }}M
            </div>
            <span class="bar-label">{{ row.month }}</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>처리 필요</h2>
            <p>승인, 납기, 재고 예외</p>
          </div>
        </div>
        <div class="task-list">
          <div v-for="task in tasks" :key="`${task.meta}-${task.title}`" class="task-item">
            <strong>{{ task.title }}</strong>
            <div class="task-meta">
              <span>{{ task.meta }}</span>
              <StatusBadge :status="task.status" />
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>발주 후보</h2>
            <p>가용재고가 안전재고 이하인 품목</p>
          </div>
        </div>
        <div class="compact-list">
          <div v-for="row in purchaseCandidates" :key="`${row.item}-${row.warehouse}`" class="compact-item">
            <strong>{{ row.item }}</strong>
            <div class="compact-meta">
              <span>{{ row.warehouse }}</span>
              <span>{{ formatNumber(Number(row.available)) }} / {{ formatNumber(Number(row.safety)) }}</span>
            </div>
            <NuxtLink class="secondary-button" :to="purchaseCandidateTo(row)">발주 등록</NuxtLink>
          </div>
          <div v-if="!purchaseCandidates.length" class="compact-item">
            <strong>발주 후보 없음</strong>
            <div class="compact-meta">
              <span>모든 품목의 가용재고가 안전재고보다 높습니다.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel wide-panel">
        <div class="panel-header">
          <div>
            <h2>생산 일정</h2>
            <p>라인별 진행률</p>
          </div>
        </div>
        <div class="timeline-list">
          <NuxtLink v-for="row in productionRows.slice(0, 4)" :key="String(row.no)" class="timeline-item" :to="`/production/${row.no}`">
            <div class="task-meta">
              <strong>{{ row.item }}</strong>
              <StatusBadge :status="String(row.status)" />
            </div>
            <div class="progress" :aria-label="`진행률 ${row.progress}%`">
              <span :style="{ width: `${row.progress}%` }"></span>
            </div>
            <div class="timeline-meta">
              <span>{{ row.line }}</span>
              <span>{{ row.start }} ~ {{ row.end }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>
