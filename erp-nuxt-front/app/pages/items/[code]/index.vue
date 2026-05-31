<script setup lang="ts">
import { ArrowLeft, Pencil } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { fieldLabel } from '~/utils/fields'
import { formatCellValue } from '~/utils/format'

const route = useRoute()
const store = useMockErpStore()
const { canAction } = useMockAuth()
const code = computed(() => String(route.params.code))
const item = computed(() => store.findByField('items', 'code', code.value))
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">품목 관리</p>
      <h1>{{ item?.name || '품목 상세' }}</h1>
    </div>
    <div class="hero-actions">
      <NuxtLink class="secondary-button" to="/items">
        <ArrowLeft />
        <span>목록</span>
      </NuxtLink>
      <NuxtLink v-if="item && canAction('edit:items')" class="primary-button" :to="`/items/${item.code}/edit`">
        <Pencil />
        <span>수정</span>
      </NuxtLink>
    </div>
  </section>

  <section v-if="item" class="record-detail-layout">
    <article class="record-main panel">
      <div class="detail-title-row">
        <h2>{{ item.name }}</h2>
        <StatusBadge :status="String(item.status)" />
      </div>
      <div class="detail-grid detail-grid-wide">
        <div v-for="[key, value] in Object.entries(item)" :key="key" class="detail-row">
          <span class="detail-label">{{ fieldLabel(key) }}</span>
          <span class="detail-value">{{ formatCellValue(value, typeof value === 'number' ? 'numeric' : 'text') }}</span>
        </div>
      </div>
    </article>
    <aside class="panel record-side">
      <h2>업무 연결</h2>
      <div class="task-list">
        <div class="task-item">
          <strong>재고 현황</strong>
          <span class="kpi-note">창고별 수량과 안전재고 기준을 함께 확인합니다.</span>
        </div>
        <div class="task-item">
          <strong>수주/발주</strong>
          <span class="kpi-note">품목 기준으로 판매 단가와 구매 단가를 비교합니다.</span>
        </div>
      </div>
    </aside>
  </section>

  <section v-else class="panel">
    <h2>품목을 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
