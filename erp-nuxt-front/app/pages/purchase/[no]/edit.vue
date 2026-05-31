<script setup lang="ts">
import PurchaseForm from '~/components/purchase/PurchaseForm.vue'
import type { ErpRow } from '~/types/erp'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()
const no = computed(() => String(route.params.no))
const purchase = computed(() => store.findByField('purchase', 'no', no.value))

function updatePurchase(row: ErpRow) {
  try {
    const updated = store.updatePurchase(no.value, row)
    if (!updated) {
      showToast('수정할 발주를 찾지 못했습니다.')
      return
    }

    const suffix = updated.received ? ' 입고까지 반영했습니다.' : ' 정보를 수정했습니다.'
    showToast(`${updated.no} 발주${suffix}`)
    router.push(`/purchase/${updated.no}`)
  } catch (error) {
    showToast(error instanceof Error ? error.message : '발주 상태를 확인하세요.')
  }
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">발주 관리</p>
      <h1>발주 수정</h1>
    </div>
  </section>

  <PurchaseForm v-if="purchase" mode="edit" :initial="purchase" @submit="updatePurchase" />
  <section v-else class="panel">
    <h2>발주를 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
