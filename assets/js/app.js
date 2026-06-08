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
    { id: "cards",               label: "Accounts",              color: "#444", text: "#fff", core: true },
    { id: "inflow",              label: "Investments",           color: "#444", text: "#fff", core: true },
    { id: "outflow",             label: "Fixed Outflow",          color: "#444", text: "#fff", core: true },
    { id: "insurance",           label: "Insurance",             color: "#444", text: "#fff", core: true },
    { id: "monthlyBudget",       label: "Budget",                color: "#444", text: "#fff", core: true },
    { id: "financialGoal",       label: "Goals",                 color: "#444", text: "#fff", core: true },
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
    inflow: [
        { id: "name",         label: "Investment Name",     type: "text",   placeholder: "e.g. HDFC SIP, Axis FD", required: true },
        { id: "type",         label: "Type",               type: "select", options: ["Mutual Fund", "SIP", "FD", "RD", "Stocks", "PPF", "EPF", "NPS", "Bonds", "Gold", "Real Estate", "Saving", "Other"] },
        { id: "category",     label: "Category",           type: "select", options: ["Existing", "Monthly"] },
        { id: "amount",       label: "Invested Amount (₹)", type: "number", placeholder: "Total amount invested", required: true },
        { id: "currentValue", label: "Current Value (₹)",  type: "number", placeholder: "Market value today" },
        { id: "interestRate", label: "Expected Return (%)", type: "number", placeholder: "Annual return rate" },
        { id: "frequency",    label: "Frequency",           type: "select", options: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "One-Time"] },
        { id: "startDate",    label: "Start Date",          type: "date",   placeholder: "" },
        { id: "endDate",      label: "Maturity Date",       type: "date",   placeholder: "" },
        { id: "details",      label: "Notes",               type: "text",   placeholder: "Optional notes" }
    ],
    outflow: [
        { id: "name",      label: "Name",           type: "text",   placeholder: "e.g. Rent, LIC Premium", required: true },
        { id: "type",      label: "Type",           type: "select", options: ["Insurance", "Liability", "Saving", "Expenditure", "Investment"] },
        { id: "amount",    label: "Amount (₹)",     type: "number", placeholder: "0", required: true },
        { id: "frequency", label: "Frequency",      type: "select", options: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "One-Time"] },
        { id: "bankName",  label: "Bank Name",      type: "text",   placeholder: "e.g. HDFC, ICICI" },
        { id: "endDate",   label: "End Date",       type: "date",   placeholder: "" },
        { id: "details",   label: "Details",        type: "text",   placeholder: "Optional" }
    ],
    cards: [
        { id: "bankName",      label: "Bank/NBFC Name",      type: "text",   placeholder: "e.g. HDFC, ICICI", required: true },
        { id: "isPrimary",     label: "Primary Account",     type: "select", options: ["No", "Yes"] },
        { id: "accountPresent", label: "Account Present",    type: "select", options: ["Yes", "No"] },
        { id: "balance",       label: "Balance (₹)",         type: "number", placeholder: "0" },
        { id: "debitCardPresent", label: "Debit Card Present", type: "select", options: ["Yes", "No"] },
        { id: "creditCardPresent", label: "Credit Card Present", type: "select", options: ["Yes", "No"] },
        { id: "creditLimit",   label: "Credit Card Limit (₹)", type: "number", placeholder: "0" },
        { id: "purpose",       label: "Purpose of Use",      type: "select", options: ["Salary", "Expenditure", "Saving", "Investment", "Loan", "Others"] },
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
    ],
    insurance: [
        { id: "name",          label: "Policy Name",          type: "text",   placeholder: "e.g. LIC Term Plan, Star Health", required: true },
        { id: "policyType",    label: "Policy Type",          type: "select", options: ["Term Life", "Whole Life", "Health", "Vehicle", "Home", "Travel", "Critical Illness", "Personal Accident", "Other"] },
        { id: "provider",      label: "Insurance Provider",   type: "text",   placeholder: "e.g. LIC, HDFC Life, Star Health" },
        { id: "policyNumber",  label: "Policy Number",        type: "text",   placeholder: "Policy/Certificate number" },
        { id: "sumAssured",    label: "Sum Assured (₹)",      type: "number", placeholder: "Coverage amount" },
        { id: "premiumAmount", label: "Premium Amount (₹)",   type: "number", placeholder: "0 if no current premium" },
        { id: "premiumFrequency", label: "Premium Frequency", type: "select", options: ["Monthly", "Quarterly", "Half-Yearly", "Annual", "None (Paid Up)"] },
        { id: "startDate",     label: "Policy Start Date",    type: "date",   placeholder: "" },
        { id: "endDate",       label: "Policy End Date",      type: "date",   placeholder: "" },
        { id: "nominee",       label: "Nominee",              type: "text",   placeholder: "Nominee name" },
        { id: "details",       label: "Notes",                type: "text",   placeholder: "Optional notes" }
    ]
};

// ── Monthly Budget Category Fields ───────────────────────────────────────────
const MONTHLY_BUDGET_CATEGORIES = {
    inflow: [
        { id: "primaryIncome", label: "Primary Income (Salary credited this month)", type: "number" },
        { id: "secondaryIncome", label: "Secondary Income", type: "number" },
        { id: "borrowing", label: "Borrowing/Money Back", type: "number" },
        { id: "interest", label: "Interest/Dividend", type: "number" },
        { id: "othersInflow", label: "Others", type: "number" }
    ],
    outflow: [
        { id: "loanEMI", label: "Auto-calculated Liabilities (EMIs)", type: "number" },
        { id: "insurancePremiums", label: "Auto-calculated Insurance Premiums", type: "number" },
        { id: "creditCardOutstanding", label: "Previous Month CC Bill (unpaid)", type: "number" },
        { id: "midMonthCCOutstanding", label: "Current Month CC Spending", type: "number" },
        { id: "debtRepayment", label: "Debt Repayment / Lending", type: "number" },
        { id: "utilityBills", label: "Utility Bills (electricity, water, gas, internet)", type: "number" },
        { id: "familyExpenditure", label: "Family Expenditure (groceries, household)", type: "number" },
        { id: "miscExpenses", label: "Miscellaneous Expenses", type: "number" },
        { id: "fixedExpenditure", label: "Auto-calculated Fixed Expenditure", type: "number" }
    ],
    investing: [
        { id: "fixedSaving", label: "Auto-calculated Fixed Saving", type: "number" },
        { id: "fixedInvestment", label: "Auto-calculated Fixed Investment", type: "number" },
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

// Inflow refs
const inflowUI             = document.getElementById("inflowUI");
const toggleInflowEdit     = document.getElementById("toggleInflowEdit");
const inflowTabPreview     = document.getElementById("inflowTabPreview");
const inflowTabEdit        = document.getElementById("inflowTabEdit");
const inflowList           = document.getElementById("inflowList");
const inflowForm           = document.getElementById("inflowForm");
const inflowDynamicFields  = document.getElementById("inflowDynamicFields");
const inflowTableHead      = document.getElementById("inflowTableHead");
const inflowTableBody      = document.getElementById("inflowTableBody");
const inflowEmptyState     = document.getElementById("inflowEmptyState");
const inflowBarChartCanvas = document.getElementById("inflowBarChart");

// Outflow refs
const outflowUI             = document.getElementById("outflowUI");
const toggleOutflowEdit     = document.getElementById("toggleOutflowEdit");
const outflowTabPreview     = document.getElementById("outflowTabPreview");
const outflowTabEdit        = document.getElementById("outflowTabEdit");
const outflowList           = document.getElementById("outflowList");
const outflowForm           = document.getElementById("outflowForm");
const outflowDynamicFields  = document.getElementById("outflowDynamicFields");
const outflowTableHead      = document.getElementById("outflowTableHead");
const outflowTableBody      = document.getElementById("outflowTableBody");
const outflowEmptyState     = document.getElementById("outflowEmptyState");
const outflowBankChartCanvas = document.getElementById("outflowBankChart");
const outflowTypeChartCanvas = document.getElementById("outflowTypeChart");
const monthlyIncomeInput   = document.getElementById("monthlyIncomeInput");
const saveMonthlyIncome    = document.getElementById("saveMonthlyIncome");

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
const emergencyFundPreview      = document.getElementById("emergencyFundPreview");
const emergencyFundEdit         = document.getElementById("emergencyFundEdit");
const emergencyFundForm        = document.getElementById("emergencyFundForm");
const emergencyFundDynamicFields = document.getElementById("emergencyFundDynamicFields");

// Insurance refs
const insuranceUI             = document.getElementById("insuranceUI");
const toggleInsuranceEdit     = document.getElementById("toggleInsuranceEdit");
const insuranceTabPreview     = document.getElementById("insuranceTabPreview");
const insuranceTabEdit        = document.getElementById("insuranceTabEdit");
const insuranceList           = document.getElementById("insuranceList");
const insuranceForm           = document.getElementById("insuranceForm");
const insuranceDynamicFields  = document.getElementById("insuranceDynamicFields");
const insuranceTableHead      = document.getElementById("insuranceTableHead");
const insuranceTableBody      = document.getElementById("insuranceTableBody");
const insuranceEmptyState     = document.getElementById("insuranceEmptyState");

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
let isInflowEditMode = false;
let isOutflowEditMode = false;
let isCardEditMode = false;
let isNetWorthEditMode = false;
let isTaxPlanEditMode = false;
let isGiftsEditMode = false;
let isEmergencyFundEditMode = false;
let isInsuranceEditMode = false;
let activeInvestmentView = "all"; // all | existing | monthly | portfolio
let outflowBankChart = null;
let outflowTypeChart = null;
let inflowBarChart   = null;
let netWorthProjectionChart = null;
let localWritePending = false;
let budgetEditSnapshot = null;

// ── Sort/filter state for list views ─────────────────────────────────────────
const listSortFilter = {
    financialGoal: { sortBy: "", sortDir: "asc", filters: {} },
    inflow:        { sortBy: "", sortDir: "asc", filters: {} },
    outflow:       { sortBy: "", sortDir: "asc", filters: {} },
    gifts:         { sortBy: "", sortDir: "asc", filters: {} },
    insurance:     { sortBy: "", sortDir: "asc", filters: {} },
};

const editingEntryIds = {
    financialGoal: null,
    inflow: null,
    outflow: null,
    cards: null,
    netWorth: null,
    taxPlan: null,
    gifts: null,
    standard: null,
    insurance: null,
};

const sectionConfig = {
    financialGoal: { prefix: "goal", form: () => goalForm, submitText: "Save Goal", addText: "Add Goal", render: () => renderFinancialGoal() },
    inflow: { prefix: "inflow", form: () => inflowForm, submitText: "Save Inflow", addText: "Add Inflow", render: () => renderInflow() },
    outflow: { prefix: "outflow", form: () => outflowForm, submitText: "Save Outflow", addText: "Add Outflow", render: () => renderOutflow() },
    cards: { prefix: "card", form: () => cardForm, submitText: "Save Account", addText: "Add Account", render: () => renderCards() },
    netWorth: { prefix: "netWorth", form: () => netWorthForm, submitText: "Save Asset/Liability", addText: "Add Asset/Liability", render: () => renderNetWorth() },
    taxPlan: { prefix: "taxPlan", form: () => taxPlanForm, submitText: "Save Tax Item", addText: "Add Tax Saving Item", render: () => renderTaxPlan() },
    gifts: { prefix: "gifts", form: () => giftsForm, submitText: "Save Gift", addText: "Add Gift", render: () => renderGifts() },
    insurance: { prefix: "insurance", form: () => insuranceForm, submitText: "Save Policy", addText: "Add Policy", render: () => renderInsurance() },
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
                onboardingComplete: false,
                onboardingDate: new Date().toISOString().slice(0, 10),
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
    const payload = JSON.stringify({ exportDate: new Date().toISOString(), version: "2.0", data: appData }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `smartfin-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Backup exported successfully!");
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
            // Basic validation: must have tabData or be recognisable
            if (!imported.tabData && !imported.monthlyBudgetData && !imported.customTabs) {
                throw new Error("File does not contain SmartFin data.");
            }
            const exportInfo = parsed.exportDate ? `\nBackup date: ${new Date(parsed.exportDate).toLocaleDateString("en-IN")}` : "";
            if (!window.confirm(`This will overwrite ALL your current data with the imported backup.${exportInfo}\n\nContinue?`)) return;

            // Ensure all required fields exist in imported data
            const safeImport = {
                tabData: imported.tabData || {},
                customTabs: imported.customTabs || [],
                userName: imported.userName || appData.userName || "",
                monthlyBudgetData: imported.monthlyBudgetData || {},
                fixedMonthlyIncome: imported.fixedMonthlyIncome || 0,
                dateOfBirth: imported.dateOfBirth || "",
                currentAge: imported.currentAge || 0,
                onboardingComplete: imported.onboardingComplete || false,
                onboardingDate: imported.onboardingDate || "",
                dataMigrated: imported.dataMigrated || false,
            };

            db.collection("users").doc(currentUser.uid)
                .set(safeImport)
                .then(() => {
                    // Update local state immediately
                    appData = safeImport;
                    // Re-check onboarding based on imported accounts
                    const cards = (appData.tabData || {}).cards || [];
                    const hasPrimaryImp = cards.some(c => c.isPrimary === "Yes");
                    const hasSalaryImp = cards.some(c => c.purpose === "Salary" && c.isPrimary !== "Yes");
                    appData.onboardingComplete = hasPrimaryImp && hasSalaryImp;
                    // Trigger migration if needed
                    if (!appData.dataMigrated) migrateToNewTabStructure();
                    activeTabId = appData.onboardingComplete ? "monthlyBudget" : "cards";
                    render();
                    closeSettings();
                    alert("Data imported successfully!");
                })
                .catch(err => alert("Import failed: " + err.message));
        } catch (err) {
            alert("Could not read file. Make sure it is a valid SmartFin backup (.json).\n\n" + err.message);
        }
    };
    reader.readAsText(file);
    importFileInput.value = "";
});

// Reset (Settings panel)
resetDataBtn.addEventListener("click", () => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure? This will permanently delete ALL your financial data and cannot be undone.")) return;
    const typed = prompt("Type DELETE to confirm:");
    if (typed !== "DELETE") { alert("Reset cancelled."); return; }
    const resetData = {
        tabData: {}, customTabs: [], userName: appData.userName || "",
        monthlyBudgetData: {}, fixedMonthlyIncome: 0,
        dateOfBirth: "", currentAge: 0,
        onboardingComplete: false, onboardingDate: "", dataMigrated: true
    };
    db.collection("users").doc(currentUser.uid)
        .set(resetData)
        .then(() => {
            appData = resetData;
            activeTabId = "cards";
            render();
            closeSettings();
            alert("All data has been reset.");
        })
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
    let firstLoad = true;
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
                    onboardingComplete: d.onboardingComplete || false,
                    onboardingDate: d.onboardingDate || "",
                    dataMigrated: d.dataMigrated || false,
                };
                userEmailDisplay.textContent = appData.userName || currentUser.email;

                // Data migration: convert old tab structure on first load
                if (!appData.dataMigrated) {
                    migrateToNewTabStructure();
                }

                // Landing tab logic on first load
                if (firstLoad) {
                    firstLoad = false;
                    if (!appData.onboardingComplete) {
                        activeTabId = "cards";
                    } else {
                        activeTabId = "monthlyBudget";
                    }
                }
            } else {
                appData = { tabData: {}, customTabs: [], userName: "", monthlyBudgetData: {}, fixedMonthlyIncome: 0, dateOfBirth: "", currentAge: 0, onboardingComplete: false, onboardingDate: "", dataMigrated: false };
                userEmailDisplay.textContent = currentUser.email;
                if (firstLoad) {
                    firstLoad = false;
                    activeTabId = "cards";
                }
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

// ── Data migration: old tabs → new inflow/outflow ────────────────────────────
function migrateToNewTabStructure() {
    if (!appData.tabData) appData.tabData = {};
    const td = appData.tabData;
    const oldInvestments = td.investments || [];
    const oldExpenses    = td.monthlyFixedExpense || [];
    const oldInsurances  = td.insurances || [];

    // Skip if nothing to migrate
    if (oldInvestments.length === 0 && oldExpenses.length === 0 && oldInsurances.length === 0) {
        appData.dataMigrated = true;
        if (!appData.onboardingDate) appData.onboardingDate = new Date().toISOString().slice(0, 10);
        scheduleSave();
        return;
    }

    const newInflow  = td.inflow  || [];
    const newOutflow = td.outflow || [];

    // Migrate investments → inflow
    oldInvestments.forEach(inv => {
        newInflow.push({
            id: inv.id,
            name: inv.name || "",
            type: "Investment",
            amount: Number(inv.initialInvestment || 0),
            currentValue: Number(inv.totalAmount || inv.initialInvestment || 0),
            interestRate: Number(inv.annualInterestRate || 0),
            frequency: inv.frequency === "Annually" ? "Annual" : (inv.frequency || "One-Time"),
            startDate: inv.startDate || "",
            endDate: inv.maturityDate || "",
            details: inv.details || "",
        });
    });

    // Migrate liabilities → inflow (Investment/Saving types) or outflow (others)
    oldExpenses.forEach(exp => {
        const t = exp.type || "Expenditure";
        if (t === "Investment" || t === "Saving") {
            newInflow.push({
                id: exp.id,
                name: exp.name || "",
                type: t,
                amount: Number(exp.amount || 0),
                currentValue: 0,
                interestRate: 0,
                frequency: exp.frequency || "Monthly",
                startDate: "",
                endDate: exp.endDate || "",
                details: exp.bankName ? `Bank: ${exp.bankName}` : "",
            });
        } else {
            newOutflow.push({
                id: exp.id,
                name: exp.name || "",
                type: t,
                amount: Number(exp.amount || 0),
                frequency: exp.frequency || "Monthly",
                bankName: exp.bankName || "",
                endDate: exp.endDate || "",
                details: "",
            });
        }
    });

    // Migrate insurances → outflow
    oldInsurances.forEach(ins => {
        const detailParts = [];
        if (ins.policyType) detailParts.push(`Policy: ${ins.policyType}`);
        if (ins.sumAssured) detailParts.push(`Sum Assured: ${ins.sumAssured}`);
        if (ins.nomineeName) detailParts.push(`Nominee: ${ins.nomineeName}`);
        if (ins.nirLinked === "Yes") detailParts.push("NIR: Yes");
        newOutflow.push({
            id: ins.id,
            name: ins.name || "",
            type: "Insurance",
            amount: Number(ins.premium || 0),
            frequency: ins.premiumFrequency === "Semi-Annual" ? "Semi-Annual" : (ins.premiumFrequency || "Annual"),
            bankName: ins.companyName || "",
            endDate: ins.maturityDate || "",
            details: detailParts.join(", "),
        });
    });

    td.inflow  = newInflow;
    td.outflow = newOutflow;

    // Clean up old keys
    delete td.investments;
    delete td.monthlyFixedExpense;
    delete td.insurances;

    appData.dataMigrated = true;
    if (!appData.onboardingDate) appData.onboardingDate = new Date().toISOString().slice(0, 10);

    // Auto-set onboarding complete if user has accounts
    if ((td.cards || []).length > 0) {
        appData.onboardingComplete = true;
    }

    scheduleSave();
    console.log("Data migrated: investments→inflow, liabilities+insurances→outflow");
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
    return `<div class="row-actions"><button class="edit-row" type="button" data-id="${id}">Edit</button><button class="delete-row" type="button" data-id="${id}">Delete</button></div>`;
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

function getInflowCurrentValue(item) {
    const amount = Number(item.amount || 0);
    const currentVal = item.currentValue === "" || item.currentValue == null ? 0 : Number(item.currentValue || 0);
    const base = Math.max(amount, currentVal || amount);
    const annualRate = Number(item.interestRate || 0) / 100;
    const years = monthsBetween(item.startDate) / 12;
    if (base <= 0 || annualRate <= 0 || years <= 0) return base;
    return base * Math.pow(1 + annualRate, years);
}

function getOutflowAnnualAmount(item) {
    const amount = Number(item.amount || 0);
    const freq = item.frequency || "Monthly";
    if (freq === "Monthly") return amount * 12;
    if (freq === "Quarterly") return amount * 4;
    if (freq === "Semi-Annual") return amount * 2;
    if (freq === "Annual") return amount;
    return amount; // One-Time
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
    if (tabId === "inflow") {
        if (entry.currentValue === "" || Number(entry.currentValue || 0) <= 0) {
            entry.currentValue = Number(entry.amount || 0);
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

    // Outflow tab items with type=Liability → auto-populate budget outflow (all frequencies as monthly equivalent)
    const outflowItems = (appData.tabData || {}).outflow || [];
    outflowItems.forEach(item => {
        const amount = Number(item.amount || 0);
        if (amount <= 0) return;
        if (item.endDate && monthKey > item.endDate.slice(0, 7)) return;
        const freq = item.frequency || "Monthly";
        // Convert to monthly equivalent
        let monthlyAmount = 0;
        if (freq === "Monthly")      monthlyAmount = amount;
        else if (freq === "Quarterly")   monthlyAmount = amount / 3;
        else if (freq === "Semi-Annual") monthlyAmount = amount / 6;
        else if (freq === "Annual")      monthlyAmount = amount / 12;
        else if (freq === "One-Time") {
            // One-time: only include in the start month
            if (item.startDate && monthKey === item.startDate.slice(0, 7)) monthlyAmount = amount;
        }
        if (monthlyAmount <= 0) return;
        const freqLabel = freq !== "Monthly" ? ` (${freq} ÷ ${freq === "Quarterly" ? 3 : freq === "Semi-Annual" ? 6 : freq === "Annual" ? 12 : 1})` : "";
        if (item.type === "Liability") {
            values.outflow.loanEMI = (values.outflow.loanEMI || 0) + monthlyAmount;
            if (!breakdown.outflow.loanEMI) breakdown.outflow.loanEMI = [];
            breakdown.outflow.loanEMI.push({ name: item.name + freqLabel, amount: monthlyAmount, source: "Fixed Outflow" });
        } else if (item.type === "Insurance") {
            values.outflow.insurancePremiums = (values.outflow.insurancePremiums || 0) + monthlyAmount;
            if (!breakdown.outflow.insurancePremiums) breakdown.outflow.insurancePremiums = [];
            breakdown.outflow.insurancePremiums.push({ name: item.name + freqLabel, amount: monthlyAmount, source: "Fixed Outflow" });
        } else if (item.type === "Expenditure") {
            values.outflow.fixedExpenditure = (values.outflow.fixedExpenditure || 0) + monthlyAmount;
            if (!breakdown.outflow.fixedExpenditure) breakdown.outflow.fixedExpenditure = [];
            breakdown.outflow.fixedExpenditure.push({ name: item.name + freqLabel, amount: monthlyAmount, source: "Fixed Outflow" });
        } else if (item.type === "Saving") {
            values.investing.fixedSaving = (values.investing.fixedSaving || 0) + monthlyAmount;
            if (!breakdown.investing.fixedSaving) breakdown.investing.fixedSaving = [];
            breakdown.investing.fixedSaving.push({ name: item.name + freqLabel, amount: monthlyAmount, source: "Fixed Outflow" });
        } else if (item.type === "Investment") {
            values.investing.fixedInvestment = (values.investing.fixedInvestment || 0) + monthlyAmount;
            if (!breakdown.investing.fixedInvestment) breakdown.investing.fixedInvestment = [];
            breakdown.investing.fixedInvestment.push({ name: item.name + freqLabel, amount: monthlyAmount, source: "Fixed Outflow" });
        }
    });

    // Inflow tab items → auto-populate budget investing
    const inflowItems = (appData.tabData || {}).inflow || [];
    inflowItems.forEach(inv => {
        const amount = Number(inv.amount || 0);
        if (amount <= 0) return;
        if (inv.startDate && monthKey < inv.startDate.slice(0, 7)) return;
        if (inv.endDate && monthKey > inv.endDate.slice(0, 7)) return;
        if (inv.frequency === "Annual" && (!inv.startDate || monthKey.slice(5) === inv.startDate.slice(5, 7))) {
            values.investing.onetimeInvestment = (values.investing.onetimeInvestment || 0) + amount;
        }
        if (inv.frequency === "One-Time" && inv.startDate && monthKey === inv.startDate.slice(0, 7)) {
            values.investing.onetimeInvestment = (values.investing.onetimeInvestment || 0) + amount;
        }
    });

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

    // All UI panels
    const allPanels = { monthlyBudgetUI, standardUI, financialGoalUI, inflowUI, outflowUI, insuranceUI, cardsUI, netWorthUI, taxPlanUI, giftsUI, emergencyFundUI };
    // Hide all panels first
    Object.values(allPanels).forEach(p => { if (p) p.hidden = true; });

    const panelMap = {
        monthlyBudget: { panel: monthlyBudgetUI, render: renderMonthlyBudget },
        financialGoal: { panel: financialGoalUI, render: renderFinancialGoal },
        inflow:        { panel: inflowUI,        render: renderInflow },
        outflow:       { panel: outflowUI,       render: renderOutflow },
        cards:         { panel: cardsUI,          render: renderCards },
        netWorth:      { panel: netWorthUI,       render: renderNetWorth },
        taxPlan:       { panel: taxPlanUI,        render: renderTaxPlan },
        gifts:         { panel: giftsUI,          render: renderGifts },
        emergencyFund: { panel: emergencyFundUI,  render: renderEmergencyFund },
        insurance:     { panel: insuranceUI,       render: renderInsurance },
    };

    const entry = panelMap[activeTabId];
    if (entry && entry.panel) {
        entry.panel.hidden = false;
        entry.render();
    } else {
        standardUI.hidden = false;
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

    // Month-end carry forward banner: detect if previous month has unclosed balance
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthKey = getMonthKey(prevMonth);
    const prevMonthData = (appData.monthlyBudgetData || {})[prevMonthKey];
    const prevExpBalance = Number(window._budgetExpAccount?.balance || 0);
    const prevCarryDone = prevMonthData?._carryForwardDone;
    const prevTransferDone = prevMonthData?._transferDone;
    const budgetStatusEl = document.getElementById("budgetStatus");
    if (budgetStatusEl) {
        // If prev month had a transfer but no carry forward, suggest carry forward
        if (prevTransferDone && !prevCarryDone && prevExpBalance > 0) {
            budgetStatusEl.innerHTML = `<div class="month-end-banner">
                <span>Previous month (${prevMonth.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}) has \u20b9${prevExpBalance.toLocaleString("en-IN")} remaining. Carry forward?</span>
                <button type="button" id="bannerCarryForward">Carry Forward</button>
            </div>`;
            const bannerBtn = document.getElementById("bannerCarryForward");
            if (bannerBtn) bannerBtn.addEventListener("click", () => {
                if (!appData.monthlyBudgetData[prevMonthKey]) appData.monthlyBudgetData[prevMonthKey] = { inflow: {}, outflow: {}, investing: {} };
                appData.monthlyBudgetData[prevMonthKey]._carryForwardDone = prevExpBalance;
                scheduleSave();
                renderMonthlyBudget();
            });
        }
    }
    
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
        
        // Render preview mode (pass auto-linked info for clickable breakdown)
        renderCategoryPreview(inflowPreview, MONTHLY_BUDGET_CATEGORIES.inflow, monthData.inflow, monthData.autoLinkedFields, monthData.autoLinkedBreakdown, "inflow");
        renderCategoryPreview(outflowPreview, MONTHLY_BUDGET_CATEGORIES.outflow, monthData.outflow, monthData.autoLinkedFields, monthData.autoLinkedBreakdown, "outflow");
        renderCategoryPreview(investingPreview, MONTHLY_BUDGET_CATEGORIES.investing, monthData.investing, monthData.autoLinkedFields, monthData.autoLinkedBreakdown, "investing");
        const investingTotalVal = Object.values(monthData.investing || {}).reduce((s, v) => s + Number(v || 0), 0);
        const investingSection = document.getElementById("investingPreviewSection");
        if (investingSection) investingSection.hidden = (investingTotalVal === 0);

        // Calculate and display totals
        calculateAndDisplaySummary(monthData);
        
        // Render pie chart
        renderPieChart(monthData);
    }
}

function renderCategoryPreview(container, fields, data, autoLinkedFields, autoLinkedBreakdown, categoryName) {
    container.innerHTML = "";
    const alf = autoLinkedFields || {};
    const alb = autoLinkedBreakdown || {};
    fields.forEach(field => {
        const value = Number(data[field.id] || 0);
        if (value > 0) {
            const item = document.createElement("div");
            item.className = "category-preview-item";
            const fieldKey = `${categoryName}.${field.id}`;
            const isAuto = Boolean(alf[fieldKey]);
            const breakdown = (alb[fieldKey]) || [];
            let badgeHtml = "";
            if (isAuto) {
                badgeHtml = `<span class="auto-badge auto-badge-clickable auto-preview-badge" data-field-key="${fieldKey}" style="cursor:pointer" title="Click to see breakdown">auto</span>`;
            }
            item.innerHTML = `
                <span class="label">${field.label}${badgeHtml}</span>
                <span class="value">${formatMoney(value)}</span>
            `;
            // Attach click handler for auto badge
            if (isAuto && breakdown.length > 0) {
                const badge = item.querySelector(".auto-preview-badge");
                if (badge) {
                    badge.addEventListener("click", (e) => {
                        e.stopPropagation();
                        showAutoCalcPopup(e.target, field.label, breakdown);
                    });
                }
            }
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
    const outflowTotal = Object.values(monthData.outflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const investingTotal = Object.values(monthData.investing || {}).reduce((s, v) => s + Number(v || 0), 0);

    // Liability = auto-calc loan EMIs + insurance premiums + manual debt repayment
    const loanEMI = Number(monthData.outflow?.loanEMI || 0);
    const insurancePremiums = Number(monthData.outflow?.insurancePremiums || 0);
    const debtRepayment = Number(monthData.outflow?.debtRepayment || 0);
    const liability = loanEMI + insurancePremiums + debtRepayment;

    // Expenditure = fixed recurring + manual outflow items + CC spending + on-demand spending
    const expenditure = Number(monthData.outflow?.fixedExpenditure || 0)
        + Number(monthData.outflow?.utilityBills || 0)
        + Number(monthData.outflow?.familyExpenditure || 0)
        + Number(monthData.outflow?.miscExpenses || 0)
        + Number(monthData.outflow?.creditCardOutstanding || 0)
        + Number(monthData.outflow?.midMonthCCOutstanding || 0)
        + Number(monthData.investing?.ondemandExpenditure || 0)
        + Number(monthData.investing?.ondemandLiability || 0);

    // Saving = fixed recurring + on-demand
    const saving = Number(monthData.investing?.fixedSaving || 0)
        + Number(monthData.investing?.onetimeSaving || 0);
    // Investment = fixed recurring + on-demand
    const investment = Number(monthData.investing?.fixedInvestment || 0)
        + Number(monthData.investing?.onetimeInvestment || 0);

    // Other = total outflow + total investing - all categorised items
    const allCategorised = liability + expenditure + saving + investment;
    const combinedTotal = outflowTotal + investingTotal;
    const other = Math.max(0, combinedTotal - allCategorised);

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

// ── Investments Tab (was Inflow) ──────────────────────────────────────────────
function renderInflow() {
    const entries = (appData.tabData || {}).inflow || [];

    if (toggleInflowEdit) toggleInflowEdit.textContent = isInflowEditMode ? "✓ Done" : "✎ Edit";

    // Show/hide sub-section tabs only in preview
    const subTabs = document.getElementById("investmentSubTabs");
    if (subTabs) subTabs.hidden = isInflowEditMode;

    if (isInflowEditMode) {
        if (inflowTabPreview) inflowTabPreview.hidden = true;
        if (inflowTabEdit) inflowTabEdit.hidden = false;
        renderInflowDynamicFields();
        updateSectionSubmitButton("inflow");
        renderInflowTable(entries);
    } else {
        if (inflowTabPreview) inflowTabPreview.hidden = false;
        if (inflowTabEdit) inflowTabEdit.hidden = true;

        // Filter based on active investment view
        let displayEntries = entries;
        const portfolioEl = document.getElementById("portfolioSummary");
        const chartSection = inflowTabPreview?.querySelector(".chart-section");
        const sortFilterEl = document.getElementById("inflowSortFilter");

        if (activeInvestmentView === "existing") {
            displayEntries = entries.filter(e => (e.category || "Existing") === "Existing" && e.frequency !== "Monthly");
            if (portfolioEl) portfolioEl.hidden = true;
            if (chartSection) chartSection.hidden = false;
            if (inflowList) inflowList.hidden = false;
        } else if (activeInvestmentView === "monthly") {
            displayEntries = entries.filter(e => e.category === "Monthly" || e.frequency === "Monthly");
            if (portfolioEl) portfolioEl.hidden = true;
            if (chartSection) chartSection.hidden = false;
            if (inflowList) inflowList.hidden = false;
        } else if (activeInvestmentView === "portfolio") {
            if (portfolioEl) portfolioEl.hidden = false;
            if (chartSection) chartSection.hidden = true;
            if (inflowList) inflowList.hidden = true;
            if (sortFilterEl) sortFilterEl.innerHTML = "";
            renderPortfolioSummary(entries);
            calculateInflowSummary(entries);
            return;
        } else {
            if (portfolioEl) portfolioEl.hidden = true;
            if (chartSection) chartSection.hidden = false;
            if (inflowList) inflowList.hidden = false;
        }

        renderInflowPreviewCards(displayEntries);
        calculateInflowSummary(entries);
        renderInflowChart(displayEntries);
    }
}

function renderPortfolioSummary(entries) {
    const existingEntries = entries.filter(e => (e.category || "Existing") === "Existing" && e.frequency !== "Monthly");
    const monthlyEntries = entries.filter(e => e.category === "Monthly" || e.frequency === "Monthly");

    // One-time investments from budget
    const budgetData = appData.monthlyBudgetData || {};
    const oneTimeInvestments = [];
    Object.entries(budgetData).forEach(([monthKey, md]) => {
        const amt = Number(md?.investing?.onetimeInvestment || 0);
        if (amt > 0) oneTimeInvestments.push({ name: `Budget Investment (${monthKey})`, amount: amt, currentValue: amt });
    });

    function renderList(containerEl, items) {
        if (!containerEl) return;
        containerEl.innerHTML = "";
        if (items.length === 0) {
            containerEl.innerHTML = `<div style="color:var(--muted);font-size:0.82rem;">None</div>`;
            return;
        }
        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "portfolio-item";
            div.innerHTML = `<span>${esc(item.name)} <span style="color:var(--muted);font-size:0.75rem;">${esc(item.type || "")}</span></span><span>${formatMoney(Number(item.currentValue || item.amount || 0))}</span>`;
            containerEl.appendChild(div);
        });
    }

    renderList(document.getElementById("portfolioExisting"), existingEntries);
    renderList(document.getElementById("portfolioMonthly"), monthlyEntries);
    renderList(document.getElementById("portfolioOneTime"), oneTimeInvestments);

    const existingTotal = existingEntries.reduce((s, e) => s + Number(e.currentValue || e.amount || 0), 0);
    const monthlyTotal = monthlyEntries.reduce((s, e) => s + Number(e.currentValue || e.amount || 0), 0);
    const oneTimeTotal = oneTimeInvestments.reduce((s, e) => s + Number(e.currentValue || e.amount || 0), 0);
    const grandTotal = existingTotal + monthlyTotal + oneTimeTotal;

    const el1 = document.getElementById("portfolioExistingTotal");
    const el2 = document.getElementById("portfolioMonthlyTotal");
    const el3 = document.getElementById("portfolioOneTimeTotal");
    const el4 = document.getElementById("portfolioGrandTotal");
    if (el1) el1.textContent = formatMoney(existingTotal);
    if (el2) el2.textContent = formatMoney(monthlyTotal);
    if (el3) el3.textContent = formatMoney(oneTimeTotal);
    if (el4) el4.textContent = formatMoney(grandTotal);
}

function renderInflowDynamicFields() {
    if (!inflowDynamicFields) return;
    inflowDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.inflow;
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
            if (field.type === "number") { input.min = "0"; input.step = "1"; }
        }
        input.id = `inflow_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        inflowDynamicFields.appendChild(div);
    });
}

function renderInflowTable(entries) {
    if (!inflowTableHead || !inflowTableBody) return;
    const fields = TAB_FIELDS.inflow;
    inflowTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => { const th = document.createElement("th"); th.textContent = f.label; tr.appendChild(th); });
    const actionTh = document.createElement("th"); actionTh.textContent = ""; tr.appendChild(actionTh);
    inflowTableHead.appendChild(tr);
    inflowTableBody.innerHTML = "";
    if (inflowEmptyState) inflowEmptyState.classList.toggle("visible", entries.length === 0);
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") { td.textContent = formatMoney(Number(item[f.id] || 0)); td.className = "amount"; }
            else { td.textContent = esc(item[f.id] || "—"); }
            row.appendChild(td);
        });
        const actionTd = document.createElement("td");
        actionTd.innerHTML = renderRowActions(item.id);
        row.appendChild(actionTd);
        inflowTableBody.appendChild(row);
    });
}

function renderInflowPreviewCards(entries) {
    const toolbarEl = document.getElementById("inflowSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("inflow");
    const displayEntries = applyListSortFilter("inflow", entries);
    if (!inflowList) return;
    inflowList.innerHTML = "";
    if (displayEntries.length === 0) {
        inflowList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background:var(--surf1);border:1px solid var(--border2);border-radius:12px;">No inflow items yet. Click Edit to add.</div>`
            : `<div class="empty-state visible" style="background:var(--surf1);border:1px solid var(--border2);border-radius:12px;">No results match the current filters.</div>`;
        return;
    }
    displayEntries.forEach(item => {
        const card = document.createElement("div");
        card.className = "investment-card";
        const curVal = getInflowCurrentValue(item);
        card.innerHTML = `
            <div class="investment-card-info">
                <div class="investment-card-title">${esc(item.name)}</div>
                <div class="investment-card-details">
                    <span class="investment-card-frequency">${esc(item.type || "Other")}</span>
                    <span style="color:var(--muted);font-size:0.75rem;">${esc(item.frequency || "One-Time")}</span><br>
                    Amount: ${formatMoney(Number(item.amount || 0))}<br>
                    Current Value: ${formatMoney(Number(item.currentValue || 0))}<br>
                    Net Worth Today: ${formatMoney(curVal)}<br>
                    Interest: ${Number(item.interestRate || 0)}% p.a.<br>
                    Start: ${esc(item.startDate || "—")} | End: ${esc(item.endDate || "—")}<br>
                    ${item.details ? esc(item.details) : ""}
                </div>
            </div>
            <div class="investment-card-amount">${formatMoney(curVal)}</div>`;
        inflowList.appendChild(card);
    });
}

function calculateInflowSummary(entries) {
    const totalAmount = entries.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalCurrent = entries.reduce((s, i) => s + getInflowCurrentValue(i), 0);
    const el1 = document.getElementById("totalInflowAmount");
    const el2 = document.getElementById("totalInflowCurrentValue");
    const el3 = document.getElementById("totalInflowItems");
    if (el1) el1.textContent = formatMoney(totalAmount);
    if (el2) el2.textContent = formatMoney(totalCurrent);
    if (el3) el3.textContent = entries.length;

    // Monthly vs Existing breakdown
    const monthlyEntries = entries.filter(e => e.category === "Monthly" || e.frequency === "Monthly");
    const existingEntries = entries.filter(e => (e.category || "Existing") === "Existing" && e.frequency !== "Monthly");
    const monthlyTotal = monthlyEntries.reduce((s, i) => s + Number(i.amount || 0), 0);
    const existingTotal = existingEntries.reduce((s, i) => s + getInflowCurrentValue(i), 0);
    const el4 = document.getElementById("totalMonthlyInvestments");
    const el5 = document.getElementById("totalExistingInvestments");
    if (el4) el4.textContent = formatMoney(monthlyTotal);
    if (el5) el5.textContent = formatMoney(existingTotal);
}

function renderInflowChart(entries) {
    if (inflowBarChart) { inflowBarChart.destroy(); inflowBarChart = null; }
    if (!inflowBarChartCanvas || entries.length === 0) return;
    const labels = entries.map(e => e.name || "Unnamed");
    const values = entries.map(e => getInflowCurrentValue(e));
    const ctx = inflowBarChartCanvas.getContext("2d");
    inflowBarChart = new Chart(ctx, {
        type: "bar",
        data: { labels, datasets: [{ label: "Amount (₹)", data: values, backgroundColor: getChartThemeColors().bar, borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { x: { ticks: { color: getChartThemeColors().text }, grid: { color: getChartThemeColors().grid } },
                      y: { ticks: { color: getChartThemeColors().text }, grid: { color: getChartThemeColors().grid } } } }
    });
}

// ── Outflow Tab (replaces Liabilities + Insurances) ──────────────────────────
function renderOutflow() {
    const entries = (appData.tabData || {}).outflow || [];

    if (toggleOutflowEdit) toggleOutflowEdit.textContent = isOutflowEditMode ? "✓ Done" : "✎ Edit";

    if (isOutflowEditMode) {
        if (outflowTabPreview) outflowTabPreview.hidden = true;
        if (outflowTabEdit) outflowTabEdit.hidden = false;
        renderOutflowDynamicFields();
        updateSectionSubmitButton("outflow");
        renderOutflowTable(entries);
    } else {
        if (outflowTabPreview) outflowTabPreview.hidden = false;
        if (outflowTabEdit) outflowTabEdit.hidden = true;
        renderOutflowPreviewCards(entries);
        calculateOutflowSummary(entries);
        renderOutflowCharts(entries);
    }
}

function renderOutflowDynamicFields() {
    if (!outflowDynamicFields) return;
    outflowDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.outflow;
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
                blank.value = ""; blank.textContent = "— Select Account —";
                input.appendChild(blank);
                activeAccounts.forEach(acct => { const opt = document.createElement("option"); opt.value = acct.bankName; opt.textContent = acct.bankName; input.appendChild(opt); });
            }
        } else if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => { const option = document.createElement("option"); option.value = opt; option.textContent = opt; input.appendChild(option); });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            if (field.type === "number") { input.min = "0"; input.step = "1"; }
        }
        input.id = `outflow_${field.id}`;
        if (field.required && field.id !== "bankName") input.required = true;
        div.appendChild(input);
        outflowDynamicFields.appendChild(div);
    });
}

function renderOutflowTable(entries) {
    if (!outflowTableHead || !outflowTableBody) return;
    const fields = TAB_FIELDS.outflow;
    outflowTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => { const th = document.createElement("th"); th.textContent = f.label; tr.appendChild(th); });
    const durTh = document.createElement("th"); durTh.textContent = "Duration"; tr.appendChild(durTh);
    const actTh = document.createElement("th"); actTh.textContent = ""; tr.appendChild(actTh);
    outflowTableHead.appendChild(tr);
    outflowTableBody.innerHTML = "";
    if (outflowEmptyState) outflowEmptyState.classList.toggle("visible", entries.length === 0);
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") { td.textContent = formatMoney(Number(item[f.id] || 0)); td.className = "amount"; }
            else { td.textContent = esc(item[f.id] || "—"); }
            row.appendChild(td);
        });
        const durTd = document.createElement("td"); durTd.textContent = calcDurationFromToday(item.endDate); row.appendChild(durTd);
        const actTd = document.createElement("td"); actTd.innerHTML = renderRowActions(item.id); row.appendChild(actTd);
        outflowTableBody.appendChild(row);
    });
}

function renderOutflowPreviewCards(entries) {
    const toolbarEl = document.getElementById("outflowSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("outflow");
    const displayEntries = applyListSortFilter("outflow", entries);
    if (!outflowList) return;
    outflowList.innerHTML = "";
    if (displayEntries.length === 0) {
        outflowList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background:var(--surf1);border:1px solid var(--border2);border-radius:12px;">No outflow items yet. Click Edit to add.</div>`
            : `<div class="empty-state visible" style="background:var(--surf1);border:1px solid var(--border2);border-radius:12px;">No results match the current filters.</div>`;
        return;
    }

    // Group by type
    const groups = {};
    displayEntries.forEach(item => {
        const type = item.type || "Expenditure";
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
    });

    Object.entries(groups).forEach(([type, items]) => {
        const groupTotal = items.reduce((s, i) => s + Number(i.amount || 0), 0);
        const groupDiv = document.createElement("div");
        groupDiv.className = "outflow-group";
        const typeLower = type.toLowerCase().replace(/\s+/g, "");
        groupDiv.innerHTML = `<div class="outflow-group-header">
            <span class="expense-card-type ${typeLower}">${esc(type)}</span>
            <span class="outflow-group-count">${items.length} item${items.length > 1 ? "s" : ""}</span>
            <strong class="outflow-group-total">${formatMoney(groupTotal)}</strong>
        </div>`;
        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "expense-card";
            card.innerHTML = `
                <div class="expense-card-info">
                    <div class="expense-card-title">${esc(item.name)}</div>
                    <div class="expense-card-details">
                        <span style="color:var(--muted);font-size:0.75rem;">${esc(item.frequency || "Monthly")}</span>
                        | Bank: ${esc(item.bankName || "—")}
                        | End: ${esc(item.endDate || "—")}
                        | Duration: ${calcDurationFromToday(item.endDate)}
                        ${item.details ? `<br>${esc(item.details)}` : ""}
                    </div>
                </div>
                <div class="expense-card-amount">${formatMoney(Number(item.amount || 0))}</div>`;
            groupDiv.appendChild(card);
        });
        outflowList.appendChild(groupDiv);
    });
}

function calculateOutflowSummary(entries) {
    const totalMonthly = entries.filter(e => e.frequency === "Monthly").reduce((s, e) => s + Number(e.amount || 0), 0);
    const totalAll     = entries.reduce((s, e) => s + Number(e.amount || 0), 0);
    const income       = Number(appData.fixedMonthlyIncome || 0);
    const remaining    = income - totalMonthly;
    const el1 = document.getElementById("totalOutflowDeductions");
    const el2 = document.getElementById("outflowDisplayIncome");
    const el3 = document.getElementById("outflowRemainingToSpend");
    const el4 = document.getElementById("totalOutflowItems");
    if (el1) el1.textContent = formatMoney(totalMonthly);
    if (el2) el2.textContent = formatMoney(income);
    if (el3) { el3.textContent = formatMoney(remaining); el3.className = "remaining-amount " + (remaining >= 0 ? "positive" : "negative"); }
    if (el4) el4.textContent = entries.length;
}

function renderOutflowCharts(entries) {
    if (outflowBankChart) { outflowBankChart.destroy(); outflowBankChart = null; }
    if (outflowTypeChart) { outflowTypeChart.destroy(); outflowTypeChart = null; }
    if (entries.length === 0) return;

    // Bank chart
    const bankData = {};
    entries.forEach(e => { const bank = e.bankName || "Unknown"; bankData[bank] = (bankData[bank] || 0) + Number(e.amount || 0); });
    if (outflowBankChartCanvas) {
        const bankCtx = outflowBankChartCanvas.getContext("2d");
        outflowBankChart = new Chart(bankCtx, {
            type: "bar", data: { labels: Object.keys(bankData), datasets: [{ label: "Amount (₹)", data: Object.values(bankData), backgroundColor: getChartThemeColors().bar, borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: getChartThemeColors().text }, grid: { color: getChartThemeColors().grid } }, y: { ticks: { color: getChartThemeColors().text }, grid: { color: getChartThemeColors().grid } } } }
        });
    }

    // Type chart
    const typeData = { "Insurance": { amount: 0, color: "#a855f7" }, "Investment": { amount: 0, color: "#3b82f6" }, "Saving": { amount: 0, color: "#22c55e" }, "Liability": { amount: 0, color: "#f97316" }, "Expenditure": { amount: 0, color: "#f97316" } };
    entries.forEach(e => { const type = e.type || "Expenditure"; if (typeData[type]) typeData[type].amount += Number(e.amount || 0); });
    if (outflowTypeChartCanvas) {
        const typeCtx = outflowTypeChartCanvas.getContext("2d");
        outflowTypeChart = new Chart(typeCtx, {
            type: "bar", data: { labels: Object.keys(typeData), datasets: [{ label: "Amount (₹)", data: Object.keys(typeData).map(t => typeData[t].amount), backgroundColor: Object.keys(typeData).map(t => typeData[t].color), borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: getChartThemeColors().text }, grid: { color: getChartThemeColors().grid } }, y: { ticks: { color: getChartThemeColors().text }, grid: { color: getChartThemeColors().grid } } } }
        });
    }
}

function renderCards() {
    const entries = activeEntries();
    
    // Account setup guidance banner
    const hasPrimary = entries.some(c => c.isPrimary === "Yes");
    const hasSalary = entries.some(c => c.purpose === "Salary" && c.isPrimary !== "Yes");
    let setupBanner = document.getElementById("accountSetupBanner");
    if (!setupBanner) {
        setupBanner = document.createElement("div");
        setupBanner.id = "accountSetupBanner";
        setupBanner.className = "budget-status";
        const parent = document.getElementById("cardsUI");
        if (parent) parent.insertBefore(setupBanner, parent.firstChild);
    }
    if (!hasPrimary || !hasSalary) {
        const missing = [];
        if (!hasPrimary) missing.push("Primary (Expenditure) account");
        if (!hasSalary) missing.push("Salary account");
        setupBanner.hidden = false;
        setupBanner.className = "budget-status negative";
        setupBanner.textContent = `Account setup incomplete — add: ${missing.join(" + ")}`;
    } else {
        setupBanner.hidden = true;
    }

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
    const purposeOrder = { "Salary": 1, "Saving": 2 };
    return [...entries].sort((a, b) => {
        // Primary (Expenditure) always first
        if (a.isPrimary === "Yes" && b.isPrimary !== "Yes") return -1;
        if (b.isPrimary === "Yes" && a.isPrimary !== "Yes") return 1;
        // Then Salary, then Saving, then others
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
            ? `<span class="card-item-badge primary-badge">⭐ PRIMARY (Expenditure)</span>` : "";
        const salaryBadge = card.purpose === "Salary"
            ? `<span class="card-item-badge primary-badge" style="background:rgba(234,179,8,0.15);color:#eab308">💼 SALARY</span>` : "";
        const savingBadge = card.purpose === "Saving"
            ? `<span class="card-item-badge saving-badge">💰 SAVING</span>` : "";

        item.innerHTML = `
            <div class="card-item-info">
                <div class="card-item-title">${esc(card.bankName)}${primaryBadge}${salaryBadge}${savingBadge}</div>
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
    // Inflow items → Assets
    const inflowItems = (appData.tabData || {}).inflow || [];
    inflowItems.forEach(item => {
        const val = getInflowCurrentValue(item);
        if (val > 0) {
            auto.push({
                id: 'auto_inv_' + item.id,
                name: item.name || 'Investment',
                type: 'Asset',
                value: val,
                growthRate: item.interestRate || '',
                details: 'From Inflow tab',
                auto: true
            });
        }
    });
    // Outflow items with type Liability → Liabilities (amount × remaining months)
    const outflowItems = (appData.tabData || {}).outflow || [];
    outflowItems.filter(e => (e.type || '') === 'Liability').forEach(item => {
        const monthly = Number(item.amount || 0);
        const months  = Number(item.duration || 1);
        const outstanding = monthly * months;
        if (outstanding > 0) {
            auto.push({
                id: 'auto_exp_' + item.id,
                name: item.name || 'Liability',
                type: 'Liability',
                value: outstanding,
                growthRate: '',
                details: `From Outflow (${formatMoney(monthly)}/mo × ${months} mo remaining)`,
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
        assetsList.innerHTML = `<div class="empty-state visible">No assets yet. Add inflow items to see them here.</div>`;
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
    // Outflow items with type Insurance → 80D
    const outflowItems = (appData.tabData || {}).outflow || [];
    outflowItems.filter(e => e.type === 'Insurance').forEach(item => {
        const annual = getOutflowAnnualAmount(item);
        if (annual > 0) auto.push({ id: 'atax_ins_' + item.id, name: item.name || 'Insurance', amount: annual, section: '80D', details: 'From Outflow tab', auto: true });
    });
    // Inflow items → 80C
    const inflowItems = (appData.tabData || {}).inflow || [];
    inflowItems.forEach(item => {
        const freq = (item.frequency || '').toLowerCase();
        const base = Number(item.amount || 0);
        const annual = freq === 'monthly' ? base * 12 : base;
        if (annual > 0) auto.push({ id: 'atax_inv_' + item.id, name: item.name || 'Investment', amount: annual, section: '80C', details: 'From Inflow tab', auto: true });
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
        taxDeductionsList.innerHTML = `<div class="empty-state visible">No deductions found. Add inflow or outflow items to see auto-pulled deductions here.</div>`;
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
        if (emergencyFundPreview) emergencyFundPreview.hidden = true;
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
        if (emergencyFundPreview) emergencyFundPreview.hidden = false;
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

// ── Insurance Tab ─────────────────────────────────────────────────────────────
function renderInsurance() {
    const entries = (appData.tabData || {}).insurance || [];

    if (toggleInsuranceEdit) toggleInsuranceEdit.textContent = isInsuranceEditMode ? "✓ Done" : "✎ Edit";

    if (isInsuranceEditMode) {
        if (insuranceTabPreview) insuranceTabPreview.hidden = true;
        if (insuranceTabEdit) insuranceTabEdit.hidden = false;
        renderInsuranceDynamicFields();
        updateSectionSubmitButton("insurance");
        renderInsuranceTable(entries);
    } else {
        if (insuranceTabPreview) insuranceTabPreview.hidden = false;
        if (insuranceTabEdit) insuranceTabEdit.hidden = true;
        renderInsurancePreviewCards(entries);
        calculateInsuranceSummary(entries);
    }
}

function renderInsuranceDynamicFields() {
    if (!insuranceDynamicFields) return;
    insuranceDynamicFields.innerHTML = "";
    const fields = TAB_FIELDS.insurance;
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
            if (field.type === "number") { input.min = "0"; input.step = "1"; }
        }
        input.id = `insurance_${field.id}`;
        if (field.required) input.required = true;
        div.appendChild(input);
        insuranceDynamicFields.appendChild(div);
    });
}

function renderInsuranceTable(entries) {
    if (!insuranceTableHead || !insuranceTableBody) return;
    const fields = TAB_FIELDS.insurance;
    insuranceTableHead.innerHTML = "";
    const tr = document.createElement("tr");
    fields.forEach(f => { const th = document.createElement("th"); th.textContent = f.label; tr.appendChild(th); });
    const actTh = document.createElement("th"); actTh.textContent = ""; tr.appendChild(actTh);
    insuranceTableHead.appendChild(tr);
    insuranceTableBody.innerHTML = "";
    if (insuranceEmptyState) insuranceEmptyState.classList.toggle("visible", entries.length === 0);
    entries.forEach(item => {
        const row = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            if (f.type === "number") { td.textContent = formatMoney(Number(item[f.id] || 0)); td.className = "amount"; }
            else { td.textContent = esc(item[f.id] || "—"); }
            row.appendChild(td);
        });
        const actTd = document.createElement("td"); actTd.innerHTML = renderRowActions(item.id); row.appendChild(actTd);
        insuranceTableBody.appendChild(row);
    });
}

function getInsuranceAnnualPremium(item) {
    const amt = Number(item.premiumAmount || 0);
    const freq = (item.premiumFrequency || "").toLowerCase();
    if (freq === "monthly") return amt * 12;
    if (freq === "quarterly") return amt * 4;
    if (freq === "half-yearly") return amt * 2;
    if (freq === "annual") return amt;
    return 0; // None (Paid Up)
}

function renderInsurancePreviewCards(entries) {
    const toolbarEl = document.getElementById("insuranceSortFilter");
    if (toolbarEl) toolbarEl.innerHTML = buildSortFilterToolbar("insurance");
    const displayEntries = applyListSortFilter("insurance", entries);
    if (!insuranceList) return;
    insuranceList.innerHTML = "";
    if (displayEntries.length === 0) {
        insuranceList.innerHTML = entries.length === 0
            ? `<div class="empty-state visible" style="background:var(--surf1);border:1px solid var(--border2);border-radius:12px;">No insurance policies yet. Click Edit to add.</div>`
            : `<div class="empty-state visible" style="background:var(--surf1);border:1px solid var(--border2);border-radius:12px;">No results match the current filters.</div>`;
        return;
    }
    displayEntries.forEach(item => {
        const card = document.createElement("div");
        card.className = "insurance-card";
        const annualPremium = getInsuranceAnnualPremium(item);
        const hasPremium = annualPremium > 0;
        card.innerHTML = `
            <div class="insurance-card-info">
                <div class="insurance-card-title">${esc(item.name)}</div>
                <div class="insurance-card-details">
                    <span class="policy-badge">${esc(item.policyType || "Other")}</span>
                    ${hasPremium ? `<span class="premium-badge">${esc(item.premiumFrequency)} Premium</span>` : `<span class="no-premium-badge">No Active Premium</span>`}
                    <br>Provider: ${esc(item.provider || "—")}
                    | Policy #: ${esc(item.policyNumber || "—")}
                    <br>Sum Assured: ${formatMoney(Number(item.sumAssured || 0))}
                    ${hasPremium ? `| Premium: ${formatMoney(Number(item.premiumAmount || 0))} (${esc(item.premiumFrequency)})` : ""}
                    <br>Period: ${esc(item.startDate || "—")} to ${esc(item.endDate || "—")}
                    | Nominee: ${esc(item.nominee || "—")}
                    ${item.details ? `<br>${esc(item.details)}` : ""}
                </div>
            </div>
            <div class="insurance-card-amount">${hasPremium ? formatMoney(annualPremium) + "/yr" : "Paid Up"}</div>`;
        insuranceList.appendChild(card);
    });
}

function calculateInsuranceSummary(entries) {
    const totalPolicies = entries.length;
    const totalAnnualPremium = entries.reduce((s, e) => s + getInsuranceAnnualPremium(e), 0);
    const monthlyPremiumLoad = totalAnnualPremium / 12;
    const totalSumAssured = entries.reduce((s, e) => s + Number(e.sumAssured || 0), 0);

    const el1 = document.getElementById("totalPolicies");
    const el2 = document.getElementById("totalAnnualPremium");
    const el3 = document.getElementById("monthlyPremiumLoad");
    const el4 = document.getElementById("totalSumAssured");
    if (el1) el1.textContent = totalPolicies;
    if (el2) el2.textContent = formatMoney(totalAnnualPremium);
    if (el3) el3.textContent = formatMoney(monthlyPremiumLoad);
    if (el4) el4.textContent = formatMoney(totalSumAssured);
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

        // Determine earliest month (onboarding date)
        const onboardingMonth = appData.onboardingDate ? appData.onboardingDate.slice(0, 7) : null;
        
        monthKeys.forEach(monthKey => {
            // Skip months before onboarding
            if (onboardingMonth && monthKey < onboardingMonth) return;
            const monthData = monthlyBudgetData[monthKey] || { inflow: {}, outflow: {}, investing: {} };
            // Apply auto-values so loanEMI, insurancePremiums etc. are populated
            applyMonthlyAutoValues(monthKey, monthData);
            const dist = getMonthlyDistribution(monthData);
            Object.keys(totals).forEach(key => { totals[key] += Number(dist[key] || 0); });
            monthDataList.push({ month: monthKey, ...dist });
        });
        
        const monthsWithData = monthDataList.filter(m => m.income > 0 || m.expenditure > 0 || m.saving > 0 || m.investment > 0 || m.liability > 0).length;
        const monthCount = Math.max(monthsWithData, 1);
        
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
                backgroundColor: ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#a855f7"],
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

function showAutoCalcPopup(anchor, fieldLabel, breakdown) {
    // Remove any existing popup
    const existing = document.getElementById("autoCalcPopup");
    if (existing) existing.remove();

    const total = breakdown.reduce((s, b) => s + b.amount, 0);
    const popup = document.createElement("div");
    popup.id = "autoCalcPopup";
    popup.className = "auto-calc-popup";
    popup.innerHTML = `
        <div class="auto-calc-popup-header">
            <strong>${esc(fieldLabel)} Breakdown</strong>
            <button type="button" class="auto-calc-popup-close">&times;</button>
        </div>
        <div class="auto-calc-popup-body">
            ${breakdown.map(b => `
                <div class="auto-calc-popup-row">
                    <span class="auto-calc-popup-name">${esc(b.name)}</span>
                    <span class="auto-calc-popup-amount">${formatMoney(b.amount)}</span>
                    <span class="auto-calc-popup-source">${esc(b.source)}</span>
                </div>
            `).join("")}
            <div class="auto-calc-popup-total">
                <strong>Total</strong>
                <strong>${formatMoney(total)}</strong>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Position near anchor
    const rect = anchor.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.top = (rect.bottom + 6) + "px";
    popup.style.left = Math.max(8, rect.left - 80) + "px";
    popup.style.zIndex = "9999";

    // Close handlers
    popup.querySelector(".auto-calc-popup-close").addEventListener("click", () => popup.remove());
    const closeOnOutside = (e) => {
        if (!popup.contains(e.target) && e.target !== anchor) {
            popup.remove();
            document.removeEventListener("click", closeOnOutside);
        }
    };
    setTimeout(() => document.addEventListener("click", closeOnOutside), 10);
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
            autoBadge.className = "auto-badge auto-badge-clickable";
            autoBadge.textContent = "auto-calculated";
            autoBadge.style.cursor = "pointer";
            if (breakdown && breakdown.length > 0) {
                autoBadge.addEventListener("click", (e) => {
                    e.stopPropagation();
                    showAutoCalcPopup(e.target, field.label, breakdown);
                });
                autoBadge.title = "Click to see breakdown";
            } else {
                autoBadge.title = "No source items found - add Outflow items (type=Liability, freq=Monthly) to auto-calculate";
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
            input.title = "Auto-populated from Inflow or Outflow tab. Edit the source item to change current/future months.";
            div.classList.add("auto-linked-field");
        }
        
        div.appendChild(input);

        // Add "Settle from Saving" button for credit card outstanding field
        if (field.id === "creditCardOutstanding") {
            const settleBtn = document.createElement("button");
            settleBtn.type = "button";
            settleBtn.className = "btn-settle-saving";
            settleBtn.textContent = "Settle from Saving";
            settleBtn.title = "Move credit card outstanding to the Saving account balance";
            settleBtn.addEventListener("click", () => settleCreditCardFromSaving());
            div.appendChild(settleBtn);
        }

        container.appendChild(div);
    });
}

function settleCreditCardFromSaving() {
    const cards = getCardEntries();
    const savingAccount = cards.find(c => c.purpose === "Saving");
    if (!savingAccount) {
        alert("No Saving account found. Please set up a Saving account first.");
        return;
    }
    const monthKey = getMonthKey(currentMonth);
    const monthData = (appData.monthlyBudgetData || {})[monthKey];
    if (!monthData) return;
    const outstanding = Number(monthData.outflow?.creditCardOutstanding || 0);
    if (outstanding <= 0) {
        alert("No outstanding credit card bill to settle.");
        return;
    }
    const savingBalance = Number(savingAccount.balance || 0);
    if (savingBalance <= 0) {
        alert("Saving account has no balance to settle from.");
        return;
    }
    const settleAmount = Math.min(outstanding, savingBalance);
    const confirmed = confirm(
        `Settle ₹${settleAmount.toLocaleString("en-IN")} from your Saving account (${savingAccount.bankName})?\n\n` +
        `Outstanding: ${formatMoney(outstanding)}\n` +
        `Saving balance: ${formatMoney(savingBalance)}\n` +
        `Amount to settle: ${formatMoney(settleAmount)}\n\n` +
        `This will:\n• Reduce outstanding to ${formatMoney(outstanding - settleAmount)}\n` +
        `• Reduce saving balance to ${formatMoney(savingBalance - settleAmount)}`
    );
    if (!confirmed) return;

    // Update the outstanding amount
    monthData.outflow.creditCardOutstanding = outstanding - settleAmount;

    // Update saving account balance
    savingAccount.balance = savingBalance - settleAmount;
    const updatedCards = cards.map(c => c.id === savingAccount.id ? savingAccount : c);
    if (!appData.tabData) appData.tabData = {};
    appData.tabData.cards = updatedCards;

    scheduleSave();
    renderMonthlyBudget();
}

function calculateAndDisplaySummary(monthData) {
    const cards = (appData.tabData || {}).cards || [];
    const salaryAccount = cards.find(c => c.purpose === "Salary" && c.isPrimary !== "Yes");
    const expenditureAccount = cards.find(c => c.isPrimary === "Yes");
    const savingAccount = cards.find(c => c.purpose === "Saving" && c.isPrimary !== "Yes");
    const investmentAccount = cards.find(c => c.purpose === "Investment" && c.isPrimary !== "Yes");
    const rawSalaryBalance = Number(salaryAccount?.balance || 0);
    const expBalance = Number(expenditureAccount?.balance || 0);

    // Fixed outflows auto-debited from salary — all frequencies converted to monthly equivalent
    const allOutflows = ((appData.tabData || {}).outflow || []);
    const autoDebitByType = { Liability: 0, Insurance: 0, Saving: 0, Expenditure: 0, Investment: 0 };
    allOutflows.forEach(e => {
        const amount = Number(e.amount || 0);
        if (amount <= 0) return;
        const freq = e.frequency || "Monthly";
        let monthlyAmt = 0;
        if (freq === "Monthly")      monthlyAmt = amount;
        else if (freq === "Quarterly")   monthlyAmt = amount / 3;
        else if (freq === "Semi-Annual") monthlyAmt = amount / 6;
        else if (freq === "Annual")      monthlyAmt = amount / 12;
        // One-Time excluded from recurring auto-debit
        if (monthlyAmt <= 0) return;
        const t = e.type || "Expenditure";
        autoDebitByType[t] = (autoDebitByType[t] || 0) + monthlyAmt;
    });
    const fixedMonthlyOutflow = Object.values(autoDebitByType).reduce((s, v) => s + v, 0);

    // Category totals
    const inflowTotal = Object.values(monthData.inflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const outflowTotal = Object.values(monthData.outflow || {}).reduce((s, v) => s + Number(v || 0), 0);
    const investingTotal = Object.values(monthData.investing || {}).reduce((s, v) => s + Number(v || 0), 0);
    const totalOutAll = outflowTotal + investingTotal;

    document.getElementById("inflowTotal").textContent = formatMoney(inflowTotal);
    document.getElementById("outflowTotal").textContent = formatMoney(outflowTotal);
    document.getElementById("investingTotal").textContent = formatMoney(investingTotal);

    // Summary grid
    const cashFlow = inflowTotal - totalOutAll;
    document.getElementById("totalIncome").textContent = formatMoney(inflowTotal);
    document.getElementById("totalExpenses").textContent = formatMoney(totalOutAll);
    document.getElementById("cashFlow").textContent = formatMoney(cashFlow);
    const cashFlowEl = document.getElementById("cashFlow");
    if (cashFlowEl) cashFlowEl.style.color = cashFlow >= 0 ? "#22c55e" : "#ef4444";

    // Account balances — show actual salary balance (auto-debits already reflected in real balance)
    document.getElementById("initialBalance").textContent = formatMoney(rawSalaryBalance);
    const salaryLabelEl = document.getElementById("salaryBalanceLabel");
    const salaryHintEl = document.getElementById("salaryBalanceHint");
    if (salaryLabelEl) salaryLabelEl.textContent = "Salary A/c Balance";
    if (salaryHintEl) salaryHintEl.textContent = fixedMonthlyOutflow > 0
        ? `₹${fixedMonthlyOutflow.toLocaleString("en-IN")}/mo in fixed outflows from this account`
        : `Current balance in your salary account`;
    const expBalEl = document.getElementById("expenditureAccountBalance");
    if (expBalEl) expBalEl.textContent = formatMoney(expBalance);

    // Auto-debit breakdown by destination (with individual items)
    const breakdownEl = document.getElementById("autoDebitBreakdown");
    if (breakdownEl) {
        const lines = [];
        // Show individual outflow items grouped by type
        const itemsByType = {};
        allOutflows.forEach(e => {
            const amount = Number(e.amount || 0);
            if (amount <= 0) return;
            const freq = e.frequency || "Monthly";
            let monthlyAmt = 0;
            if (freq === "Monthly")      monthlyAmt = amount;
            else if (freq === "Quarterly")   monthlyAmt = amount / 3;
            else if (freq === "Semi-Annual") monthlyAmt = amount / 6;
            else if (freq === "Annual")      monthlyAmt = amount / 12;
            if (monthlyAmt <= 0) return;
            const t = e.type || "Expenditure";
            if (!itemsByType[t]) itemsByType[t] = [];
            const freqNote = freq !== "Monthly" ? ` <span style="color:var(--muted);font-size:0.7rem">(${freq} ÷${freq === "Quarterly" ? 3 : freq === "Semi-Annual" ? 6 : 12})</span>` : "";
            itemsByType[t].push(`${esc(e.name)}${freqNote}: ${formatMoney(monthlyAmt)}`);
        });
        if (autoDebitByType.Liability > 0) {
            lines.push(`<strong>Liability (EMIs): ${formatMoney(autoDebitByType.Liability)}</strong>`);
            (itemsByType.Liability || []).forEach(l => lines.push(`&nbsp;&nbsp;${l}`));
        }
        if (autoDebitByType.Insurance > 0) {
            lines.push(`<strong>Insurance: ${formatMoney(autoDebitByType.Insurance)}</strong>`);
            (itemsByType.Insurance || []).forEach(l => lines.push(`&nbsp;&nbsp;${l}`));
        }
        if (autoDebitByType.Saving > 0) {
            lines.push(`<strong>→ Saving A/c: ${formatMoney(autoDebitByType.Saving)}</strong>${savingAccount ? ` (${savingAccount.bankName})` : ""}`);
            (itemsByType.Saving || []).forEach(l => lines.push(`&nbsp;&nbsp;${l}`));
        }
        if (autoDebitByType.Investment > 0) {
            lines.push(`<strong>→ Investment A/c: ${formatMoney(autoDebitByType.Investment)}</strong>${investmentAccount ? ` (${investmentAccount.bankName})` : ""}`);
            (itemsByType.Investment || []).forEach(l => lines.push(`&nbsp;&nbsp;${l}`));
        }
        if (autoDebitByType.Expenditure > 0) {
            lines.push(`<strong>→ Primary A/c: ${formatMoney(autoDebitByType.Expenditure)}</strong>`);
            (itemsByType.Expenditure || []).forEach(l => lines.push(`&nbsp;&nbsp;${l}`));
        }
        breakdownEl.innerHTML = lines.length > 0
            ? lines.map(l => `<div class="auto-debit-line">${l}</div>`).join("")
            : `<div class="auto-debit-line" style="color:var(--dim)">No fixed outflows</div>`;
    }

    // Tracked expenses = recorded outflow + on-demand outflow
    // Note: loanEMI, insurancePremiums, fixedSaving, fixedInvestment are auto-deducted from salary
    // (not from expenditure account) so they are NOT included in tracked expenses
    const trackedExpenses = Number(monthData.outflow?.creditCardOutstanding || 0)
        + Number(monthData.outflow?.midMonthCCOutstanding || 0)
        + Number(monthData.outflow?.debtRepayment || 0)
        + Number(monthData.outflow?.utilityBills || 0)
        + Number(monthData.outflow?.familyExpenditure || 0)
        + Number(monthData.outflow?.miscExpenses || 0)
        + Number(monthData.investing?.ondemandExpenditure || 0)
        + Number(monthData.investing?.ondemandLiability || 0);
    // Store globally for Quick Update calculations
    window._budgetTrackedExpenses = trackedExpenses;

    // Total Spendable = Expenditure Account Balance + pending transfer − tracked expenses − mid-month CC
    const transferDoneForSpendable = Number(monthData._transferDone || 0);
    const hasPendingTransfer = !monthData._transferDone && (inflowTotal - fixedMonthlyOutflow) > 0;
    const pendingTransferAmt = hasPendingTransfer ? Math.max(0, Number(monthData.inflow?.primaryIncome || 0) - fixedMonthlyOutflow) : 0;
    const spendable = expBalance + pendingTransferAmt - trackedExpenses;
    const availableEl = document.getElementById("amountAvailableToSpend");
    const availableLabelEl = document.getElementById("amountAvailableLabel");
    if (availableEl) {
        availableEl.textContent = formatMoney(Math.abs(spendable));
        availableEl.style.color = spendable >= 0 ? "#22c55e" : "#ef4444";
    }
    if (availableLabelEl) {
        availableLabelEl.textContent = spendable >= 0 ? "Total Spendable This Month" : "Amount Overspent";
    }
    const trackedEl = document.getElementById("trackedExpenses");
    if (trackedEl) trackedEl.textContent = formatMoney(trackedExpenses);

    // Untracked expenses = money put into expenditure account - tracked expenses - current balance
    // totalFunded = transfer done this month + carryforward from prev month
    // If no transfer yet, use the pending transfer amount as estimate
    const monthKey = getMonthKey(currentMonth);
    const transferDone = Number(monthData._transferDone || 0);
    const prevMonthForCarry = new Date(currentMonth);
    prevMonthForCarry.setMonth(prevMonthForCarry.getMonth() - 1);
    const prevMonthCarry = (appData.monthlyBudgetData || {})[getMonthKey(prevMonthForCarry)];
    const prevCarryForward = Number(prevMonthCarry?._carryForwardDone || 0);
    const effectiveFunded = transferDone > 0 ? transferDone : pendingTransferAmt;
    const totalFunded = prevCarryForward + effectiveFunded;
    // Untracked = what went in - what you recorded - what's still in the account
    // midMonthCC is included in trackedExpenses but will be paid from this account, so it reduces available balance
    const untracked = totalFunded > 0 ? Math.max(0, totalFunded - trackedExpenses - expBalance) : 0;
    const untrackedEl = document.getElementById("untrackedExpenses");
    if (untrackedEl) {
        untrackedEl.textContent = formatMoney(untracked);
        untrackedEl.style.color = untracked > 0 ? "#eab308" : "#22c55e";
    }

    // Budget status banner
    budgetStatus.className = "budget-status";
    if (spendable > 0) {
        budgetStatus.classList.add("positive");
        budgetStatus.textContent = `Budget Positive: +${formatMoney(spendable)} surplus`;
    } else if (spendable < 0) {
        budgetStatus.classList.add("negative");
        budgetStatus.textContent = `Budget Negative: ${formatMoney(Math.abs(spendable))} overspent`;
    } else {
        budgetStatus.classList.add("neutral");
        budgetStatus.textContent = `Budget Balanced`;
    }

    // Previous month CC outstanding carryover note
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthData = (appData.monthlyBudgetData || {})[getMonthKey(prevMonth)];
    const prevCC = prevMonthData ? Number(prevMonthData.outflow?.creditCardOutstanding || 0) : 0;
    if (prevCC > 0) {
        budgetStatus.textContent += ` | CC carryover: ${formatMoney(prevCC)}`;
    }

    // Transfer calculation: income - auto-debited fixed outflows = amount to transfer to expenditure
    const primaryIncome = Number(monthData.inflow?.primaryIncome || 0);
    const transferAmt = primaryIncome - fixedMonthlyOutflow;
    document.getElementById("transferPrimaryIncome").textContent = formatMoney(primaryIncome);
    document.getElementById("transferFixedExpenses").textContent = formatMoney(fixedMonthlyOutflow);
    const transferEl = document.getElementById("transferAmount");
    transferEl.textContent = formatMoney(Math.abs(transferAmt));
    transferEl.style.color = transferAmt >= 0 ? "#22c55e" : "#ef4444";
    transferEl.previousElementSibling.textContent = transferAmt >= 0
        ? "Transfer to Expenditure Account"
        : "Shortfall (Fixed Outflow exceeds Income)";

    // Store transfer amount for Execute Transfer button
    window._budgetTransferAmt = transferAmt;
    window._budgetSalaryAccount = salaryAccount;
    window._budgetExpAccount = expenditureAccount;
    window._budgetTrackedExpenses = trackedExpenses;
    window._budgetTransferDone = transferDone;

    // Month-end carryforward: show if expenditure balance > 0 and budget is positive
    const carrySection = document.getElementById("carryforwardSection");
    if (carrySection) {
        const today = new Date();
        const isCurrentMonth = getMonthKey(currentMonth) === getMonthKey(today);
        const isPastMonth = getMonthKey(currentMonth) < getMonthKey(today);
        // Show carryforward for current or past months with positive expenditure balance
        if ((isCurrentMonth || isPastMonth) && expBalance > 0 && spendable >= 0) {
            carrySection.hidden = false;
            const cfBalEl = document.getElementById("carryforwardBalance");
            const cfAmtEl = document.getElementById("carryforwardAmount");
            if (cfBalEl) cfBalEl.textContent = formatMoney(expBalance);
            if (cfAmtEl) cfAmtEl.textContent = formatMoney(expBalance);
        } else {
            carrySection.hidden = true;
        }
    }
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

function areAccountsSetUp() {
    const cards = (appData.tabData || {}).cards || [];
    const hasPrimary = cards.some(c => c.isPrimary === "Yes");
    const hasSalary = cards.some(c => c.purpose === "Salary" && c.isPrimary !== "Yes");
    return hasPrimary && hasSalary;
}

function renderTabs() {
    tabList.innerHTML = "";
    const accountsReady = areAccountsSetUp();

    getTabs().forEach(tab => {
        const btn = document.createElement("button");
        btn.type = "button";
        const disabled = !accountsReady && tab.id !== "cards";
        btn.className = "tab" + (tab.id === activeTabId ? " active" : "") + (disabled ? " tab-disabled" : "");
        btn.textContent = tab.label;
        btn.style.background = tab.color;
        btn.style.color = tab.text;
        if (disabled) {
            btn.title = "Set up a Primary (Expenditure) + Salary account first";
            btn.style.opacity = "0.4";
            btn.style.cursor = "not-allowed";
        }
        btn.addEventListener("click", () => {
            if (disabled) {
                alert("Please set up both a Primary (Expenditure) account and a Salary account in the Accounts tab before accessing other tabs.");
                return;
            }
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
                "⚠️  You are about to delete your PRIMARY (Expenditure) account.\n\n" +
                "This is your main spending account. Deleting it will disable all " +
                "other tabs until a new primary account is set.\n\n" +
                "Are you sure you want to delete this primary account?"
            );
            if (!confirmed) return;
        } else if (entry && entry.purpose === "Salary") {
            const confirmed = confirm(
                "⚠️  You are about to delete your SALARY account.\n\n" +
                "This account is used for salary credits and transfer calculations. " +
                "Deleting it will disable other tabs until a Salary account is added again.\n\n" +
                "Are you sure?"
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
        "• All inflow items\n" +
        "• All outflow items\n" +
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
        currentAge: 0,
        onboardingComplete: false,
        onboardingDate: "",
        dataMigrated: true
    };
    activeTabId = "cards";
    
    // Save the cleared data
    doSave();
    
    // Re-render
    render();
    
    alert("✅ All data has been permanently deleted.");
}

// ── Delete Account ────────────────────────────────────────────────────────────
function deleteAccount() {
    const confirmation = confirm(
        "⚠️ DANGER: DELETE ACCOUNT\n\n" +
        "This will permanently:\n" +
        "• Delete ALL your financial data from our servers\n" +
        "• Delete your Firebase Authentication account\n" +
        "• Log you out immediately\n\n" +
        "This action CANNOT be undone. Your data CANNOT be recovered.\n\n" +
        "Are you sure you want to delete your account?"
    );
    if (!confirmation) return;

    const deleteConfirmation = prompt("Type 'DELETE ACCOUNT' to confirm permanent account deletion:");
    if (deleteConfirmation !== "DELETE ACCOUNT") {
        alert("Account deletion cancelled. Your data remains intact.");
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) { alert("No user signed in."); return; }

    // Step 1: Delete Firestore data
    db.collection("users").doc(user.uid).delete()
        .then(() => {
            // Step 2: Delete Firebase Auth user
            return user.delete();
        })
        .then(() => {
            alert("Your account and all data have been permanently deleted.");
            // Auth state listener will handle redirect to login
        })
        .catch(err => {
            if (err.code === "auth/requires-recent-login") {
                alert("For security, you need to sign in again before deleting your account. Please log out, log back in, and try again.");
            } else {
                alert("Error deleting account: " + err.message);
                console.error("Delete account error:", err);
            }
        });
}

const deleteAccountBtn = document.getElementById("deleteAccountBtn");
if (deleteAccountBtn) deleteAccountBtn.addEventListener("click", deleteAccount);

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
function getBudgetEarliestDate() {
    const od = appData.onboardingDate;
    if (!od) return null;
    const d = new Date(od);
    // Block navigation before the onboarding month (not just FY start)
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

prevMonthBtn.addEventListener("click", () => {
    const step = isAnnualBudgetView ? -12 : -1;
    const proposed = new Date(currentMonth);
    proposed.setMonth(proposed.getMonth() + step);
    const earliest = getBudgetEarliestDate();
    if (earliest && proposed < earliest) return; // Block navigation before onboarding month
    currentMonth.setMonth(currentMonth.getMonth() + step);
    renderMonthlyBudget();
});

nextMonthBtn.addEventListener("click", () => {
    const step = isAnnualBudgetView ? 12 : 1;
    const proposed = new Date(currentMonth);
    proposed.setMonth(proposed.getMonth() + step);
    // Block navigation beyond next month (or next FY)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1); // next month from today
    maxDate.setDate(1);
    if (!isAnnualBudgetView && proposed > maxDate) return;
    if (isAnnualBudgetView) {
        const proposedFYStart = proposed.getMonth() >= 3 ? proposed.getFullYear() : proposed.getFullYear() - 1;
        const currentFYStart = new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear() - 1;
        if (proposedFYStart > currentFYStart) return;
    }
    currentMonth.setMonth(currentMonth.getMonth() + step);
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

// ── Execute Transfer button ───────────────────────────────────────────────────
const btnDoTransfer = document.getElementById("btnDoTransfer");
if (btnDoTransfer) btnDoTransfer.addEventListener("click", () => {
    const amt = window._budgetTransferAmt;
    const salary = window._budgetSalaryAccount;
    const exp = window._budgetExpAccount;
    if (!salary) { alert("No Salary account found. Add one with purpose 'Salary' in Accounts tab."); return; }
    if (!exp) { alert("No Primary (Expenditure) account found. Set an account as Primary in the Accounts tab."); return; }
    if (amt <= 0) { alert("Nothing to transfer — fixed outflow exceeds or equals income."); return; }
    const confirmed = confirm(
        `Transfer ${formatMoney(amt)} from ${salary.bankName} (Salary) to ${exp.bankName} (Expenditure)?\n\n` +
        `Salary balance: ${formatMoney(Number(salary.balance || 0))} → ${formatMoney(Number(salary.balance || 0) - amt)}\n` +
        `Expenditure balance: ${formatMoney(Number(exp.balance || 0))} → ${formatMoney(Number(exp.balance || 0) + amt)}`
    );
    if (!confirmed) return;
    salary.balance = Number(salary.balance || 0) - amt;
    exp.balance = Number(exp.balance || 0) + amt;
    const cards = (appData.tabData || {}).cards || [];
    appData.tabData.cards = cards.map(c => c.id === salary.id ? salary : c.id === exp.id ? exp : c);
    // Record transfer done for this month
    const monthKey = getMonthKey(currentMonth);
    if (!appData.monthlyBudgetData) appData.monthlyBudgetData = {};
    if (!appData.monthlyBudgetData[monthKey]) appData.monthlyBudgetData[monthKey] = { inflow: {}, outflow: {}, investing: {} };
    appData.monthlyBudgetData[monthKey]._transferDone = (appData.monthlyBudgetData[monthKey]._transferDone || 0) + amt;
    scheduleSave();
    renderMonthlyBudget();
});

// ── Reconcile button ─────────────────────────────────────────────────────────
const btnReconcile = document.getElementById("btnReconcile");
if (btnReconcile) btnReconcile.addEventListener("click", () => {
    const input = document.getElementById("currentExpAccBalanceInput");
    const actualBalance = Number(input?.value || 0);
    const transferDone = window._budgetTransferDone || 0;
    const trackedExp = window._budgetTrackedExpenses || 0;
    // Previous month carryforward adds to expected starting balance
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthData = (appData.monthlyBudgetData || {})[getMonthKey(prevMonth)];
    const prevCarryForward = Number(prevMonthData?._carryForwardDone || 0);
    const expectedBalance = prevCarryForward + transferDone - trackedExp;
    const untracked = Math.max(0, expectedBalance - actualBalance);

    const grid = document.getElementById("reconciliationGrid");
    if (grid) grid.hidden = false;
    const el1 = document.getElementById("expectedExpBalance");
    const el2 = document.getElementById("actualExpBalance");
    const el3 = document.getElementById("reconciledUntracked");
    if (el1) el1.textContent = formatMoney(expectedBalance);
    if (el2) el2.textContent = formatMoney(actualBalance);
    if (el3) {
        el3.textContent = formatMoney(untracked);
        el3.style.color = untracked > 0 ? "#eab308" : "#22c55e";
    }

    // Also update expenditure account balance in Accounts
    const exp = window._budgetExpAccount;
    if (exp) {
        exp.balance = actualBalance;
        const cards = (appData.tabData || {}).cards || [];
        appData.tabData.cards = cards.map(c => c.id === exp.id ? exp : c);
        scheduleSave();
    }
});

// ── Carry Forward button ─────────────────────────────────────────────────────
const btnCarryForward = document.getElementById("btnCarryForward");
if (btnCarryForward) btnCarryForward.addEventListener("click", () => {
    const exp = window._budgetExpAccount;
    if (!exp) { alert("No Expenditure account found."); return; }
    const balance = Number(exp.balance || 0);
    if (balance <= 0) { alert("Nothing to carry forward — expenditure balance is zero or negative."); return; }

    // The "carry forward" simply means: the expenditure balance stays and is available next month.
    // We record it in the current month's data so we know carryforward was done.
    const monthKey = getMonthKey(currentMonth);
    if (!appData.monthlyBudgetData) appData.monthlyBudgetData = {};
    if (!appData.monthlyBudgetData[monthKey]) appData.monthlyBudgetData[monthKey] = { inflow: {}, outflow: {}, investing: {} };
    appData.monthlyBudgetData[monthKey]._carryForwardDone = balance;
    scheduleSave();

    alert(`${formatMoney(balance)} will carry forward in the Expenditure account to next month.`);
    renderMonthlyBudget();
});

// ── Mid-Month Quick Updates ──────────────────────────────────────────────────
const btnUpdateSalaryBalance = document.getElementById("btnUpdateSalaryBalance");
if (btnUpdateSalaryBalance) btnUpdateSalaryBalance.addEventListener("click", () => {
    const input = document.getElementById("midMonthSalaryBalance");
    const newBalance = Number(input?.value);
    if (isNaN(newBalance) || newBalance < 0) { alert("Enter a valid salary balance."); return; }
    const cards = (appData.tabData || {}).cards || [];
    const salary = cards.find(c => c.purpose === "Salary" && c.isPrimary !== "Yes");
    if (!salary) { alert("No Salary account found."); return; }
    salary.balance = newBalance;
    appData.tabData.cards = cards.map(c => c.id === salary.id ? salary : c);
    scheduleSave();
    input.value = "";
    if (!isBudgetEditMode) renderMonthlyBudget();
    alert(`Salary account balance updated to ${formatMoney(newBalance)}`);
});

// Quick Update: Expenditure Account Balance
const btnUpdateExpBalance = document.getElementById("btnUpdateExpBalance");
if (btnUpdateExpBalance) btnUpdateExpBalance.addEventListener("click", () => {
    const input = document.getElementById("midMonthExpBalance");
    const newBalance = Number(input?.value);
    if (isNaN(newBalance) || newBalance < 0) { alert("Enter a valid expenditure balance."); return; }
    const cards = (appData.tabData || {}).cards || [];
    const exp = cards.find(c => c.isPrimary === "Yes");
    if (!exp) { alert("No Primary (Expenditure) account found."); return; }
    exp.balance = newBalance;
    appData.tabData.cards = cards.map(c => c.id === exp.id ? exp : c);
    scheduleSave();
    input.value = "";
    // Calculate and show untracked expenses
    const monthKey = getMonthKey(currentMonth);
    const monthData = (appData.monthlyBudgetData || {})[monthKey] || {};
    const transferDone = Number(monthData._transferDone || 0);
    const prevMonthForCarry = new Date(currentMonth);
    prevMonthForCarry.setMonth(prevMonthForCarry.getMonth() - 1);
    const prevMonthCarry = (appData.monthlyBudgetData || {})[getMonthKey(prevMonthForCarry)];
    const prevCarryForward = Number(prevMonthCarry?._carryForwardDone || 0);
    const trackedExp = window._budgetTrackedExpenses || 0;
    const totalFunded = prevCarryForward + transferDone;
    const untracked = totalFunded > 0 ? Math.max(0, totalFunded - trackedExp - newBalance) : 0;
    const resultEl = document.getElementById("quickUpdateResult");
    const untrackedEl = document.getElementById("quickUpdateUntracked");
    if (resultEl) resultEl.hidden = false;
    if (untrackedEl) { untrackedEl.textContent = formatMoney(untracked); untrackedEl.style.color = untracked > 0 ? "#eab308" : "#22c55e"; }
    if (!isBudgetEditMode) renderMonthlyBudget();
    alert(`Expenditure account balance updated to ${formatMoney(newBalance)}`);
});

// Quick Update: Current Month CC Spending (stored as midMonthCCOutstanding)
const btnUpdateCCOutstanding = document.getElementById("btnUpdateCCOutstanding");
if (btnUpdateCCOutstanding) btnUpdateCCOutstanding.addEventListener("click", () => {
    const input = document.getElementById("midMonthCCOutstanding");
    const newCC = Number(input?.value);
    if (isNaN(newCC) || newCC < 0) { alert("Enter a valid CC spending amount."); return; }
    const monthKey = getMonthKey(currentMonth);
    if (!appData.monthlyBudgetData) appData.monthlyBudgetData = {};
    if (!appData.monthlyBudgetData[monthKey]) appData.monthlyBudgetData[monthKey] = { inflow: {}, outflow: {}, investing: {} };
    appData.monthlyBudgetData[monthKey].outflow.midMonthCCOutstanding = newCC;
    scheduleSave();
    input.value = "";
    renderMonthlyBudget();
    alert(`Current month CC spending for ${currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })} updated to ${formatMoney(newCC)}`);
});

// ── Sort/Filter toolbar event delegation ─────────────────────────────────────
(function () {
    const previewMap = {
        goalPreview:        { tabId: "financialGoal", render: () => renderFinancialGoal() },
        inflowTabPreview:   { tabId: "inflow",        render: () => renderInflow() },
        outflowTabPreview:  { tabId: "outflow",       render: () => renderOutflow() },
        giftsPreview:       { tabId: "gifts",         render: () => renderGifts() },
        insuranceTabPreview:{ tabId: "insurance",     render: () => renderInsurance() },
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

// Inflow event bindings
if (toggleInflowEdit) toggleInflowEdit.addEventListener("click", () => {
    isInflowEditMode = !isInflowEditMode;
    renderInflow();
});
if (inflowForm) inflowForm.addEventListener("submit", addInflowEntry);
if (inflowTableBody) inflowTableBody.addEventListener("click", e => handleTableAction("inflow", e));

// Outflow event bindings
if (toggleOutflowEdit) toggleOutflowEdit.addEventListener("click", () => {
    isOutflowEditMode = !isOutflowEditMode;
    if (isOutflowEditMode && monthlyIncomeInput) monthlyIncomeInput.value = appData.fixedMonthlyIncome || "";
    if (!isOutflowEditMode) scheduleSave();
    renderOutflow();
});
if (saveMonthlyIncome) saveMonthlyIncome.addEventListener("click", () => {
    appData.fixedMonthlyIncome = Number(monthlyIncomeInput.value || 0);
    scheduleSave();
    renderOutflow();
});
if (outflowForm) outflowForm.addEventListener("submit", addOutflowEntry);
if (outflowTableBody) outflowTableBody.addEventListener("click", e => handleTableAction("outflow", e));

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

// Insurance event bindings
if (toggleInsuranceEdit) toggleInsuranceEdit.addEventListener("click", () => {
    isInsuranceEditMode = !isInsuranceEditMode;
    if (!isInsuranceEditMode) scheduleSave();
    renderInsurance();
});
if (insuranceForm) insuranceForm.addEventListener("submit", addInsuranceEntry);
if (insuranceTableBody) insuranceTableBody.addEventListener("click", e => handleTableAction("insurance", e));

// Investment sub-tab bindings
const investmentSubTabs = document.getElementById("investmentSubTabs");
if (investmentSubTabs) investmentSubTabs.addEventListener("click", e => {
    if (!e.target.matches("[data-inv-view]")) return;
    activeInvestmentView = e.target.dataset.invView;
    investmentSubTabs.querySelectorAll(".inv-sub-tab").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    renderInflow();
});

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

function addInflowEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("inflow");
    if (!entry.name || Number(entry.amount || 0) < 0) return;
    upsertSectionEntry("inflow", entry);
    resetSectionForm("inflow");
    renderInflow();
}

function addOutflowEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("outflow");
    if (!entry.name || Number(entry.amount || 0) < 0) return;
    upsertSectionEntry("outflow", entry);
    resetSectionForm("outflow");
    renderOutflow();
}

function addInsuranceEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("insurance");
    if (!entry.name) return;
    upsertSectionEntry("insurance", entry);
    resetSectionForm("insurance");
    renderInsurance();
}

function addCardEntry(event) {
    event.preventDefault();
    const entry = readSectionFormEntry("cards");
    if (!entry.bankName) return;

    const entries = activeEntries();
    const editingId = editingEntryIds.cards;

    // Enforce: only one Primary (Expenditure) account
    if (entry.isPrimary === "Yes" && entries.some(c => c.isPrimary === "Yes" && c.id !== editingId)) {
        alert("A Primary (Expenditure) account already exists.\nOnly one primary account is allowed. Edit the existing one instead.");
        renderCardDynamicFields();
        return;
    }
    // Enforce: only one Salary account
    if (entry.purpose === "Salary" && entries.some(c => c.purpose === "Salary" && c.id !== editingId)) {
        alert("A Salary account already exists.\nOnly one Salary account is allowed.");
        return;
    }
    // Enforce: only one Saving account
    if (entry.purpose === "Saving" && entries.some(c => c.purpose === "Saving" && c.id !== editingId)) {
        alert("A Saving account already exists.\nOnly one Saving account is allowed.");
        return;
    }

    upsertSectionEntry("cards", entry);
    resetSectionForm("cards");

    // Mark onboarding complete only when both Primary (Expenditure) + Salary accounts exist
    const updatedEntries = getSectionEntries("cards");
    const hasPrimaryAcc = updatedEntries.some(c => c.isPrimary === "Yes");
    const hasSalaryAcc = updatedEntries.some(c => c.purpose === "Salary" && c.isPrimary !== "Yes");
    if (hasPrimaryAcc && hasSalaryAcc) {
        if (!appData.onboardingComplete) {
            appData.onboardingComplete = true;
            if (!appData.onboardingDate) appData.onboardingDate = new Date().toISOString().slice(0, 10);
        }
    } else {
        appData.onboardingComplete = false;
    }
    scheduleSave();
    renderTabs();
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
    // cancelEmergencyFundEdit removed
    renderEmergencyFund();
}

function saveMonthBudgetData() {
    scheduleSave();
}
