<script setup lang="ts">
import { ArrowLeft, Save } from '@lucide/vue'
import type { ErpRow } from '~/types/erp'

const props = withDefaults(defineProps<{
  mode?: 'create' | 'edit'
  initial?: ErpRow
}>(), {
  mode: 'create'
})

const store = useMockErpStore()
const emit = defineEmits<{
  submit: [ErpRow]
}>()

const customerOptions = computed(() => (store.datasets.value.customers || []).map((row) => String(row.name)))
const itemOptions = computed(() => (store.datasets.value.items || []).map((row) => String(row.name)))
const selectedItem = computed(() => (store.datasets.value.items || []).find((row) => row.name === form.item))

const form = reactive({
  customer: String(props.initial?.customer || customerOptions.value[0] || ''),
  item: String(props.initial?.item || itemOptions.value[0] || ''),
  qty: Number(props.initial?.qty || 100),
  orderDate: String(props.initial?.orderDate || '2026-05-31'),
  dueDate: String(props.initial?.dueDate || '2026-06-07'),
  owner: String(props.initial?.owner || '최영업'),
  amount: Number(props.initial?.amount || 0),
  status: String(props.initial?.status || '대기')
})

watch([() => form.item, () => form.qty], () => {
  if (selectedItem.value) {
    form.amount = Number(selectedItem.value.sales || 0) * Number(form.qty || 0)
  }
}, { immediate: props.mode === 'create' })

function submitForm() {
  emit('submit', {
    ...props.initial,
    ...form,
    qty: Number(form.qty),
    amount: Number(form.amount)
  })
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submitForm">
    <div class="form-grid">
      <label class="field">
        <span>거래처</span>
        <select v-model="form.customer">
          <option v-for="customer in customerOptions" :key="customer">{{ customer }}</option>
        </select>
      </label>
      <label class="field">
        <span>품목</span>
        <select v-model="form.item">
          <option v-for="item in itemOptions" :key="item">{{ item }}</option>
        </select>
      </label>
      <label class="field">
        <span>수량</span>
        <input v-model.number="form.qty" type="number" min="1" required>
      </label>
      <label class="field">
        <span>수주 금액</span>
        <input v-model.number="form.amount" type="number" min="0" step="1000" required>
      </label>
      <label class="field">
        <span>수주일</span>
        <input v-model="form.orderDate" type="date" required>
      </label>
      <label class="field">
        <span>납기일</span>
        <input v-model="form.dueDate" type="date" required>
      </label>
      <label class="field">
        <span>담당자</span>
        <input v-model="form.owner" required>
      </label>
      <label class="field">
        <span>상태</span>
        <select v-model="form.status">
          <option>대기</option>
          <option>진행</option>
          <option>지연</option>
          <option>완료</option>
          <option>취소</option>
        </select>
      </label>
    </div>

    <div class="form-actions">
      <NuxtLink class="secondary-button" to="/orders">
        <ArrowLeft />
        <span>목록</span>
      </NuxtLink>
      <button class="primary-button" type="submit">
        <Save />
        <span>{{ mode === 'create' ? '등록' : '저장' }}</span>
      </button>
    </div>
  </form>
</template>
