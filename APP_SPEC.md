# SmartFin – Application Specification (v4.0)

> **Purpose**: Single source of truth for the app's architecture, data models, business logic, and UI structure.
> Use this file as context when making future modifications. Update it after every significant change.

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (single-page app) |
| Styling | Custom CSS with CSS variables for theming (dark/light) |
| Charts | Chart.js |
| Export | SheetJS (XLSX) |
| Auth | Firebase Authentication (email/password) |
| Database | Firebase Firestore (real-time sync) |
| Fonts | Google Fonts – Inter |
| Icons | Inline emoji/text icons (no icon library) |

### Files

| File | Purpose | Approx Lines |
|------|---------|-------------|
| `index.html` | All HTML structure (single file, all tabs) | ~1050 |
| `assets/js/app.js` | All application logic (single file) | ~4900 |
| `assets/css/styles.css` | All styles (single file) | ~3280 |

---

## 2. Navigation & Tab System

### DEFAULT_TABS (in order)

| Tab ID | Label | Core | Has Custom UI |
|--------|-------|------|--------------|
| `cards` | Accounts | Yes | Yes – `cardsUI` |
| `inflow` | Investments | Yes | Yes – `inflowUI` |
| `outflow` | Outflow | Yes | Yes – `outflowUI` |
| `insurance` | Insurance | Yes | Yes – `insuranceUI` |
| `monthlyBudget` | Budget | Yes | Yes – `monthlyBudgetUI` |
| `financialGoal` | Goals | Yes | Yes – `financialGoalUI` |
| `netWorth` | Net Worth | No | Yes – `netWorthUI` |
| `taxPlan` | Tax Plan | No | Yes – `taxPlanUI` |
| `gifts` | Gifts | No | Yes – `giftsUI` |
| `emergencyFund` | Emergency Fund | No | Yes – `emergencyFundUI` |

Custom tabs use `standardUI` with generic form/table.

### UI Pattern

All tabs follow **Preview/Edit toggle**:
- Preview mode: summary cards, charts, read-only preview items
- Edit mode: dynamic form fields + data table with edit/delete actions
- Toggle button: `✎ Edit` ↔ `✓ Done`
- State variables: `is{Tab}EditMode` (boolean)

---

## 3. Data Model

### Firestore Document Structure

```
users/{uid} → single document
```

```json
{
  "userName": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "currentAge": 0,
  "fixedMonthlyIncome": 0,
  "onboardingComplete": false,
  "onboardingDate": "YYYY-MM-DD",
  "dataMigrated": true,
  "tabData": {
    "cards": [ ...entries ],
    "inflow": [ ...entries ],
    "outflow": [ ...entries ],
    "insurance": [ ...entries ],
    "financialGoal": [ ...entries ],
    "netWorth": [ ...entries ],
    "taxPlan": [ ...entries ],
    "gifts": [ ...entries ],
    "emergencyFund": [ ...entries ],
    "{customTabId}": [ ...entries ]
  },
  "monthlyBudgetData": {
    "2026-06": {
      "inflow": { "primaryIncome": 0, "secondaryIncome": 0, ... },
      "outflow": { "loanEMI": 0, "fixedSaving": 0, "fixedInvestment": 0, "fixedExpenditure": 0, "variableExpenditure": 0, "creditCardOutstanding": 0, "midMonthCCOutstanding": 0, ... },
      "investing": { "onetimeSaving": 0, "onetimeInvestment": 0, ... },
      "monthEndBalance": 0,
      "_transferDone": 0,
      "_initialBalance": 0,
      "_carryForwardDone": 0,
      "_monthClosed": false,
      "autoLinkedFields": { "outflow.loanEMI": true, "outflow.variableExpenditure": true, ... },
      "autoLinkedBreakdown": { "outflow.loanEMI": [{name, amount, source}] }
    }
  },
  "customTabs": [ { "id": "string", "label": "string", "color": "#hex", "text": "#hex" } ]
}
```

### Entry Structure (all tabs)

Every entry has:
```json
{
  "id": "uuid-v4",
  ...tab-specific fields from TAB_FIELDS
}
```

---

## 4. Tab-Specific Field Definitions (TAB_FIELDS)

### cards (Accounts)

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| bankName | Bank/NBFC Name | text | — | Yes |
| isPrimary | Primary Account | select | Yes, No | — |
| accountPresent | Account Present | select | Yes, No | — |
| balance | Balance (₹) | number | — | — |
| debitCardPresent | Debit Card Present | select | Yes, No | — |
| creditCardPresent | Credit Card Present | select | Yes, No | — |
| creditCardLimit | Credit Card Limit (₹) | number | — | — |
| purpose | Purpose of Use | select | Salary, Expenditure, Saving, Investment, Loan, Others | — |
| purposeOther | Specify Purpose | text | — | — |
| kycUpdated | Address/KYC Updated | select | Yes, No | — |
| nomineeAdded | Nominee Added | select | Yes, No | — |

**Business Rules:**
- `isPrimary=Yes` → auto-sets `purpose=Expenditure`
- Only ONE Primary, ONE Salary, ONE Saving account allowed
- Onboarding complete when both Primary + Salary exist

### inflow (Investments)

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Investment Name | text | — | Yes |
| type | Type | select | Mutual Fund, SIP, FD, RD, Stocks, PPF, EPF, NPS, Bonds, Gold, Real Estate, Saving, Other | — |
| category | Category | select | Existing, Monthly | — |
| amount | Invested Amount (₹) | number | — | Yes |
| currentValue | Current Value (₹) | number | — | — |
| interestRate | Expected Return (%) | number | — | — |
| frequency | Frequency | select | Monthly, Quarterly, Semi-Annual, Annual, One-Time | — |
| startDate | Start Date | date | — | — |
| endDate | Maturity Date | date | — | — |
| details | Notes | text | — | — |

**Sub-section Filtering (preview mode):**
- `activeInvestmentView` state: `all | existing | monthly | portfolio`
- Existing = `category=Existing AND frequency≠Monthly`
- Monthly = `category=Monthly OR frequency=Monthly`
- Portfolio = consolidated view including one-time budget investments

### outflow (Fixed Deductions)

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Name | text | — | Yes |
| type | Type | select | Insurance, Liability, Saving, Expenditure, Investment | — |
| amount | Amount (₹) | number | — | Yes |
| frequency | Frequency | select | Monthly, Quarterly, Semi-Annual, Annual, One-Time | — |
| bankName | Bank Name | text | — | — |
| endDate | End Date | date | — | — |
| details | Details | text | — | — |

**Auto-Debit Routing (Monthly frequency only):**
- Liability → leaves system
- Insurance → leaves system
- Saving → Saving account
- Investment → Investment account
- Expenditure → Primary account

### insurance

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Policy Name | text | — | Yes |
| policyType | Policy Type | select | Term Life, Whole Life, Health, Vehicle, Home, Travel, Critical Illness, Personal Accident, Other | — |
| provider | Insurance Provider | text | — | — |
| policyNumber | Policy Number | text | — | — |
| sumAssured | Sum Assured (₹) | number | — | — |
| premiumAmount | Premium Amount (₹) | number | — | — |
| premiumFrequency | Premium Frequency | select | Monthly, Quarterly, Half-Yearly, Annual, None (Paid Up) | — |
| startDate | Policy Start Date | date | — | — |
| endDate | Policy End Date | date | — | — |
| nominee | Nominee | text | — | — |
| details | Notes | text | — | — |

**Annual Premium Calculation:**
- Monthly → ×12, Quarterly → ×4, Half-Yearly → ×2, Annual → ×1, None → 0

### financialGoal

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Goal Name | text | — | Yes |
| amountNeeded | Amount Needed (₹) | number | — | Yes |
| amountAccumulated | Amount Accumulated (₹) | number | — | — |
| targetDate | Target Date | date | — | — |
| details | Details | text | — | — |
| goalType | Goal Type | select | Short Term, Mid Term, Long Term | — |
| status | Status | select | Planned, Ongoing, Achieved, Missed | — |

### netWorth

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Name | text | — | Yes |
| type | Type | select | Asset, Liability | — |
| value | Value Today (₹) | number | — | Yes |
| growthRate | Expected Annual Growth (%) | number | — | — |
| details | Details | text | — | — |

**Auto-entries:** Account balances (Assets) and Outflow liabilities are auto-imported.

### taxPlan

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Tax Saving Item | text | — | Yes |
| section | Section | select | 80C, 80D, 80CCD(1B), 80TTA, 80G, HRA, Other | — |
| amount | Amount (₹) | number | — | Yes |
| details | Details | text | — | — |

**Auto-deductions:** EPF, PPF, NPS, Insurance premiums auto-pulled from Outflow and Investments.

### gifts

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| name | Gift Name | text | — | Yes |
| category | Category | select | Fixed Every Year, On Demand | — |
| relativeName | Relative Name | text | — | — |
| occasion | Occasion | text | — | — |
| amount | Amount (₹) | number | — | — |
| details | Details | text | — | — |

### emergencyFund

| Field ID | Label | Type | Options | Required |
|----------|-------|------|---------|----------|
| currentFund | Current Emergency Fund (₹) | number | — | Yes |
| details | Details | text | — | — |

---

## 5. Monthly Budget Engine

### MONTHLY_BUDGET_CATEGORIES

```
inflow:    primaryIncome, secondaryIncome, borrowing, interest, othersInflow
outflow:   loanEMI, insurancePremiums, fixedSaving, fixedInvestment, fixedExpenditure,
           variableExpenditure, creditCardOutstanding, midMonthCCOutstanding,
           debtRepayment, utilityBills, familyExpenditure, miscExpenses
investing: onetimeSaving, onetimeInvestment, ondemandExpenditure, ondemandLiability
```

### Auto-Linked Fields

These fields are auto-calculated from other tabs (read-only in budget edit):
- `outflow.loanEMI` — Sum of all Liability outflows (monthly equivalent)
- `outflow.insurancePremiums` — Sum of all Insurance outflows (monthly equivalent)
- `outflow.fixedSaving` — Sum of all Saving outflows (monthly equivalent)
- `outflow.fixedInvestment` — Sum of all Investment outflows (monthly equivalent)
- `outflow.fixedExpenditure` — Sum of all Expenditure outflows (monthly equivalent)
- `outflow.variableExpenditure` — Auto: (initialBalance + prevCarryForward + transferDone) - currentExpBalance
- `outflow.creditCardOutstanding` — Auto from previous month's midMonthCCOutstanding (when prev month is closed)

### Key Calculations (calculateAndDisplaySummary)

```
fixedMonthlyOutflow = sum of all Outflow entries converted to monthly equivalent:
  Monthly → amount, Quarterly → amount/3, Semi-Annual → amount/6, Annual → amount/12, One-Time → excluded

totalSpendable = inflowTotal - fixedMonthlyOutflow
variableExpenses = variableExpenditure + midMonthCCOutstanding
budgetBalance = totalSpendable - variableExpenses (positive = surplus, negative = overspent)
```

### Transfer Flow

```
transferAmount = primaryIncome - fixedMonthlyOutflow
Execute Transfer:
  1. Blocks if no Salary or Expenditure account
  2. Blocks if transfer already done (_transferDone exists)
  3. Blocks if month already closed (_monthClosed)
  4. Blocks if primaryIncome not set or ≤ 0
  5. Blocks if transferAmount ≤ 0 (outflow exceeds income)
  6. salary.balance = 0 (deduct full primaryIncome)
  7. expenditure.balance += transferAmount
  8. savingAccount.balance += autoDebitByType.Saving
  9. investmentAccount.balance += autoDebitByType.Investment
  10. Records: _transferDone, _initialBalance
  11. Transfer section hidden after execution
```

When primaryIncome is entered, salary account balance is auto-updated to match.

### Close Current Month Budget

Replaces old "Carry Forward". Shown after transfer is done.

```
Close Month → confirmation dialog showing:
  • Month becomes read-only
  • Leftover expenditure balance carries forward
  • CC outstanding becomes next month's "Previous Month CC Bill (Unpaid)"

Actions:
  monthData._monthClosed = true
  monthData._carryForwardDone = expenditureBalance
  Navigate to next month
```

### Closed Month Behavior

- Edit button shows "🔒 Closed" (disabled)
- Budget status shows read-only banner
- Transfer section hidden
- Close section hidden
- Next month auto-gets CC outstanding via applyMonthlyAutoValues

---

## 6. Quick Update System

Located in Budget edit mode. Two fields (salary is auto-managed, not manually editable):

| Field | DOM ID | Action |
|-------|--------|--------|
| Expenditure Balance | `midMonthExpBalance` | Updates Primary account balance, auto-calculates variable expenditure |
| CC Spending | `midMonthCCOutstanding` | Stores in `monthlyBudgetData[monthKey].outflow.midMonthCCOutstanding` |

Variable expenditure shown after update: `totalFunded (initialBalance + prevCarryForward + transferDone) − newBalance`

---

## 7. Account System & Routing

### Account Lookup

```js
salaryAccount = cards.find(c => c.purpose === "Salary" && c.isPrimary !== "Yes")
expenditureAccount = cards.find(c => c.isPrimary === "Yes")
savingAccount = cards.find(c => c.purpose === "Saving" && c.isPrimary !== "Yes")
investmentAccount = cards.find(c => c.purpose === "Investment" && c.isPrimary !== "Yes")
```

### Auto-Debit Type Routing

```js
autoDebitByType = { Liability: 0, Insurance: 0, Saving: 0, Expenditure: 0, Investment: 0 }
// Liability/Insurance → leaves system (paid externally)
// Saving → savingAccount.balance += amount
// Investment → investmentAccount.balance += amount
// Expenditure → expenditureAccount.balance += amount
```

---

## 8. Delete Account

```
Settings → Danger Zone → Delete Account
1. confirm() dialog
2. prompt("DELETE ACCOUNT")
3. Firestore: db.collection("users").doc(uid).delete()
4. Firebase Auth: user.delete()
5. Auth state listener redirects to login
```

Requires recent login — if `auth/requires-recent-login` error, user must re-authenticate first.

---

## 9. UI Component Patterns

### Section Config Map

```js
sectionConfig = {
  financialGoal: { prefix: "goal",      form: goalForm,      render: renderFinancialGoal },
  inflow:        { prefix: "inflow",    form: inflowForm,    render: renderInflow },
  outflow:       { prefix: "outflow",   form: outflowForm,   render: renderOutflow },
  cards:         { prefix: "card",      form: cardForm,      render: renderCards },
  netWorth:      { prefix: "netWorth",  form: netWorthForm,  render: renderNetWorth },
  taxPlan:       { prefix: "taxPlan",   form: taxPlanForm,   render: renderTaxPlan },
  gifts:         { prefix: "gifts",     form: giftsForm,     render: renderGifts },
  insurance:     { prefix: "insurance", form: insuranceForm, render: renderInsurance },
  standard:      { prefix: "field",     form: entryForm,     render: render },
}
```

### Form Field ID Convention

Input IDs follow: `{prefix}_{fieldId}` (e.g., `insurance_name`, `card_bankName`)

### Generic Functions Used Across Tabs

| Function | Purpose |
|----------|---------|
| `readSectionFormEntry(section)` | Reads form inputs into entry object |
| `upsertSectionEntry(section, entry)` | Creates or updates entry in tabData |
| `resetSectionForm(section)` | Clears form and resets editing state |
| `updateSectionSubmitButton(section)` | Sets button text (Add/Save) |
| `handleTableAction(section, event)` | Handles Edit/Delete clicks in table |
| `renderRowActions(id)` | Returns HTML for edit/delete buttons |
| `activeEntries()` | Returns entries for current tab |
| `buildSortFilterToolbar(section)` | Builds sort/filter dropdown HTML |
| `applyListSortFilter(section, entries)` | Applies sort/filter to entry list |

---

## 10. Sort/Filter System

### State

```js
listSortFilter = {
  financialGoal: { sortBy: "", sortDir: "asc", filters: {} },
  inflow:        { sortBy: "", sortDir: "asc", filters: {} },
  outflow:       { sortBy: "", sortDir: "asc", filters: {} },
  gifts:         { sortBy: "", sortDir: "asc", filters: {} },
  insurance:     { sortBy: "", sortDir: "asc", filters: {} },
}
```

### Preview Map (event delegation)

```js
previewMap = {
  goalPreview:         → financialGoal,
  inflowTabPreview:    → inflow,
  outflowTabPreview:   → outflow,
  giftsPreview:        → gifts,
  insuranceTabPreview: → insurance,
}
```

---

## 11. CSS Architecture

### Theme System

- CSS variables on `:root` and `[data-theme="light"]`
- Key variables: `--bg`, `--surf1`, `--surf2`, `--text`, `--dim`, `--muted`, `--border`, `--border2`, `--accent`, `--shadow`

### Key CSS Classes

| Class | Used For |
|-------|---------|
| `.summary-hint` | Small descriptive text below summary labels |
| `.field-hint` | Hint text below form field labels |
| `.section-description` | Descriptive paragraph at top of tab sections |
| `.inv-sub-tabs` | Investment sub-section tab bar |
| `.inv-sub-tab.active` | Active investment sub-tab |
| `.portfolio-summary` | Portfolio summary grid container |
| `.portfolio-section` | Individual section in portfolio |
| `.portfolio-item` | Single investment item in portfolio list |
| `.insurance-card` | Insurance policy preview card |
| `.policy-badge` | Policy type badge |
| `.premium-badge` / `.no-premium-badge` | Premium status badges |
| `.quick-update-section` | Quick Update container in budget |
| `.quick-update-field` | Individual quick update input group |
| `.quick-update-result` | Untracked expenses result display |
| `.month-end-banner` | Carry forward suggestion banner |
| `.auto-calc-badge` | Badge for auto-calculated budget fields |
| `.category-preview-item` | Budget category line item in preview |
| `.budget-status.positive/.negative/.neutral` | Budget status banner variants |
| `.danger-zone` | Destructive action container in settings |
| `.danger-btn` | Red destructive action button |

---

## 12. Rendering Pipeline

```
render()
  ├─ getTabs() → merged DEFAULT_TABS + customTabs
  ├─ renderTabs() → tab bar HTML
  ├─ panelMap[activeTabId]
  │    ├─ monthlyBudget → renderMonthlyBudget()
  │    │    ├─ (annual view) → calculateAnnualSummary()
  │    │    ├─ applyMonthlyAutoValues()
  │    │    ├─ month-end banner check
  │    │    ├─ (edit) → renderCategoryFields() × 3
  │    │    └─ (preview) → renderCategoryPreview() × 3
  │    │         ├─ calculateAndDisplaySummary()
  │    │         └─ renderPieChart()
  │    ├─ inflow → renderInflow()
  │    │    ├─ (edit) → renderInflowDynamicFields() + renderInflowTable()
  │    │    └─ (preview) → filter by activeInvestmentView
  │    │         ├─ renderInflowPreviewCards() + calculateInflowSummary() + renderInflowChart()
  │    │         └─ (portfolio) → renderPortfolioSummary()
  │    ├─ insurance → renderInsurance()
  │    │    ├─ (edit) → renderInsuranceDynamicFields() + renderInsuranceTable()
  │    │    └─ (preview) → renderInsurancePreviewCards() + calculateInsuranceSummary()
  │    ├─ cards → renderCards()
  │    ├─ outflow → renderOutflow()
  │    ├─ financialGoal → renderFinancialGoal()
  │    ├─ netWorth → renderNetWorth()
  │    ├─ taxPlan → renderTaxPlan()
  │    ├─ gifts → renderGifts()
  │    └─ emergencyFund → renderEmergencyFund()
  └─ (custom/standard) → renderDynamicFields() + renderTableHead() + renderRows()
```

---

## 13. Event Binding Summary

| Event Source | Handler | Tab |
|-------------|---------|-----|
| `toggleBudgetEdit` click | Toggle `isBudgetEditMode` | Budget |
| `prevMonth/nextMonth` click | Navigate month | Budget |
| `toggleBudgetView` click | Toggle annual/monthly view | Budget |
| `btnCarryForward` click | Close current month budget | Budget |
| `btnUpdateExpBalance` click | Update expenditure balance + calc variable expenditure | Budget Quick Update |
| `btnUpdateCCOutstanding` click | Store midMonthCCOutstanding | Budget Quick Update |
| `inflowFields/outflowFields/investingFields` input | `handleCategoryFieldChange` | Budget Edit |
| `toggle{Tab}Edit` click | Toggle edit mode | All tabs |
| `{tab}Form` submit | `add{Tab}Entry` | All tabs |
| `{tab}TableBody` click | `handleTableAction(tab)` | All tabs |
| `investmentSubTabs` click | Switch investment view | Investments |
| `deleteAccountBtn` click | `deleteAccount()` | Settings |
| `resetAllDataButton` click | `resetAllData()` | Settings |

---

## 14. Global Window Variables

| Variable | Purpose |
|----------|---------|
| `window._budgetExpAccount` | Reference to expenditure account |
| `window._budgetSalaryAccount` | Reference to salary account |
| `window._budgetTransferAmt` | Calculated transfer amount |
| `window._budgetAutoDebitByType` | Auto-debit amounts by type |
| `window._budgetTransferDone` | Transfer done amount for current month |
| `window._budgetTrackedExpenses` | Variable expenses (variableExp + CC) |

---

## 15. Known Relationships & Dependencies

1. **Accounts → Budget**: Salary and Expenditure balances feed into budget calculations
2. **Outflow → Budget**: Monthly outflows auto-populate `loanEMI` and auto-debit routing
3. **Outflow → Net Worth**: Liabilities auto-imported as net worth liabilities
4. **Accounts → Net Worth**: Account balances auto-imported as net worth assets
5. **Budget → Investments (Portfolio)**: On-demand investment amounts feed portfolio summary
6. **Outflow (Insurance type) → Insurance**: Premium payments in Outflow should match policy entries in Insurance
7. **Outflow + Investments → Tax Plan**: EPF, PPF, NPS, insurance premiums auto-calculated as deductions
8. **Budget → Emergency Fund**: Fixed liabilities + fixed expenditure + avg variable expenses from budget history

---

## 16. Modification Checklist

When modifying the app, check these areas:

- [ ] **Adding a new tab**: Update `DEFAULT_TABS`, `TAB_FIELDS`, add DOM refs, state variable, `sectionConfig`, `editingEntryIds`, `listSortFilter`, `panelMap` in `render()`, `allPanels`, event bindings, add HTML panel, add CSS styles
- [ ] **Adding a budget category field**: Update `MONTHLY_BUDGET_CATEGORIES`, update `calculateAndDisplaySummary` if it affects tracked expenses or spendable calculation
- [ ] **Changing account types**: Update `addCardEntry` validation, account lookup in `calculateAndDisplaySummary`, auto-debit routing
- [ ] **Changing outflow types**: Update `autoDebitByType` in `calculateAndDisplaySummary`, auto-debit routing labels
- [ ] **Adding auto-linked budget fields**: Update `applyMonthlyAutoValues`, ensure field is marked read-only in `renderCategoryFields`
- [ ] **Modifying transfer logic**: Update `calculateAndDisplaySummary`, Execute Transfer handler, Quick Update handlers
- [ ] **Adding to net worth auto-entries**: Update `getAutoNetWorthEntries`
- [ ] **Adding tax auto-deductions**: Update `getAutoTaxDeductions`

---

*Last updated: 2026-06-09 (v5.0)*
