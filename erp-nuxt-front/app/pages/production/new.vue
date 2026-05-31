<script setup lang="ts">
import ProductionForm from '~/components/production/ProductionForm.vue'
import type { ErpRow } from '~/types/erp'

const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()

function createProduction(row: ErpRow) {
  try {
    const created = store.createProduction(row)
    showToast(`${created.no} 생산 계획을 mock 데이터에 등록했습니다.`)
    router.push('/production')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '생산 상태를 확인하세요.')
  }
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
