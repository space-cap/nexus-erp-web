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

const itemOptions = computed(() => (store.datasets.value.items || []).map((row) => String(row.name)))
const lineOptions = ['전자조립 1라인', '가공 1라인', '가공 2라인', '조립 3라인', '포장 1라인']

const form = reactive({
  item: String(props.initial?.item || itemOptions.value[0] || ''),
  line: String(props.initial?.line || lineOptions[0]),
  start: String(props.initial?.start || '2026-05-31'),
  end: String(props.initial?.end || '2026-06-07'),
  qty: Number(props.initial?.qty || 500),
  progress: Number(props.initial?.progress || 0),
  status: String(props.initial?.status || '대기')
})

function submitForm() {
  emit('submit', {
    ...props.initial,
    ...form,
    qty: Number(form.qty),
    progress: Number(form.progress)
  })
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submitForm">
    <div class="form-grid">
      <label class="field">
        <span>품목</span>
        <select v-model="form.item">
          <option v-for="item in itemOptions" :key="item">{{ item }}</option>
        </select>
      </label>
      <label class="field">
        <span>라인</span>
        <select v-model="form.line">
          <option v-for="line in lineOptions" :key="line">{{ line }}</option>
        </select>
      </label>
      <label class="field">
        <span>생산 수량</span>
        <input v-model.number="form.qty" type="number" min="1" required>
      </label>
      <label class="field">
        <span>진행률</span>
        <input v-model.number="form.progress" type="number" min="0" max="100" required>
      </label>
      <label class="field">
        <span>시작일</span>
        <input v-model="form.start" type="date" required>
      </label>
      <label class="field">
        <span>종료일</span>
        <input v-model="form.end" type="date" required>
      </label>
      <label class="field">
        <span>상태</span>
        <select v-model="form.status">
          <option>대기</option>
          <option>진행</option>
          <option>지연</option>
          <option>완료</option>
        </select>
      </label>
    </div>

    <div class="form-actions">
      <NuxtLink class="secondary-button" to="/production">
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
