<script setup lang="ts">
import { ArrowLeft, Factory, Pencil } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { fieldLabel } from '~/utils/fields'
import { formatCellValue } from '~/utils/format'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()
const { canAction } = useMockAuth()
const no = computed(() => String(route.params.no))
const order = computed(() => store.findByField('orders', 'no', no.value))

function createProductionInstruction() {
  const created = store.createProductionFromOrder(no.value)
  if (!created) {
    showToast('생산 지시를 만들 수주를 찾지 못했습니다.')
    return
  }

  showToast(`${created.no} 생산 계획을 수주 기준으로 생성했습니다.`)
  router.push(`/production/${created.no}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">수주 관리</p>
      <h1>{{ order?.no || '수주 상세' }}</h1>
    </div>
    <div class="hero-actions">
      <NuxtLink class="secondary-button" to="/orders">
        <ArrowLeft />
        <span>목록</span>
      </NuxtLink>
      <button v-if="order && canAction('create:production')" class="secondary-button" type="button" @click="createProductionInstruction">
        <Factory />
        <span>생산 지시</span>
      </button>
      <NuxtLink v-if="order && canAction('edit:orders')" class="primary-button" :to="`/orders/${order.no}/edit`">
        <Pencil />
        <span>수정</span>
      </NuxtLink>
    </div>
  </section>

  <section v-if="order" class="record-detail-layout">
    <article class="record-main panel">
      <div class="detail-title-row">
        <h2>{{ order.customer }} / {{ order.item }}</h2>
        <StatusBadge :status="String(order.status)" />
      </div>
      <div class="detail-grid detail-grid-wide">
        <div v-for="[key, value] in Object.entries(order)" :key="key" class="detail-row">
          <span class="detail-label">{{ fieldLabel(key) }}</span>
          <span class="detail-value">{{ formatCellValue(value, typeof value === 'number' ? 'numeric' : 'text') }}</span>
        </div>
      </div>
    </article>
    <aside class="panel record-side">
      <h2>업무 연결</h2>
      <div class="task-list">
        <div class="task-item">
          <strong>재고 예약</strong>
          <span class="kpi-note">수주 상태가 완료/취소가 아니면 예약재고에 반영됩니다.</span>
        </div>
        <div class="task-item">
          <strong>생산 지시</strong>
          <span class="kpi-note">수주 품목, 수량, 납기일을 기준으로 생산 계획을 생성합니다.</span>
        </div>
      </div>
    </aside>
  </section>

  <section v-else class="panel">
    <h2>수주를 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
