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
  ceo: String(props.initial?.ceo || ''),
  bizNo: String(props.initial?.bizNo || ''),
  manager: String(props.initial?.manager || '김관리'),
  phone: String(props.initial?.phone || ''),
  status: String(props.initial?.status || '대기'),
  amount: Number(props.initial?.amount || 0)
})

function submitForm() {
  emit('submit', {
    ...props.initial,
    ...form,
    amount: Number(form.amount),
    status: form.status
  } as ErpRow)
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submitForm">
    <div class="form-grid">
      <label class="field">
        <span>거래처명</span>
        <input v-model="form.name" required placeholder="예: 한빛정밀">
      </label>
      <label class="field">
        <span>대표자</span>
        <input v-model="form.ceo" required placeholder="예: 박상훈">
      </label>
      <label class="field">
        <span>사업자번호</span>
        <input v-model="form.bizNo" required placeholder="예: 123-81-45670">
      </label>
      <label class="field">
        <span>내부 담당자</span>
        <input v-model="form.manager" required placeholder="예: 최영업">
      </label>
      <label class="field">
        <span>연락처</span>
        <input v-model="form.phone" required placeholder="예: 02-553-1101">
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
      <label class="field">
        <span>누적 금액</span>
        <input v-model.number="form.amount" type="number" min="0" step="10000">
      </label>
    </div>

    <div class="form-actions">
      <NuxtLink class="secondary-button" to="/customers">
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
