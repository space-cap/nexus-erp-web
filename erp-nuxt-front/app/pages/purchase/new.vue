<script setup lang="ts">
import PurchaseForm from '~/components/purchase/PurchaseForm.vue'
import type { ErpRow } from '~/types/erp'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()

const suggestedPurchase = computed(() => {
  const item = String(route.query.item || '')
  const qty = Number(route.query.qty || 0)
  if (!item) {
    return undefined
  }

  return {
    vendor: '동양소재',
    item,
    qty: Math.max(1, qty),
    orderDate: '2026-05-31',
    dueDate: '2026-06-05',
    owner: '박구매',
    amount: 0,
    status: '대기'
  } as ErpRow
})

function createPurchase(row: ErpRow) {
  const created = store.createPurchase(row)
  showToast(`${created.no} 발주를 mock 데이터에 등록했습니다.`)
  router.push('/purchase')
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">발주 관리</p>
      <h1>발주 신규 등록</h1>
    </div>
  </section>

  <PurchaseForm :initial="suggestedPurchase" @submit="createPurchase" />
</template>
