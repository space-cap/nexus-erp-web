<script setup lang="ts">
import { ArrowLeft, Pencil } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { fieldLabel } from '~/utils/fields'
import { formatCellValue } from '~/utils/format'

const route = useRoute()
const store = useMockErpStore()
const { canAction } = useMockAuth()
const no = computed(() => String(route.params.no))
const purchase = computed(() => store.findByField('purchase', 'no', no.value))
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">발주 관리</p>
      <h1>{{ purchase?.no || '발주 상세' }}</h1>
    </div>
    <div class="hero-actions">
      <NuxtLink class="secondary-button" to="/purchase">
        <ArrowLeft />
        <span>목록</span>
      </NuxtLink>
      <NuxtLink v-if="purchase && canAction('edit:purchase')" class="primary-button" :to="`/purchase/${purchase.no}/edit`">
        <Pencil />
        <span>수정</span>
      </NuxtLink>
    </div>
  </section>

  <section v-if="purchase" class="record-detail-layout">
    <article class="record-main panel">
      <div class="detail-title-row">
        <h2>{{ purchase.vendor }} / {{ purchase.item }}</h2>
        <StatusBadge :status="String(purchase.status)" />
      </div>
      <div class="detail-grid detail-grid-wide">
        <div v-for="[key, value] in Object.entries(purchase)" :key="key" class="detail-row">
          <span class="detail-label">{{ fieldLabel(key) }}</span>
          <span class="detail-value">{{ formatCellValue(value, typeof value === 'number' ? 'numeric' : 'text') }}</span>
        </div>
      </div>
    </article>
    <aside class="panel record-side">
      <h2>입고 연결</h2>
      <div class="task-list">
        <div class="task-item">
          <strong>{{ purchase.received ? '입고 완료' : '입고 대기' }}</strong>
          <span class="kpi-note">상태를 완료로 저장하면 같은 품목 재고에 입고 수량이 반영됩니다.</span>
        </div>
        <div v-if="purchase.receivedDate" class="task-item">
          <strong>입고일</strong>
          <span class="kpi-note">{{ purchase.receivedDate }}</span>
        </div>
      </div>
    </aside>
  </section>

  <section v-else class="panel">
    <h2>발주를 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
