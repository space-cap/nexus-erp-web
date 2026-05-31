import type { ErpRow, SalesPoint } from '~/types/erp'

export const mockSales: SalesPoint[] = [
  { month: '1월', amount: 132000000 },
  { month: '2월', amount: 148000000 },
  { month: '3월', amount: 141000000 },
  { month: '4월', amount: 176000000 },
  { month: '5월', amount: 193000000 },
  { month: '6월', amount: 214000000 }
]

export const mockCustomers: ErpRow[] = [
  { code: 'C-1001', name: '한빛정밀', ceo: '박상훈', bizNo: '123-81-45670', manager: '최영업', phone: '02-553-1101', status: '정상', lastDate: '2026-05-28', amount: 78200000 },
  { code: 'C-1002', name: '세림전자', ceo: '오민지', bizNo: '215-87-90321', manager: '김관리', phone: '031-441-7781', status: '진행', lastDate: '2026-05-24', amount: 43600000 },
  { code: 'C-1003', name: '다온테크', ceo: '이준호', bizNo: '602-85-11902', manager: '최영업', phone: '032-771-3350', status: '대기', lastDate: '2026-05-18', amount: 16500000 },
  { code: 'C-1004', name: '우진산업', ceo: '장현우', bizNo: '410-88-61290', manager: '박구매', phone: '051-337-9900', status: '정상', lastDate: '2026-05-29', amount: 103200000 },
  { code: 'C-1005', name: '에이원모듈', ceo: '강서연', bizNo: '134-86-55820', manager: '김관리', phone: '041-552-2109', status: '중지', lastDate: '2026-04-30', amount: 8400000 }
]

export const mockItems: ErpRow[] = [
  { code: 'P-2001', name: '알루미늄 하우징 A형', spec: '120x80x35', unit: 'EA', purchase: 18400, sales: 28600, status: '정상', owner: '이자재', lastDate: '2026-05-22' },
  { code: 'P-2002', name: '컨트롤 PCB V2', spec: '4Layer', unit: 'EA', purchase: 51200, sales: 79400, status: '정상', owner: '이자재', lastDate: '2026-05-25' },
  { code: 'P-2003', name: '모터 브라켓', spec: 'M8 대응', unit: 'EA', purchase: 8600, sales: 14200, status: '진행', owner: '박생산', lastDate: '2026-05-26' },
  { code: 'P-2004', name: '센서 케이블 1.5M', spec: 'M12 4Pin', unit: 'EA', purchase: 3900, sales: 7100, status: '대기', owner: '이자재', lastDate: '2026-05-12' },
  { code: 'P-2005', name: '패킹 고무', spec: 'NBR 65', unit: 'M', purchase: 1300, sales: 2300, status: '중지', owner: '박생산', lastDate: '2026-04-16' }
]

export const mockInventory: ErpRow[] = [
  { item: '알루미늄 하우징 A형', warehouse: '원자재 창고', current: 1840, reserved: 120, safety: 900, available: 1720, status: '정상', lastDate: '2026-05-29' },
  { item: '컨트롤 PCB V2', warehouse: '전자부품 창고', current: 312, reserved: 24, safety: 450, available: 288, status: '부족', lastDate: '2026-05-30' },
  { item: '모터 브라켓', warehouse: '가공품 창고', current: 760, reserved: 70, safety: 500, available: 690, status: '정상', lastDate: '2026-05-28' },
  { item: '센서 케이블 1.5M', warehouse: '전자부품 창고', current: 128, reserved: 8, safety: 300, available: 120, status: '부족', lastDate: '2026-05-27' },
  { item: '패킹 고무', warehouse: '원자재 창고', current: 2200, reserved: 60, safety: 1000, available: 2140, status: '정상', lastDate: '2026-05-21' }
]

export const mockOrders: ErpRow[] = [
  { no: 'SO-260529-001', customer: '한빛정밀', item: '알루미늄 하우징 A형', qty: 1000, reservedQty: 1000, orderDate: '2026-05-29', dueDate: '2026-06-07', owner: '최영업', amount: 28600000, status: '진행' },
  { no: 'SO-260528-004', customer: '우진산업', item: '컨트롤 PCB V2', qty: 690, reservedQty: 690, orderDate: '2026-05-28', dueDate: '2026-06-04', owner: '김관리', amount: 54800000, status: '대기' },
  { no: 'SO-260524-002', customer: '세림전자', item: '모터 브라켓', qty: 1366, reservedQty: 1366, orderDate: '2026-05-24', dueDate: '2026-05-31', owner: '최영업', amount: 19400000, status: '지연' },
  { no: 'SO-260520-003', customer: '다온테크', item: '센서 케이블 1.5M', qty: 2324, reservedQty: 0, orderDate: '2026-05-20', dueDate: '2026-06-12', owner: '김관리', amount: 16500000, status: '완료' },
  { no: 'SO-260518-007', customer: '한빛정밀', item: '패킹 고무', qty: 13130, reservedQty: 13130, orderDate: '2026-05-18', dueDate: '2026-06-01', owner: '최영업', amount: 30200000, status: '진행' }
]

export const mockPurchase: ErpRow[] = [
  { no: 'PO-260530-002', vendor: '동양소재', item: '알루미늄 하우징 A형', qty: 770, orderDate: '2026-05-30', dueDate: '2026-06-03', owner: '박구매', amount: 14200000, status: '대기' },
  { no: 'PO-260529-001', vendor: '제이피전자', item: '컨트롤 PCB V2', qty: 760, orderDate: '2026-05-29', dueDate: '2026-06-05', owner: '박구매', amount: 38900000, status: '진행' },
  { no: 'PO-260526-005', vendor: '삼우케이블', item: '센서 케이블 1.5M', qty: 2000, orderDate: '2026-05-26', dueDate: '2026-05-30', owner: '이자재', amount: 7800000, status: '지연' },
  { no: 'PO-260522-003', vendor: '우진고무', item: '패킹 고무', qty: 3230, orderDate: '2026-05-22', dueDate: '2026-06-02', owner: '이자재', amount: 4200000, status: '완료', received: true, receivedDate: '2026-05-31' },
  { no: 'PO-260520-008', vendor: '한성가공', item: '모터 브라켓', qty: 1372, orderDate: '2026-05-20', dueDate: '2026-06-10', owner: '박구매', amount: 11800000, status: '진행' }
]

export const mockProduction: ErpRow[] = [
  { no: 'PL-260530-A1', item: '컨트롤 PCB V2', line: '전자조립 1라인', start: '2026-05-30', end: '2026-06-02', qty: 600, progress: 38, status: '진행' },
  { no: 'PL-260529-B2', item: '알루미늄 하우징 A형', line: '가공 2라인', start: '2026-05-29', end: '2026-06-04', qty: 1200, progress: 54, status: '진행' },
  { no: 'PL-260528-C1', item: '모터 브라켓', line: '가공 1라인', start: '2026-05-28', end: '2026-05-31', qty: 900, progress: 82, status: '지연' },
  { no: 'PL-260524-A3', item: '센서 케이블 1.5M', line: '조립 3라인', start: '2026-05-24', end: '2026-05-29', qty: 1500, progress: 100, status: '완료' },
  { no: 'PL-260522-P1', item: '패킹 고무', line: '포장 1라인', start: '2026-05-22', end: '2026-06-05', qty: 3000, progress: 24, status: '대기' }
]

export const mockUsers: ErpRow[] = [
  { id: 'u001', name: '김관리', dept: '경영지원', role: 'ERP 관리자', auth: '전체 권한', status: '정상', lastDate: '2026-05-30' },
  { id: 'u002', name: '최영업', dept: '영업팀', role: '영업 담당', auth: '영업/거래처', status: '정상', lastDate: '2026-05-29' },
  { id: 'u003', name: '박구매', dept: '구매팀', role: '구매 담당', auth: '구매/발주', status: '정상', lastDate: '2026-05-28' },
  { id: 'u004', name: '이자재', dept: '자재팀', role: '재고 담당', auth: '품목/재고', status: '대기', lastDate: '2026-05-21' },
  { id: 'u005', name: '박생산', dept: '생산팀', role: '생산 담당', auth: '생산/실적', status: '중지', lastDate: '2026-04-30' }
]

export const mockDatasets: Record<string, ErpRow[]> = {
  customers: mockCustomers,
  items: mockItems,
  inventory: mockInventory,
  orders: mockOrders,
  purchase: mockPurchase,
  production: mockProduction,
  users: mockUsers
}
