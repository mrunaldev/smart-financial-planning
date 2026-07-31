// ── SmartFin Dashboard Module ────────────────────────────────────────────────
// Full dashboard: budget status, net worth, goal progress, spending trends, reminders
import { COLOR_POSITIVE, COLOR_NEGATIVE, COLOR_WARNING } from './constants.js';

// Lazy-load Chart.js helper
let _chartJsLoaded = false;
async function ensureChart() {
    if (_chartJsLoaded || typeof Chart !== 'undefined') { _chartJsLoaded = true; return; }
    await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        s.onload = () => { _chartJsLoaded = true; resolve(); };
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

let _trendChart = null;

function fmtMoney(v) {
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0);
    } catch { return '₹0'; }
}

function getMonthKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function statusColor(val) { return val >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE; }

// ── Render Dashboard ─────────────────────────────────────────────────────────
export function renderDashboard(appData, netWorthSummary = {}) {
    const grid = document.getElementById('dashboardGrid');
    const remindersEl = document.getElementById('dashReminders');
    if (!grid) return;

    const cards = (appData.tabData || {}).cards || [];
    const goals = (appData.tabData || {}).financialGoal || [];
    const outflows = (appData.tabData || {}).outflow || [];
    const netWorthItems = (appData.tabData || {}).netWorth || [];
    const now = new Date();
    const mk = getMonthKey(now);
    const monthData = (appData.monthlyBudgetData || {})[mk] || {};

    let html = '';

    // ── 1. Budget Status Card ────────────────────────────────────────────────
    const income = Number(monthData.inflow?.primaryIncome || 0);
    const totalOutflow = Object.entries(monthData.outflow || {}).reduce((s, [k, v]) => {
        if (k.endsWith('Desc')) return s;
        return s + Number(v || 0);
    }, 0);
    const expAccount = cards.find(c => c.isPrimary === 'Yes');
    const salaryAccount = cards.find(c => c.purpose === 'Salary' && c.isPrimary !== 'Yes');
    const expBalance = Number(expAccount?.balance || 0);
    const salaryBalance = Number(salaryAccount?.balance || 0);
    const transferred = Number(monthData._transferDone || 0);
    const monthClosed = !!monthData._monthClosed;

    const statusBadge = monthClosed
        ? `<span class="dash-card-badge" style="background:${COLOR_POSITIVE}22;color:${COLOR_POSITIVE}">Closed</span>`
        : transferred > 0
            ? '<span class="dash-card-badge" style="background:#3b82f622;color:#3b82f6">Active</span>'
            : `<span class="dash-card-badge" style="background:${COLOR_WARNING}22;color:${COLOR_WARNING}">Pending</span>`;

    html += `<div class="dash-card">
        <div class="dash-card-header">
            <span class="dash-card-title">This Month's Budget</span>
            ${statusBadge}
        </div>
        <div class="dash-stat-row"><span class="dash-stat-label">Income</span><span class="dash-stat-value">${fmtMoney(income)}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Fixed Outflow</span><span class="dash-stat-value" style="color:${COLOR_NEGATIVE}">${fmtMoney(totalOutflow)}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Salary A/c</span><span class="dash-stat-value">${fmtMoney(salaryBalance)}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Expenditure A/c</span><span class="dash-stat-value">${fmtMoney(expBalance)}</span></div>
    </div>`;

    // ── 2. Net Worth Card ────────────────────────────────────────────────────
    let totalAssets = 0, totalLiabilities = 0;
    netWorthItems.forEach(item => {
        const val = Number(item.value || 0);
        if (item.type === 'Asset') totalAssets += val;
        else totalLiabilities += val;
    });
    // Add account balances to assets
    cards.forEach(c => { totalAssets += Number(c.balance || 0); });
    const netWorth = totalAssets - totalLiabilities;

    html += `<div class="dash-card">
        <div class="dash-card-header">
            <span class="dash-card-title">Net Worth</span>
            <span class="dash-card-badge" style="background:${netWorth >= 0 ? COLOR_POSITIVE + '22' : COLOR_NEGATIVE + '22'};color:${statusColor(netWorth)}">${fmtMoney(netWorth)}</span>
        </div>
        <div class="dash-stat-row"><span class="dash-stat-label">Total Assets</span><span class="dash-stat-value" style="color:${COLOR_POSITIVE}">${fmtMoney(totalAssets)}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Total Liabilities</span><span class="dash-stat-value" style="color:${COLOR_NEGATIVE}">${fmtMoney(totalLiabilities)}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Net Worth Items</span><span class="dash-stat-value">${netWorthItems.length}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Accounts</span><span class="dash-stat-value">${cards.length}</span></div>
    </div>`;

    // ── 3. Goal Progress Card ────────────────────────────────────────────────
    const activeGoals = goals.filter(g => {
        const needed = Number(g.amountNeeded || 0);
        const accumulated = Number(g.amountAccumulated || 0);
        return needed > 0 && accumulated < needed;
    });
    const totalNeeded = goals.reduce((s, g) => s + Number(g.amountNeeded || 0), 0);
    const totalAccumulated = goals.reduce((s, g) => s + Number(g.amountAccumulated || 0), 0);
    const goalPct = totalNeeded > 0 ? Math.min(100, (totalAccumulated / totalNeeded) * 100) : 0;

    let goalsHtml = '';
    activeGoals.slice(0, 4).forEach(g => {
        const needed = Number(g.amountNeeded || 0);
        const accumulated = Number(g.amountAccumulated || 0);
        const pct = needed > 0 ? Math.min(100, (accumulated / needed) * 100) : 0;
        goalsHtml += `<div class="dash-goal-item">
            <div style="display:flex;justify-content:space-between">
                <span class="dash-goal-name">${g.name || 'Unnamed'}</span>
                <span class="dash-goal-meta">${Math.round(pct)}%</span>
            </div>
            <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${pct}%;background:${pct >= 100 ? COLOR_POSITIVE : '#3b82f6'}"></div></div>
            <span class="dash-goal-meta">${fmtMoney(accumulated)} / ${fmtMoney(needed)}</span>
        </div>`;
    });
    if (activeGoals.length === 0) goalsHtml = '<span class="dash-stat-label" style="text-align:center;padding:12px 0">No active goals</span>';

    html += `<div class="dash-card">
        <div class="dash-card-header">
            <span class="dash-card-title">Goals</span>
            <span class="dash-card-badge" style="background:#3b82f622;color:#3b82f6">${Math.round(goalPct)}% overall</span>
        </div>
        <div class="dash-stat-row"><span class="dash-stat-label">Total Goals</span><span class="dash-stat-value">${goals.length}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Active</span><span class="dash-stat-value">${activeGoals.length}</span></div>
        ${goalsHtml}
    </div>`;

    // ── 4. Accounts Overview Card ────────────────────────────────────────────
    const totalBalance = cards.reduce((s, c) => s + Number(c.balance || 0), 0);
    const totalCreditLimit = cards.reduce((s, c) => s + Number(c.creditLimit || 0), 0);
    html += `<div class="dash-card">
        <div class="dash-card-header"><span class="dash-card-title">Accounts</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Total Accounts</span><span class="dash-stat-value">${cards.length}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Total Balance</span><span class="dash-stat-value" style="color:${COLOR_POSITIVE}">${fmtMoney(totalBalance)}</span></div>
        <div class="dash-stat-row"><span class="dash-stat-label">Total Credit Limit</span><span class="dash-stat-value">${fmtMoney(totalCreditLimit)}</span></div>
    </div>`;
    grid.innerHTML = html;

    // ── 5. Payment Reminders Banner ──────────────────────────────────────────
    renderReminders(outflows, remindersEl);

    // ── 6. Spending Trend Chart ──────────────────────────────────────────────
    renderTrendChart(appData).catch(() => {});
}

function renderReminders(outflows, el) {
    if (!el) return;
    const now = new Date();
    const upcoming = [];

    outflows.forEach(item => {
        const amount = Number(item.amount || 0);
        if (amount <= 0) return;
        const freq = item.frequency || 'Monthly';
        if (freq === 'One-Time') return;

        upcoming.push({
            name: item.name || 'Unnamed',
            amount,
            type: item.type || 'Other',
            frequency: freq,
        });
    });

    if (upcoming.length === 0) { el.hidden = true; return; }

    el.hidden = false;
    let html = `<div class="dash-reminders-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        Recurring Payments This Month
    </div>`;

    html += `<div class="dash-reminders-list">`;
    upcoming.forEach(item => {
        html += `<div class="dash-reminder-item">
            <span class="dash-reminder-name">${item.name} <span class="dash-reminder-due">(${item.frequency})</span></span>
            <span class="dash-reminder-amount">${fmtMoney(item.amount)}</span>
        </div>`;
    });
    html += `</div>`;

    el.innerHTML = html;
}

async function renderTrendChart(appData) {
    const card = document.getElementById('dashTrendCard');
    const canvas = document.getElementById('dashTrendChart');
    if (!card || !canvas) return;

    const now = new Date();
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    const savingData = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mk = getMonthKey(d);
        const md = (appData.monthlyBudgetData || {})[mk] || {};
        labels.push(d.toLocaleDateString('en-IN', { month: 'short' }));

        const inc = Number(md.inflow?.primaryIncome || 0);
        const outTotal = Object.entries(md.outflow || {}).reduce((s, [k, v]) => k.endsWith('Desc') ? s : s + Number(v || 0), 0);
        incomeData.push(inc);
        expenseData.push(outTotal);
        savingData.push(Math.max(0, inc - outTotal));
    }

    // Only show if there's any data
    const hasData = incomeData.some(v => v > 0) || expenseData.some(v => v > 0);
    if (!hasData) { card.hidden = true; return; }

    card.hidden = false;

    try {
        await ensureChart();
    } catch { card.hidden = true; return; }

    if (_trendChart) { _trendChart.destroy(); _trendChart = null; }

    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)';
    const textColor = isDark ? '#aaa' : '#666';

    _trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Income', data: incomeData, backgroundColor: COLOR_POSITIVE + '88', borderColor: COLOR_POSITIVE, borderWidth: 1 },
                { label: 'Expenses', data: expenseData, backgroundColor: COLOR_NEGATIVE + '88', borderColor: COLOR_NEGATIVE, borderWidth: 1 },
                { label: 'Savings', data: savingData, backgroundColor: '#3b82f688', borderColor: '#3b82f6', borderWidth: 1 },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => '₹' + (v / 1000).toFixed(0) + 'k' } }
            }
        }
    });
}
