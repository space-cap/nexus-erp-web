<script setup lang="ts">
import ProductionForm from '~/components/production/ProductionForm.vue'
import type { ErpRow } from '~/types/erp'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()
const no = computed(() => String(route.params.no))
const production = computed(() => store.findByField('production', 'no', no.value))

function updateProduction(row: ErpRow) {
  const updated = store.updateProduction(no.value, row)
  if (!updated) {
    showToast('수정할 생산 계획을 찾지 못했습니다.')
    return
  }

  const suffix = updated.productionReceived
    ? ' 생산 완료 입고까지 반영했습니다.'
    : updated.issued
      ? ' 자재 출고까지 반영했습니다.'
      : ' 정보를 수정했습니다.'
  showToast(`${updated.no} 생산 계획${suffix}`)
  router.push(`/production/${updated.no}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">생산 관리</p>
      <h1>생산 계획 수정</h1>
    </div>
  </section>

  <ProductionForm v-if="production" mode="edit" :initial="production" @submit="updateProduction" />
  <section v-else class="panel">
    <h2>생산 계획을 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
