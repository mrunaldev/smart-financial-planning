const DEFAULT_TABS = [
    { id: "monthlyBudget", label: "Monthly Budget", color: "#dfeff7", text: "#218250" },
    { id: "financialGoal", label: "Financial Goal", color: "#ffc107", text: "#000" },
    { id: "monthlyFixedExpense", label: "Monthly Fixed Expense", color: "#e9162a", text: "#fff" },
    { id: "investments", label: "Investments", color: "#09a54b", text: "#fff" },
    { id: "insurances", label: "Insurances", color: "#6a329f", text: "#fff" },
    { id: "cards", label: "Cards", color: "#073371", text: "#fff" },
    { id: "netWorth", label: "Net Worth", color: "#8a6800", text: "#fff" },
    { id: "taxPlan", label: "Tax Plan", color: "#f92a9e", text: "#fff" },
    { id: "gifts", label: "Gifts", color: "#8a6800", text: "#fff" },
    { id: "misc", label: "Misc", color: "#3a3a3a", text: "#fff" },
    { id: "oneTimeBudget", label: "One Time Budget", color: "#104c4b", text: "#fff" }
];

const STORAGE_KEY = "smartFinancialPlanningData";
const CUSTOM_TABS_KEY = "smartFinancialPlanningCustomTabs";

let activeTabId = DEFAULT_TABS[0].id;

const tabBar = document.getElementById("tabBar");
const activeSubtitle = document.getElementById("activeSubtitle");
const entryForm = document.getElementById("entryForm");
const entryRows = document.getElementById("entryRows");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const clearTabButton = document.getElementById("clearTab");

const fields = {
    name: document.getElementById("entryName"),
    planned: document.getElementById("entryPlanned"),
    actual: document.getElementById("entryActual"),
    date: document.getElementById("entryDate"),
    note: document.getElementById("entryNote")
};

const totals = {
    planned: document.getElementById("plannedTotal"),
    actual: document.getElementById("actualTotal"),
    balance: document.getElementById("balanceTotal"),
    count: document.getElementById("itemCount")
};

function loadJson(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

function getTabs() {
    return DEFAULT_TABS.concat(loadJson(CUSTOM_TABS_KEY, []));
}

function loadData() {
    return loadJson(STORAGE_KEY, {});
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatMoney(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value || 0);
}

function renderTabs() {
    tabBar.innerHTML = "";

    getTabs().forEach(tab => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tab" + (tab.id === activeTabId ? " active" : "");
        button.textContent = tab.label;
        button.style.background = tab.color;
        button.style.color = tab.text;
        button.addEventListener("click", () => {
            activeTabId = tab.id;
            searchInput.value = "";
            render();
        });
        tabBar.appendChild(button);
    });

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "tab add-tab";
    addButton.textContent = "+";
    addButton.setAttribute("aria-label", "Add tab");
    addButton.addEventListener("click", addCustomTab);
    tabBar.appendChild(addButton);
}

function activeEntries() {
    const data = loadData();
    return data[activeTabId] || [];
}

function setActiveEntries(entries) {
    const data = loadData();
    data[activeTabId] = entries;
    saveData(data);
}

function renderSummary(entries) {
    const planned = entries.reduce((sum, item) => sum + Number(item.planned || 0), 0);
    const actual = entries.reduce((sum, item) => sum + Number(item.actual || 0), 0);

    totals.planned.textContent = formatMoney(planned);
    totals.actual.textContent = formatMoney(actual);
    totals.balance.textContent = formatMoney(planned - actual);
    totals.count.textContent = String(entries.length);
}

function renderRows(entries) {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = entries.filter(item => {
        const text = [item.name, item.date, item.note].join(" ").toLowerCase();
        return text.includes(query);
    });

    entryRows.innerHTML = "";
    emptyState.classList.toggle("visible", filtered.length === 0);

    filtered.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${escapeHtml(item.name)}</td>
            <td class="amount">${formatMoney(Number(item.planned))}</td>
            <td class="amount">${formatMoney(Number(item.actual || 0))}</td>
            <td>${escapeHtml(item.date || "-")}</td>
            <td>${escapeHtml(item.note || "-")}</td>
            <td><button class="delete-row" type="button" data-id="${item.id}">Delete</button></td>
        `;
        entryRows.appendChild(row);
    });
}

function render() {
    const tab = getTabs().find(item => item.id === activeTabId) || DEFAULT_TABS[0];
    activeSubtitle.textContent = tab.label;
    renderTabs();

    const entries = activeEntries();
    renderSummary(entries);
    renderRows(entries);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function addEntry(event) {
    event.preventDefault();

    const entry = {
        id: String(Date.now()),
        name: fields.name.value.trim(),
        planned: Number(fields.planned.value || 0),
        actual: Number(fields.actual.value || 0),
        date: fields.date.value,
        note: fields.note.value.trim()
    };

    if (!entry.name || entry.planned < 0 || entry.actual < 0) {
        return;
    }

    const entries = activeEntries();
    entries.unshift(entry);
    setActiveEntries(entries);
    entryForm.reset();
    render();
}

function deleteEntry(id) {
    setActiveEntries(activeEntries().filter(item => item.id !== id));
    render();
}

function clearActiveTab() {
    if (!activeEntries().length) {
        return;
    }

    if (confirm("Clear all items in this tab?")) {
        setActiveEntries([]);
        render();
    }
}

function addCustomTab() {
    const label = prompt("New tab name");
    if (!label || !label.trim()) {
        return;
    }

    const customTabs = loadJson(CUSTOM_TABS_KEY, []);
    const id = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

    customTabs.push({
        id,
        label: label.trim(),
        color: "#222",
        text: "#fff"
    });

    localStorage.setItem(CUSTOM_TABS_KEY, JSON.stringify(customTabs));
    activeTabId = id;
    render();
}

entryForm.addEventListener("submit", addEntry);
searchInput.addEventListener("input", render);
clearTabButton.addEventListener("click", clearActiveTab);

entryRows.addEventListener("click", event => {
    const button = event.target.closest(".delete-row");
    if (button) {
        deleteEntry(button.dataset.id);
    }
});

render();
