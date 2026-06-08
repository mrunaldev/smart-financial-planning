# SmartFin – Smart Financial Planning

A comprehensive dark-themed personal finance app with login/register, cross-device sync via Firebase, and tabbed sections for complete financial management.

## Features

### Tabs & Functionality

1. **Budget** – Monthly income & expense tracking with category-based fields
   - **Cash Inflow**: Primary Income, Secondary Income, Borrowing/Money Back, Interest/Dividend, Others
   - **Cash Outflow**: Auto-calculated Liabilities, Insurance Premiums, Fixed Saving, Fixed Investment, Fixed Expenditure, Variable Expenditure (auto), Previous Month CC Bill, Current Month CC Spending, Debt Repayment/Lending, Utility Bills, Family Expenditure, Miscellaneous Expenses
   - **On-Demand Outflow**: On-Demand Saving, On-Demand Investment, On-Demand Expenditure, On-Demand Liability
   - Auto-calculated fields with **clickable breakdown popups** showing source items (both edit & preview modes)
   - **Monthly Transfer Breakdown**: Primary Income − Auto-deducted Fixed Outflow = Transfer to Expenditure Account
   - **Execute Transfer** button: deducts full salary to ₹0, credits Expenditure/Saving/Investment accounts; one-time per month
   - **Close Current Month Budget**: marks month read-only, carries forward balance, navigates to next month
   - **Mid-Month Quick Update**: update Expenditure Account balance and CC outstanding from budget edit mode (salary is auto-managed, not editable)
   - Summary: Total Inflow, Total Outflow, Salary Balance, Expenditure Balance, Total Spendable, Variable Expenses
   - Budget status banner: **Surplus** / **Over Budget** / **Balanced** + edge cases (no accounts, no income, closed month)
   - Month navigation restricted: cannot go before April of onboarding FY or beyond next month from today
   - Financial-year annual view with Apr–Mar calculations (averages based on months with data)
   - Pie chart visualization (hidden during edit mode)
   - Edit mode with snapshot/restore on Cancel

2. **Goals** – Set and track financial goals
   - Target amount, current amount, target date
   - Automatic status: Planned, Ongoing, Achieved, or Missed
   - Progress tracking with status-based colors
   - Preview/Edit mode with summary

3. **Inflow** – Track income sources & investments (replaces old Investments tab)
   - Name, Type (FD/RD/MF/Stocks/PPF/NPS/Gold/Real Estate/Other), Frequency, Amount, Current Value, Interest Rate, Start/End Date, Details
   - Current value calculation based on start date, amount, and annual interest rate
   - Bar chart visualization; grouped preview cards
   - Auto-populates budget investing fields for Monthly frequency items

4. **Outflow** – Track recurring liabilities & insurance (replaces old Liabilities + Insurances tabs)
   - Name, Type (Liability/Insurance/Expenditure/Saving/Investment), Bank, Frequency, Amount, End Date, Details
   - Items grouped by type in preview with subtotals per group
   - Monthly Liability items auto-populate budget outflow (auto-calculated)
   - Monthly items auto-debited from salary account at month start
   - Summary: Fixed Monthly Income, Monthly Deductions, Remaining, Total Items
   - Bar charts: Amount by Bank, Amount by Type

5. **Accounts** – Manage bank accounts
   - Bank/NBFC Name, Primary Account, Balance, Debit/Credit Card, Credit Limit, Purpose (Salary/Expenditure/Saving/Investment/Loan/Others)
   - **Primary account** = Expenditure account (mandatory, one only, purpose auto-set to "Expenditure") — your main daily-use spending account
   - **Salary account** = mandatory, non-primary, purpose "Salary" — where salary is credited, then transferred to Primary
   - **Saving account**: max one, shown with 💰 SAVING badge
   - ⭐ PRIMARY (Expenditure) badge on primary card, 💼 SALARY badge on salary card
   - Default sort: Primary → Salary → Saving → others by balance descending
   - **All other tabs disabled until both Primary (Expenditure) + Salary accounts are set up**
   - Setup guidance banner shows which mandatory accounts are missing
   - Only one Salary account allowed; only one Primary account allowed

6. **Net Worth** – Calculate and project net worth
   - Auto-populated assets from Inflow tab, liabilities from Outflow tab
   - Manual entries with growth rates
   - Net worth projection graph (till age 70), inflation-adjusted (6%)

7. **Tax Plan** – Tax liability under new/old regimes
   - Auto-pulled deductions from Inflow & Outflow tabs (80C, 80D, 80CCD, etc.)
   - Manual tax saving items
   - New Tax Regime (FY 2024-25) and Old Tax Regime calculations

8. **Gifts** – Track gifts and charitable giving
   - Category: Fixed Every Year / On Demand
   - Summary: Total Gifts, Total Amount, Fixed Every Year count

9. **Emergency Fund** – Calculate emergency fund requirements
   - Minimum Monthly Need = Fixed Liabilities/Insurance + Fixed Expenditure + Avg Variable Expenses
   - Excludes Saving & Investment (stoppable in emergency)
   - Practical scenarios: 3-month (bare min), 6-month (recommended), 12-month (ideal)
   - Monthly need breakdown with component details
   - Status: EXCELLENT (≥12), READY (6–12), ADEQUATE (3–6), LOW (<3)

### Additional Features

- **Add/Edit/Delete** – Edit and Delete buttons side-by-side on desktop, stacked on mobile. Delete requires confirmation for all entries.
- **Preview/Edit Toggle** – Switch between view and edit modes. Budget edit supports Cancel with snapshot/restore.
- **Data Migration** – Automatic one-time migration from old tab structure (investments/liabilities/insurances → inflow/outflow)
- **Onboarding** – New users start on Accounts tab; existing users go to Budget
- **Excel Export** – Export tab data as `.xlsx`
- **Data Reset** – Double confirmation (confirm + type "DELETE")
- **Cross-Device Sync** – Firebase Firestore real-time sync
- **Responsive Design** – Desktop & mobile with iOS safe-area support

## Structure

- `index.html` — Auth + app markup
- `assets/css/styles.css` — Responsive dark UI
- `assets/js/firebase-config.js` — **Your Firebase config goes here**
- `assets/js/app.js` — Firebase Auth + Firestore sync, tabs, rendering, calculations

## Firebase Setup (required for login & cross-device sync)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Add a **Web App** to the project (click the `</>` icon)
4. **Authentication** → Get started → Enable **Email/Password**
5. **Firestore Database** → Create database → Start in **test mode**
6. **Project Settings** → Your apps → copy the config snippet into `assets/js/firebase-config.js`

## Run Locally

Open `index.html` directly in your browser — no server needed (the app uses Firebase, not local files).

Or with a local server:

```bash
python -m http.server 8082
```

Then open `http://localhost:8082`

## Data Management

### Export Data
- Click "Export Excel" button to export current tab data
- Downloads as `{Tab_Name}_export.xlsx`

### Reset Data
- Click "Reset All Data" button to clear all data
- Requires double confirmation (confirm dialog + type "DELETE")
- Permanently deletes all data including budget, inflow, outflow, accounts, net worth, tax plan, gifts, emergency fund
- **This action cannot be undone**

## User Manual — How Each Field Is Calculated

### Getting Started

1. **Create accounts**: You must add a **Primary (Expenditure)** account (set as Primary) and a **Salary** account (purpose = Salary) before other tabs unlock.
2. **Add outflow items**: Go to the Outflow tab and add your recurring monthly liabilities (EMIs, subscriptions, etc.) with type "Liability" and frequency "Monthly".
3. **Add inflow items**: Go to the Inflow tab and add your investments (SIPs, FDs, etc.) with appropriate frequency.
4. **Set budget**: Go to the Budget tab to enter your monthly income and expenses.

---

### Account System

| Account Type | Rules |
|---|---|
| **Primary (Expenditure)** | Mandatory. Exactly one. Purpose auto-set to "Expenditure". This is your main daily-use spending account. Funds are transferred here from Salary. |
| **Salary** | Mandatory. Exactly one. Non-primary, purpose "Salary". Where your salary is credited. Fixed outflows are auto-debited, remaining is transferred to Primary. |
| **Saving** | Optional. Max one. Shown with 💰 badge. Used for "Settle from Saving" on CC outstanding. |
| **Others** | Optional. Investment, Loan, or custom purpose. |

---

### Monthly Budget — Field Calculations

#### Category Totals

| Field | Formula |
|---|---|
| **Cash Inflow Total** | `Primary Income + Secondary Income + Borrowing + Interest + Others` |
| **Cash Outflow Total** | `Auto-calc Liabilities + CC Outstanding + Debt Repayment + Utility Bills + Family Expenditure + Misc Expenses` |
| **On-Demand Outflow Total** | `On-Demand Saving + On-Demand Investment + On-Demand Expenditure + On-Demand Liability` |

#### Auto-Calculated Fields

| Field | Source | How |
|---|---|---|
| **Auto-calculated Liabilities** (loanEMI) | Outflow tab | Sum of all Outflow items where `type = Liability` and `frequency = Monthly` and item has not ended. Click the "auto" badge to see itemised breakdown. |
| **On-Demand Investment** (auto part) | Inflow tab | Sum of Inflow items with `frequency = Annual` (in matching month) or `frequency = One-Time` (in start month). |

#### Summary Grid

| Field | Formula |
|---|---|
| **Total Inflow** | Same as Cash Inflow Total |
| **Total Outflow** | Cash Outflow Total + On-Demand Outflow Total |
| **Salary A/c Balance** | Auto-set when Primary Income entered (transit account, zeroed on transfer) |
| **Expenditure Account Balance** | Current balance of the Expenditure account (from Accounts tab) |
| **Total Spendable / Amount Overspent** | `Inflow Total − Fixed Monthly Outflow` — shows "Total Spendable" if ≥ 0, "Amount Overspent" if < 0. Fixed Monthly Outflow = sum of all Outflow tab items converted to monthly equivalent (all frequencies). |
| **Variable Expenses** | `variableExpenditure + midMonthCCOutstanding` — spending from expenditure account + CC charges |

#### Budget Status Banner

| Status | Condition |
|---|---|
| ⚠️ **No accounts** | Missing Primary or Salary account — setup guidance shown |
| *Empty* | No income or outflows entered yet |
| ⚪ **Enter income** | Outflows exist but no income entered |
| � **Budget Surplus** | Spendable > Variable Expenses |
| 🔴 **Over Budget** | Variable Expenses > Spendable |
| ⚪ **Budget Balanced** | Spendable = Variable Expenses |
| 🔒 **Closed** | Month is closed and read-only |

---

### Monthly Transfer Breakdown

| Field | Formula |
|---|---|
| **Primary Income** | From budget Cash Inflow → Primary Income field |
| **Fixed Monthly Outflow** | Sum of Outflow tab items with `frequency = Monthly` (all types) |
| **Breakdown by destination** | Auto-debits from Salary are routed by Outflow type: |
| | • **Liability** (EMIs) → paid to lender (leaves system) |
| | • **Insurance** → paid to insurer (leaves system) |
| | • **Saving** → credited to Saving account |
| | • **Investment** → credited to Investment account |
| | • **Expenditure** → credited to Primary (Expenditure) account |
| **Remaining → Transfer to Primary** | `Primary Income − Total Fixed Monthly Outflow` (green if ≥ 0; red = shortfall) |

**Execute Transfer** button:
- Deducts **full** primaryIncome from Salary (balance → ₹0)
- Credits Expenditure account with transfer amount
- Credits Saving and Investment accounts with respective auto-debit totals
- Records `_transferDone` and `_initialBalance`
- **One-time only** per month — section hidden after execution

---

### Close Current Month Budget

Visible when: transfer done, current or past month, not already closed.

**Close Month** button:
- Marks month as **read-only** (`_monthClosed = true`)
- Records expenditure balance as `_carryForwardDone`
- Sets current month's CC spending as next month's "Previous Month CC Bill (Unpaid)"
- Navigates to next month
- **Requires transfer first** — blocks if not yet executed

---

### Mid-Month Quick Update (Edit Mode)

| Field | What It Updates |
|---|---|
| **Expenditure Account Balance** | Updates Primary account balance + auto-calculates variable expenditure |
| **Current Month CC Spending** | Stores as `midMonthCCOutstanding` in current month's outflow data |

Salary balance is **not** manually editable — auto-managed as a transit account.

---

### Annual View

Averages are calculated using **only months that have data** (not always 12).

| Field | Formula |
|---|---|
| **Income** | Sum of all monthly inflow totals across FY (Apr–Mar) |
| **Expenditure** | Sum of: Utility Bills + Family Expenditure + Misc Expenses + CC Outstanding + On-Demand Expenditure + On-Demand Liability (per month) |
| **Saving** | Sum of On-Demand Saving per month |
| **Investment** | Sum of On-Demand Investment per month |
| **Liability** | Sum of Loan EMI + Debt Repayment per month |
| **Other** | `(Cash Outflow Total + On-Demand Total) − (Liability + Expenditure + Saving + Investment)` per month (catches any unclassified items) |
| **Monthly Average** | `Total ÷ Months with data` |

---

### Emergency Fund

**Minimum Monthly Need** = Fixed Liabilities/Insurance + Fixed Expenditure + Average Variable Expenses

Excludes Saving & Investment outflows (stoppable in emergency).

| Component | Source |
|---|---|
| **Fixed Liabilities & Insurance** | Outflow tab items (type=Liability or Insurance), converted to monthly equivalent |
| **Fixed Expenditure** | Outflow tab items (type=Expenditure), converted to monthly equivalent |
| **Avg Variable Expenses** | Average of variable budget fields across months with data |

| Scenario | Formula |
|---|---|
| **3 Months (Bare Minimum)** | Minimum Monthly Need × 3 |
| **6 Months (Recommended)** | Minimum Monthly Need × 6 |
| **12 Months (Ideal)** | Minimum Monthly Need × 12 |
| **Shortfall** | `max(0, 6×Monthly Need − Current Fund)` |
| **Months Covered** | `Current Fund ÷ Minimum Monthly Need` |

| Status | Condition |
|---|---|
| 🟢 **EXCELLENT** | ≥ 12 months covered |
| 🟢 **READY** | 6–12 months |
| 🟡 **ADEQUATE** | 3–6 months |
| 🔴 **LOW** | < 3 months |

---

### Net Worth (Auto-Entries)

| Source | Mapped To | Value |
|---|---|---|
| Inflow tab items | Asset | `currentValue` (calculated from amount, interest rate, start date) |
| Outflow tab items (type=Liability) | Liability | `amount × remaining months (duration)` |

Manual entries can be added alongside auto-entries. Growth is projected at the item's rate minus 6% inflation.

---

### Tax Plan (Auto-Deductions)

Auto-pulled from Inflow and Outflow tabs based on item type mapping to tax sections (80C, 80D, 80CCD, etc.).

---

### Pie Charts

| Chart | Data |
|---|---|
| **Monthly** | Distribution of: Investment, Liability, Saving, Expenditure, Other (from `getMonthlyDistribution`) |
| **Annual** | Same categories summed across 12 FY months |

## Libraries Used

- Firebase (Auth, Firestore) – Authentication and data sync
- Chart.js – Pie charts, bar charts, line charts
- SheetJS (XLSX) – Excel export
