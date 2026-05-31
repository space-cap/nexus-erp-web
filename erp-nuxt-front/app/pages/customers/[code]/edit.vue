<script setup lang="ts">
import CustomerForm from '~/components/customers/CustomerForm.vue'
import type { ErpRow } from '~/types/erp'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()
const code = computed(() => String(route.params.code))
const customer = computed(() => store.findByField('customers', 'code', code.value))

function updateCustomer(row: ErpRow) {
  const updated = store.updateCustomer(code.value, row)
  if (!updated) {
    showToast('수정할 거래처를 찾지 못했습니다.')
    return
  }

  showToast(`${updated.name} 거래처 정보를 수정했습니다.`)
  router.push(`/customers/${updated.code}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">거래처 관리</p>
      <h1>거래처 수정</h1>
    </div>
  </section>

  <CustomerForm v-if="customer" mode="edit" :initial="customer" @submit="updateCustomer" />
  <section v-else class="panel">
    <h2>거래처를 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
