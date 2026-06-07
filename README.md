# SmartFin – Smart Financial Planning

A comprehensive dark-themed personal finance app with login/register, cross-device sync via Firebase, and tabbed sections for complete financial management.

## Features

### Tabs & Functionality

1. **Budget** – Monthly income & expense tracking with category-based fields
   - **Cash Inflow**: Primary Income, Secondary Income, Borrowing/Money Back, Interest/Dividend, Others
   - **Cash Outflow**: Auto-calculated Liabilities (from Outflow tab), Outstanding Credit Card Bill, Debt Repayment/Lending, Utility Bills, Family Expenditure, Miscellaneous Expenses
   - **On-Demand Outflow**: On-Demand Saving, On-Demand Investment, On-Demand Expenditure, On-Demand Liability
   - Auto-calculated fields with **clickable breakdown popups** showing source items (both edit & preview modes)
   - **Monthly Transfer Breakdown**: Primary Income − Auto-deducted Fixed Outflow = Transfer to Expenditure Account
   - **Execute Transfer** button: moves funds from Salary → Expenditure account, updates both balances; salary should reach ₹0 after auto-debit + transfer
   - **Expenditure Reconciliation**: input current expenditure account balance to detect untracked/cash expenses
   - **Month-End Carryforward**: positive expenditure balance carries to next month
   - **Mid-Month Quick Update**: update Salary account balance and CC outstanding directly from budget edit mode
   - Summary: Total Inflow, Total Outflow, Cash Flow, Salary Balance (after auto-debit), Expenditure Balance, Total Spendable, Tracked Expenses, Untracked Expenses
   - Budget status banner: **Positive** (surplus), **Negative** (overspent), **Neutral** (balanced) + CC carryover
   - **Settle from Saving** button on credit card outstanding field
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
   - Auto average monthly expense from budget data
   - 6-month and 12-month targets
   - Status: Green (12+), Yellow (6–12), Red (<6 months)

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
| **Cash Flow** | `Total Inflow − Total Outflow` (green if ≥ 0, red if < 0) |
| **Salary Balance (after auto-debit)** | `Salary Account Balance − Fixed Monthly Outflow` — Fixed Monthly Outflow = sum of all Outflow tab items with `frequency = Monthly`. These are assumed auto-debited at the start of each month. |
| **Expenditure Account Balance** | Current balance of the Expenditure account (from Accounts tab). |
| **Total Spendable / Amount Overspent** | `Total Inflow − Total Outflow` — shows "Total Spendable" if ≥ 0, "Amount Overspent" if < 0. |
| **Tracked Expenses** | `CC Outstanding + Debt Repayment + Utility Bills + Family Expenditure + Misc Expenses + On-Demand Expenditure + On-Demand Liability` — excludes auto-calc liabilities (already debited from salary). |
| **Untracked Expenses** | `(Previous Month Carryforward + Transfers Done) − Tracked Expenses − Current Expenditure Balance` — clamped to ≥ 0. Shows ₹0 if no transfers done yet. |

#### Budget Status Banner

| Status | Condition |
|---|---|
| 🟢 **Budget Positive** | Cash Flow > 0 → shows surplus amount |
| 🔴 **Budget Negative** | Cash Flow < 0 → shows overspent amount |
| ⚪ **Budget Balanced** | Cash Flow = 0 |
| **CC Carryover** | If previous month had CC Outstanding > 0, appended to banner |

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

**Execute Transfer** button: Deducts transfer amount from Salary account, adds to Primary (Expenditure) account, records `_transferDone` on the month. Can be clicked multiple times (cumulative).

---

### Expenditure Reconciliation

| Field | Formula |
|---|---|
| **Expected Balance** | `Previous Month Carryforward + Transfers Done − Tracked Expenses` |
| **Actual Balance** | User-entered current expenditure account balance |
| **Untracked/Cash Expenses** | `Expected Balance − Actual Balance` (clamped to ≥ 0) |

The **Reconcile** button also updates the Expenditure account balance in the Accounts tab.

---

### Month-End Carryforward

Visible when: current or past month, expenditure balance > 0, and budget is positive.

| Field | Formula |
|---|---|
| **Expenditure Account End Balance** | Current Expenditure account balance |
| **Carry to Next Month** | Same as end balance |

**Carry Forward** button records `_carryForwardDone` on the month data. The balance stays in the Expenditure account and is available next month.

---

### Mid-Month Quick Update (Edit Mode)

| Field | What It Updates |
|---|---|
| **Salary Account Balance** | Updates the Salary (Primary) account balance in Accounts tab |
| **Credit Card Outstanding** | Updates `creditCardOutstanding` in the current month's outflow data |

---

### Settle from Saving (Budget Edit Mode)

Available on the "Outstanding Credit Card Bill" field in edit mode.

| Step | Formula |
|---|---|
| **Settle Amount** | `min(CC Outstanding, Saving Account Balance)` |
| **After settle** | CC Outstanding reduced by settle amount; Saving account balance reduced by settle amount |

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

| Field | Formula |
|---|---|
| **Average Monthly Expenses** | Sum of all `outflow` values across all recorded months ÷ number of months |
| **6-Month Target** | `Average Monthly Expenses × 6` |
| **12-Month Target** | `Average Monthly Expenses × 12` |
| **Months Covered** | `Current Fund ÷ Average Monthly Expenses` |
| **Amount Needed** | `max(0, 6-Month Target − Current Fund)` |
| **Status** | 🟢 Green (≥12 months) · 🟡 Yellow (6–12) · 🔴 Red (<6) |

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
