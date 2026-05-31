import { mockDatasets } from '~/data/mock/erp'
import { filterMockList, getStatusOptions as getStaticStatusOptions } from '~/services/mockErpRepository'
import type { ErpRow, ListParams } from '~/types/erp'
import { assertWorkflowStatusTransition } from '~/utils/status'

const todayText = '2026-05-31'
const datasetStorageKey = 'erp-nuxt-mock-datasets-v2'
const stockStorageKey = 'erp-nuxt-stock-transactions-v2'

const initialStockTransactions: ErpRow[] = [
  { no: 'ST-260531-001', type: '입고', item: '컨트롤 PCB V2', warehouse: '전자부품 창고', qty: 120, owner: '이자재', memo: '발주 입고 mock', lastDate: todayText, status: '완료' },
  { no: 'ST-260531-002', type: '출고', item: '모터 브라켓', warehouse: '가공품 창고', qty: 60, owner: '박생산', memo: '생산 투입 mock', lastDate: todayText, status: '완료' }
]

export function useMockErpStore() {
  const datasets = useState<Record<string, ErpRow[]>>('mock-erp-datasets', () => normalizeDatasets(cloneDatasets()))
  const stockTransactions = useState<ErpRow[]>('mock-stock-transactions', () => initialStockTransactions.map((row) => ({ ...row })))
  const hydrated = useState('mock-erp-store-hydrated', () => false)

  if (import.meta.client && !hydrated.value) {
    onMounted(() => {
      const savedDatasets = readStored<Record<string, ErpRow[]>>(datasetStorageKey)
      const savedTransactions = readStored<ErpRow[]>(stockStorageKey)

      if (savedDatasets) {
        datasets.value = normalizeDatasets(savedDatasets)
      }

      if (savedTransactions) {
        stockTransactions.value = savedTransactions
      }

      hydrated.value = true
    })
  }

  const purchaseCandidates = computed(() => (datasets.value.inventory || []).filter((row) => {
    const available = Number(row.available || 0)
    const safety = Number(row.safety || 0)
    return row.status === '부족' || available <= safety
  }))

  function list(dataset: string, params: ListParams = {}) {
    return filterMockList(datasets.value[dataset] || [], params)
  }

  function statusOptions(dataset: string) {
    const dynamic = datasets.value[dataset] || []
    if (dynamic.length) {
      return [...new Set(dynamic.map((row) => row.status))]
    }
    return getStaticStatusOptions(dataset)
  }

  function findByField(dataset: string, field: string, value: string) {
    return (datasets.value[dataset] || []).find((row) => String(row[field]) === value)
  }

  function upsertRow(dataset: string, keyField: string, row: ErpRow) {
    const rows = datasets.value[dataset] || []
    const index = rows.findIndex((item) => String(item[keyField]) === String(row[keyField]))
    const nextRows = [...rows]

    if (index >= 0) {
      nextRows[index] = { ...nextRows[index], ...row }
    } else {
      nextRows.unshift(row)
    }

    datasets.value = {
      ...datasets.value,
      [dataset]: nextRows
    }
    persistDatasets()
  }

  function createCustomer(row: Omit<ErpRow, 'code' | 'lastDate' | 'amount'> & { amount?: number }) {
    const code = nextCustomerCode()
    const customer: ErpRow = {
      ...row,
      code,
      lastDate: todayText,
      amount: Number(row.amount || 0),
      status: row.status || '대기'
    }
    upsertRow('customers', 'code', customer)
    return customer
  }

  function updateCustomer(code: string, row: ErpRow) {
    const current = findByField('customers', 'code', code)
    if (!current) {
      return undefined
    }

    const updated = {
      ...current,
      ...row,
      code,
      lastDate: todayText,
      amount: Number(row.amount || current.amount || 0)
    }
    upsertRow('customers', 'code', updated)
    return updated
  }

  function createItem(row: Omit<ErpRow, 'code' | 'lastDate'>) {
    const code = nextItemCode()
    const item: ErpRow = {
      ...row,
      code,
      purchase: Number(row.purchase || 0),
      sales: Number(row.sales || 0),
      owner: row.owner || '이자재',
      status: row.status || '대기',
      lastDate: todayText
    }
    upsertRow('items', 'code', item)
    return item
  }

  function updateItem(code: string, row: ErpRow) {
    const current = findByField('items', 'code', code)
    if (!current) {
      return undefined
    }

    const updated = {
      ...current,
      ...row,
      code,
      purchase: Number(row.purchase || current.purchase || 0),
      sales: Number(row.sales || current.sales || 0),
      lastDate: todayText
    }
    upsertRow('items', 'code', updated)
    return updated
  }

  function createOrder(row: ErpRow) {
    assertWorkflowStatusTransition('orders', undefined, String(row.status || '대기'), 'create')

    const order = normalizeOrder({
      ...row,
      no: nextNo('orders', 'SO'),
      owner: row.owner || '최영업',
      status: row.status || '대기'
    })

    upsertRow('orders', 'no', order)
    if (order.reservedQty) {
      adjustInventoryReservation(String(order.item || ''), Number(order.reservedQty || 0))
    }
    return order
  }

  function updateOrder(no: string, row: ErpRow) {
    const current = findByField('orders', 'no', no)
    if (!current) {
      return undefined
    }

    assertWorkflowStatusTransition('orders', String(current.status), String(row.status || current.status))

    if (current.item && current.reservedQty) {
      adjustInventoryReservation(String(current.item), -Number(current.reservedQty || 0))
    }

    let updated = normalizeOrder({
      ...current,
      ...row,
      no
    })

    if (updated.status === '완료' && !current.shipped) {
      updated = completeOrderShipment(updated)
    }

    upsertRow('orders', 'no', updated)

    if (updated.reservedQty) {
      adjustInventoryReservation(String(updated.item || ''), Number(updated.reservedQty || 0))
    }

    return updated
  }

  function createPurchase(row: ErpRow) {
    assertWorkflowStatusTransition('purchase', undefined, String(row.status || '대기'), 'create')

    const purchase: ErpRow = {
      ...row,
      no: nextNo('purchase', 'PO'),
      amount: Number(row.amount || 0),
      qty: Number(row.qty || 0),
      owner: row.owner || '박구매',
      status: row.status || '대기'
    }
    const saved = completePurchaseIfNeeded(purchase)
    upsertRow('purchase', 'no', saved)
    return saved
  }

  function updatePurchase(no: string, row: ErpRow) {
    const current = findByField('purchase', 'no', no)
    if (!current) {
      return undefined
    }

    assertWorkflowStatusTransition('purchase', String(current.status), String(row.status || current.status))

    const updated = completePurchaseIfNeeded({
      ...current,
      ...row,
      no,
      amount: Number(row.amount || current.amount || 0),
      qty: Number(row.qty || current.qty || 0)
    })
    upsertRow('purchase', 'no', updated)
    return updated
  }

  function createProduction(row: ErpRow) {
    assertWorkflowStatusTransition('production', undefined, String(row.status || '대기'), 'create')

    const production = completeProductionFlowIfNeeded({
      ...row,
      no: nextProductionNo(),
      qty: Number(row.qty || 0),
      progress: Number(row.progress || 0),
      status: row.status || '대기'
    })
    upsertRow('production', 'no', production)
    return production
  }

  function createProductionFromOrder(orderNo: string) {
    const order = findByField('orders', 'no', orderNo)
    if (!order) {
      return undefined
    }

    return createProduction({
      item: String(order.item || ''),
      line: '가공 1라인',
      start: todayText,
      end: String(order.dueDate || todayText),
      qty: Number(order.qty || 0),
      progress: 0,
      status: '대기',
      sourceOrder: order.no
    })
  }

  function updateProduction(no: string, row: ErpRow) {
    const current = findByField('production', 'no', no)
    if (!current) {
      return undefined
    }

    assertWorkflowStatusTransition('production', String(current.status), String(row.status || current.status))

    const updated = completeProductionFlowIfNeeded({
      ...current,
      ...row,
      no,
      qty: Number(row.qty || current.qty || 0),
      progress: Number(row.progress || current.progress || 0)
    })
    upsertRow('production', 'no', updated)
    return updated
  }

  function addStockTransaction(input: ErpRow) {
    const transaction: ErpRow = {
      no: nextStockNo(),
      type: input.type || '입고',
      item: input.item,
      warehouse: input.warehouse,
      qty: Number(input.qty || 0),
      owner: input.owner || '김관리',
      memo: input.memo || '',
      lastDate: todayText,
      status: '완료'
    }

    stockTransactions.value = [transaction, ...stockTransactions.value]
    applyStockTransaction(transaction)
    persistStockTransactions()
    return transaction
  }

  function normalizeOrder(row: ErpRow) {
    const qty = Number(row.qty || 0)
    const shouldReserve = Boolean(row.item) && !['완료', '취소'].includes(String(row.status || ''))

    return {
      ...row,
      amount: Number(row.amount || 0),
      qty,
      reservedQty: shouldReserve ? qty : 0
    } as ErpRow
  }

  function completeOrderShipment(row: ErpRow) {
    const itemName = String(row.item || '')
    const warehouse = getWarehouseForItem(itemName)

    if (itemName && warehouse && Number(row.qty || 0) > 0) {
      addStockTransaction({
        type: '출고',
        item: itemName,
        warehouse,
        qty: Number(row.qty || 0),
        owner: row.owner || '최영업',
        memo: `${row.no} 수주 완료 출고`
      })
    }

    return {
      ...row,
      reservedQty: 0,
      shipped: true,
      shippedDate: todayText
    }
  }

  function completePurchaseIfNeeded(row: ErpRow) {
    if (row.status !== '완료' || row.received) {
      return row
    }

    const warehouse = getWarehouseForItem(String(row.item || ''))
    if (row.item && warehouse) {
      addStockTransaction({
        type: '입고',
        item: row.item,
        warehouse,
        qty: Number(row.qty || 0),
        owner: row.owner || '박구매',
        memo: `${row.no || '신규 발주'} 완료 입고`
      })
    }

    return {
      ...row,
      received: true,
      receivedDate: todayText
    }
  }

  function completeProductionFlowIfNeeded(row: ErpRow) {
    let next = completeProductionIssueIfNeeded(row)
    next = completeProductionReceiptIfNeeded(next)
    return next
  }

  function completeProductionIssueIfNeeded(row: ErpRow) {
    if (row.status !== '진행' || row.issued) {
      return row
    }

    const itemName = String(row.item || '')
    const warehouse = getWarehouseForItem(itemName)
    if (itemName && warehouse) {
      addStockTransaction({
        type: '출고',
        item: itemName,
        warehouse,
        qty: Number(row.qty || 0),
        owner: '박생산',
        memo: `${row.no || '신규 생산'} 생산 투입 출고`
      })
    }

    return {
      ...row,
      issued: true,
      issueDate: todayText
    }
  }

  function completeProductionReceiptIfNeeded(row: ErpRow) {
    if (row.status !== '완료' || row.productionReceived) {
      return row
    }

    const itemName = String(row.item || '')
    const warehouse = getWarehouseForItem(itemName)
    if (itemName && warehouse) {
      addStockTransaction({
        type: '입고',
        item: itemName,
        warehouse,
        qty: Number(row.qty || 0),
        owner: '박생산',
        memo: `${row.no || '신규 생산'} 생산 완료 입고`
      })
    }

    return {
      ...row,
      progress: 100,
      productionReceived: true,
      productionReceivedDate: todayText
    }
  }

  function nextCustomerCode() {
    const numbers = (datasets.value.customers || [])
      .map((row) => Number(String(row.code).replace(/\D/g, '')))
      .filter((value) => Number.isFinite(value))
    return `C-${Math.max(1000, ...numbers) + 1}`
  }

  function nextItemCode() {
    const numbers = (datasets.value.items || [])
      .map((row) => Number(String(row.code).replace(/\D/g, '')))
      .filter((value) => Number.isFinite(value))
    return `P-${Math.max(2000, ...numbers) + 1}`
  }

  function nextNo(dataset: 'orders' | 'purchase', prefix: 'SO' | 'PO') {
    const numbers = (datasets.value[dataset] || [])
      .map((row) => Number(String(row.no).split('-').at(-1)))
      .filter((value) => Number.isFinite(value))
    return `${prefix}-260531-${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`
  }

  function nextProductionNo() {
    const numbers = (datasets.value.production || [])
      .map((row) => Number(String(row.no).split('-').at(-1)))
      .filter((value) => Number.isFinite(value))
    return `PL-260531-${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`
  }

  function nextStockNo() {
    return `ST-260531-${String(stockTransactions.value.length + 1).padStart(3, '0')}`
  }

  function adjustInventoryReservation(itemName: string, qtyDelta: number) {
    if (!itemName || !qtyDelta) {
      return
    }

    const rows = datasets.value.inventory || []
    const index = rows.findIndex((row) => row.item === itemName)
    if (index < 0) {
      return
    }

    const nextRows = [...rows]
    const current = Number(nextRows[index].current || 0)
    const reserved = Math.max(0, Number(nextRows[index].reserved || 0) + qtyDelta)
    const available = Math.max(0, current - reserved)

    nextRows[index] = normalizeInventoryRow({
      ...nextRows[index],
      reserved,
      available,
      lastDate: todayText
    })

    datasets.value = {
      ...datasets.value,
      inventory: nextRows
    }
    persistDatasets()
  }

  function getWarehouseForItem(itemName: string) {
    return String((datasets.value.inventory || []).find((row) => row.item === itemName)?.warehouse || '원자재 창고')
  }

  function applyStockTransaction(transaction: ErpRow) {
    const rows = datasets.value.inventory || []
    const index = rows.findIndex((row) => row.item === transaction.item && row.warehouse === transaction.warehouse)
    if (index < 0) {
      return
    }

    const multiplier = transaction.type === '출고' ? -1 : transaction.type === '조정' ? 0 : 1
    const qty = Number(transaction.qty || 0)
    const current = Number(rows[index].current || 0)
    const nextCurrent = transaction.type === '조정' ? qty : Math.max(0, current + qty * multiplier)
    const nextRows = [...rows]

    nextRows[index] = normalizeInventoryRow({
      ...nextRows[index],
      current: nextCurrent,
      lastDate: todayText
    })

    datasets.value = {
      ...datasets.value,
      inventory: nextRows
    }
    persistDatasets()
  }

  function persistDatasets() {
    writeStored(datasetStorageKey, datasets.value)
  }

  function persistStockTransactions() {
    writeStored(stockStorageKey, stockTransactions.value)
  }

  return {
    datasets,
    stockTransactions,
    purchaseCandidates,
    list,
    statusOptions,
    findByField,
    upsertRow,
    createCustomer,
    updateCustomer,
    createItem,
    updateItem,
    createOrder,
    updateOrder,
    createPurchase,
    updatePurchase,
    createProduction,
    createProductionFromOrder,
    updateProduction,
    addStockTransaction
  }
}

function cloneDatasets() {
  return Object.fromEntries(
    Object.entries(mockDatasets).map(([key, rows]) => [key, rows.map((row) => ({ ...row }))])
  )
}

function normalizeDatasets(input: Record<string, ErpRow[]>) {
  return {
    ...input,
    inventory: (input.inventory || []).map(normalizeInventoryRow)
  }
}

function normalizeInventoryRow(row: ErpRow) {
  const current = Number(row.current || 0)
  const reserved = Number(row.reserved || 0)
  const available = Math.max(0, current - reserved)

  return {
    ...row,
    reserved,
    available,
    status: available <= Number(row.safety || 0) ? '부족' : '정상'
  } as ErpRow
}

function readStored<T>(key: string) {
  if (!import.meta.client) {
    return undefined
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : undefined
  } catch {
    return undefined
  }
}

function writeStored(key: string, value: unknown) {
  if (!import.meta.client) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}
