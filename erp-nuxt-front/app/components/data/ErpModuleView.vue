<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Download, Eye, Pencil, Plus, RotateCcw, Save, SearchX, X } from '@lucide/vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { moduleDefinitions } from '~/constants/modules'
import { getGroupValue } from '~/services/mockErpRepository'
import type { ErpRow } from '~/types/erp'
import { fieldLabel } from '~/utils/fields'
import { formatCellValue, formatCurrency, formatNumber } from '~/utils/format'

const props = defineProps<{
  moduleKey: string
}>()

const globalSearch = useGlobalSearch()
const router = useRouter()
const { showToast } = useToast()
const { canAction } = useMockAuth()
const store = useMockErpStore()
const keyword = ref('')
const status = ref('all')
const period = ref('all')
const group = ref('all')
const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')
const selectedIndex = ref(0)
const modalOpen = ref(false)

const config = computed(() => moduleDefinitions[props.moduleKey])
const statuses = computed(() => store.statusOptions(config.value.dataset))
const baseResponse = computed(() => store.list(config.value.dataset, {
  keyword: keyword.value,
  globalKeyword: globalSearch.value,
  status: status.value,
  period: period.value
}))
const groupOptions = computed(() => [
  ...new Set(baseResponse.value.items.map((row) => getGroupValue(row, config.value.dataset)).filter(Boolean))
])
const response = computed(() => store.list(config.value.dataset, {
  keyword: keyword.value,
  globalKeyword: globalSearch.value,
  status: status.value,
  period: period.value,
  group: group.value,
  sortKey: sortKey.value,
  sortDir: sortDir.value
}))
const rows = computed(() => response.value.items)
const summary = computed(() => response.value.summary)
const selectedRow = computed(() => rows.value[selectedIndex.value])
const createActionKey = computed(() => props.moduleKey === 'inventory' ? 'process:inventory' : `create:${props.moduleKey}`)
const editActionKey = computed(() => `edit:${props.moduleKey}`)
const processActionKey = computed(() => props.moduleKey === 'purchase' ? 'process:purchase' : props.moduleKey === 'production' ? 'process:production' : '')
const canCreateCurrent = computed(() => canAction(createActionKey.value))
const canEditCurrent = computed(() => canAction(editActionKey.value))
const canProcessCurrent = computed(() => processActionKey.value ? canAction(processActionKey.value) : true)

const groupFilterLabel = computed(() => {
  if (props.moduleKey === 'inventory') {
    return '창고'
  }

  if (props.moduleKey === 'users') {
    return '부서'
  }

  if (props.moduleKey === 'orders') {
    return '거래처'
  }

  if (props.moduleKey === 'purchase') {
    return '매입처'
  }

  if (props.moduleKey === 'production') {
    return '라인'
  }

  return '담당/구분'
})

watch([keyword, status, period, group, globalSearch], () => {
  selectedIndex.value = 0
})

watch(groupOptions, () => {
  if (group.value !== 'all' && !groupOptions.value.includes(group.value)) {
    group.value = 'all'
  }
})

function valueFor(row: ErpRow, key: string) {
  return row[key]
}

function detailTitle(row: ErpRow) {
  return String(row[config.value.detailTitle] || row.name || row.no || row.code || '')
}

function exportCsv() {
  const headers = config.value.columns.map((column) => column.label)
  const body = rows.value.map((row) => config.value.columns.map((column) => escapeCsv(valueFor(row, column.key))).join(','))
  const csv = [headers.join(','), ...body].join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${config.value.title.replace(/\s+/g, '_')}_mock.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast(`${config.value.title} CSV 파일을 생성했습니다.`)
}

function escapeCsv(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }

  selectedIndex.value = 0
}

function resetFilters() {
  keyword.value = ''
  status.value = 'all'
  period.value = 'all'
  group.value = 'all'
  sortKey.value = ''
  sortDir.value = 'asc'
  selectedIndex.value = 0
}

function sortLabel(columnKey: string) {
  if (sortKey.value !== columnKey) {
    return '정렬 없음'
  }

  return sortDir.value === 'asc' ? '오름차순' : '내림차순'
}

function closeModal() {
  modalOpen.value = false
}

function submitMockForm() {
  closeModal()
  showToast('신규 mock 데이터가 저장된 것처럼 처리했습니다.')
}

function openNew() {
  if (props.moduleKey === 'customers') {
    router.push('/customers/new')
    return
  }

  if (props.moduleKey === 'items') {
    router.push('/items/new')
    return
  }

  if (props.moduleKey === 'orders') {
    router.push('/orders/new')
    return
  }

  if (props.moduleKey === 'purchase') {
    router.push('/purchase/new')
    return
  }

  if (props.moduleKey === 'production') {
    router.push('/production/new')
    return
  }

  if (props.moduleKey === 'inventory') {
    router.push('/inventory/transactions')
    return
  }

  modalOpen.value = true
}

function openDetail(row: ErpRow) {
  if (props.moduleKey === 'customers') {
    router.push(`/customers/${row.code}`)
    return
  }

  if (props.moduleKey === 'items') {
    router.push(`/items/${row.code}`)
    return
  }

  if (props.moduleKey === 'orders') {
    router.push(`/orders/${row.no}`)
    return
  }

  if (props.moduleKey === 'purchase') {
    router.push(`/purchase/${row.no}`)
    return
  }

  if (props.moduleKey === 'production') {
    router.push(`/production/${row.no}`)
    return
  }

  showToast(`${config.value.title} 상세 페이지는 다음 업무 화면에서 확장합니다.`)
}

function openEdit(row: ErpRow) {
  if (props.moduleKey === 'customers') {
    router.push(`/customers/${row.code}/edit`)
    return
  }

  if (props.moduleKey === 'items') {
    router.push(`/items/${row.code}/edit`)
    return
  }

  if (props.moduleKey === 'orders') {
    router.push(`/orders/${row.no}/edit`)
    return
  }

  if (props.moduleKey === 'purchase') {
    router.push(`/purchase/${row.no}/edit`)
    return
  }

  if (props.moduleKey === 'production') {
    router.push(`/production/${row.no}/edit`)
    return
  }

  showToast(`${config.value.title} 수정 화면은 다음 업무 화면에서 확장합니다.`)
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">{{ config.eyebrow }}</p>
      <h1>{{ config.title }}</h1>
    </div>
    <div class="hero-actions">
      <button class="secondary-button" type="button" @click="exportCsv">
        <Download />
        <span>CSV</span>
      </button>
      <button v-if="canCreateCurrent" class="primary-button" type="button" @click="openNew">
        <Plus />
        <span>{{ props.moduleKey === 'inventory' ? '입출고' : '신규' }}</span>
      </button>
    </div>
  </section>

  <section class="module-view" aria-label="업무 목록">
    <div class="summary-strip">
      <div class="summary-card">
        <span>조회 건수</span>
        <strong>{{ formatNumber(summary.totalCount) }}건</strong>
      </div>
      <div class="summary-card">
        <span>주요 합계</span>
        <strong>{{ summary.primaryTotal >= 100000 ? formatCurrency(summary.primaryTotal) : formatNumber(summary.primaryTotal) }}</strong>
      </div>
      <div class="summary-card">
        <span>정상/진행</span>
        <strong>{{ formatNumber(summary.activeCount) }}건</strong>
      </div>
      <div class="summary-card">
        <span>주의 상태</span>
        <strong>{{ formatNumber(summary.warningCount) }}건</strong>
        <span v-if="summary.ownerCount">담당/구분 {{ summary.ownerCount }}개</span>
      </div>
    </div>

    <div class="workbench">
      <section class="list-area">
        <div class="filter-bar">
          <label class="field">
            <span>검색</span>
            <input v-model="keyword" type="search" placeholder="현재 화면에서 검색">
          </label>
          <label class="field">
            <span>상태</span>
            <select v-model="status">
              <option value="all">전체</option>
              <option v-for="option in statuses" :key="option" :value="option">{{ option }}</option>
            </select>
          </label>
          <label class="field">
            <span>{{ groupFilterLabel }}</span>
            <select v-model="group">
              <option value="all">전체</option>
              <option v-for="option in groupOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </label>
          <label class="field">
            <span>기간</span>
            <select v-model="period">
              <option value="all">전체</option>
              <option value="week">최근 7일</option>
              <option value="month">이번 달</option>
            </select>
          </label>
          <button class="secondary-button filter-reset-button" type="button" @click="resetFilters">
            <RotateCcw />
            <span>초기화</span>
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th v-for="column in config.columns" :key="column.key" :class="{ numeric: column.type === 'numeric' }">
                  <button class="sort-button" type="button" @click="toggleSort(column.key)">
                    <span>{{ column.label }}</span>
                    <ArrowUp v-if="sortKey === column.key && sortDir === 'asc'" />
                    <ArrowDown v-else-if="sortKey === column.key && sortDir === 'desc'" />
                    <ArrowUpDown v-else />
                    <span class="sr-only">{{ sortLabel(column.key) }}</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!rows.length">
                <td :colspan="config.columns.length">조건에 맞는 mock 데이터가 없습니다.</td>
              </tr>
              <tr
                v-for="(row, rowIndex) in rows"
                v-else
                :key="`${config.key}-${rowIndex}`"
                :class="{ selected: rowIndex === selectedIndex }"
                @click="selectedIndex = rowIndex"
              >
                <td v-for="column in config.columns" :key="column.key" :class="{ numeric: column.type === 'numeric' }">
                  <StatusBadge v-if="column.type === 'status'" :status="String(valueFor(row, column.key))" />
                  <div v-else-if="column.type === 'progress'" class="progress" :aria-label="`진행률 ${valueFor(row, column.key)}%`">
                    <span :style="{ width: `${valueFor(row, column.key)}%` }"></span>
                  </div>
                  <template v-else>{{ formatCellValue(valueFor(row, column.key), column.type) }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="detail-panel" aria-label="상세 정보">
        <div v-if="!selectedRow" class="empty-detail">
          <SearchX />
          <strong>선택한 데이터가 없습니다</strong>
          <span>필터 조건을 바꾸면 상세 정보를 확인할 수 있습니다.</span>
        </div>
        <template v-else>
          <div class="detail-header">
            <div class="detail-title-row">
              <h2>{{ detailTitle(selectedRow) }}</h2>
              <StatusBadge :status="String(selectedRow.status)" />
            </div>
            <span class="kpi-note">{{ config.eyebrow }} 상세 mock 데이터</span>
          </div>
          <div class="detail-grid">
            <div v-for="[key, value] in Object.entries(selectedRow)" :key="key" class="detail-row">
              <span class="detail-label">{{ fieldLabel(key) }}</span>
              <span class="detail-value">{{ formatCellValue(value, typeof value === 'number' ? 'numeric' : 'text') }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <button class="secondary-button" type="button" @click="openDetail(selectedRow)">
              <Eye />
              <span>상세</span>
            </button>
            <button v-if="canEditCurrent" class="secondary-button" type="button" @click="openEdit(selectedRow)">
              <Pencil />
              <span>수정</span>
            </button>
            <button v-if="canProcessCurrent" class="primary-button" type="button" @click="showToast('승인/처리 mock 액션을 기록했습니다.')">
              <Check />
              <span>처리</span>
            </button>
          </div>
        </template>
      </aside>
    </div>
  </section>

  <div v-if="modalOpen" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle" @click.self="closeModal">
    <section class="modal">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Mock 등록</p>
          <h2 id="modalTitle">{{ config.title }} 신규 데이터</h2>
        </div>
        <button class="icon-button" type="button" aria-label="닫기" @click="closeModal">
          <X />
        </button>
      </div>
      <form class="modal-form" @submit.prevent="submitMockForm">
        <label>
          <span>제목</span>
          <input required placeholder="예: 신규 업무 데이터 등록">
        </label>
        <label>
          <span>담당자</span>
          <input required placeholder="예: 김관리">
        </label>
        <label>
          <span>상태</span>
          <select>
            <option>대기</option>
            <option>진행</option>
            <option>정상</option>
            <option>완료</option>
          </select>
        </label>
        <label>
          <span>메모</span>
          <textarea rows="4" placeholder="mock 데이터 검토용 메모"></textarea>
        </label>
        <div class="modal-actions">
          <button class="secondary-button" type="button" @click="closeModal">취소</button>
          <button class="primary-button" type="submit">
            <Save />
            <span>저장</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
