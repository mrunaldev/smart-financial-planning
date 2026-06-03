'use strict';

// ── Theme-based favicon switching ─────────────────────────────────────────────
function updateFaviconForTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const faviconIcon = document.getElementById('favicon-icon');
    const faviconIcon32 = document.getElementById('favicon-icon-32');
    const appleTouchIcon = document.getElementById('apple-touch-icon');
    
    const logoPath = isLight ? 'assets/logo_light.png' : 'assets/logo_dark.png';
    
    if (faviconIcon) faviconIcon.href = logoPath;
    if (faviconIcon32) faviconIcon32.href = logoPath;
    if (appleTouchIcon) appleTouchIcon.href = logoPath;
}

// ── Chart theme color helper ─────────────────────────────────────────────────
function getChartThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
        text:    isLight ? '#212529' : '#e0e0e0',
        grid:    isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
        bar:     isLight ? '#444444' : '#e0e0e0',
    };
}

const DEFAULT_TABS = [
    { id: "cards",               label: "Accounts",              color: "#444", text: "#fff" },
    { id: "investments",         label: "Investments",           color: "#444", text: "#fff" },
    { id: "monthlyFixedExpense", label: "Liabilities",           color: "#444", text: "#fff" },
    { id: "monthlyBudget",       label: "Budget",                color: "#444", text: "#fff" },
    { id: "financialGoal",       label: "Financial Goal",        color: "#444", text: "#fff" },
    { id: "insurances",          label: "Insurances",            color: "#444", text: "#fff" },
    { id: "netWorth",            label: "Net Worth",             color: "#444", text: "#fff" },
    { id: "taxPlan",             label: "Tax Plan",              color: "#444", text: "#fff" },
    { id: "gifts",               label: "Gifts",                 color: "#444", text: "#fff" },
    { id: "emergencyFund",       label: "Emergency Fund",        color: "#444", text: "#fff" }
];

// ── Tab-specific field configurations ───────────────────────────────────────
const TAB_FIELDS = {
    monthlyBudget: [
        { id: "name",      label: "Item Name",           type: "text",   placeholder: "e.g. Rent, Groceries", required: true },
        { id: "planned",   label: "Planned Amount (₹)", type: "number", placeholder: "0", required: true },
        { id: "actual",    label: "Actual Amount (₹)",  type: "number", placeholder: "0" },
        { id: "date",      label: "Date",               type: "date",   placeholder: "" },
        { id: "note",      label: "Note",               type: "text",   placeholder: "Optional" }
    ],
    financialGoal: [
        { id: "name",      label: "Goal Name",           type: "text",   placeholder: "e.g. Emergency Fund", required: true },
        { id: "amountNeeded", label: "Amount Needed (₹)", type: "number", placeholder: "0", required: true },
        { id: "amountAccumulated", label: "Amount Accumulated (₹)", type: "number", placeholder: "0" },
        { id: "targetDate", label: "Target Date", type: "date", placeholder: "" },
        { id: "details", label: "Details", type: "text", placeholder: "Optional" },
        { id: "goalType", label: "Goal Type", type: "select", options: ["Short Term", "Mid Term", "Long Term"] },
        { id: "status", label: "Status", type: "select", options: ["Planned", "Ongoing", "Achieved", "Missed"] }
    ],
    monthlyFixedExpense: [
        { id: "name",      label: "Expense Name",        type: "text",   placeholder: "e.g. Rent, Insurance", required: true },
        { id: "amount",    label: "Amount (₹)",         type: "number", placeholder: "0", required: true },
        { id: "type",      label: "Deduction Type",     type: "select", options: ["Insurance", "Liability", "Saving", "Expenditure", "Investment"] },
        { id: "frequency", label: "Frequency",          type: "select", options: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "One-Time"] },
        { id: "bankName", label: "Bank Name",          type: "text",   placeholder: "e.g. HDFC, ICICI" },
        { id: "endDate",   label: "End Date",           type: "date",   placeholder: "" }
    ],
    investments: [
        { id: "name",      label: "Investment Name",     type: "text",   placeholder: "e.g. HDFC SIP, Stocks", required: true },
        { id: "initialInvestment", label: "Initial Investment (₹)", type: "number", placeholder: "0", required: true },
        { id: "totalAmount", label: "Total Amount So Far (₹)", type: "number", placeholder: "0" },
        { id: "annualInterestRate", label: "Annual Interest Rate (%)", type: "number", placeholder: "0" },
        { id: "frequency", label: "Frequency", type: "select", options: ["Monthly", "Annually", "One-Time"] },
        { id: "startDate", label: "Start Date", type: "date", placeholder: "" },
        { id: "maturityDate", label: "Maturity Date", type: "date", placeholder: "" },
        { id: "details", label: "Details/Remark", type: "text", placeholder: "Optional" }
    ],
    insurances: [
        { id: "name",      label: "Policy Name",         type: "text",   placeholder: "e.g. Term Life, Health", required: true },
        { id: "policyType", label: "Policy Type", type: "select", options: ["Life Insurance", "Term Insurance", "Health Insurance", "Vehicle Insurance", "Travel Insurance", "Home Insurance", "Other"] },
        { id: "companyName", label: "Company Name",       type: "text",   placeholder: "e.g. HDFC, ICICI" },
        { id: "premium",   label: "Premium (₹)",        type: "number", placeholder: "0", required: true },
        { id: "premiumFrequency", label: "Premium Type", type: "select", options: ["Monthly", "Semi-Annual", "Annual"] },
        { id: "sumAssured", label: "Sum Assured (₹)",    type: "number", placeholder: "0" },
        { id: "startDate", label: "Start Date",      type: "date",   placeholder: "" },
        { id: "maturityDate", label: "Maturity Date",      type: "date",   placeholder: "" },
        { id: "nomineeName", label: "Nominee Name",       type: "text",   placeholder: "e.g. John Doe" },
        { id: "nirLinked", label: "NIR Linked",          type: "select", options: ["Yes", "No"] }
    ],
    cards: [
        { id: "bankName",      label: "Bank/NBFC Name",      type: "text",   placeholder: "e.g. HDFC, ICICI", required: true },
        { id: "isPrimary",     label: "Primary Account",     type: "select", options: ["No", "Yes"] },
        { id: "accountPresent", label: "Account Present",    type: "select", options: ["Yes", "No"] },
        { id: "balance",       label: "Balance (₹)",         type: "number", placeholder: "0" },
        { id: "debitCardPresent", label: "Debit Card Present", type: "select", options: ["Yes", "No"] },
        { id: "creditCardPresent", label: "Credit Card Present", type: "select", options: ["Yes", "No"] },
        { id: "creditLimit",   label: "Credit Card Limit (₹)", type: "number", placeholder: "0" },
        { id: "purpose",       label: "Purpose of Use",      type: "select", options: ["Income", "Expenditure", "Saving", "Investment", "Loan", "Others"] },
        { id: "purposeOther",  label: "Specify Purpose",     type: "text",   placeholder: "Custom purpose (if Others selected)", noTable: true },
        { id: "kycUpdated",   label: "Address/KYC Updated",  type: "select", options: ["Yes", "No"] },
        { id: "nomineeAdded",  label: "Nominee Added",       type: "select", options: ["Yes", "No"] }
    ],
    netWorth: [
        { id: "name",      label: "Asset/Liability Name", type: "text",   placeholder: "e.g. House, Car, Loan", required: true },
        { id: "type",      label: "Type",               type: "select", options: ["Asset", "Liability"] },
        { id: "value",     label: "Value Today (₹)",    type: "number", placeholder: "0", required: true },
        { id: "growthRate", label: "Expected Annual Growth (%)", type: "number", placeholder: "0" },
        { id: "details",   label: "Details",            type: "text",   placeholder: "Optional" }
    ],
    taxPlan: [
        { id: "name",      label: "Tax Saving Item",     type: "text",   placeholder: "e.g. PPF, ELSS, 80C", required: true },
        { id: "amount",   label: "Amount Invested (₹)", type: "number", placeholder: "0", required: true },
        { id: "section",  label: "Section",             type: "select", options: ["80C", "80D", "80CCD(1B)", "80CCD(2)", "80E", "80EEA", "80G", "Other"] },
        { id: "details",   label: "Details",            type: "text",   placeholder: "Optional" }
    ],
    gifts: [
        { id: "name",      label: "Gift Name",           type: "text",   placeholder: "e.g. Birthday gift to friend", required: true },
        { id: "category",  label: "Category",            type: "select", options: ["Fixed Every Year", "On Demand"] },
        { id: "relativeName", label: "Relative Name",    type: "text",   placeholder: "e.g. John Doe" },
        { id: "occasion",  label: "Occasion",             type: "text",   placeholder: "e.g. Birthday, Wedding, Anniversary" },
        { id: "amount",    label: "Amount (₹)",          type: "number", placeholder: "0" },
        { id: "details",   label: "Details",              type: "text",   placeholder: "Optional" }
    ],
    emergencyFund: [
        { id: "currentFund", label: "Current Emergency Fund (₹)", type: "number", placeholder: "0", required: true },
        { id: "details",     label: "Details",               type: "text",   placeholder: "Optional" }
    ]
};

// ── Monthly Budget Category Fields ───────────────────────────────────────────
const MONTHLY_BUDGET_CATEGORIES = {
    inflow: [
        { id: "primaryIncome", label: "Primary Income", type: "number" },
        { id: "secondaryIncome", label: "Secondary Income", type: "number" },
        { id: "borrowing", label: "Borrowing/Money Back", type: "number" },
        { id: "interest", label: "Interest/Dividend", type: "number" },
        { id: "othersInflow", label: "Others", type: "number" }
    ],
    outflow: [
        { id: "loanEMI", label: "Auto-calculated Liabilities", type: "number" },
        { id: "creditCardOutstanding", label: "Credit Card Outstanding Amount So Far", type: "number" },
        { id: "debtRepayment", label: "Debt Repayment/Lending", type: "number" },
        { id: "utilityBills", label: "Utility Bills", type: "number" },
        { id: "familyExpenditure", label: "Family Expenditure", type: "number" },
        { id: "miscExpenses", label: "Miscellaneous Expenses", type: "number" }
    ],
    investing: [
        { id: "onetimeSaving", label: "On-Demand Saving", type: "number" },
        { id: "onetimeInvestment", label: "On-Demand Investment", type: "number" },
        { id: "ondemandExpenditure", label: "On-Demand Expenditure", type: "number" },
        { id: "ondemandLiability", label: "On-Demand Liability", type: "number" }
    ]
};

// ── DOM refs ──────────────────────────────────────────────────────────────────
const authScreen        = document.getElementById("authScreen");
const appScreen         = document.getElementById("appScreen");
const authForm          = document.getElementById("authForm");
const authNameInput     = document.getElementById("authName");
const authDobInput      = document.getElementById("authDob");
const authEmailInput    = document.getElementById("authEmail");
const authPasswordInput = document.getElementById("authPassword");
const authSubmitBtn     = document.getElementById("authSubmitBtn");
const authToggleBtn     = document.getElementById("authToggleBtn");
const authSwitchText    = document.getElementById("authSwitchText");
const authError         = document.getElementById("authError");
const nameField         = document.getElementById("nameField");
const dobField          = document.getElementById("dobField");
const logoutBtn         = document.getElementById("logoutBtn");
const themeToggle       = document.getElementById("themeToggle");
const tabMenuToggle     = document.getElementById("tabMenuToggle");
const tabList           = document.getElementById("tabList");
const mobileActiveTab   = document.getElementById("mobileActiveTab");
const userEmailDisplay  = document.getElementById("userEmailDisplay");
const tabBar            = document.getElementById("tabBar");

// Ensure the auth form starts in sign-in mode.
nameField.hidden = true;
dobField.hidden = true;
authNameInput.required = false;
authNameInput.value = "";

window.addEventListener("error", event => {
    const message = event.error ? event.error.message : event.message || "Unknown error";
    setAuthError(`Global error: ${message}`);
    console.error("Global script error:", event.error || event.message, event);
});

window.addEventListener("unhandledrejection", event => {
    const reason = event.reason ? (event.reason.message || JSON.stringify(event.reason)) : "Unknown promise rejection";
    setAuthError(`Unhandled rejection: ${reason}`);
    console.error("Unhandled rejection:", event.reason);
});


// Ensure the sign-in form starts in sign-in mode.
nameField.hidden = true;
authNameInput.required = false;
const activeSubtitle    = document.getElementById("activeSubtitle");
const entryForm         = document.getElementById("entryForm");
const dynamicFields     = document.getElementById("dynamicFields");
const tableHead         = document.getElementById("tableHead");
const entryRows         = document.getElementById("entryRows");
const emptyState        = document.getElementById("emptyState");
const searchInput       = document.getElementById("searchInput");
const exportBtn         = document.getElementById("exportBtn");
const clearTabButton    = document.getElementById("clearTab");
const resetAllDataButton = document.getElementById("resetAllData");

// Monthly Budget specific refs
const monthlyBudgetUI   = document.getElementById("monthlyBudgetUI");
const standardUI        = document.getElementById("standardUI");
const prevMonthBtn      = document.getElementById("prevMonth");
const nextMonthBtn      = document.getElementById("nextMonth");
const toggleBudgetView  = document.getElementById("toggleBudgetView");
const currentMonthDisplay = document.getElementById("currentMonthDisplay");
const budgetStatus      = document.getElementById("budgetStatus");
const inflowFields      = document.getElementById("inflowFields");
const outflowFields     = document.getElementById("outflowFields");
const investingFields   = document.getElementById("investingFields");
const monthEndBalance   = document.getElementById("monthEndBalance");

// Annual summary refs
const annualSummarySection = document.getElementById("annualSummarySection");
const monthlyViewSection   = document.getElementById("monthlyViewSection");
const annualTotalIncome    = document.getElementById("annualTotalIncome");
const annualTotalExpenditure = document.getElementById("annualTotalExpenditure");
const annualTotalSavings   = document.getElementById("annualTotalSavings");
const annualTotalInvestment = document.getElementById("annualTotalInvestment");
const annualTotalLiability = document.getElementById("annualTotalLiability");
const annualTotalOther = document.getElementById("annualTotalOther");
const avgMonthlyIncome     = document.getElementById("avgMonthlyIncome");
const avgMonthlyExpenditure = document.getElementById("avgMonthlyExpenditure");
const avgMonthlySavings = document.getElementById("avgMonthlySavings");
const avgMonthlyInvestment = document.getElementById("avgMonthlyInvestment");
const avgMonthlyLiability = document.getElementById("avgMonthlyLiability");
const avgMonthlyOther = document.getElementById("avgMonthlyOther");
const annualMonthsList     = document.getElementById("annualMonthsList");
const annualPieChartCanvas = document.getElementById("annualPieChart");
const pieCanvas        = document.getElementById("pieChart");
const toggleBudgetEdit  = document.getElementById("toggleBudgetEdit");
const budgetPreview     = document.getElementById("budgetPreview");
const budgetEdit        = document.getElementById("budgetEdit");
const inflowPreview     = document.getElementById("inflowPreview");
const outflowPreview    = document.getElementById("outflowPreview");
const investingPreview  = document.getElementById("investingPreview");

// Financial Goal refs
const financialGoalUI   = document.getElementById("financialGoalUI");
const toggleGoalEdit    = document.getElementById("toggleGoalEdit");
const goalPreview       = document.getElementById("goalPreview");
const goalEdit          = document.getElementById("goalEdit");
const goalsList         = document.getElementById("goalsList");
const goalForm          = document.getElementById("goalForm");
const goalDynamicFields = document.getElementById("goalDynamicFields");
const goalTableHead     = document.getElementById("goalTableHead");
const goalTableBody     = document.getElementById("goalTableBody");
const goalEmptyState    = document.getElementById("goalEmptyState");

// Monthly Fixed Expense refs
const monthlyFixedExpenseUI = document.getElementById("monthlyFixedExpenseUI");
const toggleExpenseEdit    = document.getElementById("toggleExpenseEdit");
const expensePreview       = document.getElementById("expensePreview");
const expenseEdit          = document.getElementById("expenseEdit");
const expensesList         = document.getElementById("expensesList");
const expenseForm          = document.getElementById("expenseForm");
const expenseDynamicFields = document.getElementById("expenseDynamicFields");
const expenseTableHead     = document.getElementById("expenseTableHead");
const expenseTableBody     = document.getElementById("expenseTableBody");
const expenseEmptyState    = document.getElementById("expenseEmptyState");
const bankBarChartCanvas  = document.getElementById("bankBarChart");
const typeBarChartCanvas  = document.getElementById("typeBarChart");
const monthlyIncomeInput  = document.getElementById("monthlyIncomeInput");
const saveMonthlyIncome   = document.getElementById("saveMonthlyIncome");
const displayMonthlyIncome = document.getElementById("displayMonthlyIncome");
const remainingToSpend    = document.getElementById("remainingToSpend");

// Investments refs
const investmentsUI      = document.getElementById("investmentsUI");
const toggleInvestmentEdit = document.getElementById("toggleInvestmentEdit");
const investmentPreview  = document.getElementById("investmentPreview");
const investmentEdit     = document.getElementById("investmentEdit");
const investmentsList    = document.getElementById("investmentsList");
const investmentForm     = document.getElementById("investmentForm");
const investmentDynamicFields = document.getElementById("investmentDynamicFields");
const investmentTableHead = document.getElementById("investmentTableHead");
const investmentTableBody = document.getElementById("investmentTableBody");
const investmentEmptyState = document.getElementById("investmentEmptyState");
const investmentBarChartCanvas = document.getElementById("investmentBarChart");

// Insurances refs
const insurancesUI      = document.getElementById("insurancesUI");
const toggleInsuranceEdit = document.getElementById("toggleInsuranceEdit");
const insurancePreview   = document.getElementById("insurancePreview");
const insuranceEdit      = document.getElementById("insuranceEdit");
const insurancesList     = document.getElementById("insurancesList");
const insuranceForm      = document.getElementById("insuranceForm");
const insuranceDynamicFields = document.getElementById("insuranceDynamicFields");
const insuranceTableHead = document.getElementById("insuranceTableHead");
const insuranceTableBody = document.getElementById("insuranceTableBody");
const insuranceEmptyState = document.getElementById("insuranceEmptyState");

// Cards refs
const cardsUI           = document.getElementById("cardsUI");
const toggleCardEdit    = document.getElementById("toggleCardEdit");
const cardPreview       = document.getElementById("cardPreview");
const cardEdit          = document.getElementById("cardEdit");
const cardsList         = document.getElementById("cardsList");
const cardForm          = document.getElementById("cardForm");
const cardDynamicFields = document.getElementById("cardDynamicFields");
const cardTableHead     = document.getElementById("cardTableHead");
const cardTableBody     = document.getElementById("cardTableBody");
const cardEmptyState    = document.getElementById("cardEmptyState");

// Net Worth refs
const netWorthUI        = document.getElementById("netWorthUI");
const cancelBudgetEdit       = document.getElementById("cancelBudgetEdit");
const cancelGoalEdit         = document.getElementById("cancelGoalEdit");
const cancelExpenseEdit      = document.getElementById("cancelExpenseEdit");
const cancelInvestmentEdit   = document.getElementById("cancelInvestmentEdit");
const cancelInsuranceEdit    = document.getElementById("cancelInsuranceEdit");
const cancelCardEdit         = document.getElementById("cancelCardEdit");
const cancelNetWorthEdit     = document.getElementById("cancelNetWorthEdit");
const cancelTaxPlanEdit      = document.getElementById("cancelTaxPlanEdit");
const cancelGiftsEdit        = document.getElementById("cancelGiftsEdit");
const cancelEmergencyFundEdit = document.getElementById("cancelEmergencyFundEdit");
const toggleNetWorthEdit = document.getElementById("toggleNetWorthEdit");
const currentAgeInput   = document.getElementById("currentAge");
const currentAgeDisplay = document.getElementById("currentAgeDisplay");
const netWorthPreview  = document.getElementById("netWorthPreview");
const netWorthEdit     = document.getElementById("netWorthEdit");
const assetsList       = document.getElementById("assetsList");
const liabilitiesList  = document.getElementById("liabilitiesList");
const netWorthForm     = document.getElementById("netWorthForm");
const netWorthDynamicFields = document.getElementById("netWorthDynamicFields");
const netWorthTableHead = document.getElementById("netWorthTableHead");
const netWorthTableBody = document.getElementById("netWorthTableBody");
const netWorthEmptyState = document.getElementById("netWorthEmptyState");
const netWorthProjectionChartCanvas = document.getElementById("netWorthProjectionChart");

// Tax Plan refs
const taxPlanUI         = document.getElementById("taxPlanUI");
const toggleTaxPlanEdit = document.getElementById("toggleTaxPlanEdit");
const taxRegimeSelect   = document.getElementById("taxRegime");
const financialYearSelect = document.getElementById("financialYear");
const taxPlanPreview   = document.getElementById("taxPlanPreview");
const taxPlanEdit      = document.getElementById("taxPlanEdit");
const taxDeductionsList = document.getElementById("taxDeductionsList");
const taxBreakdown     = document.getElementById("taxBreakdown");
const taxPlanForm      = document.getElementById("taxPlanForm");
const taxPlanDynamicFields = document.getElementById("taxPlanDynamicFields");
const taxPlanTableHead = document.getElementById("taxPlanTableHead");
const taxPlanTableBody = document.getElementById("taxPlanTableBody");
const taxPlanEmptyState = document.getElementById("taxPlanEmptyState");

// Gifts refs
const giftsUI          = document.getElementById("giftsUI");
const toggleGiftsEdit  = document.getElementById("toggleGiftsEdit");
const giftsPreview     = document.getElementById("giftsPreview");
const giftsEdit        = document.getElementById("giftsEdit");
const giftsList        = document.getElementById("giftsList");
const giftsForm        = document.getElementById("giftsForm");
const giftsDynamicFields = document.getElementById("giftsDynamicFields");
const giftsTableHead   = document.getElementById("giftsTableHead");
const giftsTableBody   = document.getElementById("giftsTableBody");
const giftsEmptyState  = document.getElementById("giftsEmptyState");

// Emergency Fund refs
const emergencyFundUI          = document.getElementById("emergencyFundUI");
const toggleEmergencyFundEdit = document.getElementById("toggleEmergencyFundEdit");
const currentEmergencyFundDisplay = document.getElementById("currentEmergencyFundDisplay");
const emergencyFundEdit         = document.getElementById("emergencyFundEdit");
const emergencyFundForm        = document.getElementById("emergencyFundForm");
const emergencyFundDynamicFields = document.getElementById("emergencyFundDynamicFields");

const fieldInputs = {};

// ── App state ─────────────────────────────────────────────────────────────────
let isRegisterMode = false;
let currentUser    = null;
let activeTabId    = "monthlyBudget";
let appData        = { tabData: {}, customTabs: [], userName: "", monthlyBudgetData: {} };
let firestoreUnsub = null;
let saveTimer      = null;
let currentMonth    = new Date(); // For monthly budget navigation
let pieChart       = null; // Chart.js instance
let annualPieChart = null;
let isBudgetEditMode = false;
let isAnnualBudgetView = false;
let isGoalEditMode  = false;
let isExpenseEditMode = false;
let isInvestmentEditMode = false;
let isInsuranceEditMode = false;
let isCardEditMode = false;
let isNetWorthEditMode = false;
let isTaxPlanEditMode = false;
let isGiftsEditMode = false;
let isEmergencyFundEditMode = false;
let bankBarChart   = null;
let typeBarChart   = null;
let investmentBarChart = null;
let netWorthProjectionChart = null;
let localWritePending = false;
let budgetEditSnapshot = null;

// ── Sort/filter state for list views ─────────────────────────────────────────
const listSortFilter = {
    financialGoal: { sortBy: "", sortDir: "asc", filters: {} },
    investments:   { sortBy: "", sortDir: "asc", filters: {} },
    insurances:    { sortBy: "", sortDir: "asc", filters: {} },
    gifts:         { sortBy: "", sortDir: "asc", filters: {} },
};

const editingEntryIds = {
    financialGoal: null,
    monthlyFixedExpense: null,
    investments: null,
    insurances: null,
    cards: null,
    netWorth: null,
    taxPlan: null,
    gifts: null,
    standard: null,
};

const sectionConfig = {
    financialGoal: { prefix: "goal", form: () => goalForm, submitText: "Save Goal", addText: "Add Goal", render: () => renderFinancialGoal() },
    monthlyFixedExpense: { prefix: "expense", form: () => expenseForm, submitText: "Save Expense", addText: "Add Expense", render: () => renderMonthlyFixedExpense() },
    investments: { prefix: "investment", form: () => investmentForm, submitText: "Save Investment", addText: "Add Investment", render: () => renderInvestments() },
    insurances: { prefix: "insurance", form: () => insuranceForm, submitText: "Save Insurance", addText: "Add Insurance", render: () => renderInsurances() },
    cards: { prefix: "card", form: () => cardForm, submitText: "Save Account", addText: "Add Account", render: () => renderCards() },
    netWorth: { prefix: "netWorth", form: () => netWorthForm, submitText: "Save Asset/Liability", addText: "Add Asset/Liability", render: () => renderNetWorth() },
    taxPlan: { prefix: "taxPlan", form: () => taxPlanForm, submitText: "Save Tax Item", addText: "Add Tax Saving Item", render: () => renderTaxPlan() },
    gifts: { prefix: "gifts", form: () => giftsForm, submitText: "Save Gift", addText: "Add Gift", render: () => renderGifts() },
    standard: { prefix: "field", form: () => entryForm, submitText: "Save", addText: "Add", render: () => render() },
};

// ── Firebase handles ──────────────────────────────────────────────────────────
const auth = firebase.auth();
const db   = firebase.firestore();

// ── Auth state listener ───────────────────────────────────────────────────────
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        authScreen.hidden = true;
        appScreen.hidden  = false;
        startListening();
    } else {
        currentUser = null;
        appScreen.hidden  = true;
        authScreen.hidden = false;
        stopListening();
        isRegisterMode = false;
        nameField.hidden = true;
        authNameInput.required = false;
        authNameInput.value = "";
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = "Sign In";
        authToggleBtn.textContent = "Register";
        authSwitchText.textContent = "Don't have an account?";
        setAuthError("");
    }
});

// ── Auth form ─────────────────────────────────────────────────────────────────
authToggleBtn.addEventListener("click", () => {
    isRegisterMode = !isRegisterMode;
    nameField.hidden = !isRegisterMode;
    dobField.hidden = !isRegisterMode;
    authNameInput.required = isRegisterMode;
    if (!isRegisterMode) {
        authNameInput.value = "";
        authDobInput.value = "";
    }
    authSubmitBtn.textContent  = isRegisterMode ? "Create Account"           : "Sign In";
    authToggleBtn.textContent  = isRegisterMode ? "Sign In"                  : "Register";
    authSwitchText.textContent = isRegisterMode ? "Already have an account?" : "Don't have an account?";
    setAuthError("");
});

authForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email    = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    const name     = authNameInput.value.trim();
    const dob      = authDobInput.value;
    if (!email || !password) return;
    if (isRegisterMode && !name) return;
    setAuthError("");
    authSubmitBtn.disabled    = true;
    authSubmitBtn.textContent = "Please wait…";
    try {
        if (isRegisterMode) {
            const cred = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection("users").doc(cred.user.uid).set({
                tabData: {},
                customTabs: [],
                userName: name,
                dateOfBirth: dob,
                monthlyBudgetData: {},
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            await auth.signInWithEmailAndPassword(email, password);
        }
    } catch (err) {
        console.error("Firebase auth error:", err);
        const message = friendlyError(err.code);
        const display = err.code
            ? `${err.code}: ${message}`
            : err.message || message || JSON.stringify(err);
        setAuthError(display);
        authSubmitBtn.disabled    = false;
        authSubmitBtn.textContent = isRegisterMode ? "Create Account" : "Sign In";
    }
});

logoutBtn.addEventListener("click", () => auth.signOut());

// ── Theme Toggle ────────────────────────────────────────────────────────────
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const sunIcon  = themeToggle.querySelector(".sun-icon");
    const moonIcon = themeToggle.querySelector(".moon-icon");
    const label    = document.getElementById("themeLabel");
    if (theme === "light") {
        sunIcon.hidden  = true;
        moonIcon.hidden = false;
        if (label) label.textContent = "Dark Mode";
    } else {
        sunIcon.hidden  = false;
        moonIcon.hidden = true;
        if (label) label.textContent = "Light Mode";
    }
    localStorage.setItem("theme", theme);
    updateFaviconForTheme();
}

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
    render();
});

applyTheme(localStorage.getItem("theme") || "dark");
updateFaviconForTheme();

// ── Settings Panel ──────────────────────────────────────────────────────────
const settingsBtn      = document.getElementById("settingsBtn");
const settingsPanel    = document.getElementById("settingsPanel");
const settingsOverlay  = document.getElementById("settingsOverlay");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const exportDataBtn    = document.getElementById("exportDataBtn");
const importFileInput  = document.getElementById("importFileInput");
const resetDataBtn     = document.getElementById("resetDataBtn");

function openSettings() {
    settingsOverlay.hidden = false;
    settingsPanel.classList.add("open");
    settingsPanel.setAttribute("aria-hidden", "false");
}
function closeSettings() {
    settingsPanel.classList.remove("open");
    settingsPanel.setAttribute("aria-hidden", "true");
    setTimeout(() => { settingsOverlay.hidden = true; }, 280);
}

settingsBtn.addEventListener("click", openSettings);
closeSettingsBtn.addEventListener("click", closeSettings);
settingsOverlay.addEventListener("click", closeSettings);

// Export
exportDataBtn.addEventListener("click", () => {
    if (!currentUser) return;
    const payload = JSON.stringify({ exportDate: new Date().toISOString(), version: "1.0", data: appData }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `smartfin-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

// Import
importFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(ev.target.result);
            const imported = parsed.data || parsed;
            if (typeof imported !== "object" || Array.isArray(imported)) throw new Error("Invalid format");
            if (!window.confirm("This will overwrite your current data with the imported backup. Continue?")) return;
            db.collection("users").doc(currentUser.uid)
                .set(imported)
                .then(() => { alert("Data imported successfully!"); closeSettings(); })
                .catch(err => alert("Import failed: " + err.message));
        } catch (err) {
            alert("Could not read file. Make sure it is a valid SmartFin backup (.json).");
        }
    };
    reader.readAsText(file);
    importFileInput.value = "";
});

// Reset
resetDataBtn.addEventListener("click", () => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure? This will permanently delete ALL your financial data and cannot be undone.")) return;
    if (!window.confirm("Second confirmation: All data will be erased. Proceed?")) return;
    db.collection("users").doc(currentUser.uid)
        .set({ tabData: {}, customTabs: [], userName: appData.userName || "", monthlyBudgetData: {}, fixedMonthlyIncome: 0, currentAge: 0 })
        .then(() => { alert("All data has been reset."); closeSettings(); })
        .catch(err => alert("Reset failed: " + err.message));
});

// ── Tab Menu Toggle ─────────────────────────────────────────────────────────────
tabMenuToggle.addEventListener("click", () => {
    tabList.classList.toggle("open");
});

// Close tab menu when clicking outside on mobile
document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
        if (!tabBar.contains(e.target) && tabList.classList.contains("open")) {
            tabList.classList.remove("open");
        }
    }
});

function setAuthError(msg) {
    authError.textContent = msg;
    authError.hidden = !msg;
}

function friendlyError(code) {
    const map = {
        "auth/user-not-found":         "No account found with this email.",
        "auth/wrong-password":         "Incorrect password. Please try again.",
        "auth/invalid-credential":     "Invalid email or password.",
        "auth/email-already-in-use":   "Email already registered. Please sign in.",
        "auth/invalid-email":          "Please enter a valid email address.",
        "auth/weak-password":          "Password must be at least 6 characters.",
        "auth/operation-not-allowed":  "Email/password sign-in is disabled in Firebase Auth.",
        "auth/invalid-api-key":        "Firebase API key is invalid. Check firebase-config.js.",
        "auth/unauthorized-domain":    "This domain is not authorized for Firebase Auth.",
        "auth/too-many-requests":      "Too many attempts. Try again later.",
        "auth/network-request-failed": "Network error. Check your connection."
    };
    return map[code] || "Something went wrong. Please try again.";
}

// ── Firestore real-time sync ──────────────────────────────────────────────────
function startListening() {
    stopListening();
    firestoreUnsub = db.collection("users").doc(currentUser.uid)
        .onSnapshot(snap => {
            // Skip re-render when this is our own write being echoed back (prevents focus loss)
            if (snap.metadata.hasPendingWrites) return;
            if (localWritePending) { localWritePending = false; return; }

            if (snap.exists) {
                const d = snap.data();
                appData = {
                    tabData: d.tabData || {},
                    customTabs: d.customTabs || [],
                    userName: d.userName || "",
                    monthlyBudgetData: d.monthlyBudgetData || {},
                    fixedMonthlyIncome: d.fixedMonthlyIncome || 0,
                    dateOfBirth: d.dateOfBirth || "",
                    currentAge: d.currentAge || 0,
                };
                userEmailDisplay.textContent = appData.userName || currentUser.email;
            } else {
                appData = { tabData: {}, customTabs: [], userName: "", monthlyBudgetData: {}, fixedMonthlyIncome: 0, dateOfBirth: "", currentAge: 0 };
                userEmailDisplay.textContent = currentUser.email;
            }
            render();
        }, err => console.error("Firestore listen error:", err));
}

function stopListening() {
    if (firestoreUnsub) { firestoreUnsub(); firestoreUnsub = null; }
}

function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 600);
}

function doSave() {
    if (!currentUser) return;
    localWritePending = true;
    db.collection("users").doc(currentUser.uid)
        .set(appData)
        .catch(err => { localWritePending = false; console.error("Save failed:", err); });
}

// ── Tab helpers ───────────────────────────────────────────────────────────────
function getTabs() {
    return DEFAULT_TABS.concat(appData.customTabs || []);
}

function activeEntries() {
    try {
        return (appData.tabData || {})[activeTabId] || [];
    } catch (e) {
        console.error("Error getting active entries:", e);
        return [];
    }
}

function setActiveEntries(entries) {
    try {
        if (!appData.tabData) appData.tabData = {};
        appData.tabData[activeTabId] = entries || [];
        scheduleSave();
    } catch (e) {
        console.error("Error setting active entries:", e);
    }
}

// ── Dependency helpers ────────────────────────────────────────────────────────
function getCardEntries() {
    return (appData.tabData || {}).cards || [];
}

function hasAnyAccount() {
    return getCardEntries().length > 0;
}

function buildDependencyNotice(message, jumpTabId) {
    return `<div class="dependency-notice">
        <span class="dependency-notice-icon">ℹ️</span>
        <span class="dependency-notice-text">${message}</span>
        <button type="button" class="dependency-notice-btn" onclick="switchToTab('${jumpTabId}')">Go to Accounts →</button>
    </div>`;
}

function switchToTab(tabId) {
    activeTabId = tabId;
    if (searchInput) searchInput.value = "";
    render();
}

// ── Sort/Filter toolbar helpers ───────────────────────────────────────────────
function buildSortFilterToolbar(tabId) {
    const fields = TAB_FIELDS[tabId] || [];
    const state = listSortFilter[tabId];
    const selectFields = fields.filter(f => f.type === "select");

    const sortOpts = `<option value="">None</option>` +
        fields.map(f => `<option value="${f.id}"${state.sortBy === f.id ? " selected" : ""}>${f.label}</option>`).join("");

    const filtersHtml = selectFields.map(f => {
        const val = state.filters[f.id] || "";
        const optHtml = f.options.map(o => `<option value="${o}"${val === o ? " selected" : ""}>${o}</option>`).join("");
        return `<div class="toolbar-filter-item">
            <label>${f.label}</label>
            <select class="toolbar-filter-select" data-tab="${tabId}" data-field="${f.id}">
                <option value="">All</option>
                ${optHtml}
            </select>
        </div>`;
    }).join("");

    const divider = selectFields.length > 0 ? `<div class="list-toolbar-divider"></div>` : "";
    const filterBlock = selectFields.length > 0
        ? `<div class="list-toolbar-filters">${filtersHtml}</div>`
        : "";

    return `<div class="list-toolbar">
        <div class="list-toolbar-sort">
            <label>Sort by</label>
            <select class="toolbar-sort-select" data-tab="${tabId}">${sortOpts}</select>
            <button type="button" class="toolbar-sort-dir" data-tab="${tabId}">${state.sortDir === "asc" ? "↑ Asc" : "↓ Desc"}</button>
        </div>
        ${divider}${filterBlock}
    </div>`;
}

function applyListSortFilter(tabId, entries) {
    const state = listSortFilter[tabId];
    const fields = TAB_FIELDS[tabId] || [];
    let result = [...entries];

    Object.entries(state.filters).forEach(([fieldId, val]) => {
        if (val) result = result.filter(e => (e[fieldId] || "") === val);
    });

    if (state.sortBy) {
        const field = fields.find(f => f.id === state.sortBy);
        result.sort((a, b) => {
            let av = a[state.sortBy] != null ? a[state.sortBy] : "";
            let bv = b[state.sortBy] != null ? b[state.sortBy] : "";
            if (field && field.type === "number") {
                av = Number(av); bv = Number(bv);
                return state.sortDir === "asc" ? av - bv : bv - av;
            }
            av = String(av).toLowerCase();
            bv = String(bv).toLowerCase();
            if (av < bv) return state.sortDir === "asc" ? -1 : 1;
            if (av > bv) return state.sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }
    return result;
}

// ── Formatting ────────────────────────────────────────────────────────────────
function calcDurationFromToday(endDate) {
    if (!endDate) return "—";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    if (end < today) return "Ended";
    let years  = end.getFullYear() - today.getFullYear();
    let months = end.getMonth()    - today.getMonth();
    let days   = end.getDate()     - today.getDate();
    if (days < 0) {
        months--;
        const lastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        days += lastDay;
    }
    if (months < 0) { years--; months += 12; }
    const parts = [];
    if (years  > 0) parts.push(`${years} Year${years   > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
    if (days   > 0) parts.push(`${days} Day${days     > 1 ? "s" : ""}`);
    return parts.length ? parts.join(", ") : "< 1 Day";
}

function calculateAgeFromDob(dob) {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function formatMoney(v) {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(v || 0);
    } catch (e) {
        console.error("Error formatting money:", e);
        return "₹0";
    }
}

function esc(s) {
    return String(s)
        .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getSectionEntries(tabId) {
    if (tabId === "standard") return activeEntries();
    return ((appData.tabData || {})[tabId] || []);
}

function setSectionEntries(tabId, entries) {
    if (tabId === "standard") {
        setActiveEntries(entries);
        return;
    }
    if (!appData.tabData) appData.tabData = {};
    appData.tabData[tabId] = entries || [];
    scheduleSave();
}

function getSectionSubmitButton(tabId) {
    const cfg = sectionConfig[tabId];
    return cfg?.form()?.querySelector("button[type='submit']") || null;
}

function updateSectionSubmitButton(tabId) {
    const btn = getSectionSubmitButton(tabId);
    if (!btn) return;
    const cfg = sectionConfig[tabId] || {};
    btn.textContent = editingEntryIds[tabId] ? (cfg.submitText || "Save") : (cfg.addText || "Add");
}

function clearEditing(tabId) {
    editingEntryIds[tabId] = null;
    updateSectionSubmitButton(tabId);
}

function readSectionFormEntry(tabId) {
    const cfg = sectionConfig[tabId];
    const fields = TAB_FIELDS[tabId === "standard" ? activeTabId : tabId] || TAB_FIELDS.monthlyBudget;
    const entry = { id: editingEntryIds[tabId] || String(Date.now()) };

    fields.forEach(f => {
        const input = document.getElementById(`${cfg.prefix}_${f.id}`);
        if (!input) return;
        if (f.type === "number") {
            entry[f.id] = input.value === "" ? "" : Number(input.value || 0);
        } else {
            entry[f.id] = input.value.trim();
        }
    });

    return normalizeEntry(tabId, entry);
}

function populateSectionForm(tabId, entry) {
    const cfg = sectionConfig[tabId];
    const fields = TAB_FIELDS[tabId === "standard" ? activeTabId : tabId] || TAB_FIELDS.monthlyBudget;
    fields.forEach(f => {
        const input = document.getElementById(`${cfg.prefix}_${f.id}`);
        if (!input) return;
        input.value = entry[f.id] ?? "";
        input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    if (tabId === "cards") {
        document.getElementById("card_isPrimary")?.dispatchEvent(new Event("change", { bubbles: true }));
    }
    updateSectionSubmitButton(tabId);
}

function beginEditEntry(tabId, id) {
    const entry = getSectionEntries(tabId).find(i => i.id === id);
    if (!entry) return;
    editingEntryIds[tabId] = id;
    const cfg = sectionConfig[tabId];
    cfg.render();
    populateSectionForm(tabId, entry);
    cfg.form()?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function upsertSectionEntry(tabId, entry) {
    const entries = getSectionEntries(tabId);
    const editId = editingEntryIds[tabId];
    if (editId) {
        setSectionEntries(tabId, entries.map(item => item.id === editId ? { ...item, ...entry, id: editId } : item));
    } else {
        setSectionEntries(tabId, [entry, ...entries]);
    }
    clearEditing(tabId);
}

function resetSectionForm(tabId) {
    const cfg = sectionConfig[tabId];
    cfg.form()?.reset();
    updateSectionSubmitButton(tabId);
}

function renderRowActions(id) {
    return `<button class="edit-row" type="button" data-id="${id}">Edit</button><button class="delete-row" type="button" data-id="${id}">Delete</button>`;
}

function handleTableAction(tabId, e) {
    const editBtn = e.target.closest(".edit-row");
    if (editBtn) {
        beginEditEntry(tabId, editBtn.dataset.id);
        return;
    }
    const deleteBtn = e.target.closest(".delete-row");
    if (deleteBtn) deleteEntry(deleteBtn.dataset.id);
}

function normalizeGoalStatus(goal) {
    const needed = Number(goal.amountNeeded || 0);
    const accumulated = Number(goal.amountAccumulated || 0);
    if (needed > 0 && accumulated >= needed) return "Achieved";
    if (goal.targetDate) {
        const target = new Date(goal.targetDate);
        target.setHours(23, 59, 59, 999);
        if (target < new Date()) return "Missed";
    }
    return accumulated > 0 ? "Ongoing" : "Planned";
}

function monthsBetween(startDate, endDate = new Date()) {
    if (!startDate) return 0;
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime()) || start > endDate) return 0;
    return Math.max(0, (endDate.getFullYear() - start.getFullYear()) * 12 + (endDate.getMonth() - start.getMonth()));
}

function getInvestmentCurrentValue(inv) {
    const initial = Number(inv.initialInvestment || 0);
    const manualTotal = inv.totalAmount === "" || inv.totalAmount == null ? 0 : Number(inv.totalAmount || 0);
    const base = Math.max(initial, manualTotal || initial);
    const annualRate = Number(inv.annualInterestRate || 0) / 100;
    const years = monthsBetween(inv.startDate) / 12;
    if (base <= 0 || annualRate <= 0 || years <= 0) return base;
    return base * Math.pow(1 + annualRate, years);
}

function getInsuranceAnnualPremium(insurance) {
    const premium = Number(insurance.premium || 0);
    const freq = insurance.premiumFrequency || "Annual";
    if (freq === "Monthly") return premium * 12;
    if (freq === "Semi-Annual") return premium * 2;
    return premium;
}

function getDateProgress(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
    return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
}

function normalizeEntry(tabId, entry) {
    if (tabId === "financialGoal") {
        entry.status = normalizeGoalStatus(entry);
    }
    if (tabId === "investments") {
        if (entry.totalAmount === "" || Number(entry.totalAmount || 0) <= 0) {
            entry.totalAmount = Number(entry.initialInvestment || 0);
        }
    }
    if (tabId === "cards" && entry.isPrimary === "Yes") {
        entry.purpose = "Expenditure";
    }
    return entry;
}

function isCurrentOrFutureMonth(monthKey) {
    return monthKey >= getMonthKey(new Date());
}

function buildMonthlyAutoValues(monthKey) {
    const values = { inflow: {}, outflow: {}, investing: {} };
    const breakdown = { inflow: {}, outflow: {}, investing: {} };
    const liabilities = (appData.tabData || {}).monthlyFixedExpense || [];
    liabilities.forEach(item => {
        const amount = Number(item.amount || 0);
        if (amount <= 0) return;
        if (item.endDate && monthKey > item.endDate.slice(0, 7)) return;
        const freq = item.frequency || "Monthly";
        if (freq !== "Monthly") return;
        if (item.type === "Liability") {
            values.outflow.loanEMI = (values.outflow.loanEMI || 0) + amount;
            if (!breakdown.outflow.loanEMI) breakdown.outflow.loanEMI = [];
            breakdown.outflow.loanEMI.push({ name: item.name, amount, source: "Liabilities" });
        }
    });

    const investments = (appData.tabData || {}).investments || [];
    investments.forEach(inv => {
        const amount = Number(inv.initialInvestment || 0);
        if (amount <= 0) return;
        if (inv.startDate && monthKey < inv.startDate.slice(0, 7)) return;
        if (inv.maturityDate && monthKey > inv.maturityDate.slice(0, 7)) return;
        if (inv.frequency === "Annually" && (!inv.startDate || monthKey.slice(5) === inv.startDate.slice(5, 7))) {
            values.investing.onetimeInvestment = (values.investing.onetimeInvestment || 0) + amount;
        }
        if (inv.frequency === "One-Time" && inv.startDate && monthKey === inv.startDate.slice(0, 7)) {
            values.investing.onetimeInvestment = (values.investing.onetimeInvestment || 0) + amount;
        }
    });

    // NOTE: Credit card outstanding is NOT auto-carried (user manages it manually per month)
    // It was removed from auto-values to keep the field editable

    return { values, breakdown };
}

function applyMonthlyAutoValues(monthKey, monthData) {
    monthData.autoLinkedFields = monthData.autoLinkedFields || {};
    monthData.autoLinkedBreakdown = monthData.autoLinkedBreakdown || {};
    if (!isCurrentOrFutureMonth(monthKey)) return monthData.autoLinkedFields;
    Object.keys(monthData.autoLinkedFields).forEach(key => {
        const [category, fieldId] = key.split(".");
        if (monthData[category]) monthData[category][fieldId] = 0;
        delete monthData.autoLinkedFields[key];
        delete monthData.autoLinkedBreakdown[key];
    });
    const { values, breakdown } = buildMonthlyAutoValues(monthKey);
    Object.entries(values).forEach(([category, fieldValues]) => {
        if (!monthData[category]) monthData[category] = {};
        Object.entries(fieldValues).forEach(([fieldId, value]) => {
            monthData[category][fieldId] = value;
            monthData.autoLinkedFields[`${category}.${fieldId}`] = true;
            monthData.autoLinkedBreakdown[`${category}.${fieldId}`] = breakdown[category][fieldId] || [];
        });
    });
    return monthData.autoLinkedFields;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
    const tab = getTabs().find(t => t.id === activeTabId) || DEFAULT_TABS[0];
    activeSubtitle.textContent = tab.label;
    renderTabs();
    
    // Show/hide specific UIs vs Standard UI
    if (activeTabId === "monthlyBudget") {
        monthlyBudgetUI.hidden = false;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderMonthlyBudget();
    } else if (activeTabId === "financialGoal") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = false;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderFinancialGoal();
    } else if (activeTabId === "monthlyFixedExpense") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = false;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderMonthlyFixedExpense();
    } else if (activeTabId === "investments") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = false;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderInvestments();
    } else if (activeTabId === "insurances") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = false;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderInsurances();
    } else if (activeTabId === "cards") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = false;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderCards();
    } else if (activeTabId === "netWorth") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = false;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderNetWorth();
    } else if (activeTabId === "taxPlan") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = false;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderTaxPlan();
    } else if (activeTabId === "gifts") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = false;
        emergencyFundUI.hidden = true;
        renderGifts();
    } else if (activeTabId === "emergencyFund") {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = true;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = false;
        renderEmergencyFund();
    } else {
        monthlyBudgetUI.hidden = true;
        standardUI.hidden = false;
        financialGoalUI.hidden = true;
        monthlyFixedExpenseUI.hidden = true;
        investmentsUI.hidden = true;
        insurancesUI.hidden = true;
        cardsUI.hidden = true;
        netWorthUI.hidden = true;
        taxPlanUI.hidden = true;
        giftsUI.hidden = true;
        emergencyFundUI.hidden = true;
        renderDynamicFields();
        updateSectionSubmitButton("standard");
        const entries = activeEntries();
        renderTableHead();
        renderRows(entries);
    }
}

function renderMonthlyBudget() {
    // Handle annual view toggle
    if (isAnnualBudgetView) {
        annualSummarySection.hidden = false;
        monthlyViewSection.hidden = true;
        calculateAnnualSummary();
        return;
    } else {
        annualSummarySection.hidden = true;
        monthlyViewSection.hidden = false;
        if (annualPieChart) { annualPieChart.destroy(); annualPieChart = null; }
    }

    const monthKey = getMonthKey(currentMonth);
    currentMonthDisplay.textContent = currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    
    // Get or create month data with safe defaults
    if (!appData.monthlyBudgetData) appData.monthlyBudgetData = {};
    const monthData = appData.monthlyBudgetData[monthKey] || {
        inflow: {},
        outflow: {},
        investing: {},
        monthEndBalance: 0
    };
    appData.monthlyBudgetData[monthKey] = monthData;
    const autoLinkedFields = applyMonthlyAutoValues(monthKey, monthData);
    
    // Update toggle button text
    toggleBudgetEdit.textContent = isBudgetEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isBudgetEditMode) {
        budgetPreview.hidden = true;
        budgetEdit.hidden = false;
        
        // Render category fields in edit mode
        renderCategoryFields(inflowFields, MONTHLY_BUDGET_CATEGORIES.inflow, monthData.inflow, autoLinkedFields, monthData.autoLinkedBreakdown);
        renderCategoryFields(outflowFields, MONTHLY_BUDGET_CATEGORIES.outflow, monthData.outflow, autoLinkedFields, monthData.autoLinkedBreakdown);
        renderCategoryFields(investingFields, MONTHLY_BUDGET_CATEGORIES.investing, monthData.investing, autoLinkedFields, monthData.autoLinkedBreakdown);
        // monthEndBalance removed – primary account balance is used instead
        
        // Update edit mode totals
        const inflowTotal = Object.values(monthData.inflow).reduce((s, v) => s + Number(v || 0), 0);
        const outflowTotal = Object.values(monthData.outflow).reduce((s, v) => s + Number(v || 0), 0);
        const investingTotal = Object.values(monthData.investing).reduce((s, v) => s + Number(v || 0), 0);
        document.getElementById("inflowTotalEdit").textContent = formatMoney(inflowTotal);
        document.getElementById("outflowTotalEdit").textContent = formatMoney(outflowTotal);
        document.getElementById("investingTotalEdit").textContent = formatMoney(investingTotal);
    } else {
        budgetPreview.hidden = false;
        budgetEdit.hidden = true;
        
        // Render preview mode
        renderCategoryPreview(inflowPreview, MONTHLY_BUDGET_CATEGORIES.inflow, monthData.inflow);
        renderCategoryPreview(outflowPreview, MONTHLY_BUDGET_CATEGORIES.outflow, monthData.outflow);
        renderCategoryPreview(investingPreview, MONTHLY_BUDGET_CATEGORIES.investing, monthData.investing);
        const investingTotalVal = Object.values(monthData.investing || {}).reduce((s, v) => s + Number(v || 0), 0);
        const investingSection = document.getElementById("investingPreviewSection");
        if (investingSection) investingSection.hidden = (investingTotalVal === 0);

        // Calculate and display totals
        calculateAndDisplaySummary(monthData);
        
        // Render pie chart
        renderPieChart(monthData);
    }
}

function renderCategoryPreview(container, fields, data) {
    container.innerHTML = "";
    fields.forEach(field => {
        const value = Number(data[field.id] || 0);
        if (value > 0) {
            const item = document.createElement("div");
            item.className = "category-preview-item";
            item.innerHTML = `
                <span class="label">${field.label}</span>
                <span class="value">${formatMoney(value)}</span>
            `;
            container.appendChild(item);
        }
    });
    
    if (container.children.length === 0) {
        container.innerHTML = `<div class="category-preview-item" style="color: var(--dim);">No entries</div>`;
    }
}

function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getFinancialYearStartYear(date = currentMonth) {
    return date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
}

function getFinancialYearLabel(startYear) {
    return `FY ${startYear}-${String(startYear + 1).slice(-2)}`;
}

function getFinancialYearMonthKeys(startYear) {
    return Array.from({ length: 12 }, (_, idx) => {
        const d = new Date(startYear, 3 + idx, 1);
        return getMonthKey(d);
    });
}

function getMonthlyDistribution(monthData) {
    const inflowTotal = Object.values(monthData.inflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const investingTotal = Object.values(monthData.investing || {}).reduce((s, v) => s + Number(v || 0), 0);
    const outflowTotal = Object.values(monthData.outflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const loanEMI = Number(monthData.outflow?.loanEMI || 0);
    const debtRepayment = Number(monthData.outflow?.debtRepayment || 0);
    const saving = Number(monthData.investing?.onetimeSaving || 0);
    const investment = Number(monthData.investing?.onetimeInvestment || 0);
    const liability = loanEMI + debtRepayment;
    const expenditure = Number(monthData.outflow?.utilityBills || 0)
        + Number(monthData.outflow?.familyExpenditure || 0)
        + Number(monthData.outflow?.miscExpenses || 0)
        + Number(monthData.outflow?.creditCardOutstanding || 0)
        + Number(monthData.investing?.ondemandExpenditure || 0)
        + Number(monthData.investing?.ondemandLiability || 0);
    const knownOutflow = liability + expenditure;
    const other = Math.max(0, outflowTotal - knownOutflow);

    return {
        income: inflowTotal,
        expenditure,
        saving,
        investment,
        liability,
        other,
    };
}

function renderFinancialGoal() {
    const entries = activeEntries();
    
    // Update toggle button text
    toggleGoalEdit.textContent = isGoalEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isGoalEditMode) {
        goalPreview.hidden = true;
        goalEdit.hidden = false;
        
        // Render form fields
        renderGoalDynamicFields();
        updateSectionSubmitButton("financialGoal");
        
        // Render table
        renderGoalTable(entries);
    } else {
        goalPreview.hidden = false;
        goalEdit.hidden = true;
        
        // Render preview cards
        renderGoalPreviewCards(entries);
        
        // Calculate and display summary
        calculateGoalSummary(entries);
    }
}

function renderGoalDynamicFields() {
    goalDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.financialGoal || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `goal_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        goalDynamicFields.appendChild(div);
    });

    const syncStatus = () => {
        const status = document.getElementById("goal_status");
        if (!status) return;
        status.value = normalizeGoalStatus({
            amountNeeded: document.getElementById("goal_amountNeeded")?.value,
            amountAccumulated: document.getElementById("goal_amountAccumulated")?.value,
            targetDate: document.getElementById("goal_targetDate")?.value,
        });
    };
    ["goal_amountNeeded", "goal_amountAccumulated", "goal_targetDate"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener("input", syncStatus);
        if (input) input.addEventListener("change", syncStatus);
    });
    syncStatus();
}

function renderGoalTable(entries) {
    const fields = TAB_FIELDS.financialGoal || TAB_FIELDS.monthlyBudget;
    
    goalTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    goalTableHead.appendChild(tr);
    
    goalTableBody.innerHTML = "";
    goalEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        goalTableBody.appendChild(row);
    });
}

function renderGoalPreviewCards(entries) {
    const toolbarEl = document.getElementById("goalSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("financialGoal");

    const displayEntries = applyListSortFilter("financialGoal", entries);
    goalsList.innerHTML = "";

    if (displayEntries.length === 0) {
        goalsList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No goals yet. Click Edit to add goals.</div>`
            : `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No results match the current filters.</div>`;
        return;
    }

    displayEntries.forEach(goal => {
        const card = document.createElement("div");
        card.className = "goal-card";
        
        const amountNeeded = Number(goal.amountNeeded || 0);
        const amountAccumulated = Number(goal.amountAccumulated || 0);
        const progress = amountNeeded > 0 ? (amountAccumulated / amountNeeded) * 100 : 0;
        const progressClamped = Math.min(progress, 100);
        const status = normalizeGoalStatus(goal);
        const statusClass = status.toLowerCase();
        
        card.innerHTML = `
            <div class="goal-card-header">
                <span class="goal-card-title">${esc(goal.name)}</span>
                <div style="display: flex; gap: 8px;">
                    <span class="goal-card-type">${esc(goal.goalType || "Short Term")}</span>
                    <span class="goal-card-status ${statusClass}">${esc(status)}</span>
                </div>
            </div>
            <div class="goal-card-details">
                ${esc(goal.details || "No details")}<br>
                Target: ${esc(goal.targetDate || "—")}
            </div>
            <div class="goal-card-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill ${statusClass}" style="width: ${progressClamped}%"></div>
                </div>
                <div class="goal-progress-text">
                    <span>${formatMoney(amountAccumulated)} / ${formatMoney(amountNeeded)}</span>
                    <span>${progress.toFixed(1)}%</span>
                </div>
            </div>
        `;
        
        goalsList.appendChild(card);
    });
}

function calculateGoalSummary(entries) {
    const totalNeeded = entries.reduce((s, g) => s + Number(g.amountNeeded || 0), 0);
    const totalAccumulated = entries.reduce((s, g) => s + Number(g.amountAccumulated || 0), 0);
    const amountMoreNeeded = Math.max(0, totalNeeded - totalAccumulated);
    
    document.getElementById("totalGoalNeeded").textContent = formatMoney(totalNeeded);
    document.getElementById("totalGoalAccumulated").textContent = formatMoney(totalAccumulated);
    document.getElementById("amountMoreNeeded").textContent = formatMoney(amountMoreNeeded);
}

function renderMonthlyFixedExpense() {
    const entries = activeEntries();
    const liabNotice = document.getElementById("liabilitiesDependencyNotice");
    if (liabNotice) {
        liabNotice.innerHTML = hasAnyAccount() ? "" :
            buildDependencyNotice("No accounts set up yet. Set up your accounts first before adding liabilities.", "cards");
    }

    // Update toggle button text
    toggleExpenseEdit.textContent = isExpenseEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isExpenseEditMode) {
        expensePreview.hidden = true;
        expenseEdit.hidden = false;
        
        // Render form fields
        renderExpenseDynamicFields();
        updateSectionSubmitButton("monthlyFixedExpense");
        
        // Render table
        renderExpenseTable(entries);
    } else {
        expensePreview.hidden = false;
        expenseEdit.hidden = true;
        
        // Render preview cards
        renderExpensePreviewCards(entries);
        
        // Calculate and display summary
        calculateExpenseSummary(entries);
        
        // Render bar charts
        renderExpenseCharts(entries);
    }
}

function renderExpenseDynamicFields() {
    expenseDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.monthlyFixedExpense || TAB_FIELDS.monthlyBudget;
    const activeAccounts = getCardEntries().filter(c => c.accountPresent === "Yes");

    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";

        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);

        let input;

        if (field.id === "bankName") {
            if (activeAccounts.length === 0) {
                const notice = document.createElement("p");
                notice.style.cssText = "font-size:0.82rem;color:#eab308;margin:4px 0 0;";
                notice.innerHTML = `No active accounts found. <button type="button" class="dependency-notice-btn" style="font-size:0.78rem;padding:3px 8px;" onclick="switchToTab('cards')">Set up Accounts →</button>`;
                div.appendChild(notice);
                input = document.createElement("input");
                input.type = "hidden";
            } else {
                input = document.createElement("select");
                const blank = document.createElement("option");
                blank.value = "";
                blank.textContent = "— Select Account —";
                input.appendChild(blank);
                activeAccounts.forEach(acct => {
                    const opt = document.createElement("option");
                    opt.value = acct.bankName;
                    opt.textContent = acct.bankName;
                    input.appendChild(opt);
                });
            }
        } else if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") { input.min = "0"; input.step = "1"; }
        }

        input.id = `expense_${field.id}`;
        if (field.required && field.id !== "bankName") input.required = true;
        div.appendChild(input);

        expenseDynamicFields.appendChild(div);
    });
}

function renderExpenseTable(entries) {
    const fields = TAB_FIELDS.monthlyFixedExpense || TAB_FIELDS.monthlyBudget;

    expenseTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const durationTh = document.createElement("th");
    durationTh.textContent = "Duration";
    tr.appendChild(durationTh);
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    expenseTableHead.appendChild(tr);

    expenseTableBody.innerHTML = "";
    expenseEmptyState.classList.toggle("visible", entries.length === 0);

    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const durationTd = document.createElement("td");
        durationTd.textContent = calcDurationFromToday(item.endDate);
        row.appendChild(durationTd);
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        expenseTableBody.appendChild(row);
    });
}

function renderExpensePreviewCards(entries) {
    expensesList.innerHTML = "";
    
    if (entries.length === 0) {
        expensesList.innerHTML = `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No expenses yet. Click Edit to add expenses.</div>`;
        return;
    }
    
    entries.forEach(expense => {
        const card = document.createElement("div");
        card.className = "expense-card";
        
        const typeLower = expense.type?.toLowerCase() || "expenditure";
        const typeClass = typeLower.replace(/\s+/g, "");
        
        card.innerHTML = `
            <div class="expense-card-info">
                <div class="expense-card-title">${esc(expense.name)}</div>
                <div class="expense-card-details">
                    <span class="expense-card-type ${typeClass}">${esc(expense.type || "Expenditure")}</span>
                    <span style="color:var(--muted);font-size:0.75rem;">${esc(expense.frequency || "Monthly")}</span><br>
                    Bank: ${esc(expense.bankName || "—")}<br>
                    End Date: ${esc(expense.endDate || "—")}<br>
                    Duration: ${calcDurationFromToday(expense.endDate)}
                </div>
            </div>
            <div class="expense-card-amount">${formatMoney(Number(expense.amount || 0))}</div>
        `;
        
        expensesList.appendChild(card);
    });
}

function calculateExpenseSummary(entries) {
    const total   = entries.reduce((s, e) => s + Number(e.amount || 0), 0);
    const income  = Number(appData.fixedMonthlyIncome || 0);
    const remaining = income - total;

    document.getElementById("totalExpenseDeductions").textContent = formatMoney(total);
    displayMonthlyIncome.textContent = formatMoney(income);

    remainingToSpend.textContent = formatMoney(remaining);
    remainingToSpend.className = "remaining-amount " + (remaining >= 0 ? "positive" : "negative");
}

function renderExpenseCharts(entries) {
    // Destroy existing charts
    if (bankBarChart) { bankBarChart.destroy(); bankBarChart = null; }
    if (typeBarChart) { typeBarChart.destroy(); typeBarChart = null; }
    
    if (entries.length === 0) return;
    
    // Prepare data for Bank chart
    const bankData = {};
    entries.forEach(e => {
        const bank = e.bankName || "Unknown";
        bankData[bank] = (bankData[bank] || 0) + Number(e.amount || 0);
    });
    
    const bankLabels = Object.keys(bankData);
    const bankValues = Object.values(bankData);
    
    // Bank bar chart
    const bankCtx = bankBarChartCanvas.getContext("2d");
    bankBarChart = new Chart(bankCtx, {
        type: "bar",
        data: {
            labels: bankLabels,
            datasets: [{
                label: "Amount (₹)",
                data: bankValues,
                backgroundColor: getChartThemeColors().bar,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                },
                y: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                }
            }
        }
    });
    
    // Prepare data for Type chart with color codes
    const typeData = {
        "Insurance": { amount: 0, color: "#a855f7" },
        "Investment": { amount: 0, color: "#3b82f6" },
        "Saving": { amount: 0, color: "#22c55e" },
        "Liability": { amount: 0, color: "#f97316" },
        "Expenditure": { amount: 0, color: "#f97316" }
    };
    
    entries.forEach(e => {
        const type = e.type || "Expenditure";
        if (typeData[type]) {
            typeData[type].amount += Number(e.amount || 0);
        }
    });
    
    const typeLabels = Object.keys(typeData);
    const typeValues = typeLabels.map(t => typeData[t].amount);
    const typeColors = typeLabels.map(t => typeData[t].color);
    
    // Type bar chart
    const typeCtx = typeBarChartCanvas.getContext("2d");
    typeBarChart = new Chart(typeCtx, {
        type: "bar",
        data: {
            labels: typeLabels,
            datasets: [{
                label: "Amount (₹)",
                data: typeValues,
                backgroundColor: typeColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                },
                y: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                }
            }
        }
    });
}

function renderInvestments() {
    const entries = activeEntries();
    const invNotice = document.getElementById("investmentsDependencyNotice");
    if (invNotice) {
        invNotice.innerHTML = hasAnyAccount() ? "" :
            buildDependencyNotice("No accounts set up yet. Set up your accounts first before adding investments.", "cards");
    }

    // Update toggle button text
    toggleInvestmentEdit.textContent = isInvestmentEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isInvestmentEditMode) {
        investmentPreview.hidden = true;
        investmentEdit.hidden = false;
        
        // Render form fields
        renderInvestmentDynamicFields();
        updateSectionSubmitButton("investments");
        
        // Render table
        renderInvestmentTable(entries);
    } else {
        investmentPreview.hidden = false;
        investmentEdit.hidden = true;
        
        // Render preview cards
        renderInvestmentPreviewCards(entries);
        
        // Calculate and display summary
        calculateInvestmentSummary(entries);
        
        // Render bar chart
        renderInvestmentChart(entries);
    }
}

function renderInvestmentDynamicFields() {
    investmentDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.investments || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `investment_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        investmentDynamicFields.appendChild(div);
    });
}

function renderInvestmentTable(entries) {
    const fields = TAB_FIELDS.investments || TAB_FIELDS.monthlyBudget;
    
    investmentTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    investmentTableHead.appendChild(tr);
    
    investmentTableBody.innerHTML = "";
    investmentEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        investmentTableBody.appendChild(row);
    });
}

function renderInvestmentPreviewCards(entries) {
    const toolbarEl = document.getElementById("investmentSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("investments");

    const displayEntries = applyListSortFilter("investments", entries);
    investmentsList.innerHTML = "";

    if (displayEntries.length === 0) {
        investmentsList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No investments yet. Click Edit to add investments.</div>`
            : `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No results match the current filters.</div>`;
        return;
    }

    displayEntries.forEach(investment => {
        const card = document.createElement("div");
        card.className = "investment-card";
        const currentValue = getInvestmentCurrentValue(investment);
        
        card.innerHTML = `
            <div class="investment-card-info">
                <div class="investment-card-title">${esc(investment.name)}</div>
                <div class="investment-card-details">
                    <span class="investment-card-frequency">${esc(investment.frequency || "One-Time")}</span>
                    Initial: ${formatMoney(Number(investment.initialInvestment || 0))}<br>
                    Amount So Far: ${formatMoney(Number(investment.totalAmount || 0))}<br>
                    Net Worth Today: ${formatMoney(currentValue)}<br>
                    Interest: ${Number(investment.annualInterestRate || 0)}% p.a.<br>
                    Start: ${esc(investment.startDate || "—")}<br>
                    Maturity: ${esc(investment.maturityDate || "—")}<br>
                    ${esc(investment.details || "")}
                </div>
            </div>
            <div class="investment-card-amount">${formatMoney(currentValue)}</div>
        `;
        
        investmentsList.appendChild(card);
    });
}

function calculateInvestmentSummary(entries) {
    const totalInitial = entries.reduce((s, i) => s + Number(i.initialInvestment || 0), 0);
    const totalCurrent = entries.reduce((s, i) => s + getInvestmentCurrentValue(i), 0);
    const totalInvestments = entries.length;
    
    document.getElementById("totalInitialInvestment").textContent = formatMoney(totalInitial);
    document.getElementById("totalCurrentInvestment").textContent = formatMoney(totalCurrent);
    document.getElementById("totalInvestments").textContent = totalInvestments;
}

function renderInvestmentChart(entries) {
    // Destroy existing chart
    if (investmentBarChart) investmentBarChart.destroy();
    
    if (entries.length === 0) return;
    
    const labels = entries.map(e => e.name || "Unnamed");
    const values = entries.map(e => getInvestmentCurrentValue(e));
    
    const ctx = investmentBarChartCanvas.getContext("2d");
    investmentBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Amount (₹)",
                data: values,
                backgroundColor: getChartThemeColors().bar,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                },
                y: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                }
            }
        }
    });
}

function renderInsurances() {
    const entries = activeEntries();
    
    // Update toggle button text
    toggleInsuranceEdit.textContent = isInsuranceEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isInsuranceEditMode) {
        insurancePreview.hidden = true;
        insuranceEdit.hidden = false;
        
        // Render form fields
        renderInsuranceDynamicFields();
        updateSectionSubmitButton("insurances");
        
        // Render table
        renderInsuranceTable(entries);
    } else {
        insurancePreview.hidden = false;
        insuranceEdit.hidden = true;
        
        // Render preview cards
        renderInsurancePreviewCards(entries);
        
        // Calculate and display summary
        calculateInsuranceSummary(entries);
    }
}

function renderInsuranceDynamicFields() {
    insuranceDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.insurances || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `insurance_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        insuranceDynamicFields.appendChild(div);
    });
}

function renderInsuranceTable(entries) {
    const fields = TAB_FIELDS.insurances || TAB_FIELDS.monthlyBudget;
    
    insuranceTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    insuranceTableHead.appendChild(tr);
    
    insuranceTableBody.innerHTML = "";
    insuranceEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        insuranceTableBody.appendChild(row);
    });
}

function renderInsurancePreviewCards(entries) {
    const toolbarEl = document.getElementById("insuranceSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("insurances");

    const displayEntries = applyListSortFilter("insurances", entries);
    insurancesList.innerHTML = "";

    if (displayEntries.length === 0) {
        insurancesList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No insurances yet. Click Edit to add insurances.</div>`
            : `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No results match the current filters.</div>`;
        return;
    }

    displayEntries.forEach(insurance => {
        const card = document.createElement("div");
        card.className = "insurance-card";
        
        const nirClass = insurance.nirLinked?.toLowerCase() === "yes" ? "yes" : "no";
        const maturityProgress = getDateProgress(insurance.startDate, insurance.maturityDate);
        
        card.innerHTML = `
            <div class="insurance-card-info">
                <div class="insurance-card-title">${esc(insurance.name)}</div>
                <div class="insurance-card-details">
                    <span class="insurance-card-nir ${nirClass}">NIR: ${esc(insurance.nirLinked || "No")}</span>
                    <span class="insurance-card-nir">${esc(insurance.policyType || "Other")}</span>
                    Company: ${esc(insurance.companyName || "—")}<br>
                    Premium: ${formatMoney(Number(insurance.premium || 0))} (${esc(insurance.premiumFrequency || "Annual")})<br>
                    Sum Assured: ${formatMoney(Number(insurance.sumAssured || 0))}<br>
                    Start: ${esc(insurance.startDate || "—")}<br>
                    Maturity: ${esc(insurance.maturityDate || "—")}<br>
                    Nominee: ${esc(insurance.nomineeName || "—")}
                    <div class="maturity-progress">
                        <div class="maturity-progress-bar"><span style="width: ${maturityProgress}%"></span></div>
                        <small>${maturityProgress.toFixed(0)}% time to maturity</small>
                    </div>
                </div>
            </div>
            <div class="insurance-card-amounts">
                <div><span>Premium</span><strong>${formatMoney(Number(insurance.premium || 0))}</strong></div>
                <div><span>Sum Assured</span><strong>${formatMoney(Number(insurance.sumAssured || 0))}</strong></div>
            </div>
        `;
        
        insurancesList.appendChild(card);
    });
}

function calculateInsuranceSummary(entries) {
    const totalPremium = entries.reduce((s, i) => s + getInsuranceAnnualPremium(i), 0);
    const totalSumAssured = entries.reduce((s, i) => s + Number(i.sumAssured || 0), 0);
    const totalPolicies = entries.length;
    
    document.getElementById("totalPremium").textContent = formatMoney(totalPremium);
    document.getElementById("totalSumAssured").textContent = formatMoney(totalSumAssured);
    document.getElementById("totalPolicies").textContent = totalPolicies;
}

function renderCards() {
    const entries = activeEntries();
    
    // Update toggle button text
    toggleCardEdit.textContent = isCardEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isCardEditMode) {
        cardPreview.hidden = true;
        cardEdit.hidden = false;
        
        // Render form fields
        renderCardDynamicFields();
        updateSectionSubmitButton("cards");
        
        // Render table
        renderCardTable(entries);
    } else {
        cardPreview.hidden = false;
        cardEdit.hidden = true;
        
        // Render preview cards
        renderCardPreviewCards(entries);
        
        // Calculate and display summary
        calculateCardSummary(entries);
    }
}

function renderCardDynamicFields() {
    cardDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.cards || TAB_FIELDS.monthlyBudget;
    const entries = activeEntries();
    const editingId = editingEntryIds.cards;
    const primaryExists = entries.some(c => c.isPrimary === "Yes" && c.id !== editingId);

    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";

        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);

        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                if (field.id === "isPrimary" && opt === "Yes" && primaryExists) {
                    option.disabled = true;
                    option.textContent = "Yes (already set)";
                }
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `card_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);

        if (field.id === "isPrimary" && primaryExists) {
            const hint = document.createElement("small");
            hint.style.cssText = "color: var(--muted); margin-top: 2px; display: block;";
            hint.textContent = "A primary account already exists.";
            div.appendChild(hint);
        }

        div.dataset.fieldId = field.id;
        cardDynamicFields.appendChild(div);
    });

    // Conditional field visibility
    function updateCardConditionals() {
        const accountVal     = document.getElementById("card_accountPresent")?.value || "No";
        const creditCardVal  = document.getElementById("card_creditCardPresent")?.value || "No";
        const primaryVal     = document.getElementById("card_isPrimary")?.value || "No";
        const purposeInput   = document.getElementById("card_purpose");
        cardDynamicFields.querySelectorAll("[data-field-id]").forEach(div => {
            const fid = div.dataset.fieldId;
            if (fid === "balance")      div.hidden = (accountVal    !== "Yes");
            if (fid === "creditLimit")  div.hidden = (creditCardVal !== "Yes");
            if (fid === "purposeOther") div.hidden = (document.getElementById("card_purpose")?.value !== "Others");
        });
        if (purposeInput) {
            if (primaryVal === "Yes") {
                purposeInput.value = "Expenditure";
                purposeInput.disabled = true;
            } else {
                purposeInput.disabled = false;
            }
        }
    }
    updateCardConditionals();
    const acctSel    = document.getElementById("card_accountPresent");
    const ccSel      = document.getElementById("card_creditCardPresent");
    const primarySel = document.getElementById("card_isPrimary");
    const purposeSel = document.getElementById("card_purpose");
    if (acctSel)    acctSel.addEventListener("change",    updateCardConditionals);
    if (ccSel)      ccSel.addEventListener("change",      updateCardConditionals);
    if (primarySel) primarySel.addEventListener("change", updateCardConditionals);
    if (purposeSel) purposeSel.addEventListener("change", updateCardConditionals);
}

function renderCardTable(entries) {
    const fields = (TAB_FIELDS.cards || TAB_FIELDS.monthlyBudget).filter(f => !f.noTable);
    
    cardTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    cardTableHead.appendChild(tr);
    
    cardTableBody.innerHTML = "";
    cardEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        cardTableBody.appendChild(row);
    });
}

function sortCardEntries(entries) {
    const purposeOrder = { "Expenditure": 1, "Saving": 2 };
    return [...entries].sort((a, b) => {
        if (a.isPrimary === "Yes" && b.isPrimary !== "Yes") return -1;
        if (b.isPrimary === "Yes" && a.isPrimary !== "Yes") return 1;
        const aOrder = purposeOrder[a.purpose] || 3;
        const bOrder = purposeOrder[b.purpose] || 3;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return Number(b.balance || 0) - Number(a.balance || 0);
    });
}

function renderCardPreviewCards(entries) {
    const sorted = sortCardEntries(entries);
    cardsList.innerHTML = "";
    
    if (sorted.length === 0) {
        cardsList.innerHTML = `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No accounts yet. Click Edit to add accounts.</div>`;
        return;
    }
    
    sorted.forEach(card => {
        const item = document.createElement("div");
        item.className = "card-item" + (card.isPrimary === "Yes" ? " card-item-primary" : "");

        const accountClass  = card.accountPresent?.toLowerCase()  === "yes" ? "yes" : "no";
        const creditCardClass = card.creditCardPresent?.toLowerCase() === "yes" ? "yes" : "no";
        const kycClass      = card.kycUpdated?.toLowerCase()      === "yes" ? "yes" : "no";
        const nomineeClass  = card.nomineeAdded?.toLowerCase()    === "yes" ? "yes" : "no";
        const primaryBadge  = card.isPrimary === "Yes"
            ? `<span class="card-item-badge primary-badge">⭐ PRIMARY</span>` : "";

        item.innerHTML = `
            <div class="card-item-info">
                <div class="card-item-title">${esc(card.bankName)}${primaryBadge}</div>
                <div class="card-item-details">
                    <span class="card-item-badge ${accountClass}">Account: ${esc(card.accountPresent || "No")}</span>
                    <span class="card-item-badge ${creditCardClass}">Credit Card: ${esc(card.creditCardPresent || "No")}</span>
                    <span class="card-item-badge ${kycClass}">KYC: ${esc(card.kycUpdated || "No")}</span>
                    <span class="card-item-badge ${nomineeClass}">Nominee: ${esc(card.nomineeAdded || "No")}</span><br>
                    Purpose: ${esc(card.purpose === "Others" && card.purposeOther ? card.purposeOther : (card.purpose || "—"))}
                </div>
            </div>
            <div class="card-item-amounts">
                <div><span>Balance</span><strong>${formatMoney(Number(card.balance || 0))}</strong></div>
                <div><span>Credit Limit</span><strong>${formatMoney(Number(card.creditLimit || 0))}</strong></div>
            </div>
        `;

        cardsList.appendChild(item);
    });
}

function calculateCardSummary(entries) {
    const totalBanks = entries.filter(c => c.accountPresent?.toLowerCase() === "yes").length;
    const totalDebitCards = entries.filter(c => c.debitCardPresent?.toLowerCase() === "yes").length;
    const totalBalance = entries.filter(c => c.accountPresent?.toLowerCase() === "yes")
        .reduce((s, c) => s + Number(c.balance || 0), 0);
    const totalCreditLimit = entries.filter(c => c.creditCardPresent?.toLowerCase() === "yes")
        .reduce((s, c) => s + Number(c.creditLimit || 0), 0);
    const totalCreditCards = entries.filter(c => c.creditCardPresent?.toLowerCase() === "yes").length;

    document.getElementById("totalBanks").textContent = totalBanks;
    document.getElementById("totalDebitCards").textContent = totalDebitCards;
    document.getElementById("totalBalance").textContent = formatMoney(totalBalance);
    document.getElementById("totalCreditLimit").textContent = formatMoney(totalCreditLimit);
    document.getElementById("totalCreditCards").textContent = totalCreditCards;
}

function getAutoNetWorthEntries() {
    const auto = [];
    // Investments → Assets
    const investments = (appData.tabData || {}).investments || [];
    investments.forEach(inv => {
        const val = getInvestmentCurrentValue(inv);
        if (val > 0) {
            auto.push({
                id: 'auto_inv_' + inv.id,
                name: inv.name || 'Investment',
                type: 'Asset',
                value: val,
                growthRate: inv.annualInterestRate || '',
                details: 'From Investments tab',
                auto: true
            });
        }
    });
    // Fixed Expenses with type Liability → Liabilities (amount × remaining months)
    const expenses = (appData.tabData || {}).monthlyFixedExpense || [];
    expenses.filter(e => (e.type || '') === 'Liability').forEach(exp => {
        const monthly = Number(exp.amount || 0);
        const months  = Number(exp.duration || 1);
        const outstanding = monthly * months;
        if (outstanding > 0) {
            auto.push({
                id: 'auto_exp_' + exp.id,
                name: exp.name || 'Liability',
                type: 'Liability',
                value: outstanding,
                growthRate: '',
                details: `From Fixed Expenses (${formatMoney(monthly)}/mo × ${months} mo remaining)`,
                auto: true
            });
        }
    });
    return auto;
}

function getAllNetWorthEntries() {
    return [...getAutoNetWorthEntries(), ...activeEntries()];
}

function renderNetWorth() {
    const manualEntries = activeEntries();
    const allEntries    = getAllNetWorthEntries();
    const calculatedAge = calculateAgeFromDob(appData.dateOfBirth);

    // Update toggle button text
    toggleNetWorthEdit.textContent = isNetWorthEditMode ? "✓ Done" : "✎ Edit";

    // Show/hide preview/edit modes
    if (isNetWorthEditMode) {
        netWorthPreview.hidden = true;
        netWorthEdit.hidden = false;

        // Render form fields
        renderNetWorthDynamicFields();
        updateSectionSubmitButton("netWorth");

        // Render table (manual entries only)
        renderNetWorthTable(manualEntries);
    } else {
        netWorthPreview.hidden = false;
        netWorthEdit.hidden = true;
        currentAgeDisplay.textContent = calculatedAge ? calculatedAge + " yrs" : "—";

        // Calculate and display summary using combined entries
        calculateNetWorthSummary(allEntries);

        // Render assets and liabilities lists
        renderAssetsLiabilitiesLists(allEntries);

        // Render projection chart
        renderNetWorthProjectionChart(allEntries);
    }
}

function renderNetWorthDynamicFields() {
    netWorthDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.netWorth || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `netWorth_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        netWorthDynamicFields.appendChild(div);
    });
}

function renderNetWorthTable(entries) {
    const fields = TAB_FIELDS.netWorth || TAB_FIELDS.monthlyBudget;
    
    netWorthTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    netWorthTableHead.appendChild(tr);
    
    netWorthTableBody.innerHTML = "";
    netWorthEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        netWorthTableBody.appendChild(row);
    });
}

function calculateNetWorthSummary(entries) {
    const assets = entries.filter(e => e.type === "Asset");
    const liabilities = entries.filter(e => e.type === "Liability");
    
    const totalAssets = assets.reduce((s, a) => s + Number(a.value || 0), 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + Number(l.value || 0), 0);
    const netWorthToday = totalAssets - totalLiabilities;
    
    document.getElementById("totalAssets").textContent = formatMoney(totalAssets);
    document.getElementById("totalLiabilities").textContent = formatMoney(totalLiabilities);
    document.getElementById("netWorthToday").textContent = formatMoney(netWorthToday);
}

function renderAssetsLiabilitiesLists(entries) {
    const assets      = entries.filter(e => e.type === "Asset");
    const liabilities = entries.filter(e => e.type === "Liability");

    function makeItem(entry) {
        const item = document.createElement("div");
        item.className = "asset-liability-item";
        const autoBadge = entry.auto
            ? `<span class="auto-badge" title="${esc(entry.details || 'Auto-calculated')}">Auto</span>`
            : `<span class="manual-badge">Manual</span>`;
        item.innerHTML = `
            <div class="asset-label-group">
                ${autoBadge}
                <span class="label">${esc(entry.name)}</span>
                ${entry.auto ? `<span class="auto-source">${esc(entry.details)}</span>` : ''}
            </div>
            <div>
                <span class="value">${formatMoney(Number(entry.value || 0))}</span>
                ${entry.growthRate ? `<span class="growth">${entry.growthRate}% growth</span>` : ''}
            </div>
        `;
        return item;
    }

    assetsList.innerHTML = "";
    if (assets.length === 0) {
        assetsList.innerHTML = `<div class="empty-state visible">No assets yet. Add investments to see them here.</div>`;
    } else {
        assets.forEach(a => assetsList.appendChild(makeItem(a)));
    }

    liabilitiesList.innerHTML = "";
    if (liabilities.length === 0) {
        liabilitiesList.innerHTML = `<div class="empty-state visible">No liabilities yet.</div>`;
    } else {
        liabilities.forEach(l => liabilitiesList.appendChild(makeItem(l)));
    }
}

function renderNetWorthProjectionChart(entries) {
    // Destroy existing chart
    if (netWorthProjectionChart) netWorthProjectionChart.destroy();

    const currentAge = calculateAgeFromDob(appData.dateOfBirth) || 30;
    const targetAge = 70;
    const years = targetAge - currentAge;

    if (years <= 0 || entries.length === 0) return;
    
    const assets = entries.filter(e => e.type === "Asset");
    const liabilities = entries.filter(e => e.type === "Liability");
    
    // Calculate net worth projection
    const labels = [];
    const projectedValues = [];
    const inflationAdjustedValues = [];
    
    const inflationRate = 0.06; // 6% inflation
    
    for (let year = 0; year <= years; year++) {
        labels.push(`Age ${currentAge + year}`);
        
        let projectedAssets = 0;
        let projectedLiabilities = 0;
        
        // Calculate asset growth
        assets.forEach(asset => {
            const growthRate = (Number(asset.growthRate || 0) / 100);
            const futureValue = Number(asset.value || 0) * Math.pow(1 + growthRate, year);
            projectedAssets += futureValue;
        });
        
        // Calculate liability growth
        liabilities.forEach(liability => {
            const growthRate = (Number(liability.growthRate || 0) / 100);
            const futureValue = Number(liability.value || 0) * Math.pow(1 + growthRate, year);
            projectedLiabilities += futureValue;
        });
        
        const projectedNetWorth = projectedAssets - projectedLiabilities;
        const inflationAdjustedValue = projectedNetWorth / Math.pow(1 + inflationRate, year);
        
        projectedValues.push(projectedNetWorth);
        inflationAdjustedValues.push(inflationAdjustedValue);
    }
    
    // Update projection details
    const finalProjectedNetWorth = projectedValues[projectedValues.length - 1];
    const finalInflationAdjusted = inflationAdjustedValues[inflationAdjustedValues.length - 1];
    
    document.getElementById("projectedNetWorth").textContent = formatMoney(finalProjectedNetWorth);
    document.getElementById("inflationAdjustedNetWorth").textContent = formatMoney(finalInflationAdjusted);
    
    // Create chart
    const ctx = netWorthProjectionChartCanvas.getContext("2d");
    netWorthProjectionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Projected Net Worth",
                    data: projectedValues,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Inflation-Adjusted",
                    data: inflationAdjustedValues,
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: getChartThemeColors().text }
                }
            },
            scales: {
                x: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                },
                y: {
                    ticks: { color: getChartThemeColors().text },
                    grid: { color: getChartThemeColors().grid }
                }
            }
        }
    });
}

// ── Tax Plan auto-population helpers ────────────────────────────────────────
function getSelectedTaxFyStartYear() {
    const selected = financialYearSelect?.value || "";
    const match = selected.match(/^(\d{4})/);
    return match ? Number(match[1]) : getFinancialYearStartYear(new Date());
}

function populateFinancialYearOptions() {
    if (!financialYearSelect) return;
    const currentFy = getFinancialYearStartYear(new Date());
    const existing = financialYearSelect.value;
    financialYearSelect.innerHTML = "";
    for (let year = currentFy - 3; year <= currentFy + 1; year++) {
        const option = document.createElement("option");
        option.value = `${year}-${String(year + 1).slice(-2)}`;
        option.textContent = getFinancialYearLabel(year);
        if (existing ? option.value === existing : year === currentFy) option.selected = true;
        financialYearSelect.appendChild(option);
    }
}

function getAnnualIncomeFromBudget(fyStartYear = getFinancialYearStartYear(new Date())) {
    const mbData = appData.monthlyBudgetData || {};
    const fyMonthSet = new Set(getFinancialYearMonthKeys(fyStartYear));
    const fyMonths = Object.keys(mbData).filter(k => fyMonthSet.has(k));
    const pool = fyMonths.length > 0 ? fyMonths : Object.keys(mbData).sort().reverse().slice(0, 1);
    if (pool.length === 0) return 0;
    let total = 0;
    pool.forEach(k => { total += Object.values((mbData[k] || {}).inflow || {}).reduce((s, v) => s + (Number(v) || 0), 0); });
    return (total / pool.length) * 12;
}

function getAutoTaxDeductions() {
    const auto = [];
    const expenses = (appData.tabData || {}).monthlyFixedExpense || [];
    expenses.filter(e => e.type === 'Insurance').forEach(exp => {
        const annual = Number(exp.amount || 0) * 12;
        if (annual > 0) auto.push({ id: 'atax_ins_' + exp.id, name: exp.name || 'Insurance', amount: annual, section: '80D', details: formatMoney(exp.amount) + '/mo × 12', auto: true });
    });
    expenses.filter(e => ['Investment', 'Saving'].includes(e.type || '')).forEach(exp => {
        const annual = Number(exp.amount || 0) * 12;
        if (annual > 0) auto.push({ id: 'atax_sav_' + exp.id, name: exp.name || 'Saving', amount: annual, section: '80C', details: formatMoney(exp.amount) + '/mo × 12', auto: true });
    });
    const investments = (appData.tabData || {}).investments || [];
    investments.forEach(inv => {
        const freq = (inv.frequency || '').toLowerCase();
        const base = Number(inv.initialInvestment || 0);
        const annual = freq === 'monthly' ? base * 12 : base;
        if (annual > 0) auto.push({ id: 'atax_inv_' + inv.id, name: inv.name || 'Investment', amount: annual, section: '80C', details: 'From Investments tab', auto: true });
    });
    return auto;
}

function getAllTaxDeductions() {
    return [...getAutoTaxDeductions(), ...activeEntries()];
}

function getEffectiveDeductions(allEntries, regime) {
    if (regime === 'new') return { total80C: 0, total80D: 0, totalOther: 0, totalDeductions: 0, stdDeduction: 75000 };
    const raw80C  = allEntries.filter(e => e.section === '80C').reduce((s, e) => s + Number(e.amount || 0), 0);
    const raw80D  = allEntries.filter(e => e.section === '80D').reduce((s, e) => s + Number(e.amount || 0), 0);
    const other   = allEntries.filter(e => !['80C','80D'].includes(e.section || '')).reduce((s, e) => s + Number(e.amount || 0), 0);
    const total80C = Math.min(150000, raw80C);
    const total80D = Math.min(50000,  raw80D);
    return { total80C, total80D, totalOther: other, totalDeductions: total80C + total80D + other, stdDeduction: 50000 };
}

function renderTaxPlan() {
    const entries = activeEntries();
    const taxRegime = taxRegimeSelect.value;
    populateFinancialYearOptions();
    
    // Update toggle button text
    toggleTaxPlanEdit.textContent = isTaxPlanEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isTaxPlanEditMode) {
        taxPlanPreview.hidden = true;
        taxPlanEdit.hidden = false;
        
        // Render form fields
        renderTaxPlanDynamicFields();
        updateSectionSubmitButton("taxPlan");
        
        // Render table
        renderTaxPlanTable(entries);
    } else {
        taxPlanPreview.hidden = false;
        taxPlanEdit.hidden = true;
        
        // Calculate and display tax summary
        calculateTaxSummary(entries, taxRegime);
        
        // Render tax deductions list
        renderTaxDeductionsList(entries);
        
        // Render tax breakdown
        renderTaxBreakdown(entries, taxRegime);
    }
}

function renderTaxPlanDynamicFields() {
    taxPlanDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.taxPlan || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `taxPlan_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        taxPlanDynamicFields.appendChild(div);
    });
}

function renderTaxPlanTable(entries) {
    const fields = TAB_FIELDS.taxPlan || TAB_FIELDS.monthlyBudget;
    
    taxPlanTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    taxPlanTableHead.appendChild(tr);
    
    taxPlanTableBody.innerHTML = "";
    taxPlanEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        taxPlanTableBody.appendChild(row);
    });
}

function calculateTaxSummary(entries, taxRegime) {
    const fyStartYear = getSelectedTaxFyStartYear();
    const annualIncome  = getAnnualIncomeFromBudget(fyStartYear);
    const allDeductions = getAllTaxDeductions();
    const ded = getEffectiveDeductions(allDeductions, taxRegime);
    const taxableIncome = Math.max(0, annualIncome - ded.stdDeduction - ded.totalDeductions);
    const annualTaxLiability = calculateTax(taxableIncome, taxRegime);

    // YTD: based on FY month index (Apr=1, May=2 … Mar=12)
    const now = new Date();
    const currentFyStart = getFinancialYearStartYear(now);
    const m = now.getMonth();
    const fyMonth = fyStartYear < currentFyStart ? 12 : (fyStartYear > currentFyStart ? 0 : (m >= 3 ? m - 2 : m + 10));
    const taxLiabilityYTD = (annualTaxLiability * fyMonth) / 12;

    // Regime comparison
    const oldDed  = getEffectiveDeductions(allDeductions, 'old');
    const newDed  = getEffectiveDeductions(allDeductions, 'new');
    const oldTax  = calculateTax(Math.max(0, annualIncome - oldDed.stdDeduction - oldDed.totalDeductions), 'old') * 1.04;
    const newTax  = calculateTax(Math.max(0, annualIncome - newDed.stdDeduction), 'new') * 1.04;
    const bestRegime = oldTax <= newTax ? 'Old Regime' : 'New Regime';
    const saved = Math.abs(oldTax - newTax);

    document.getElementById("annualIncome").textContent          = formatMoney(annualIncome);
    document.getElementById("totalDeductions").textContent       = formatMoney(ded.stdDeduction + ded.totalDeductions);
    document.getElementById("taxableIncome").textContent         = formatMoney(taxableIncome);
    document.getElementById("annualTaxLiability").textContent    = formatMoney(annualTaxLiability * 1.04);
    document.getElementById("taxLiabilityYTD").textContent       = formatMoney(taxLiabilityYTD * 1.04);
    document.getElementById("recommendedRegime").textContent     = bestRegime;
    document.getElementById("regimeSavingsNote").textContent     = saved > 0 ? `saves ${formatMoney(saved)}/yr` : 'Equal tax';
}

function calculateTax(income, regime) {
    if (regime === "new") {
        // New Tax Regime (FY 2024-25)
        if (income <= 300000) return 0;
        if (income <= 600000) return (income - 300000) * 0.05;
        if (income <= 900000) return 15000 + (income - 600000) * 0.10;
        if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
        if (income <= 1500000) return 90000 + (income - 1200000) * 0.20;
        return 150000 + (income - 1500000) * 0.30;
    } else {
        // Old Tax Regime
        if (income <= 250000) return 0;
        if (income <= 500000) return (income - 250000) * 0.05;
        if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
        return 112500 + (income - 1000000) * 0.30;
    }
}

function renderTaxDeductionsList(entries) {
    taxDeductionsList.innerHTML = "";
    const allDeductions = getAllTaxDeductions();
    if (allDeductions.length === 0) {
        taxDeductionsList.innerHTML = `<div class="empty-state visible">No deductions found. Add investments or insurance in other tabs to see auto-pulled items here.</div>`;
        return;
    }
    allDeductions.forEach(item => {
        const div = document.createElement("div");
        div.className = "tax-deduction-item";
        const badge = item.auto
            ? `<span class="auto-badge" title="${esc(item.details || '')}">Auto</span>`
            : `<span class="manual-badge">Manual</span>`;
        div.innerHTML = `
            <div class="asset-label-group">
                ${badge}
                <span class="label">${esc(item.name)}</span>
                ${item.auto ? `<span class="auto-source">${esc(item.details || '')}</span>` : ''}
            </div>
            <div>
                <span class="value">${formatMoney(Number(item.amount || 0))}</span>
                <span class="section">${esc(item.section || '')}</span>
            </div>
        `;
        taxDeductionsList.appendChild(div);
    });
}

function renderTaxBreakdown(entries, taxRegime) {
    taxBreakdown.innerHTML = "";
    const annualIncome  = getAnnualIncomeFromBudget(getSelectedTaxFyStartYear());
    const allDeductions = getAllTaxDeductions();
    const ded = getEffectiveDeductions(allDeductions, taxRegime);
    const taxableIncome = Math.max(0, annualIncome - ded.stdDeduction - ded.totalDeductions);
    const tax      = calculateTax(taxableIncome, taxRegime);
    const cess     = tax * 0.04;
    const totalTax = tax + cess;

    // Regime comparison
    const oldDed = getEffectiveDeductions(allDeductions, 'old');
    const newDed = getEffectiveDeductions(allDeductions, 'new');
    const oldTotalTax = calculateTax(Math.max(0, annualIncome - oldDed.stdDeduction - oldDed.totalDeductions), 'old') * 1.04;
    const newTotalTax = calculateTax(Math.max(0, annualIncome - newDed.stdDeduction), 'new') * 1.04;
    const bestRegime  = oldTotalTax <= newTotalTax ? 'Old Regime' : 'New Regime';
    const saving      = Math.abs(oldTotalTax - newTotalTax);

    const breakdown = [
        { label: 'Gross Annual Income (avg from budget)', value: formatMoney(annualIncome) },
        { label: `Standard Deduction (${taxRegime === 'new' ? 'New' : 'Old'} Regime)`, value: formatMoney(ded.stdDeduction) },
        ...(taxRegime === 'old' ? [
            { label: '80C Deductions (auto+manual, cap ₹1.5L)', value: formatMoney(ded.total80C) },
            { label: '80D Deductions (auto+manual, cap ₹50K)',  value: formatMoney(ded.total80D) },
            ...(ded.totalOther > 0 ? [{ label: 'Other Deductions', value: formatMoney(ded.totalOther) }] : [])
        ] : []),
        { label: 'Taxable Income', value: formatMoney(taxableIncome), highlight: true },
        { label: 'Base Tax', value: formatMoney(tax) },
        { label: 'Cess (4%)', value: formatMoney(cess) },
        { label: 'Total Tax Liability', value: formatMoney(totalTax), highlight: true },
        { label: `💡 Best regime: ${bestRegime}`, value: saving > 0 ? `saves ${formatMoney(saving)}/yr` : 'Equal', tip: true }
    ];

    breakdown.forEach(item => {
        const div = document.createElement("div");
        div.className = `tax-breakdown-item${item.highlight ? " highlight" : ""}${item.tip ? " regime-tip" : ""}`;
        div.innerHTML = `<span>${item.label}</span><strong>${item.value}</strong>`;
        taxBreakdown.appendChild(div);
    });
}

function renderGifts() {
    const entries = activeEntries();
    
    // Update toggle button text
    toggleGiftsEdit.textContent = isGiftsEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isGiftsEditMode) {
        giftsPreview.hidden = true;
        giftsEdit.hidden = false;
        
        // Render form fields
        renderGiftsDynamicFields();
        updateSectionSubmitButton("gifts");
        
        // Render table
        renderGiftsTable(entries);
    } else {
        giftsPreview.hidden = false;
        giftsEdit.hidden = true;
        
        // Calculate and display summary
        calculateGiftsSummary(entries);
        
        // Render preview cards
        renderGiftsPreviewCards(entries);
    }
}

function renderGiftsDynamicFields() {
    giftsDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.gifts || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `gifts_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        giftsDynamicFields.appendChild(div);
    });
}

function renderGiftsTable(entries) {
    const fields = TAB_FIELDS.gifts || TAB_FIELDS.monthlyBudget;
    
    giftsTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    giftsTableHead.appendChild(tr);
    
    giftsTableBody.innerHTML = "";
    giftsEmptyState.classList.toggle("visible", entries.length === 0);
    
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        giftsTableBody.appendChild(row);
    });
}

function calculateGiftsSummary(entries) {
    const totalGifts = entries.length;
    const totalGiftAmount = entries.reduce((s, g) => s + Number(g.amount || 0), 0);
    const fixedEveryYearCount = entries.filter(g => g.category === "Fixed Every Year").length;
    
    document.getElementById("totalGifts").textContent = totalGifts;
    document.getElementById("totalGiftAmount").textContent = formatMoney(totalGiftAmount);
    document.getElementById("fixedEveryYearCount").textContent = fixedEveryYearCount;
}

function renderGiftsPreviewCards(entries) {
    const toolbarEl = document.getElementById("giftsSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("gifts");

    const displayEntries = applyListSortFilter("gifts", entries);
    giftsList.innerHTML = "";

    if (displayEntries.length === 0) {
        giftsList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No gifts yet. Click Edit to add gifts.</div>`
            : `<div class="empty-state visible" style="background: var(--surf1); border: 1px solid var(--border2); border-radius: 12px;">No results match the current filters.</div>`;
        return;
    }

    displayEntries.forEach(gift => {
        const item = document.createElement("div");
        item.className = "gift-item";
        
        const categoryClass = gift.category === "Fixed Every Year" ? "fixed" : "demand";
        
        item.innerHTML = `
            <div class="gift-item-info">
                <div class="gift-item-title">${esc(gift.name)}</div>
                <div class="gift-item-details">
                    <span class="gift-item-category ${categoryClass}">${esc(gift.category || "On Demand")}</span>
                    ${esc(gift.relativeName || "—")}<br>
                    Occasion: ${esc(gift.occasion || "—")}<br>
                    ${gift.details ? `Details: ${esc(gift.details)}` : ""}
                </div>
            </div>
            <div class="gift-item-amount">${formatMoney(Number(gift.amount || 0))}</div>
        `;
        
        giftsList.appendChild(item);
    });
}

function renderEmergencyFund() {
    const entries = activeEntries();
    
    // Update toggle button text
    toggleEmergencyFundEdit.textContent = isEmergencyFundEditMode ? "✓ Done" : "✎ Edit";
    
    // Show/hide preview/edit modes
    if (isEmergencyFundEditMode) {
        emergencyFundEdit.hidden = false;
        
        // Render form fields
        renderEmergencyFundDynamicFields();
        
        // Pre-fill with current fund value if exists
        if (entries.length > 0) {
            const currentFundInput = document.getElementById("emergencyFund_currentFund");
            if (currentFundInput) {
                currentFundInput.value = entries[0].currentFund || 0;
            }
        }
    } else {
        emergencyFundEdit.hidden = true;
        
        // Calculate and display emergency fund summary
        calculateEmergencyFundSummary(entries);
    }
}

function renderEmergencyFundDynamicFields() {
    emergencyFundDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.emergencyFund || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `emergencyFund_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        emergencyFundDynamicFields.appendChild(div);
    });
}

function calculateEmergencyFundSummary(entries) {
    // Calculate average monthly expenses from monthly budget data
    let averageMonthlyExpenses = 0;
    const monthlyBudgetData = appData.monthlyBudgetData || {};
    const availableMonths = Object.keys(monthlyBudgetData);
    
    if (availableMonths.length > 0) {
        let totalExpenses = 0;
        let monthCount = 0;
        
        availableMonths.forEach(monthKey => {
            const monthData = monthlyBudgetData[monthKey] || {};
            const outflowData = monthData.outflow || {};
            const monthExpenses = Object.values(outflowData).reduce((sum, val) => sum + (Number(val) || 0), 0);
            totalExpenses += monthExpenses;
            monthCount++;
        });
        
        averageMonthlyExpenses = monthCount > 0 ? totalExpenses / monthCount : 0;
    }
    
    const sixMonthsNeeded = averageMonthlyExpenses * 6;
    const twelveMonthsNeeded = averageMonthlyExpenses * 12;
    
    // Get current emergency fund from saved entries
    let currentFund = 0;
    if (entries.length > 0) {
        currentFund = Number(entries[0].currentFund || 0);
    }
    currentEmergencyFundDisplay.textContent = formatMoney(currentFund);
    
    // Update summary display
    document.getElementById("averageMonthlyExpenses").textContent = formatMoney(averageMonthlyExpenses);
    document.getElementById("sixMonthsNeeded").textContent = formatMoney(sixMonthsNeeded);
    document.getElementById("twelveMonthsNeeded").textContent = formatMoney(twelveMonthsNeeded);
    
    // Calculate status
    const monthsCovered = averageMonthlyExpenses > 0 ? currentFund / averageMonthlyExpenses : 0;
    const amountNeeded = Math.max(0, sixMonthsNeeded - currentFund);
    
    // Determine status color
    const statusBadge = document.getElementById("statusBadge");
    statusBadge.className = "status-badge";
    
    let statusText = "";
    if (averageMonthlyExpenses === 0) {
        statusBadge.classList.add("yellow");
        statusText = "NO DATA";
        document.getElementById("amountNeeded").textContent = "Add monthly expenses first";
        document.getElementById("monthsCovered").textContent = "—";
        statusBadge.textContent = statusText;
        return;
    }
    
    if (monthsCovered >= 12) {
        statusBadge.classList.add("green");
        statusText = "READY";
    } else if (monthsCovered >= 6) {
        statusBadge.classList.add("yellow");
        statusText = "GOOD";
    } else {
        statusBadge.classList.add("red");
        statusText = "LOW";
    }
    
    statusBadge.textContent = statusText;
    document.getElementById("amountNeeded").textContent = formatMoney(amountNeeded);
    document.getElementById("monthsCovered").textContent = monthsCovered.toFixed(1);
}

function calculateAnnualSummary() {
    try {
        const monthlyBudgetData = appData.monthlyBudgetData || {};
        const fyStartYear = getFinancialYearStartYear(currentMonth);
        const monthKeys = getFinancialYearMonthKeys(fyStartYear);
        currentMonthDisplay.textContent = getFinancialYearLabel(fyStartYear);
        
        if (!monthKeys.some(k => monthlyBudgetData[k])) {
            [annualTotalIncome, annualTotalExpenditure, annualTotalSavings, annualTotalInvestment, annualTotalLiability, annualTotalOther,
             avgMonthlyIncome, avgMonthlyExpenditure, avgMonthlySavings, avgMonthlyInvestment, avgMonthlyLiability, avgMonthlyOther]
                .forEach(el => { if (el) el.textContent = "₹0"; });
            annualMonthsList.innerHTML = "<p class='empty-state visible'>No monthly data available yet. Add data in Monthly view first.</p>";
            return;
        }
        
        const totals = {
            income: 0,
            expenditure: 0,
            saving: 0,
            investment: 0,
            liability: 0,
            other: 0,
        };
        const monthDataList = [];
        
        monthKeys.forEach(monthKey => {
            const monthData = monthlyBudgetData[monthKey] || {};
            const dist = getMonthlyDistribution(monthData);
            Object.keys(totals).forEach(key => { totals[key] += Number(dist[key] || 0); });
            monthDataList.push({ month: monthKey, ...dist });
        });
        
        const monthCount = 12;
        const netSavings = totals.income - totals.expenditure - totals.investment - totals.liability - totals.other;
        totals.saving = Math.max(0, totals.saving || netSavings);
        
        annualTotalIncome.textContent = formatMoney(totals.income);
        annualTotalExpenditure.textContent = formatMoney(totals.expenditure);
        annualTotalSavings.textContent = formatMoney(totals.saving);
        annualTotalInvestment.textContent = formatMoney(totals.investment);
        annualTotalLiability.textContent = formatMoney(totals.liability);
        annualTotalOther.textContent = formatMoney(totals.other);
        avgMonthlyIncome.textContent = formatMoney(totals.income / monthCount);
        avgMonthlyExpenditure.textContent = formatMoney(totals.expenditure / monthCount);
        avgMonthlySavings.textContent = formatMoney(totals.saving / monthCount);
        avgMonthlyInvestment.textContent = formatMoney(totals.investment / monthCount);
        avgMonthlyLiability.textContent = formatMoney(totals.liability / monthCount);
        avgMonthlyOther.textContent = formatMoney(totals.other / monthCount);

        // Render annual pie chart
        renderAnnualPieChart(totals);
        
        // Render monthly breakdown
        annualMonthsList.innerHTML = "";
        monthDataList.sort((a, b) => new Date(a.month + "-01") - new Date(b.month + "-01")).reverse().forEach(month => {
            const date = new Date(month.month + "-01");
            const monthName = date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
            
            const div = document.createElement("div");
            div.className = "annual-month-item";
            div.innerHTML = `
                <span class="annual-month-name">${monthName}</span>
                <div class="annual-month-details">
                    <span class="annual-month-detail">Income: <strong>${formatMoney(month.income)}</strong></span>
                    <span class="annual-month-detail">Expenditure: <strong>${formatMoney(month.expenditure)}</strong></span>
                    <span class="annual-month-detail">Saving: <strong>${formatMoney(month.saving)}</strong></span>
                    <span class="annual-month-detail">Investment: <strong>${formatMoney(month.investment)}</strong></span>
                    <span class="annual-month-detail">Liability: <strong>${formatMoney(month.liability)}</strong></span>
                    <span class="annual-month-detail">Other: <strong>${formatMoney(month.other)}</strong></span>
                </div>
            `;
            annualMonthsList.appendChild(div);
        });
    } catch (error) {
        console.error("Error calculating annual summary:", error);
        annualTotalIncome.textContent = "₹0";
        annualTotalExpenditure.textContent = "₹0";
        annualTotalSavings.textContent = "₹0";
        avgMonthlyIncome.textContent = "₹0";
        avgMonthlyExpenditure.textContent = "₹0";
        annualMonthsList.innerHTML = "<p class='empty-state visible'>Error loading annual data. Please try again.</p>";
    }
}

function renderAnnualPieChart(totals) {
    if (annualPieChart) annualPieChart.destroy();
    const values = [totals.investment, totals.liability, totals.saving, totals.expenditure, totals.other];
    if (values.every(v => Number(v || 0) === 0)) return;

    const ctx = annualPieChartCanvas.getContext("2d");
    annualPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Investment", "Liability", "Saving", "Expenditure", "Other"],
            datasets: [{
                data: values,
                backgroundColor: ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#eab308", "#a855f7"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: getChartThemeColors().text,
                        font: { size: 12 },
                        padding: 16,
                        generateLabels: (chart) => {
                            const ds = chart.data.datasets[0];
                            const total = ds.data.reduce((a, b) => a + b, 0);
                            const textColor = getChartThemeColors().text;
                            return chart.data.labels.map((label, i) => ({
                                text: `${label} (${total > 0 ? Math.round(ds.data[i] / total * 100) : 0}%)`,
                                fillStyle: ds.backgroundColor[i],
                                strokeStyle: ds.backgroundColor[i],
                                fontColor: textColor,
                                color: textColor,
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${formatMoney(ctx.raw)}`
                    }
                }
            }
        }
    });
}

function renderCategoryFields(container, fields, data, autoLinkedFields = {}, autoLinkedBreakdown = {}) {
    container.innerHTML = "";
    const categoryName = container.id.replace(/Fields$/, "");
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        const isAutoLinked = Boolean(autoLinkedFields[`${categoryName}.${field.id}`]);
        const fieldKey = `${categoryName}.${field.id}`;
        const breakdown = (autoLinkedBreakdown && autoLinkedBreakdown[fieldKey]) || [];
        
        const label = document.createElement("label");
        label.textContent = field.label;
        if (isAutoLinked) {
            const autoBadge = document.createElement("span");
            autoBadge.className = "auto-badge";
            autoBadge.textContent = "auto-calculated";
            if (breakdown && breakdown.length > 0) {
                const tooltipText = breakdown.map(b => `${b.name}: ${formatMoney(b.amount)} (${b.source})`).join("\n");
                autoBadge.title = tooltipText;
                autoBadge.setAttribute("aria-label", tooltipText);
            } else {
                autoBadge.title = "No source items found - add Liabilities (type=Liability, freq=Monthly) to auto-calculate";
            }
            label.appendChild(autoBadge);
        }
        div.appendChild(label);
        
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.placeholder = "0";
        input.value = data[field.id] || "";
        input.dataset.fieldId = field.id;
        input.dataset.category = container.id;
        if (isAutoLinked) {
            input.disabled = true;
            input.title = "Auto-populated from Investments or Liabilities. Edit the source item to change current/future months.";
            div.classList.add("auto-linked-field");
        }
        
        div.appendChild(input);
        container.appendChild(div);
    });
}

function calculateAndDisplaySummary(monthData) {
    // Calculate totals
    const inflowTotal = Object.values(monthData.inflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const outflowTotal = Object.values(monthData.outflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const investingTotal = Object.values(monthData.investing || {}).reduce((s, v) => s + Number(v || 0), 0);

    document.getElementById("inflowTotal").textContent = formatMoney(inflowTotal);
    document.getElementById("outflowTotal").textContent = formatMoney(outflowTotal);
    document.getElementById("investingTotal").textContent = formatMoney(investingTotal);

    const cashFlow = inflowTotal - outflowTotal - investingTotal;
    document.getElementById("totalIncome").textContent = formatMoney(inflowTotal);
    document.getElementById("totalExpenses").textContent = formatMoney(outflowTotal + investingTotal);
    document.getElementById("cashFlow").textContent = formatMoney(cashFlow);

    // Primary account current balance (replaces manual monthEndBalance)
    const primaryAccount = (appData.tabData?.cards || []).find(c => c.isPrimary === "Yes");
    const primaryBalance = Number(primaryAccount?.balance || 0);
    document.getElementById("initialBalance").textContent = formatMoney(primaryBalance);

    // Previous month credit card outstanding
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthKey = getMonthKey(prevMonth);
    const prevMonthData = (appData.monthlyBudgetData || {})[prevMonthKey];
    const prevCreditCardOutstanding = prevMonthData ? Number(prevMonthData.outflow?.creditCardOutstanding || 0) : 0;

    // Fixed liabilities from the Liabilities tab (used for transfer section only)
    const fixedLiabilities = ((appData.tabData || {}).monthlyFixedExpense || [])
        .reduce((s, e) => s + Number(e.amount || 0), 0);

    const primaryIncome = Number(monthData.inflow?.primaryIncome || 0);

    // Balance to spend = starting balance + ALL income - ALL outflows - ALL on-demand outflows
    // (prevCreditCardOutstanding is already included in outflowTotal via auto-carry)
    const balanceToSpend = primaryBalance + inflowTotal - outflowTotal - investingTotal;
    const balanceToSpendEl = document.getElementById("balanceToSpend");
    if (balanceToSpendEl) balanceToSpendEl.textContent = formatMoney(balanceToSpend);

    // Amount available to spend = net cash flow after all incomes and outflows
    const amountAvailableToSpend = inflowTotal - outflowTotal - investingTotal;
    const availableEl = document.getElementById("amountAvailableToSpend");
    const availableLabelEl = document.getElementById("amountAvailableLabel");
    if (availableEl) {
        availableEl.textContent = formatMoney(Math.abs(amountAvailableToSpend));
        availableEl.style.color = amountAvailableToSpend >= 0 ? "#22c55e" : "#ef4444";
    }
    if (availableLabelEl) {
        availableLabelEl.textContent = amountAvailableToSpend >= 0 ? "Amount Available to Spend" : "Amount Overspent";
    }

    // Budget status banner — based on net cash flow across all incomes & outflows
    budgetStatus.className = "budget-status";
    if (amountAvailableToSpend > 0) {
        budgetStatus.classList.add("positive");
        budgetStatus.textContent = `Budget Positive: +${formatMoney(amountAvailableToSpend)} surplus`;
    } else if (amountAvailableToSpend < 0) {
        budgetStatus.classList.add("negative");
        budgetStatus.textContent = `Budget Negative: ${formatMoney(Math.abs(amountAvailableToSpend))} overspent`;
    } else {
        budgetStatus.classList.add("neutral");
        budgetStatus.textContent = `Budget Balanced: ₹0 remaining`;
    }
    if (prevCreditCardOutstanding > 0) {
        budgetStatus.textContent += ` • Prev month card outstanding: ${formatMoney(prevCreditCardOutstanding)}`;
    }

    // Fixed Expense Transfer section
    const transferAmt = primaryIncome - fixedLiabilities;
    document.getElementById("transferPrimaryIncome").textContent = formatMoney(primaryIncome);
    document.getElementById("transferFixedExpenses").textContent = formatMoney(fixedLiabilities);
    const transferEl = document.getElementById("transferAmount");
    transferEl.textContent = formatMoney(Math.abs(transferAmt));
    transferEl.style.color = transferAmt >= 0 ? "#22c55e" : "#ef4444";
    transferEl.previousElementSibling.textContent = transferAmt >= 0
        ? "Transfer to Expense Account"
        : "Shortfall (Fixed Expenses exceed Income)";
}

function renderPieChart(monthData) {
    const ctx = pieCanvas.getContext("2d");
    
    if (pieChart) {
        pieChart.destroy();
    }
    
    const dist = getMonthlyDistribution(monthData);
    
    const data = {
        labels: ["Investment", "Liability", "Saving", "Expenditure", "Other"],
        datasets: [{
            data: [
                dist.investment,
                dist.liability,
                dist.saving,
                dist.expenditure,
                dist.other
            ],
            backgroundColor: [
                "#3b82f6", // Investment - blue
                "#ef4444", // Liability - red
                "#22c55e", // Saving - green
                "#f97316", // Expenditure - orange
                "#a855f7"  // Other - purple
            ],
            borderWidth: 0
        }]
    };
    
    const isMobile = window.innerWidth < 640;
    pieChart = new Chart(ctx, {
        type: "pie",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: isMobile ? "bottom" : "right",
                    align: "center",
                    labels: {
                        color: getChartThemeColors().text,
                        font: { size: 12 },
                        padding: 14,
                        boxWidth: 14,
                        boxHeight: 14,
                        generateLabels: (chart) => {
                            const ds = chart.data.datasets[0];
                            const total = ds.data.reduce((a, b) => a + b, 0);
                            const textColor = getChartThemeColors().text;
                            return chart.data.labels.map((label, i) => ({
                                text: `${label}  ${total > 0 ? Math.round(ds.data[i] / total * 100) : 0}%`,
                                fillStyle: ds.backgroundColor[i],
                                strokeStyle: ds.backgroundColor[i],
                                fontColor: textColor,
                                color: textColor,
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${formatMoney(ctx.raw)}`
                    }
                }
            }
        }
    });
}

function renderTableHead() {
    const fields = TAB_FIELDS[activeTabId] || TAB_FIELDS.monthlyBudget;
    tableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => {
        const th = document.createElement("th");
        th.textContent = f.label;
        tr.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "";
    tr.appendChild(actionTh);
    tableHead.appendChild(tr);
}

function renderDynamicFields() {
    dynamicFields.innerHTML = "";
    const fields = TAB_FIELDS[activeTabId] || TAB_FIELDS.monthlyBudget;
    
    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "field";
        
        const label = document.createElement("label");
        label.textContent = field.label;
        label.htmlFor = `field_${field.id}`;
        div.appendChild(label);
        
        let input;
        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") {
                input.min = "0";
                input.step = "1";
            }
        }
        input.id = `field_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        
        dynamicFields.appendChild(div);
        fieldInputs[field.id] = input;
    });
}

function renderTabs() {
    tabList.innerHTML = "";

    getTabs().forEach(tab => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tab" + (tab.id === activeTabId ? " active" : "");
        btn.textContent = tab.label;
        btn.style.background = tab.color;
        btn.style.color = tab.text;
        btn.addEventListener("click", () => {
            activeTabId = tab.id;
            searchInput.value = "";
            render();
            if (window.innerWidth <= 768) {
                tabList.classList.remove("open");
            }
        });
        tabList.appendChild(btn);
    });

    // Update mobile label with active tab name
    const activeTab = getTabs().find(t => t.id === activeTabId);
    if (mobileActiveTab && activeTab) {
        mobileActiveTab.textContent = activeTab.label;
    }
}

function renderSummary(entries) {
    const planned = entries.reduce((s, i) => s + Number(i.planned || 0), 0);
    const actual  = entries.reduce((s, i) => s + Number(i.actual  || 0), 0);
    totals.planned.textContent = formatMoney(planned);
    totals.actual.textContent  = formatMoney(actual);
    totals.balance.textContent = formatMoney(planned - actual);
    totals.count.textContent   = String(entries.length);
}

function renderRows(entries) {
    const q = searchInput.value.trim().toLowerCase();
    const fields = TAB_FIELDS[activeTabId] || TAB_FIELDS.monthlyBudget;
    const filtered = q
        ? entries.filter(i => fields.map(f => i[f.id]).join(" ").toLowerCase().includes(q))
        : entries;
    entryRows.innerHTML = "";
    emptyState.classList.toggle("visible", filtered.length === 0);
    filtered.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") {
                td.textContent = formatMoney(Number(item[f.id] || 0));
                td.className = "amount";
            } else {
                td.textContent = esc(item[f.id] || "—");
            }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `${renderRowActions(item.id)}`;
        row.appendChild(actionTd);
        entryRows.appendChild(row);
    });
}

// ── Entry actions ─────────────────────────────────────────────────────────────
function addEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("standard");
    if (!entry.name || entry.planned < 0) return;
    upsertSectionEntry("standard", entry);
    resetSectionForm("standard");
    render();
}

function deleteEntry(id) {
    if (activeTabId === "cards") {
        const entry = activeEntries().find(i => i.id === id);
        if (entry && entry.isPrimary === "Yes") {
            const confirmed = confirm(
                "⚠️  You are about to delete your PRIMARY account.\n\n" +
                "This account is used for tracking your monthly balance. " +
                "Deleting it will remove the primary designation and may affect " +
                "monthly balance calculations until a new primary account is set.\n\n" +
                "Are you sure you want to delete this primary account?"
            );
            if (!confirmed) return;
        } else {
            if (!confirm("Delete this account? This cannot be undone.")) return;
        }
    } else {
        if (!confirm("Delete this entry? This cannot be undone.")) return;
    }
    setActiveEntries(activeEntries().filter(i => i.id !== id));
    Object.keys(editingEntryIds).forEach(tabId => {
        if (editingEntryIds[tabId] === id) editingEntryIds[tabId] = null;
    });
    render();
}

function clearActiveTab() {
    if (!activeEntries().length) return;
    if (confirm("Clear all items in this tab?")) {
        setActiveEntries([]);
        render();
    }
}

// ── Export to Excel ─────────────────────────────────────────────────────────────
function exportToExcel() {
    const entries = activeEntries();
    if (!entries.length) {
        alert("No data to export.");
        return;
    }
    
    const tab = getTabs().find(t => t.id === activeTabId) || DEFAULT_TABS[0];
    const fields = TAB_FIELDS[activeTabId] || TAB_FIELDS.monthlyBudget;
    
    const headers = fields.map(f => f.label);
    const data = entries.map(e => fields.map(f => e[f.id] || ""));
    
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tab.label);
    XLSX.writeFile(wb, `${tab.label.replace(/\s+/g, "_")}_export.xlsx`);
}

// ── Reset All Data ─────────────────────────────────────────────────────────────
function resetAllData() {
    const confirmation = confirm(
        "⚠️ WARNING: This will delete ALL your data including:\n\n" +
        "• All budget entries\n" +
        "• All monthly budget data\n" +
        "• All financial goals\n" +
        "• All investments\n" +
        "• All insurances\n" +
        "• All cards\n" +
        "• Net worth data\n" +
        "• Tax plan data\n" +
        "• Gifts\n" +
        "• Emergency fund data\n\n" +
        "This action CANNOT be undone!\n\n" +
        "Type 'DELETE' to confirm:"
    );
    
    if (!confirmation) return;
    
    const deleteConfirmation = prompt("Type 'DELETE' to confirm permanent deletion:");
    if (deleteConfirmation !== "DELETE") {
        alert("Reset cancelled. Data remains intact.");
        return;
    }
    
    // Clear all data but preserve user name
    appData = {
        tabData: {},
        monthlyBudgetData: {},
        customTabs: [],
        userName: appData.userName || "",
        fixedMonthlyIncome: 0,
        dateOfBirth: "",
        currentAge: 0
    };
    
    // Save the cleared data
    doSave();
    
    // Re-render
    render();
    
    alert("✅ All data has been permanently deleted.");
}

// ── Event bindings ────────────────────────────────────────────────────────────
entryForm.addEventListener("submit", addEntry);
searchInput.addEventListener("input", render);
exportBtn.addEventListener("click", exportToExcel);
clearTabButton.addEventListener("click", clearActiveTab);
resetAllDataButton.addEventListener("click", resetAllData);
entryRows.addEventListener("click", e => {
    handleTableAction("standard", e);
});

// Monthly Budget event bindings
prevMonthBtn.addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() + (isAnnualBudgetView ? -12 : -1));
    renderMonthlyBudget();
});

nextMonthBtn.addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() + (isAnnualBudgetView ? 12 : 1));
    renderMonthlyBudget();
});

toggleBudgetView.addEventListener("click", () => {
    isAnnualBudgetView = !isAnnualBudgetView;
    toggleBudgetView.textContent = isAnnualBudgetView ? "📅 Monthly" : "📊 Annual";
    prevMonthBtn.textContent = isAnnualBudgetView ? "← Previous FY" : "← Previous";
    nextMonthBtn.textContent = isAnnualBudgetView ? "Next FY →" : "Next →";
    renderMonthlyBudget();
});

toggleBudgetEdit.addEventListener("click", () => {
    // If in annual view, switch to monthly first before editing
    if (isAnnualBudgetView) {
        isAnnualBudgetView = false;
        toggleBudgetView.textContent = "📊 Annual";
        prevMonthBtn.textContent = "← Previous";
        nextMonthBtn.textContent = "Next →";
    }
    if (!isBudgetEditMode) {
        // Entering edit mode – snapshot current data so cancel can revert
        const monthKey = getMonthKey(currentMonth);
        const current = (appData.monthlyBudgetData || {})[monthKey];
        budgetEditSnapshot = { monthKey, data: current ? JSON.parse(JSON.stringify(current)) : null };
    } else {
        // Leaving edit mode (Save)
        scheduleSave();
    }
    isBudgetEditMode = !isBudgetEditMode;
    toggleBudgetEdit.textContent = isBudgetEditMode ? "✓ Done" : "✎ Edit";
    renderMonthlyBudget();
});

// ── Sort/Filter toolbar event delegation ─────────────────────────────────────
(function () {
    const previewMap = {
        goalPreview:        { tabId: "financialGoal", render: () => renderFinancialGoal() },
        investmentPreview:  { tabId: "investments",   render: () => renderInvestments() },
        insurancePreview:   { tabId: "insurances",    render: () => renderInsurances() },
        giftsPreview:       { tabId: "gifts",         render: () => renderGifts() },
    };

    Object.entries(previewMap).forEach(([containerId, { tabId, render }]) => {
        const el = document.getElementById(containerId);
        if (!el) return;

        el.addEventListener("change", e => {
            if (e.target.classList.contains("toolbar-sort-select")) {
                listSortFilter[tabId].sortBy = e.target.value;
                render();
            } else if (e.target.classList.contains("toolbar-filter-select")) {
                const fieldId = e.target.dataset.field;
                listSortFilter[tabId].filters[fieldId] = e.target.value;
                render();
            }
        });

        el.addEventListener("click", e => {
            if (e.target.classList.contains("toolbar-sort-dir")) {
                listSortFilter[tabId].sortDir = listSortFilter[tabId].sortDir === "asc" ? "desc" : "asc";
                render();
            }
        });
    });
}());

// Financial Goal event bindings
toggleGoalEdit.addEventListener("click", () => {
    isGoalEditMode = !isGoalEditMode;
    renderFinancialGoal();
});

goalForm.addEventListener("submit", addGoalEntry);
goalTableBody.addEventListener("click", e => {
    handleTableAction("financialGoal", e);
});

// Monthly Fixed Expense event bindings
toggleExpenseEdit.addEventListener("click", () => {
    isExpenseEditMode = !isExpenseEditMode;
    cancelExpenseEdit.hidden = !isExpenseEditMode;
    if (isExpenseEditMode) {
        renderMonthlyFixedExpense();
        monthlyIncomeInput.value = appData.fixedMonthlyIncome || "";
    } else {
        scheduleSave();
        renderMonthlyFixedExpense();
    }
});

saveMonthlyIncome.addEventListener("click", () => {
    appData.fixedMonthlyIncome = Number(monthlyIncomeInput.value || 0);
    scheduleSave();
    displayMonthlyIncome.textContent = formatMoney(appData.fixedMonthlyIncome);
    renderMonthlyFixedExpense();
});
cancelExpenseEdit.addEventListener("click", () => {
    isExpenseEditMode = false;
    clearEditing("monthlyFixedExpense");
    cancelExpenseEdit.hidden = true;
    renderMonthlyFixedExpense();
});

expenseForm.addEventListener("submit", addExpenseEntry);
expenseTableBody.addEventListener("click", e => {
    handleTableAction("monthlyFixedExpense", e);
});

// Investments event bindings
toggleInvestmentEdit.addEventListener("click", () => {
    isInvestmentEditMode = !isInvestmentEditMode;
    renderInvestments();
});

investmentForm.addEventListener("submit", addInvestmentEntry);
investmentTableBody.addEventListener("click", e => {
    handleTableAction("investments", e);
});

// Insurances event bindings
toggleInsuranceEdit.addEventListener("click", () => {
    isInsuranceEditMode = !isInsuranceEditMode;
    renderInsurances();
});

insuranceForm.addEventListener("submit", addInsuranceEntry);
insuranceTableBody.addEventListener("click", e => {
    handleTableAction("insurances", e);
});

// Cards event bindings
toggleCardEdit.addEventListener("click", () => {
    isCardEditMode = !isCardEditMode;
    renderCards();
});

cardForm.addEventListener("submit", addCardEntry);
cardTableBody.addEventListener("click", e => {
    handleTableAction("cards", e);
});

// Net Worth event bindings
toggleNetWorthEdit.addEventListener("click", () => {
    isNetWorthEditMode = !isNetWorthEditMode;
    renderNetWorth();
});

netWorthForm.addEventListener("submit", addNetWorthEntry);
netWorthTableBody.addEventListener("click", e => {
    handleTableAction("netWorth", e);
});

// Tax Plan event bindings
toggleTaxPlanEdit.addEventListener("click", () => {
    isTaxPlanEditMode = !isTaxPlanEditMode;
    renderTaxPlan();
});

taxRegimeSelect.addEventListener("change", () => {
    if (!isTaxPlanEditMode) {
        renderTaxPlan();
    }
});
financialYearSelect.addEventListener("change", () => {
    if (!isTaxPlanEditMode) renderTaxPlan();
});

taxPlanForm.addEventListener("submit", addTaxPlanEntry);
taxPlanTableBody.addEventListener("click", e => {
    handleTableAction("taxPlan", e);
});

// Gifts event bindings
toggleGiftsEdit.addEventListener("click", () => {
    isGiftsEditMode = !isGiftsEditMode;
    renderGifts();
});

giftsForm.addEventListener("submit", addGiftsEntry);
giftsTableBody.addEventListener("click", e => {
    handleTableAction("gifts", e);
});

// Emergency Fund event bindings
toggleEmergencyFundEdit.addEventListener("click", () => {
    isEmergencyFundEditMode = !isEmergencyFundEditMode;
    renderEmergencyFund();
});

emergencyFundForm.addEventListener("submit", addEmergencyFundEntry);

// Auto-save on category field changes
inflowFields.addEventListener("input", handleCategoryFieldChange);
outflowFields.addEventListener("input", handleCategoryFieldChange);
investingFields.addEventListener("input", handleCategoryFieldChange);

function handleCategoryFieldChange(e) {
    if (e.target.disabled) return;
    if (!e.target.dataset.fieldId) return;
    
    const monthKey = getMonthKey(currentMonth);
    if (!appData.monthlyBudgetData) appData.monthlyBudgetData = {};
    if (!appData.monthlyBudgetData[monthKey]) {
        appData.monthlyBudgetData[monthKey] = {
            inflow: {},
            outflow: {},
            investing: {},
            monthEndBalance: 0
        };
    }
    
    const monthData = appData.monthlyBudgetData[monthKey];
    
    const category = e.target.dataset.category
        ? e.target.dataset.category.replace(/Fields$/, "")
        : e.target.parentElement.parentElement.id;
    const fieldId = e.target.dataset.fieldId;
    if (!monthData[category]) {
        monthData[category] = {};
    }
    monthData[category][fieldId] = Number(e.target.value) || 0;
    
    // Update edit mode totals
    const inflowTotal = Object.values(monthData.inflow).reduce((s, v) => s + Number(v || 0), 0);
    const outflowTotal = Object.values(monthData.outflow).reduce((s, v) => s + Number(v || 0), 0);
    const investingTotal = Object.values(monthData.investing).reduce((s, v) => s + Number(v || 0), 0);
    document.getElementById("inflowTotalEdit").textContent = formatMoney(inflowTotal);
    document.getElementById("outflowTotalEdit").textContent = formatMoney(outflowTotal);
    document.getElementById("investingTotalEdit").textContent = formatMoney(investingTotal);
    
    calculateAndDisplaySummary(monthData);
    if (!isBudgetEditMode) renderPieChart(monthData);
    scheduleSave();
}

function addGoalEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("financialGoal");
    if (!entry.name || entry.amountNeeded < 0) return;
    upsertSectionEntry("financialGoal", entry);
    resetSectionForm("financialGoal");
    renderFinancialGoal();
}

function addExpenseEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("monthlyFixedExpense");
    if (!entry.name || entry.amount < 0) return;
    upsertSectionEntry("monthlyFixedExpense", entry);
    resetSectionForm("monthlyFixedExpense");
    renderMonthlyFixedExpense();
}

function addInvestmentEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("investments");
    if (!entry.name || entry.initialInvestment < 0) return;
    upsertSectionEntry("investments", entry);
    resetSectionForm("investments");
    renderInvestments();
}

function addInsuranceEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("insurances");
    if (!entry.name || entry.premium < 0) return;
    upsertSectionEntry("insurances", entry);
    resetSectionForm("insurances");
    renderInsurances();
}

function addCardEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("cards");
    if (!entry.bankName) return;

    const entries = activeEntries();
    const editingId = editingEntryIds.cards;

    if (entry.isPrimary === "Yes" && entries.some(c => c.isPrimary === "Yes" && c.id !== editingId)) {
        alert("A primary account already exists.\nPlease edit the existing primary account or choose \"No\" for this account.");
        renderCardDynamicFields();
        return;
    }
    if (entry.purpose === "Saving" && entries.some(c => c.purpose === "Saving" && c.id !== editingId)) {
        alert("A Saving account already exists.\nOnly one Saving account is allowed.");
        return;
    }

    upsertSectionEntry("cards", entry);
    resetSectionForm("cards");
    renderCards();
}

function addNetWorthEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("netWorth");
    if (!entry.name || entry.value < 0) return;
    upsertSectionEntry("netWorth", entry);
    resetSectionForm("netWorth");
    renderNetWorth();
}

function addTaxPlanEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("taxPlan");
    if (!entry.name || entry.amount < 0) return;
    upsertSectionEntry("taxPlan", entry);
    resetSectionForm("taxPlan");
    renderTaxPlan();
}

function addGiftsEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("gifts");
    if (!entry.name) return;
    upsertSectionEntry("gifts", entry);
    resetSectionForm("gifts");
    renderGifts();
}

function addEmergencyFundEntry(event) {
    event.preventDefault();
    const fields = TAB_FIELDS.emergencyFund || TAB_FIELDS.monthlyBudget;
    const entry = { id: String(Date.now()) };
    
    fields.forEach(f => {
        const input = document.getElementById(`emergencyFund_${f.id}`);
        if (f.type === "number") {
            entry[f.id] = Number(input.value || 0);
        } else {
            entry[f.id] = input.value.trim();
        }
    });
    
    // Emergency fund is a single entry, replace existing
    const entries = [entry];
    setActiveEntries(entries);
    emergencyFundForm.reset();
    isEmergencyFundEditMode = false;
    cancelEmergencyFundEdit.hidden = true;
    renderEmergencyFund();
}

function saveMonthBudgetData() {
    scheduleSave();
}
