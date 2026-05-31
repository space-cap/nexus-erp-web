<script setup lang="ts">
import ItemForm from '~/components/items/ItemForm.vue'
import type { ErpRow } from '~/types/erp'

const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()

function createItem(row: ErpRow) {
  const created = store.createItem(row)
  showToast(`${created.name} 품목을 mock 데이터에 등록했습니다.`)
  router.push(`/items/${created.code}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">품목 관리</p>
      <h1>품목 신규 등록</h1>
    </div>
  </section>

  <ItemForm mode="create" @submit="createItem" />
</template>
