const sectionConfig = {
  dashboard: {
    title: "대시보드",
    eyebrow: "ERP 통합 현황",
    dataset: null
  },
  customers: {
    title: "거래처 관리",
    eyebrow: "영업 관리",
    dataset: "customers",
    columns: [
      ["code", "거래처 코드"],
      ["name", "거래처명"],
      ["manager", "담당자"],
      ["phone", "연락처"],
      ["lastDate", "최근 거래일"],
      ["amount", "누적 금액", "numeric"],
      ["status", "상태", "status"]
    ],
    detailTitle: "name"
  },
  items: {
    title: "품목 관리",
    eyebrow: "재고 관리",
    dataset: "items",
    columns: [
      ["code", "품목 코드"],
      ["name", "품목명"],
      ["spec", "규격"],
      ["unit", "단위"],
      ["purchase", "매입 단가", "numeric"],
      ["sales", "판매 단가", "numeric"],
      ["status", "상태", "status"]
    ],
    detailTitle: "name"
  },
  inventory: {
    title: "재고 현황",
    eyebrow: "창고별 수량",
    dataset: "inventory",
    columns: [
      ["item", "품목"],
      ["warehouse", "창고"],
      ["current", "현재고", "numeric"],
      ["safety", "안전재고", "numeric"],
      ["available", "가용재고", "numeric"],
      ["lastDate", "처리일"],
      ["status", "상태", "status"]
    ],
    detailTitle: "item"
  },
  orders: {
    title: "수주 관리",
    eyebrow: "영업 주문",
    dataset: "orders",
    columns: [
      ["no", "수주 번호"],
      ["customer", "거래처"],
      ["orderDate", "수주일"],
      ["dueDate", "납기일"],
      ["owner", "담당자"],
      ["amount", "수주 금액", "numeric"],
      ["status", "상태", "status"]
    ],
    detailTitle: "no"
  },
  purchase: {
    title: "발주 관리",
    eyebrow: "구매 관리",
    dataset: "purchase",
    columns: [
      ["no", "발주 번호"],
      ["vendor", "매입처"],
      ["orderDate", "발주일"],
      ["dueDate", "납기일"],
      ["owner", "담당자"],
      ["amount", "발주 금액", "numeric"],
      ["status", "상태", "status"]
    ],
    detailTitle: "no"
  },
  production: {
    title: "생산 계획",
    eyebrow: "생산 관리",
    dataset: "production",
    columns: [
      ["no", "계획 번호"],
      ["item", "품목"],
      ["line", "라인"],
      ["start", "시작일"],
      ["end", "종료일"],
      ["progress", "진행률", "progress"],
      ["status", "상태", "status"]
    ],
    detailTitle: "no"
  },
  users: {
    title: "사용자 관리",
    eyebrow: "시스템 관리",
    dataset: "users",
    columns: [
      ["id", "사용자 ID"],
      ["name", "이름"],
      ["dept", "부서"],
      ["role", "역할"],
      ["auth", "권한"],
      ["lastDate", "최근 접속"],
      ["status", "상태", "status"]
    ],
    detailTitle: "name"
  }
};

const state = {
  section: "dashboard",
  selectedIndex: null
};

const statusClassMap = {
  정상: "status-normal",
  완료: "status-complete",
  진행: "status-progress",
  대기: "status-wait",
  지연: "status-delay",
  부족: "status-low",
  중지: "status-inactive",
  취소: "status-cancel"
};

const dom = {
  navList: document.querySelector("#navList"),
  dashboardView: document.querySelector("#dashboardView"),
  moduleView: document.querySelector("#moduleView"),
  sectionTitle: document.querySelector("#sectionTitle"),
  sectionEyebrow: document.querySelector("#sectionEyebrow"),
  kpiGrid: document.querySelector("#kpiGrid"),
  salesChart: document.querySelector("#salesChart"),
  taskList: document.querySelector("#taskList"),
  stockAlerts: document.querySelector("#stockAlerts"),
  productionTimeline: document.querySelector("#productionTimeline"),
  summaryStrip: document.querySelector("#summaryStrip"),
  tableHead: document.querySelector("#tableHead"),
  tableBody: document.querySelector("#tableBody"),
  detailPanel: document.querySelector("#detailPanel"),
  statusFilter: document.querySelector("#statusFilter"),
  periodFilter: document.querySelector("#periodFilter"),
  moduleSearch: document.querySelector("#moduleSearch"),
  globalSearch: document.querySelector("#globalSearch"),
  exportButton: document.querySelector("#exportButton"),
  newRecordButton: document.querySelector("#newRecordButton"),
  recordModal: document.querySelector("#recordModal"),
  recordForm: document.querySelector("#recordForm"),
  closeModalButton: document.querySelector("#closeModalButton"),
  cancelModalButton: document.querySelector("#cancelModalButton"),
  modalTitle: document.querySelector("#modalTitle"),
  toast: document.querySelector("#toast"),
  menuToggle: document.querySelector("#menuToggle"),
  sidebar: document.querySelector(".sidebar")
};

function formatCurrency(value) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function statusBadge(status) {
  const className = statusClassMap[status] || "status-ready";
  return `<span class="status ${className}">${status}</span>`;
}

function getCurrentConfig() {
  return sectionConfig[state.section];
}

function getCurrentRows() {
  const config = getCurrentConfig();
  if (!config.dataset) {
    return [];
  }

  const search = dom.moduleSearch.value.trim().toLowerCase();
  const globalSearch = dom.globalSearch.value.trim().toLowerCase();
  const status = dom.statusFilter.value;
  const period = dom.periodFilter.value;
  const keyword = [search, globalSearch].filter(Boolean).join(" ");
  const rows = window.erpMock[config.dataset] || [];

  return rows.filter((row) => {
    const rowText = Object.values(row).join(" ").toLowerCase();
    const statusMatch = status === "all" || row.status === status;
    const keywordMatch = !keyword || keyword.split(" ").every((word) => rowText.includes(word));
    const periodMatch = period === "all" || isInPeriod(row, period);
    return statusMatch && keywordMatch && periodMatch;
  });
}

function isInPeriod(row, period) {
  const dateValue = row.lastDate || row.orderDate || row.start;
  if (!dateValue) {
    return true;
  }

  const today = new Date("2026-05-30T00:00:00");
  const date = new Date(`${dateValue}T00:00:00`);
  const diffDays = Math.floor((today - date) / 86400000);
  if (period === "week") {
    return diffDays >= 0 && diffDays <= 7;
  }
  if (period === "month") {
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  }
  return true;
}

function renderDashboard() {
  const orderTotal = window.erpMock.orders.reduce((sum, row) => sum + row.amount, 0);
  const purchaseTotal = window.erpMock.purchase.reduce((sum, row) => sum + row.amount, 0);
  const lowStock = window.erpMock.inventory.filter((row) => row.status === "부족").length;
  const activeProduction = window.erpMock.production.filter((row) => row.status === "진행").length;
  const pendingApproval = window.erpMock.purchase.filter((row) => row.status === "대기" || row.status === "지연").length;

  const cards = [
    ["sales", "수주 금액", formatCurrency(orderTotal), "이번 달 mock 수주 합계", "trending-up"],
    ["inventory", "재고 경고", `${lowStock}건`, "안전재고 이하 품목", "triangle-alert"],
    ["production", "생산 진행", `${activeProduction}라인`, "현재 진행 중인 생산 계획", "factory"],
    ["approval", "승인 대기", `${pendingApproval}건`, "발주 및 예외 처리", "clipboard-check"]
  ];

  dom.kpiGrid.innerHTML = cards
    .map(([type, label, value, note, icon]) => `
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">${label}</span>
          <span class="kpi-icon ${type}"><i data-lucide="${icon}"></i></span>
        </div>
        <strong class="kpi-value">${value}</strong>
        <span class="kpi-note">${note}</span>
      </article>
    `)
    .join("");

  const maxSales = Math.max(...window.erpMock.sales.map((row) => row.amount));
  dom.salesChart.innerHTML = window.erpMock.sales
    .map((row) => `
      <div class="bar-item">
        <div class="bar" style="height: ${Math.max(28, (row.amount / maxSales) * 100)}%">
          ${Math.round(row.amount / 1000000)}M
        </div>
        <span class="bar-label">${row.month}</span>
      </div>
    `)
    .join("");

  dom.taskList.innerHTML = [
    { title: "세림전자 수주 납기 확인", meta: "SO-260524-002", status: "지연" },
    { title: "동양소재 발주 승인", meta: "PO-260530-002", status: "대기" },
    { title: "센서 케이블 재고 보충", meta: "전자부품 창고", status: "부족" }
  ]
    .map((task) => `
      <div class="task-item">
        <strong>${task.title}</strong>
        <div class="task-meta">
          <span>${task.meta}</span>
          ${statusBadge(task.status)}
        </div>
      </div>
    `)
    .join("");

  dom.stockAlerts.innerHTML = window.erpMock.inventory
    .filter((row) => row.status === "부족")
    .map((row) => `
      <div class="compact-item">
        <strong>${row.item}</strong>
        <div class="compact-meta">
          <span>${row.warehouse}</span>
          <span>${formatNumber(row.current)} / ${formatNumber(row.safety)}</span>
        </div>
      </div>
    `)
    .join("");

  dom.productionTimeline.innerHTML = window.erpMock.production
    .slice(0, 4)
    .map((row) => `
      <div class="timeline-item">
        <div class="task-meta">
          <strong>${row.item}</strong>
          ${statusBadge(row.status)}
        </div>
        <div class="progress" aria-label="진행률 ${row.progress}%">
          <span style="width: ${row.progress}%"></span>
        </div>
        <div class="timeline-meta">
          <span>${row.line}</span>
          <span>${row.start} ~ ${row.end}</span>
        </div>
      </div>
    `)
    .join("");
}

function renderModule() {
  const config = getCurrentConfig();
  const sourceRows = window.erpMock[config.dataset] || [];
  populateStatusFilter(sourceRows);
  const rows = getCurrentRows();
  renderSummary(sourceRows, rows);
  renderTable(config, rows);
  renderDetail(config, rows[state.selectedIndex]);
}

function populateStatusFilter(rows) {
  const currentValue = dom.statusFilter.value || "all";
  const statuses = [...new Set(rows.map((row) => row.status))];
  dom.statusFilter.innerHTML = [
    `<option value="all">전체</option>`,
    ...statuses.map((status) => `<option value="${status}">${status}</option>`)
  ].join("");
  dom.statusFilter.value = statuses.includes(currentValue) ? currentValue : "all";
}

function renderSummary(sourceRows, rows) {
  const amountFields = ["amount", "sales", "current", "qty"];
  const amountField = amountFields.find((field) => sourceRows.some((row) => typeof row[field] === "number"));
  const total = amountField ? rows.reduce((sum, row) => sum + Number(row[amountField] || 0), 0) : rows.length;
  const delayed = rows.filter((row) => ["지연", "부족", "중지"].includes(row.status)).length;
  const active = rows.filter((row) => ["정상", "진행", "완료"].includes(row.status)).length;
  const owners = new Set(rows.map((row) => row.owner || row.manager || row.dept || row.warehouse).filter(Boolean)).size;

  const cards = [
    ["조회 건수", `${formatNumber(rows.length)}건`],
    ["주요 합계", amountField === "amount" || amountField === "sales" ? formatCurrency(total) : formatNumber(total)],
    ["정상/진행", `${formatNumber(active)}건`],
    ["주의 상태", `${formatNumber(delayed)}건`, owners ? `담당/구분 ${owners}개` : ""]
  ];

  dom.summaryStrip.innerHTML = cards
    .map(([label, value, note]) => `
      <div class="summary-card">
        <span>${label}</span>
        <strong>${value}</strong>
        ${note ? `<span>${note}</span>` : ""}
      </div>
    `)
    .join("");
}

function renderTable(config, rows) {
  dom.tableHead.innerHTML = `
    <tr>
      ${config.columns.map(([, label, type]) => `<th class="${type === "numeric" ? "numeric" : ""}">${label}</th>`).join("")}
    </tr>
  `;

  if (!rows.length) {
    dom.tableBody.innerHTML = `<tr><td colspan="${config.columns.length}">조건에 맞는 mock 데이터가 없습니다.</td></tr>`;
    state.selectedIndex = null;
    return;
  }

  if (state.selectedIndex === null || state.selectedIndex >= rows.length) {
    state.selectedIndex = 0;
  }

  dom.tableBody.innerHTML = rows
    .map((row, index) => `
      <tr class="${index === state.selectedIndex ? "selected" : ""}" data-index="${index}">
        ${config.columns.map(([key, , type]) => `<td class="${type === "numeric" ? "numeric" : ""}">${formatCell(row[key], type)}</td>`).join("")}
      </tr>
    `)
    .join("");
}

function formatCell(value, type) {
  if (type === "status") {
    return statusBadge(value);
  }
  if (type === "progress") {
    return `
      <div class="progress" aria-label="진행률 ${value}%">
        <span style="width: ${value}%"></span>
      </div>
    `;
  }
  if (type === "numeric" && typeof value === "number") {
    return value >= 100000 ? formatCurrency(value) : formatNumber(value);
  }
  return value ?? "";
}

function renderDetail(config, row) {
  if (!row) {
    dom.detailPanel.innerHTML = `
      <div class="empty-detail">
        <i data-lucide="search-x"></i>
        <strong>선택된 데이터가 없습니다</strong>
        <span>필터 조건을 바꾸면 상세 정보를 확인할 수 있습니다.</span>
      </div>
    `;
    refreshIcons();
    return;
  }

  const title = row[config.detailTitle] || row.name || row.no || row.code;
  const entries = Object.entries(row);
  dom.detailPanel.innerHTML = `
    <div class="detail-header">
      <div class="detail-title-row">
        <h2>${title}</h2>
        ${row.status ? statusBadge(row.status) : ""}
      </div>
      <span class="kpi-note">${config.eyebrow} 상세 mock 데이터</span>
    </div>
    <div class="detail-grid">
      ${entries.map(([key, value]) => `
        <div class="detail-row">
          <span class="detail-label">${fieldLabel(key)}</span>
          <span class="detail-value">${formatDetailValue(value, key)}</span>
        </div>
      `).join("")}
    </div>
    <div class="detail-actions">
      <button class="secondary-button" type="button" data-toast="수정 화면은 다음 단계에서 연결합니다.">
        <i data-lucide="pencil"></i>
        <span>수정</span>
      </button>
      <button class="primary-button" type="button" data-toast="승인/처리 mock 액션이 기록되었습니다.">
        <i data-lucide="check"></i>
        <span>처리</span>
      </button>
    </div>
  `;
  refreshIcons();
}

function formatDetailValue(value, key) {
  if (typeof value === "number") {
    return ["amount", "purchase", "sales"].includes(key) ? formatCurrency(value) : formatNumber(value);
  }
  return value;
}

function fieldLabel(key) {
  const labels = {
    code: "코드",
    name: "이름",
    ceo: "대표자",
    bizNo: "사업자번호",
    manager: "담당자",
    phone: "연락처",
    status: "상태",
    lastDate: "최근 처리일",
    amount: "금액",
    spec: "규격",
    unit: "단위",
    purchase: "매입 단가",
    sales: "판매 단가",
    owner: "담당자",
    item: "품목",
    warehouse: "창고",
    current: "현재고",
    safety: "안전재고",
    available: "가용재고",
    no: "문서 번호",
    customer: "거래처",
    vendor: "매입처",
    orderDate: "작성일",
    dueDate: "납기일",
    line: "라인",
    start: "시작일",
    end: "종료일",
    qty: "수량",
    progress: "진행률",
    id: "사용자 ID",
    dept: "부서",
    role: "역할",
    auth: "권한"
  };
  return labels[key] || key;
}

function setSection(section) {
  state.section = section;
  state.selectedIndex = null;
  const config = getCurrentConfig();
  dom.sectionTitle.textContent = config.title;
  dom.sectionEyebrow.textContent = config.eyebrow;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === section);
  });

  const isDashboard = section === "dashboard";
  dom.dashboardView.classList.toggle("hidden", !isDashboard);
  dom.moduleView.classList.toggle("hidden", isDashboard);
  dom.exportButton.disabled = isDashboard;
  dom.newRecordButton.disabled = false;
  dom.moduleSearch.value = "";
  dom.statusFilter.value = "all";
  dom.periodFilter.value = "all";

  if (isDashboard) {
    renderDashboard();
  } else {
    renderModule();
  }

  dom.sidebar.classList.remove("open");
  refreshIcons();
}

function exportCsv() {
  const config = getCurrentConfig();
  if (!config.dataset) {
    showToast("대시보드는 CSV 내보내기 대상이 아닙니다.");
    return;
  }

  const rows = getCurrentRows();
  const headers = config.columns.map(([, label]) => label);
  const body = rows.map((row) => config.columns.map(([key]) => escapeCsv(row[key])).join(","));
  const csv = [headers.join(","), ...body].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${config.title.replace(/\s+/g, "_")}_mock.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast(`${config.title} CSV 파일을 생성했습니다.`);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function openModal() {
  const config = getCurrentConfig();
  dom.modalTitle.textContent = `${config.title} 신규 데이터`;
  dom.recordForm.reset();
  dom.recordModal.classList.remove("hidden");
  dom.recordForm.elements.title.focus();
}

function closeModal() {
  dom.recordModal.classList.add("hidden");
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => dom.toast.classList.add("hidden"), 2200);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

dom.navList.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-item");
  if (button) {
    setSection(button.dataset.section);
  }
});

dom.tableBody.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (!row) {
    return;
  }
  state.selectedIndex = Number(row.dataset.index);
  renderModule();
});

[dom.moduleSearch, dom.statusFilter, dom.periodFilter, dom.globalSearch].forEach((element) => {
  const rerender = () => {
    state.selectedIndex = null;
    if (state.section === "dashboard") {
      renderDashboard();
    } else {
      renderModule();
    }
    refreshIcons();
  };
  element.addEventListener("input", rerender);
  element.addEventListener("change", rerender);
});

dom.exportButton.addEventListener("click", exportCsv);
dom.newRecordButton.addEventListener("click", openModal);
dom.closeModalButton.addEventListener("click", closeModal);
dom.cancelModalButton.addEventListener("click", closeModal);
dom.menuToggle.addEventListener("click", () => dom.sidebar.classList.toggle("open"));

dom.recordModal.addEventListener("click", (event) => {
  if (event.target === dom.recordModal) {
    closeModal();
  }
});

dom.recordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  closeModal();
  showToast("신규 mock 데이터가 저장된 것처럼 처리했습니다.");
});

document.body.addEventListener("click", (event) => {
  const action = event.target.closest("[data-toast]");
  if (action) {
    showToast(action.dataset.toast);
  }
});

renderDashboard();
refreshIcons();
