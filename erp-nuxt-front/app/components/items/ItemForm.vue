<script setup lang="ts">
import { ArrowLeft, Save } from '@lucide/vue'
import type { ErpRow } from '~/types/erp'

const props = defineProps<{
  mode: 'create' | 'edit'
  initial?: ErpRow
}>()

const emit = defineEmits<{
  submit: [ErpRow]
}>()

const form = reactive({
  name: String(props.initial?.name || ''),
  spec: String(props.initial?.spec || ''),
  unit: String(props.initial?.unit || 'EA'),
  purchase: Number(props.initial?.purchase || 0),
  sales: Number(props.initial?.sales || 0),
  owner: String(props.initial?.owner || '이자재'),
  status: String(props.initial?.status || '대기')
})

function submitForm() {
  emit('submit', {
    ...props.initial,
    ...form,
    purchase: Number(form.purchase),
    sales: Number(form.sales)
  } as ErpRow)
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submitForm">
    <div class="form-grid">
      <label class="field">
        <span>품목명</span>
        <input v-model="form.name" required placeholder="예: 알루미늄 하우징 B형">
      </label>
      <label class="field">
        <span>규격</span>
        <input v-model="form.spec" required placeholder="예: 140x90x40">
      </label>
      <label class="field">
        <span>단위</span>
        <select v-model="form.unit">
          <option>EA</option>
          <option>SET</option>
          <option>M</option>
          <option>KG</option>
        </select>
      </label>
      <label class="field">
        <span>담당자</span>
        <input v-model="form.owner" required>
      </label>
      <label class="field">
        <span>매입 단가</span>
        <input v-model.number="form.purchase" type="number" min="0" step="100">
      </label>
      <label class="field">
        <span>판매 단가</span>
        <input v-model.number="form.sales" type="number" min="0" step="100">
      </label>
      <label class="field">
        <span>상태</span>
        <select v-model="form.status">
          <option>정상</option>
          <option>진행</option>
          <option>대기</option>
          <option>중지</option>
        </select>
      </label>
    </div>

    <div class="form-actions">
      <NuxtLink class="secondary-button" to="/items">
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
