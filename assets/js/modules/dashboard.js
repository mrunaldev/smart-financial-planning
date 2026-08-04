// ── SmartFin Dashboard Module ────────────────────────────────────────────────
// A deliberately compact, decision-oriented summary of the detailed tabs.
import { COLOR_POSITIVE, COLOR_NEGATIVE, COLOR_WARNING, toMonthlyAmount } from './constants.js';

// Helper to get auto tax deductions (calls the function from app.js)
function getAutoTaxDeductionsFromAppData(appData) {
    // This function is defined in app.js and is available globally
    // We need to replicate the logic here since we can't import from app.js
    const auto = [];
    
    // Helper function for annual amount calculation
    function getOutflowAnnualAmount(item) {
        const amount = Number(item.amount || 0);
        const freq = item.frequency || "Monthly";
        if (freq === "Monthly") return amount * 12;
        if (freq === "Quarterly") return amount * 4;
        if (freq === "Semi-Annual") return amount * 2;
        if (freq === "Annual") return amount;
        return amount; // One-Time
    }
    
    function normalizeInvestmentFrequency(item = {}) {
        if (item.frequency) return item.frequency === "Annually" ? "Annual" : item.frequency;
        if (item.category === "Monthly") return "Monthly";
        return "One-Time";
    }

    function normalizeInvestmentEntry(entry = {}) {
        const normalized = { ...entry };
        normalized.frequency = normalizeInvestmentFrequency(normalized);
        delete normalized.category;
        return normalized;
    }

    function normalizeInvestmentEntries(entries = []) {
        return entries.map(normalizeInvestmentEntry);
    }
    
    // Outflow items with type Insurance → 80D (annual premiums only)
    const outflowItems = (appData.tabData || {}).outflow || [];
    outflowItems.filter(e => e.type === 'Insurance').forEach(item => {
        const annual = getOutflowAnnualAmount(item);
        if (annual > 0) auto.push({ id: 'atax_ins_' + item.id, name: item.name || 'Insurance', amount: annual, section: '80D', details: 'From Outflow tab', auto: true });
    });
    
    // Inflow items → 80C (only recurring contributions, exclude One-Time)
    const inflowItems = normalizeInvestmentEntries((appData.tabData || {}).inflow || []);
    inflowItems.forEach(item => {
        const freq = (item.frequency || '').toLowerCase();
        const base = Number(item.amount || 0);
        
        // Skip One-Time investments as they represent current value, not annual contribution
        if (freq === 'one-time') return;
        
        // Only count recurring contributions (Monthly, Quarterly, Semi-Annual, Annual)
        let annual = 0;
        if (freq === 'monthly') {
            annual = base * 12;
        } else if (freq === 'quarterly') {
            annual = base * 4;
        } else if (freq === 'semi-annual') {
            annual = base * 2;
        } else if (freq === 'annual') {
            annual = base;
        }
        
        if (annual > 0) auto.push({ id: 'atax_inv_' + item.id, name: item.name || 'Investment', amount: annual, section: '80C', details: 'From Inflow tab', auto: true });
    });
    return auto;
}

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

function calculateIdealHealthInsurance(age, location, monthlyIncome) {
    // More realistic formula: Base on income and age
    // Rule of thumb: Health cover should be 50% of annual income or minimum ₹5L
    const metroCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Gurgaon', 'Noida'];
    const cityName = (location || '').split(',')[0].trim();
    const isMetro = metroCities.some(metro => cityName.includes(metro));
    
    // Base calculation: 50% of annual income
    const annualIncome = monthlyIncome * 12;
    let idealCover = annualIncome * 0.5;
    
    // Minimum coverage based on city
    const minCover = isMetro ? 500000 : 300000; // ₹5L metro, ₹3L non-metro
    idealCover = Math.max(idealCover, minCover);
    
    // Age-based adjustment (medical costs increase with age)
    if (age >= 45) {
        idealCover = idealCover * 1.5; // 50% more for 45+
    } else if (age >= 35) {
        idealCover = idealCover * 1.2; // 20% more for 35-44
    }
    
    // Cap at reasonable maximum
    return Math.min(idealCover, 2000000); // Cap at ₹20L for individual
}

function calculateIdealTermInsurance(age, monthlyIncome, currentSavings) {
    // More realistic formula: 10-15x annual income minus existing savings
    // This ensures family can maintain lifestyle for 10-15 years
    const annualIncome = monthlyIncome * 12;
    const multiplier = age < 35 ? 15 : age < 45 ? 12 : 10; // Younger = higher multiplier
    const idealCover = Math.max(0, (annualIncome * multiplier) - currentSavings);
    
    // Minimum cover should be at least ₹50L
    return Math.max(idealCover, 5000000);
}

function calculateIdealEmergencyFund(appData) {
    // Use the same calculation as Emergency Fund tab for consistency
    // 1. Fixed monthly obligations (from Outflow tab)
    const allOutflows = (appData.tabData || {}).outflow || [];
    let fixedLiabilities = 0;
    let fixedExpenditure = 0;

    allOutflows.forEach(e => {
        const amount = Number(e.amount || 0);
        if (amount <= 0) return;
        const freq = e.frequency || "Monthly";
        const monthlyAmt = toMonthlyAmount(amount, freq);
        if (monthlyAmt <= 0) return;

        const t = e.type || "Expenditure";
        if (t === "Liability" || t === "Insurance") {
            fixedLiabilities += monthlyAmt;
        } else if (t === "Expenditure") {
            fixedExpenditure += monthlyAmt;
        }
    });

    // 2. Average variable monthly expenditure from budget history
    const monthlyBudgetData = appData.monthlyBudgetData || {};
    const availableMonths = Object.keys(monthlyBudgetData);
    let totalVariable = 0;
    let monthsWithData = 0;

    availableMonths.forEach(monthKey => {
        const md = monthlyBudgetData[monthKey] || {};
        const o = md.outflow || {};
        const inv = md.investing || {};
        const varExp = Number(o.utilityBills || 0)
            + Number(o.familyExpenditure || 0)
            + Number(o.miscExpenses || 0)
            + Number(o.debtRepayment || 0)
            + Number(o.creditCardOutstanding || 0)
            + Number(o.midMonthCCOutstanding || 0)
            + Number(inv.ondemandExpenditure || 0)
            + Number(inv.ondemandLiability || 0);
        if (varExp > 0) {
            totalVariable += varExp;
            monthsWithData++;
        }
    });

    const avgVariableExpenses = monthsWithData > 0 ? totalVariable / monthsWithData : 0;

    // 3. Minimum monthly survival amount
    const minMonthlyNeed = fixedLiabilities + fixedExpenditure + avgVariableExpenses;

    // 4. Standard recommendation: 6 months of expenses
    const ideal = minMonthlyNeed * 6;
    
    console.log('Emergency Fund Debug:', {
        fixedLiabilities,
        fixedExpenditure,
        avgVariableExpenses,
        minMonthlyNeed,
        ideal
    });

    return ideal;
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

    // Get all tax deductions including auto-calculated ones (now correctly calculated)
    const autoTaxDeductions = getAutoTaxDeductionsFromAppData(appData);
    const allTaxDeductions = [...autoTaxDeductions, ...taxItems];
    const taxPlanned = allTaxDeductions.reduce((total, item) => total + Number(item.amount || 0), 0);

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

    // Calculate budget surplus/deficit (same as Budget tab)
    const spendable = usableIncome - monthlyCommitments;
    const variableExp = Number(monthData.outflow?.variableExpenditure || 0);
    const creditCardOutstanding = Number(monthData.outflow?.creditCardOutstanding || 0);
    const midMonthCC = Number(monthData.outflow?.midMonthCCOutstanding || 0);
    const actualCCOutstanding = creditCardOutstanding + midMonthCC;
    const untracked = variableExp + actualCCOutstanding;
    const budgetBalance = spendable - untracked;
    let budgetSurplusText = '';
    let budgetSurplusColor = COLOR_POSITIVE;
    if (totalIncome > 0) {
        if (budgetBalance > 0) {
            budgetSurplusText = `+${fmtMoney(budgetBalance)} surplus`;
            budgetSurplusColor = COLOR_POSITIVE;
        } else if (budgetBalance < 0) {
            budgetSurplusText = `${fmtMoney(Math.abs(budgetBalance))} over budget`;
            budgetSurplusColor = COLOR_NEGATIVE;
        } else {
            budgetSurplusText = 'Balanced';
            budgetSurplusColor = COLOR_POSITIVE;
        }
    }

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
    
    // Calculate age from DOB
    let userAge = 30; // Default age
    if (appData.dateOfBirth) {
        const dob = new Date(appData.dateOfBirth);
        const today = new Date();
        userAge = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            userAge--;
        }
    }
    
    // Calculate monthly income and expenses
    const monthlyIncome = sumNumbers(monthData.inflow) || appData.fixedMonthlyIncome || 50000;
    const monthlyExpenses = sumNumbers(monthData.outflow) || 30000; // Default to 30k if no data
    
    // Calculate current savings (from accounts with purpose = Savings)
    const currentSavings = accounts
        .filter(acc => acc.purpose === 'Savings' || acc.purpose === 'Savings')
        .reduce((total, acc) => total + Number(acc.balance || 0), 0);
    
    // Calculate ideal insurance amounts with realistic formulas
    const idealHealthInsurance = calculateIdealHealthInsurance(userAge, appData.userLocation, monthlyIncome);
    const idealTermInsurance = calculateIdealTermInsurance(userAge, monthlyIncome, currentSavings);
    const idealEmergencyFund = calculateIdealEmergencyFund(appData);
    
    // Determine if user is in a metro city for tooltip
    const metroCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Gurgaon', 'Noida'];
    const cityName = (appData.userLocation || '').split(',')[0].trim();
    const isMetro = metroCities.some(metro => cityName.includes(metro));
    
    // Get current health and term insurance
    const healthInsurance = insurancePolicies
        .filter(p => p.policyType === 'Health')
        .reduce((total, p) => total + Number(p.sumAssured || 0), 0);
    const termInsurance = insurancePolicies
        .filter(p => p.policyType === 'Term Life' || p.policyType === 'Whole Life')
        .reduce((total, p) => total + Number(p.sumAssured || 0), 0);
    
    // Calculate progress percentages
    const healthInsuranceProgress = idealHealthInsurance > 0 ? Math.min(100, (healthInsurance / idealHealthInsurance) * 100) : 0;
    const termInsuranceProgress = idealTermInsurance > 0 ? Math.min(100, (termInsurance / idealTermInsurance) * 100) : 0;
    const emergencyFundProgress = idealEmergencyFund > 0 ? Math.min(100, (emergencyFund / idealEmergencyFund) * 100) : 0;
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
    const plannedGifts = gifts.reduce((total, gift) => total + Number(gift.amount || 0), 0);
    const netWorth = Number(netWorthSummary.netWorth || 0);
    const totalAssets = Number(netWorthSummary.totalAssets || 0);
    const totalLiabilities = Number(netWorthSummary.totalLiabilities || 0);
    const assetCount = Number(netWorthSummary.assetCount || 0);

    // Calculate 6-month trend data
    const sixMonthData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthKey = getMonthKey(date);
        const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
        const mData = (appData.monthlyBudgetData || {})[monthKey] || {};
        
        const investment = Number(mData.outflow?.fixedInvestment || 0) + Number(mData.investing?.onetimeInvestment || 0);
        const expenditure = Number(mData.outflow?.variableExpenditure || 0) + Number(mData.outflow?.fixedExpenditure || 0);
        const saving = Number(mData.outflow?.fixedSaving || 0) + Number(mData.investing?.onetimeSaving || 0);
        const liability = Number(mData.outflow?.loanEMI || 0) + Number(mData.investing?.ondemandLiability || 0);
        const others = Number(mData.outflow?.fixedOthers || 0);
        
        sixMonthData.push({ monthName, investment, expenditure, saving, liability, others });
    }
    
    const maxValue = Math.max(...sixMonthData.flatMap(m => [m.investment, m.expenditure, m.saving, m.liability, m.others])) || 1;

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
            ${budgetSurplusText ? `<div class="dash-stat-row"><span class="dash-stat-label">Budget status</span><span class="dash-stat-value" style="color:${budgetSurplusColor}">${budgetSurplusText}</span></div>` : ''}
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
            ${activeGoals.length > 0 ? `
                <div class="dash-goal-focus">
                    <span class="dash-goal-name">All Goals Combined</span>
                    <span class="dash-goal-meta">${activeGoals.length} goal${activeGoals.length === 1 ? '' : 's'} in progress</span>
                    ${(() => {
                        const totalNeeded = activeGoals.reduce((sum, g) => sum + Number(g.amountNeeded || 0), 0);
                        const totalAccumulated = activeGoals.reduce((sum, g) => sum + Number(g.amountAccumulated || 0), 0);
                        const overallProgress = totalNeeded > 0 ? Math.min(100, (totalAccumulated / totalNeeded) * 100) : 0;
                        const totalRemaining = Math.max(0, totalNeeded - totalAccumulated);
                        return `
                            <div style="margin-top:16px;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                    <span style="font-size:14px;font-weight:600;color:var(--text)">Combined Progress</span>
                                    <span style="font-size:13px;font-weight:600;color:#3b82f6">${Math.round(overallProgress)}%</span>
                                </div>
                                <div class="dash-progress-bar" style="height:12px;"><div class="dash-progress-fill" style="width:${overallProgress}%;background:#3b82f6"></div></div>
                                <div style="display:flex;justify-content:space-between;margin-top:8px;">
                                    <span class="dash-goal-meta">Accumulated: ${fmtMoney(totalAccumulated)}</span>
                                    <span class="dash-goal-meta">Target: ${fmtMoney(totalNeeded)}</span>
                                </div>
                                <div style="margin-top:4px;text-align:center;">
                                    <span style="font-size:13px;font-weight:500;color:${totalRemaining > 0 ? COLOR_WARNING : COLOR_POSITIVE}">${fmtMoney(totalRemaining)} remaining</span>
                                </div>
                            </div>
                        `;
                    })()}
                </div>` : '<p class="dash-empty-state">No active goals need attention.</p>'}
            <div class="dash-card-note">${activeGoals.length > 0 ? `View details in Goals tab for individual progress` : 'Add a goal to start tracking progress'}</div>
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
        </article>

        <article class="dash-card">
            <div class="dash-card-header"><span class="dash-card-title">Preparedness</span></div>
            <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:13px;font-weight:500;color:var(--text)">Emergency Fund</span>
                    <span style="font-size:12px;color:var(--dim)">${Math.round(emergencyFundProgress)}%</span>
                </div>
                <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${emergencyFundProgress}%;background:${emergencyFundProgress >= 100 ? COLOR_POSITIVE : COLOR_WARNING}"></div></div>
                <div style="display:flex;justify-content:space-between;margin-top:4px;">
                    <span class="dash-goal-meta">Current: ${fmtMoney(emergencyFund)}</span>
                    <span class="dash-goal-meta" style="cursor:help;" title="Formula: (Fixed Liabilities + Fixed Expenditure + Average Variable Expenses) × 6\nBased on your Outflow tab and budget history\nIdeal: ${fmtMoney(idealEmergencyFund)}">Ideal: ${fmtMoney(idealEmergencyFund)} ℹ️</span>
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:13px;font-weight:500;color:var(--text)">Health Insurance</span>
                    <span style="font-size:12px;color:var(--dim)">${Math.round(healthInsuranceProgress)}%</span>
                </div>
                <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${healthInsuranceProgress}%;background:${healthInsuranceProgress >= 100 ? COLOR_POSITIVE : COLOR_WARNING}"></div></div>
                <div style="display:flex;justify-content:space-between;margin-top:4px;">
                    <span class="dash-goal-meta">Current: ${fmtMoney(healthInsurance)}</span>
                    <span class="dash-goal-meta" style="cursor:help;" title="Formula: 50% of Annual Income (minimum ₹${isMetro ? '5L' : '3L'})\nAge adjustment: ${userAge >= 45 ? '1.5x' : userAge >= 35 ? '1.2x' : '1.0x'}\nYour income: ${fmtMoney(monthlyIncome)}/month (${fmtMoney(monthlyIncome * 12)}/year)\nBase: ${fmtMoney(monthlyIncome * 12 * 0.5)}\nAfter age adjustment: ${fmtMoney(monthlyIncome * 12 * 0.5 * (userAge >= 45 ? 1.5 : userAge >= 35 ? 1.2 : 1.0))}\nIdeal: ${fmtMoney(idealHealthInsurance)}">Ideal: ${fmtMoney(idealHealthInsurance)} ℹ️</span>
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:13px;font-weight:500;color:var(--text)">Term Insurance</span>
                    <span style="font-size:12px;color:var(--dim)">${Math.round(termInsuranceProgress)}%</span>
                </div>
                <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${termInsuranceProgress}%;background:${termInsuranceProgress >= 100 ? COLOR_POSITIVE : COLOR_WARNING}"></div></div>
                <div style="display:flex;justify-content:space-between;margin-top:4px;">
                    <span class="dash-goal-meta">Current: ${fmtMoney(termInsurance)}</span>
                    <span class="dash-goal-meta" style="cursor:help;" title="Formula: (Annual Income × Multiplier) - Current Savings\nMultiplier based on age: ${userAge < 35 ? '15x' : userAge < 45 ? '12x' : '10x'}\nYour income: ${fmtMoney(monthlyIncome)}/month (${fmtMoney(monthlyIncome * 12)}/year)\nBase cover: ${fmtMoney(monthlyIncome * 12)} × ${userAge < 35 ? '15' : userAge < 45 ? '12' : '10'} = ${fmtMoney(monthlyIncome * 12 * (userAge < 35 ? 15 : userAge < 45 ? 12 : 10))}\nLess savings: ${fmtMoney(currentSavings)}\nIdeal: ${fmtMoney(monthlyIncome * 12 * (userAge < 35 ? 15 : userAge < 45 ? 12 : 10) - currentSavings)}">Ideal: ${fmtMoney(idealTermInsurance)} ℹ️</span>
                </div>
            </div>
            <div class="dash-card-note">${insuranceCount} polic${insuranceCount === 1 ? 'y' : 'ies'} tracked · Based on age ${userAge}, location, and expenses</div>
        </article>
        
        <article class="dash-card" style="grid-column: 1 / -1;">
            <div class="dash-card-header"><span class="dash-card-title">6-Month Trend</span></div>
            <canvas id="dashboardTrendChart" style="margin-top:16px;max-height:250px;"></canvas>
        </article>`;
    
    // Render the 6-month trend chart using Chart.js
    setTimeout(async () => {
        const canvas = document.getElementById('dashboardTrendChart');
        if (!canvas) return;
        
        // Lazy-load Chart.js if needed
        if (typeof Chart === 'undefined') {
            try {
                await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
            } catch (err) {
                console.error('Failed to load Chart.js:', err);
                return;
            }
        }
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sixMonthData.map(m => m.monthName),
                datasets: [
                    {
                        label: 'Investment',
                        data: sixMonthData.map(m => m.investment),
                        backgroundColor: '#3b82f6', // Investment color
                        borderColor: '#3b82f6',
                        borderWidth: 1
                    },
                    {
                        label: 'Liability',
                        data: sixMonthData.map(m => m.liability),
                        backgroundColor: '#ef4444', // Liability color
                        borderColor: '#ef4444',
                        borderWidth: 1
                    },
                    {
                        label: 'Saving',
                        data: sixMonthData.map(m => m.saving),
                        backgroundColor: '#22c55e', // Savings color
                        borderColor: '#22c55e',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenditure',
                        data: sixMonthData.map(m => m.expenditure),
                        backgroundColor: '#f97316', // Expenditure color
                        borderColor: '#f97316',
                        borderWidth: 1
                    },
                    {
                        label: 'Others',
                        data: sixMonthData.map(m => m.others),
                        backgroundColor: '#eab308', // Others color
                        borderColor: '#eab308',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: ${fmtMoney(value)}`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 10
                        },
                        formatter: function(value) {
                            if (value === 0) return '';
                            return '₹' + (value / 1000).toFixed(0) + 'K';
                        },
                        anchor: 'end',
                        align: 'top'
                    }
                },
                scales: {
                    x: {
                        stacked: false
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + (value / 1000) + 'K';
                            }
                        }
                    }
                }
            },
            plugins: [{
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach(function(dataset, i) {
                        const meta = chart.getDatasetMeta(i);
                        meta.data.forEach(function(bar, index) {
                            const data = dataset.data[index];
                            if (data > 0) {
                                ctx.fillStyle = '#fff';
                                ctx.font = 'bold 10px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText('₹' + (data / 1000).toFixed(0) + 'K', bar.x, bar.y - 5);
                            }
                        });
                    });
                }
            }]
        });
    }, 100);
}
