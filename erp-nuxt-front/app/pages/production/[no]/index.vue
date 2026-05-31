<script setup lang="ts">
import { ArrowLeft, Pencil } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { fieldLabel } from '~/utils/fields'
import { formatCellValue } from '~/utils/format'

const route = useRoute()
const store = useMockErpStore()
const { canAction } = useMockAuth()
const no = computed(() => String(route.params.no))
const production = computed(() => store.findByField('production', 'no', no.value))
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">생산 관리</p>
      <h1>{{ production?.no || '생산 계획 상세' }}</h1>
    </div>
    <div class="hero-actions">
      <NuxtLink class="secondary-button" to="/production">
        <ArrowLeft />
        <span>목록</span>
      </NuxtLink>
      <NuxtLink v-if="production && canAction('edit:production')" class="primary-button" :to="`/production/${production.no}/edit`">
        <Pencil />
        <span>수정</span>
      </NuxtLink>
    </div>
  </section>

  <section v-if="production" class="record-detail-layout">
    <article class="record-main panel">
      <div class="detail-title-row">
        <h2>{{ production.item }}</h2>
        <StatusBadge :status="String(production.status)" />
      </div>
      <div class="detail-grid detail-grid-wide">
        <div v-for="[key, value] in Object.entries(production)" :key="key" class="detail-row">
          <span class="detail-label">{{ fieldLabel(key) }}</span>
          <span class="detail-value">{{ formatCellValue(value, typeof value === 'number' ? 'numeric' : 'text') }}</span>
        </div>
      </div>
    </article>
    <aside class="panel record-side">
      <h2>재고 연결</h2>
      <div class="task-list">
        <div class="task-item">
          <strong>{{ production.issued ? '자재 출고 완료' : '자재 출고 대기' }}</strong>
          <span class="kpi-note">상태를 진행으로 저장하면 같은 품목 재고가 출고 처리됩니다.</span>
        </div>
        <div class="task-item">
          <strong>{{ production.productionReceived ? '제품 입고 완료' : '제품 입고 대기' }}</strong>
          <span class="kpi-note">상태를 완료로 저장하면 생산 수량이 입고 처리됩니다.</span>
        </div>
      </div>
    </aside>
  </section>

  <section v-else class="panel">
    <h2>생산 계획을 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
