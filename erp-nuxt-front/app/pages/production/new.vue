<script setup lang="ts">
import ProductionForm from '~/components/production/ProductionForm.vue'
import type { ErpRow } from '~/types/erp'

const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()

function createProduction(row: ErpRow) {
  const created = store.createProduction(row)
  showToast(`${created.no} 생산 계획을 mock 데이터에 등록했습니다.`)
  router.push('/production')
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">생산 관리</p>
      <h1>생산 계획 신규 등록</h1>
    </div>
  </section>

  <ProductionForm @submit="createProduction" />
</template>
