<script setup lang="ts">
import ItemForm from '~/components/items/ItemForm.vue'
import type { ErpRow } from '~/types/erp'

const route = useRoute()
const router = useRouter()
const store = useMockErpStore()
const { showToast } = useToast()
const code = computed(() => String(route.params.code))
const item = computed(() => store.findByField('items', 'code', code.value))

function updateItem(row: ErpRow) {
  const updated = store.updateItem(code.value, row)
  if (!updated) {
    showToast('수정할 품목을 찾지 못했습니다.')
    return
  }

  showToast(`${updated.name} 품목 정보를 수정했습니다.`)
  router.push(`/items/${updated.code}`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">품목 관리</p>
      <h1>품목 수정</h1>
    </div>
  </section>

  <ItemForm v-if="item" mode="edit" :initial="item" @submit="updateItem" />
  <section v-else class="panel">
    <h2>품목을 찾을 수 없습니다.</h2>
    <p class="kpi-note">목록으로 돌아가 mock 데이터를 다시 확인하세요.</p>
  </section>
</template>
