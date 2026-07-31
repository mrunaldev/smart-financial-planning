// ── SmartFin Dashboard Module ────────────────────────────────────────────────
// A deliberately compact, decision-oriented summary of the detailed tabs.
import { COLOR_POSITIVE, COLOR_NEGATIVE, COLOR_WARNING, toMonthlyAmount } from './constants.js';

function fmtMoney(value) {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(Number(value) || 0);
    } catch {
        return '₹0';
    }
}

function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function sumNumbers(values) {
    return Object.entries(values || {}).reduce((total, [key, value]) => (
        key.endsWith('Desc') ? total : total + (Number(value) || 0)
    ), 0);
}

function escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = value == null ? '' : String(value);
    return element.innerHTML;
}

function formatGoalDate(value) {
    if (!value) return 'No target date';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? 'No target date'
        : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// `netWorthSummary` is calculated in app.js from the exact combined entries used
// by the Net Worth tab. Keeping this module presentation-only prevents drift.
export function renderDashboard(appData, netWorthSummary = {}) {
    const grid = document.getElementById('dashboardGrid');
    if (!grid) return;

    const tabData = appData.tabData || {};
    const accounts = tabData.cards || [];
    const investments = tabData.inflow || [];
    const goals = tabData.financialGoal || [];
    const outflows = tabData.outflow || [];
    const emergencyFunds = tabData.emergencyFund || [];
    const taxItems = tabData.taxPlan || [];
    const gifts = tabData.gifts || [];
    const now = new Date();
    const monthData = (appData.monthlyBudgetData || {})[getMonthKey(now)] || {};

    // Match the Budget tab: borrowed money is not treated as available income,
    // and recurring outflows are converted to their monthly equivalent.
    const totalIncome = sumNumbers(monthData.inflow);
    const borrowing = Number(monthData.inflow?.borrowing || 0);
    const usableIncome = totalIncome - borrowing;
    const recurringOutflows = outflows.filter(item => {
        return Number(item.amount || 0) > 0 && (item.frequency || 'Monthly') !== 'One-Time';
    });
    const monthlyCommitments = recurringOutflows.reduce((total, item) => (
        total + toMonthlyAmount(Number(item.amount || 0), item.frequency || 'Monthly')
    ), 0);
    const availableToPlan = usableIncome - monthlyCommitments;
    const transferred = Number(monthData._transferDone || 0);
    const monthClosed = Boolean(monthData._monthClosed);
    const budgetState = monthClosed ? 'Closed' : transferred > 0 ? 'In progress' : 'Needs setup';
    const budgetColor = monthClosed ? COLOR_POSITIVE : transferred > 0 ? '#3b82f6' : COLOR_WARNING;

    const activeGoals = goals.filter(goal => {
        const needed = Number(goal.amountNeeded || 0);
        const accumulated = Number(goal.amountAccumulated || 0);
        return needed > 0 && accumulated < needed && goal.status !== 'Achieved';
    });
    const nextGoal = [...activeGoals].sort((a, b) => {
        const aDate = a.targetDate ? new Date(`${a.targetDate}T00:00:00`).getTime() : Infinity;
        const bDate = b.targetDate ? new Date(`${b.targetDate}T00:00:00`).getTime() : Infinity;
        return aDate - bDate;
    })[0];
    const totalGoalGap = activeGoals.reduce((total, goal) => (
        total + Math.max(0, Number(goal.amountNeeded || 0) - Number(goal.amountAccumulated || 0))
    ), 0);
    const nextGoalProgress = nextGoal
        ? Math.min(100, (Number(nextGoal.amountAccumulated || 0) / Number(nextGoal.amountNeeded || 0)) * 100)
        : 0;

    const emergencyFund = Number(emergencyFunds[0]?.currentFund || 0);
    const insurancePolicies = tabData.insurance || [];
    const insuranceCount = insurancePolicies.length;
    const insuranceCover = insurancePolicies.reduce((total, policy) => total + Number(policy.sumAssured || 0), 0);
    const accountBalance = accounts.reduce((total, account) => total + Number(account.balance || 0), 0);
    const primaryAccount = accounts.find(account => account.isPrimary === 'Yes');
    const salaryAccount = accounts.find(account => account.purpose === 'Salary' && account.isPrimary !== 'Yes');
    const portfolioValue = investments.reduce((total, investment) => (
        total + Number(investment.currentValue || investment.amount || 0)
    ), 0);
    const monthlyInvestment = investments.reduce((total, investment) => {
        if ((investment.frequency || 'Monthly') === 'One-Time') return total;
        return total + toMonthlyAmount(Number(investment.amount || 0), investment.frequency || 'Monthly');
    }, 0);
    const taxPlanned = taxItems.reduce((total, item) => total + Number(item.amount || 0), 0);
    const plannedGifts = gifts.reduce((total, gift) => total + Number(gift.amount || 0), 0);
    const netWorth = Number(netWorthSummary.netWorth || 0);
    const totalAssets = Number(netWorthSummary.totalAssets || 0);
    const totalLiabilities = Number(netWorthSummary.totalLiabilities || 0);
    const assetCount = Number(netWorthSummary.assetCount || 0);

    grid.innerHTML = `
        <article class="dash-card dash-card-primary">
            <div class="dash-card-header">
                <span class="dash-card-title">This month</span>
                <span class="dash-card-badge" style="background:${budgetColor}22;color:${budgetColor}">${budgetState}</span>
            </div>
            <div class="dash-primary-value" style="color:${availableToPlan >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE}">${fmtMoney(availableToPlan)}</div>
            <p class="dash-primary-label">available after recurring commitments</p>
            <div class="dash-stat-row"><span class="dash-stat-label">Income to plan</span><span class="dash-stat-value">${fmtMoney(usableIncome)}</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Monthly commitments</span><span class="dash-stat-value">${fmtMoney(monthlyCommitments)}</span></div>
            <div class="dash-card-note">${recurringOutflows.length} recurring commitment${recurringOutflows.length === 1 ? '' : 's'} managed in Fixed Outflow</div>
        </article>

        <article class="dash-card">
            <div class="dash-card-header">
                <span class="dash-card-title">Net worth</span>
                <span class="dash-card-badge" style="background:${netWorth >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE}22;color:${netWorth >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE}">Current</span>
            </div>
            <div class="dash-primary-value" style="color:${netWorth >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE}">${fmtMoney(netWorth)}</div>
            <p class="dash-primary-label">assets less liabilities</p>
            <div class="dash-stat-row"><span class="dash-stat-label">Assets</span><span class="dash-stat-value" style="color:${COLOR_POSITIVE}">${fmtMoney(totalAssets)}</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Liabilities</span><span class="dash-stat-value" style="color:${COLOR_NEGATIVE}">${fmtMoney(totalLiabilities)}</span></div>
            <div class="dash-card-note">Synced with Net Worth · ${assetCount} asset${assetCount === 1 ? '' : 's'} tracked</div>
        </article>

        <article class="dash-card">
            <div class="dash-card-header">
                <span class="dash-card-title">Goals</span>
                <span class="dash-card-badge" style="background:#3b82f622;color:#3b82f6">${activeGoals.length} active</span>
            </div>
            ${nextGoal ? `
                <div class="dash-goal-focus">
                    <span class="dash-goal-name">${escapeHtml(nextGoal.name || 'Unnamed goal')}</span>
                    <span class="dash-goal-meta">Target ${formatGoalDate(nextGoal.targetDate)}</span>
                    <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${nextGoalProgress}%;background:#3b82f6"></div></div>
                    <span class="dash-goal-meta">${Math.round(nextGoalProgress)}% funded · ${fmtMoney(Math.max(0, Number(nextGoal.amountNeeded || 0) - Number(nextGoal.amountAccumulated || 0)))} to go</span>
                </div>` : '<p class="dash-empty-state">No active goals need attention.</p>'}
            <div class="dash-card-note">${totalGoalGap > 0 ? `${fmtMoney(totalGoalGap)} remaining across active goals` : 'Add a goal to start tracking progress'}</div>
        </article>

        <article class="dash-card">
            <div class="dash-card-header"><span class="dash-card-title">Preparedness</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Emergency fund</span><span class="dash-stat-value" style="color:${emergencyFund > 0 ? COLOR_POSITIVE : 'var(--text)'}">${fmtMoney(emergencyFund)}</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Insurance cover</span><span class="dash-stat-value">${fmtMoney(insuranceCover)}</span></div>
            <div class="dash-card-note">${insuranceCount} polic${insuranceCount === 1 ? 'y' : 'ies'} tracked · review coverage and reserves in their detailed tabs.</div>
        </article>

        <article class="dash-card">
            <div class="dash-card-header"><span class="dash-card-title">Accounts</span></div>
            <div class="dash-primary-value" style="color:${accountBalance > 0 ? COLOR_POSITIVE : 'var(--text)'}">${fmtMoney(accountBalance)}</div>
            <p class="dash-primary-label">cash across ${accounts.length} account${accounts.length === 1 ? '' : 's'}</p>
            <div class="dash-stat-row"><span class="dash-stat-label">Primary account</span><span class="dash-stat-value">${primaryAccount ? 'Set' : 'Missing'}</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Salary account</span><span class="dash-stat-value">${salaryAccount ? 'Set' : 'Missing'}</span></div>
        </article>

        <article class="dash-card">
            <div class="dash-card-header"><span class="dash-card-title">Investments & planning</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Portfolio value</span><span class="dash-stat-value" style="color:${COLOR_POSITIVE}">${fmtMoney(portfolioValue)}</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Monthly investment</span><span class="dash-stat-value">${fmtMoney(monthlyInvestment)}</span></div>
            <div class="dash-stat-row"><span class="dash-stat-label">Tax items logged</span><span class="dash-stat-value">${fmtMoney(taxPlanned)}</span></div>
            <div class="dash-card-note">${plannedGifts > 0 ? `${fmtMoney(plannedGifts)} planned for gifts` : 'No gift budget recorded'}</div>
        </article>`;
}
