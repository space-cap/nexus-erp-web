<script setup lang="ts">
import { ArrowLeft, Save } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import type { ErpRow } from '~/types/erp'
import { formatCellValue, formatNumber } from '~/utils/format'

const store = useMockErpStore()
const { showToast } = useToast()
const { canAction } = useMockAuth()

const inventoryRows = computed(() => store.datasets.value.inventory || [])
const form = reactive({
  type: '입고',
  item: String(inventoryRows.value[0]?.item || ''),
  warehouse: String(inventoryRows.value[0]?.warehouse || ''),
  qty: 100,
  owner: '김관리',
  memo: ''
})

const itemOptions = computed(() => [...new Set(inventoryRows.value.map((row) => String(row.item)))])
const warehouseOptions = computed(() => [...new Set(inventoryRows.value.map((row) => String(row.warehouse)))])

function submitTransaction() {
  const created = store.addStockTransaction(form as ErpRow)
  showToast(`${created.item} ${created.type} ${formatNumber(Number(created.qty))}건을 mock 처리했습니다.`)
  form.qty = 100
  form.memo = ''
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">재고 관리</p>
      <h1>재고 입출고</h1>
    </div>
    <div class="hero-actions">
      <NuxtLink class="secondary-button" to="/inventory">
        <ArrowLeft />
        <span>재고 현황</span>
      </NuxtLink>
    </div>
  </section>

  <section class="transaction-layout">
    <form class="form-panel" @submit.prevent="submitTransaction">
      <div class="form-grid">
        <label class="field">
          <span>유형</span>
          <select v-model="form.type">
            <option>입고</option>
            <option>출고</option>
            <option>조정</option>
          </select>
        </label>
        <label class="field">
          <span>품목</span>
          <select v-model="form.item">
            <option v-for="item in itemOptions" :key="item">{{ item }}</option>
          </select>
        </label>
        <label class="field">
          <span>창고</span>
          <select v-model="form.warehouse">
            <option v-for="warehouse in warehouseOptions" :key="warehouse">{{ warehouse }}</option>
          </select>
        </label>
        <label class="field">
          <span>수량</span>
          <input v-model.number="form.qty" type="number" min="0" required>
        </label>
        <label class="field">
          <span>담당자</span>
          <input v-model="form.owner" required>
        </label>
        <label class="field form-wide">
          <span>메모</span>
          <input v-model="form.memo" placeholder="예: 수주 출고, 발주 입고, 재고 실사 조정">
        </label>
      </div>
      <div class="form-actions">
        <button v-if="canAction('process:inventory')" class="primary-button" type="submit">
          <Save />
          <span>입출고 처리</span>
        </button>
      </div>
    </form>

    <section class="list-area">
      <div class="table-wrap transaction-table">
        <table>
          <thead>
            <tr>
              <th>전표 번호</th>
              <th>유형</th>
              <th>품목</th>
              <th>창고</th>
              <th class="numeric">수량</th>
              <th>담당자</th>
              <th>메모</th>
              <th>처리일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in store.stockTransactions.value" :key="String(row.no)">
              <td>{{ row.no }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.item }}</td>
              <td>{{ row.warehouse }}</td>
              <td class="numeric">{{ formatCellValue(row.qty, 'numeric') }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.memo }}</td>
              <td>{{ row.lastDate }}</td>
              <td><StatusBadge :status="String(row.status)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
