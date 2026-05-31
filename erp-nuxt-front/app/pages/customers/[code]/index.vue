<script setup lang="ts">
import { ArrowLeft, Pencil } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { fieldLabel } from '~/utils/fields'
import { formatCellValue } from '~/utils/format'

const route = useRoute()
const store = useMockErpStore()
const { canAction } = useMockAuth()
const code = computed(() => String(route.params.code))
const customer = computed(() => store.findByField('customers', 'code', code.value))
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">거래처 관리</p>
      <h1>{{ customer?.name || '거래처 상세' }}</h1>
    </div>
    <div class="hero-actions">
      <NuxtLink class="secondary-button" to="/customers">
        <ArrowLeft />
        <span>목록</span>
      </NuxtLink>
      <NuxtLink v-if="customer && canAction('edit:customers')" class="primary-button" :to="`/customers/${customer.code}/edit`">
        <Pencil />
        <span>수정</span>
      </NuxtLink>
    </div>
  </section>

  <section v-if="customer" class="record-detail-layout">
    <article class="record-main panel">
      <div class="detail-title-row">
        <h2>{{ customer.name }}</h2>
        <StatusBadge :status="String(customer.status)" />
      </div>
      <div class="detail-grid detail-grid-wide">
        <div v-for="[key, value] in Object.entries(customer)" :key="key" class="detail-row">
          <span class="detail-label">{{ fieldLabel(key) }}</span>
          <span class="detail-value">{{ formatCellValue(value, typeof value === 'number' ? 'numeric' : 'text') }}</span>
        </div>
      </div>
    </article>
    <aside class="panel record-side">
      <h2>업무 연결</h2>
      <div class="task-list">
        <div class="task-item">
          <strong>수주 관리</strong>
          <span class="kpi-note">거래처 기준 수주 흐름과 연결할 수 있습니다.</span>
        </div>
        <div class="task-item">
          <strong>회계 정보</strong>
          <span class="kpi-note">입금과 세금계산서 정보는 백엔드 확정 후 연결합니다.</span>
        </div>
      </div>
    </aside>
  </section>

  <section v-else class="panel">
    <h2>거래처를 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
