<script setup lang="ts">
import CustomerForm from '~/components/customers/CustomerForm.vue'
import type { ErpRow } from '~/types/erp'

const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()

function createCustomer(row: ErpRow) {
  const created = store.createCustomer(row)
  showToast(`${created.name} 거래처를 mock 데이터에 등록했습니다.`)
  router.push(`/customers/${created.code}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">거래처 관리</p>
      <h1>거래처 신규 등록</h1>
    </div>
  </section>

  <CustomerForm mode="create" @submit="createCustomer" />
</template>
