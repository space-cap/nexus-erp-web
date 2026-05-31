<script setup lang="ts">
import OrderForm from '~/components/orders/OrderForm.vue'
import type { ErpRow } from '~/types/erp'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()
const no = computed(() => String(route.params.no))
const order = computed(() => store.findByField('orders', 'no', no.value))

function updateOrder(row: ErpRow) {
  const updated = store.updateOrder(no.value, row)
  if (!updated) {
    showToast('수정할 수주를 찾지 못했습니다.')
    return
  }

  showToast(`${updated.no} 수주 정보를 수정했습니다.`)
  router.push(`/orders/${updated.no}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">수주 관리</p>
      <h1>수주 수정</h1>
    </div>
  </section>

  <OrderForm v-if="order" mode="edit" :initial="order" @submit="updateOrder" />
  <section v-else class="panel">
    <h2>수주를 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
