<script setup lang="ts">
import OrderForm from '~/components/orders/OrderForm.vue'
import type { ErpRow } from '~/types/erp'

const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()

function createOrder(row: ErpRow) {
  try {
    const created = store.createOrder(row)
    showToast(`${created.no} 수주를 mock 데이터에 등록했습니다.`)
    router.push('/orders')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '수주 상태를 확인하세요.')
  }
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">수주 관리</p>
      <h1>수주 신규 등록</h1>
    </div>
  </section>

  <OrderForm @submit="createOrder" />
</template>
