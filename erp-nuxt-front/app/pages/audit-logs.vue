<script setup lang="ts">
import { RotateCcw, Search } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'

const store = useMockErpStore()

const keyword = ref('')
const moduleKey = ref('all')
const action = ref('all')

const moduleOptions = computed(() => [
  ...new Set(store.auditLogs.value.map((row) => String(row.moduleKey || '')).filter(Boolean))
])

const actionOptions = computed(() => [
  ...new Set(store.auditLogs.value.map((row) => String(row.action || '')).filter(Boolean))
])

const filteredLogs = computed(() => store.auditLogs.value.filter((row) => {
  const searchText = [
    row.id,
    row.moduleName,
    row.action,
    row.documentNo,
    row.summary,
    row.actor,
    row.role,
    row.memo
  ].join(' ').toLowerCase()

  const keywordMatch = !keyword.value || searchText.includes(keyword.value.toLowerCase())
  const moduleMatch = moduleKey.value === 'all' || row.moduleKey === moduleKey.value
  const actionMatch = action.value === 'all' || row.action === action.value
  return keywordMatch && moduleMatch && actionMatch
}))

const latestLog = computed(() => filteredLogs.value[0])
const statusChangeCount = computed(() => filteredLogs.value.filter((row) => row.action === '상태 변경').length)
const stockLogCount = computed(() => filteredLogs.value.filter((row) => row.moduleKey === 'inventory').length)
const actorCount = computed(() => new Set(filteredLogs.value.map((row) => row.actor)).size)

function resetFilters() {
  keyword.value = ''
  moduleKey.value = 'all'
  action.value = 'all'
}

function moduleLabel(key: string) {
  return String(store.auditLogs.value.find((row) => row.moduleKey === key)?.moduleName || key)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">감사 로그</p>
      <h1>처리 이력</h1>
    </div>
  </section>

  <section class="summary-strip">
    <article class="summary-card">
      <span>조회 이력</span>
      <strong>{{ filteredLogs.length }}건</strong>
    </article>
    <article class="summary-card">
      <span>상태 변경</span>
      <strong>{{ statusChangeCount }}건</strong>
    </article>
    <article class="summary-card">
      <span>재고 처리</span>
      <strong>{{ stockLogCount }}건</strong>
    </article>
    <article class="summary-card">
      <span>처리자</span>
      <strong>{{ actorCount }}명</strong>
    </article>
  </section>

  <section class="audit-layout">
    <section class="list-area">
      <div class="filter-bar audit-filter-bar">
        <label class="field">
          <span>검색</span>
          <div class="input-with-icon">
            <Search />
            <input v-model="keyword" placeholder="문서 번호, 처리자, 메모 검색">
          </div>
        </label>
        <label class="field">
          <span>업무</span>
          <select v-model="moduleKey">
            <option value="all">전체</option>
            <option v-for="option in moduleOptions" :key="option" :value="option">
              {{ moduleLabel(option) }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>처리 유형</span>
          <select v-model="action">
            <option value="all">전체</option>
            <option v-for="option in actionOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>
        <button class="secondary-button audit-reset-button" type="button" @click="resetFilters">
          <RotateCcw />
          <span>초기화</span>
        </button>
      </div>

      <div class="table-wrap audit-table">
        <table>
          <thead>
            <tr>
              <th>이력 번호</th>
              <th>업무</th>
              <th>처리 유형</th>
              <th>문서 번호</th>
              <th>상태 변경</th>
              <th>처리자</th>
              <th>처리일시</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredLogs" :key="String(row.id)">
              <td>{{ row.id }}</td>
              <td>{{ row.moduleName }}</td>
              <td>{{ row.action }}</td>
              <td>{{ row.documentNo }}</td>
              <td>
                <span v-if="row.beforeStatus || row.afterStatus" class="status-flow">
                  <StatusBadge v-if="row.beforeStatus" :status="String(row.beforeStatus)" />
                  <span v-if="row.beforeStatus && row.afterStatus">→</span>
                  <StatusBadge v-if="row.afterStatus" :status="String(row.afterStatus)" />
                </span>
                <span v-else class="kpi-note">-</span>
              </td>
              <td>{{ row.actor }}</td>
              <td>{{ row.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <aside class="detail-panel">
      <template v-if="latestLog">
        <div class="detail-header">
          <div class="detail-title-row">
            <h2>{{ latestLog.id }}</h2>
            <StatusBadge :status="String(latestLog.status)" />
          </div>
          <p class="kpi-note">가장 최근 처리 이력입니다.</p>
        </div>
        <div class="detail-grid">
          <div class="detail-row">
            <span class="detail-label">업무</span>
            <strong class="detail-value">{{ latestLog.moduleName }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">처리 유형</span>
            <strong class="detail-value">{{ latestLog.action }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">문서 번호</span>
            <strong class="detail-value">{{ latestLog.documentNo }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">요약</span>
            <strong class="detail-value">{{ latestLog.summary }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">처리자</span>
            <strong class="detail-value">{{ latestLog.actor }} / {{ latestLog.role }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">부서</span>
            <strong class="detail-value">{{ latestLog.dept }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">메모</span>
            <strong class="detail-value">{{ latestLog.memo || '-' }}</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">처리일시</span>
            <strong class="detail-value">{{ latestLog.createdAt }}</strong>
          </div>
        </div>
      </template>
      <div v-else class="empty-detail">
        <strong>이력이 없습니다.</strong>
        <span>검색 조건을 조정하세요.</span>
      </div>
    </aside>
  </section>
</template>
