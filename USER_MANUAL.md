# SmartFin – User Manual

A comprehensive guide to using SmartFin for personal financial planning.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Dashboard & Navigation](#dashboard--navigation)
5. [Accounts (Setup)](#accounts-setup)
6. [Monthly Budget](#monthly-budget)
7. [Investments](#investments)
8. [Outflow (Fixed Deductions)](#outflow-fixed-deductions)
9. [Insurance](#insurance)
10. [Financial Goals](#financial-goals)
11. [Net Worth](#net-worth)
12. [Tax Plan](#tax-plan)
13. [Gifts](#gifts)
14. [Emergency Fund](#emergency-fund)
15. [Settings & Danger Zone](#settings--danger-zone)
16. [Export to Excel](#export-to-excel)
17. [Cross-Device Sync](#cross-device-sync)
18. [FAQ](#faq)

---

## Overview

SmartFin is a personal finance web application (dark/light theme) that helps you manage:

- **Monthly Budget** — Track inflows, outflows, on-demand spending with account-balance-aware calculations
- **Investments** — Existing (lump sum), Monthly (SIPs/RDs), Portfolio Summary, with sub-section views
- **Outflow** — Fixed monthly deductions (EMIs, insurance premiums, savings, investments) auto-debited from Salary
- **Insurance** — Dedicated policy tracker with premium frequency, sum assured, nominees
- **Accounts** — Bank/NBFC accounts with Primary (Expenditure), Salary, Saving, Investment designations
- **Financial Goals** — Target-based savings goals with progress tracking
- **Net Worth** — Assets & liabilities with 70-year projection
- **Tax Plan** — Old/New regime comparison with auto-calculated deductions from budget
- **Gifts** — Gift tracking with yearly/on-demand categories
- **Emergency Fund** — Fund adequacy calculator based on average monthly expenses

All data syncs in real-time across devices via Firebase Firestore.

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project configured (see README.md)
- Internet connection

### First-Time Setup

1. Open `index.html` in your browser
2. **Register** with name, email, and password
3. Go to **Accounts** tab → Add a **Primary (Expenditure)** account and a **Salary** account
4. This unlocks all other tabs

---

## Authentication

### Sign In
1. Enter email + password → Click **Sign In**

### Register
1. Click **Register** → Enter name, email, password → Click **Create Account**

---

## Dashboard & Navigation

### Tab Bar

```
[Accounts] [Investments] [Outflow] [Insurance] [Budget] [Goals] [Net Worth] [Tax Plan] [Gifts] [Emergency Fund] [+]
```

- **Core tabs** (always visible): Accounts, Investments, Outflow, Insurance, Budget, Goals
- **Additional tabs**: Net Worth, Tax Plan, Gifts, Emergency Fund
- **Custom tabs**: Add with the **+** button
- **Mobile**: Horizontally scrollable, with hamburger menu

### Edit/Preview Pattern

All tabs use the **Edit/Done toggle** pattern:
- **Preview mode** (default): Shows summary cards, charts, and read-only data
- **Edit mode** (click ✎ Edit): Shows the entry form and editable data table
- Click **✓ Done** to return to preview mode

---

## Accounts (Setup)

### Purpose

Manage your bank/NBFC accounts. The account system is the foundation — other tabs depend on it.

### Account Types

| Account | Badge | Rules |
|---------|-------|-------|
| **Primary (Expenditure)** | ⭐ PRIMARY | Exactly one. isPrimary=Yes auto-sets purpose to Expenditure |
| **Salary** | 💼 SALARY | Exactly one. Purpose=Salary, isPrimary=No |
| **Saving** | 💰 SAVING | At most one. Purpose=Saving |
| **Investment** | — | Purpose=Investment |
| **Loan** | — | Purpose=Loan |
| **Others** | — | Purpose=Others (custom purpose field) |

### Fields

| Field | Type | Description |
|-------|------|-------------|
| Bank/NBFC Name | Text | e.g. HDFC, ICICI |
| Primary Account | Select | Yes / No |
| Account Present | Select | Yes / No |
| Balance (₹) | Number | Current account balance |
| Debit Card Present | Select | Yes / No |
| Credit Card Present | Select | Yes / No |
| Credit Card Limit (₹) | Number | Credit limit |
| Purpose of Use | Select | Salary, Expenditure, Saving, Investment, Loan, Others |
| Specify Purpose | Text | Custom purpose (when Others selected) |
| Address/KYC Updated | Select | Yes / No |
| Nominee Added | Select | Yes / No |

### Onboarding

The app marks onboarding complete when **both** Primary and Salary accounts exist. Until then, other tabs are hidden.

---

## Monthly Budget

### Overview

The Budget tab is the central financial cockpit. It shows monthly income vs. expenses with account-balance-aware calculations.

### Views

- **Monthly view** — Current month's budget (navigate with ◀ ▶)
- **Annual view** — Financial year summary with pie chart (toggle with 📊 button)

### Budget Summary Grid

| Metric | Hint | Formula |
|--------|------|---------|
| **Total Inflow** | All income sources this month | Sum of Cash Inflow fields |
| **Total Outflow** | Fixed obligations + on-demand spending | Sum of Cash Outflow + On-Demand Outflow |
| **Cash Flow** | Planning metric | Inflow − Outflow |
| **Salary Account Balance** | After auto-debit of fixed outflows | Salary balance − fixed monthly outflows |
| **Expenditure Account Balance** | Current spending account balance | From Accounts tab |
| **Total Spendable This Month** | What you can still spend | Expenditure balance + pending transfers − tracked expenses |
| **Tracked Expenses** | Bills, CC spending you entered | Sum of all manually entered outflow/on-demand items |
| **Untracked Expenses** | Cash/unrecorded spending | (carryforward + transfers) − tracked − current balance |

### Budget Categories

**Cash Inflow:**
- Primary Income (auto-calculated from Salary account)
- Secondary Income
- Borrowing/Money Back
- Interest/Dividend
- Others

**Cash Outflow:**
- Auto-calculated Liabilities (EMIs) — auto-linked from Outflow tab
- Previous Month CC Bill (unpaid) — last month's credit card balance
- Current Month CC Spending — this month's credit card purchases
- Debt Repayment / Lending
- Utility Bills (electricity, water, gas, internet)
- Family Expenditure (groceries, household)
- Miscellaneous Expenses

**On-Demand Outflow:**
- On-Demand Saving
- On-Demand Investment
- On-Demand Expenditure
- On-Demand Liability

### Monthly Transfer Flow

1. Salary received → Auto-debit fixed outflows (EMIs, insurance, etc.)
2. Remaining → **Execute Transfer** to Primary (Expenditure) account
3. Track daily spending in Cash Outflow / On-Demand Outflow
4. Month-end → **Carry Forward** remaining balance

### Quick Update (Mid-Month)

Update account balances and CC spending without editing the full budget:

| Field | What it does |
|-------|-------------|
| **Salary Account Balance** | Updates the Salary account balance in Accounts |
| **Expenditure Account Balance** | Updates the Primary account balance + auto-calculates untracked expenses |
| **Current Month CC Spending** | Stores as `midMonthCCOutstanding` (separate from previous month's CC bill) |

When you update Expenditure Balance, the system calculates untracked expenses:
`Untracked = (transfers + carryforward) − tracked expenses − actual balance`

### Month-End Carry Forward Banner

When navigating to a new month, if the previous month has an unclosed balance, a banner appears:
> "Previous month (May 2026) has ₹X remaining. Carry forward?"

Click **Carry Forward** to record it.

---

## Investments

### Overview

Track all your investments in one place with sub-section views.

### Sub-sections (Preview Mode)

| Tab | Shows |
|-----|-------|
| **All** | Every investment entry |
| **Existing** | Lump sum: FDs, PPF, Stocks, Bonds, Real Estate (category=Existing, frequency≠Monthly) |
| **Monthly** | Recurring: SIPs, RDs (category=Monthly or frequency=Monthly) |
| **Portfolio Summary** | Consolidated view with Existing + Monthly + One-Time (from Budget) |

### Fields

| Field | Type | Description |
|-------|------|-------------|
| Investment Name | Text | e.g. HDFC SIP, Axis FD |
| Type | Select | Mutual Fund, SIP, FD, RD, Stocks, PPF, EPF, NPS, Bonds, Gold, Real Estate, Saving, Other |
| Category | Select | **Existing** or **Monthly** |
| Invested Amount (₹) | Number | Total amount invested |
| Current Value (₹) | Number | Market value today |
| Expected Return (%) | Number | Annual return rate |
| Frequency | Select | Monthly, Quarterly, Semi-Annual, Annual, One-Time |
| Start Date | Date | Investment start |
| Maturity Date | Date | Maturity / end date |
| Notes | Text | Optional |

### Summary Metrics

- Total Invested, Current Portfolio Value, Total Items
- Monthly Investments total, Existing (Lump Sum) total

### Portfolio Summary View

Groups investments into three sections:
1. **Existing Investments** — FDs, PPF, Stocks, etc.
2. **Monthly Investments** — SIPs, RDs
3. **One-Time Investments (from Budget)** — On-Demand Investment amounts from monthly budget data

---

## Outflow (Fixed Deductions)

### Overview

Recurring monthly deductions auto-debited from your Salary account at month start.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| Name | Text | e.g. Rent, LIC Premium |
| Type | Select | Insurance, Liability, Saving, Expenditure, Investment |
| Amount (₹) | Number | Monthly deduction amount |
| Frequency | Select | Monthly, Quarterly, Semi-Annual, Annual, One-Time |
| Bank Name | Text | Associated bank |
| End Date | Date | When deduction ends |
| Details | Text | Optional |

### Auto-Debit Routing

Monthly-frequency outflows are auto-debited from Salary and routed by type:

| Outflow Type | Destination |
|-------------|-------------|
| Liability | Leaves system (paid to lender) |
| Insurance | Leaves system (paid to insurer) |
| Saving | Credited to Saving account |
| Investment | Credited to Investment account |
| Expenditure | Credited to Primary (Expenditure) account |

The **Monthly Transfer Breakdown** section in Budget shows this routing.

### Summary

- Fixed Monthly Income (editable)
- Monthly Deductions total
- Remaining After Deductions

---

## Insurance

### Overview

Dedicated tab for tracking insurance policies — separate from Outflow premium payments.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| Policy Name | Text | e.g. LIC Term Plan, Star Health |
| Policy Type | Select | Term Life, Whole Life, Health, Vehicle, Home, Travel, Critical Illness, Personal Accident, Other |
| Insurance Provider | Text | e.g. LIC, HDFC Life |
| Policy Number | Text | Policy/certificate number |
| Sum Assured (₹) | Number | Coverage amount |
| Premium Amount (₹) | Number | 0 if no active premium (paid up) |
| Premium Frequency | Select | Monthly, Quarterly, Half-Yearly, Annual, None (Paid Up) |
| Policy Start Date | Date | When policy started |
| Policy End Date | Date | When policy expires |
| Nominee | Text | Nominee name |
| Notes | Text | Optional |

### Summary

- Total Policies count
- Annual Premium Total (all premiums annualized)
- Monthly Premium Load (annual ÷ 12)
- Total Sum Assured

### Relationship to Outflow

- Policies **with** active premiums should also have a corresponding entry in Outflow (type=Insurance) for budget auto-debit
- Policies **without** premiums (Paid Up) only appear in Insurance tab

---

## Financial Goals

### Fields

| Field | Description |
|-------|-------------|
| Goal Name | e.g. Emergency Fund, Down Payment |
| Amount Needed (₹) | Target amount |
| Amount Accumulated (₹) | Saved so far |
| Target Date | Deadline |
| Details | Optional notes |
| Goal Type | Short Term, Mid Term, Long Term |
| Status | Planned, Ongoing, Achieved, Missed |

### Preview Cards

Each goal shows a progress bar with percentage and status badge.

---

## Net Worth

### Fields

| Field | Description |
|-------|-------------|
| Asset/Liability Name | e.g. House, Car Loan |
| Type | Asset or Liability |
| Value Today (₹) | Current value |
| Expected Annual Growth (%) | For projection |
| Details | Optional |

### Features

- Auto-imports account balances and outflow liabilities as net worth entries
- Assets vs. Liabilities breakdown
- **Projection chart** — Projects net worth growth until age 70

---

## Tax Plan

### Features

- **Regime selection**: Old or New tax regime
- **Financial year selection**: Choose which FY to plan for
- **Auto-calculated deductions**: Pulls EPF, PPF, NPS, insurance premiums from Outflow and Investments
- **Manual deductions**: Add additional 80C, 80D, 80CCD, etc.
- **Tax breakdown**: Shows taxable income, slab-wise tax, cess

---

## Gifts

### Fields

| Field | Description |
|-------|-------------|
| Gift Name | e.g. Birthday gift to friend |
| Category | Fixed Every Year, On Demand |
| Relative Name | Recipient |
| Occasion | e.g. Birthday, Wedding |
| Amount (₹) | Gift value |
| Details | Optional |

---

## Emergency Fund

### How It Works

- Enter your current emergency fund amount
- System auto-calculates average monthly expenses from budget data
- Shows how many months your fund covers
- Target: 6–12 months of expenses

---

## Settings & Danger Zone

Access via the ⚙️ Settings button in the header.

### Settings Options

- **Theme**: Toggle Dark/Light mode
- **User info**: Display name, email

### Danger Zone

| Action | Description | Confirmation |
|--------|-------------|-------------|
| **Reset All Data** | Deletes all financial data, preserves account | Type "DELETE" |
| **Delete Account** | Deletes all data + Firebase Auth account permanently | Type "DELETE ACCOUNT" |

**Delete Account** is irreversible — it removes your Firestore data and Firebase Authentication record. You'll need to re-register if you want to use the app again.

---

## Export to Excel

- Click **Export** on any tab
- Downloads `{Tab_Name}_export.xlsx`
- Contains all entries with column headers
- Uses SheetJS (XLSX) library

---

## Cross-Device Sync

- **Real-time** via Firebase Firestore
- **Automatic** — no manual sync needed
- **Same data** on all devices with same account
- **Data location**: `users/{uid}` in Firestore

---

## FAQ

### Q: How do I delete my account?
**A:** Go to Settings → Danger Zone → Delete Account. Type "DELETE ACCOUNT" to confirm.

### Q: What's the difference between Outflow and Insurance tabs?
**A:** Outflow tracks **premium payments** (monthly deductions from salary). Insurance tracks **policy details** (coverage, nominees, dates). Policies with premiums should appear in both.

### Q: What does "Previous Month CC Bill" vs "Current Month CC Spending" mean?
**A:** Previous Month CC Bill is the unpaid credit card balance from last month (a fixed obligation). Current Month CC Spending is what you've charged to your credit card this month (ongoing, updated via Quick Update).

### Q: How is "Total Spendable" calculated?
**A:** `Expenditure Account Balance + Pending Transfers − Tracked Expenses`. This reflects actual money available, not a theoretical budget.

### Q: What's the Portfolio Summary view in Investments?
**A:** It consolidates your investments from three sources: Existing (lump sum), Monthly (SIPs/RDs), and One-Time (from Budget on-demand investments).

### Q: Is my data secure?
**A:** Yes. Data is in Firebase Firestore with authentication. Only you can access it.

### Q: What currency does the app use?
**A:** Indian Rupee (₹) with Indian number formatting (₹12,34,567).

---

## Tips & Best Practices

1. **Set up Accounts first** — Primary + Salary accounts unlock all features
2. **Add Outflow items** before budgeting — they auto-populate budget deductions
3. **Use Quick Update** mid-month to keep balances accurate
4. **Check Portfolio Summary** for a consolidated investment view
5. **Export monthly** for offline backups
6. **Use the carry forward banner** when switching months
7. **Keep Insurance tab updated** separately from Outflow premiums

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.0 | 2026-06-08 | **Major restructure**: Inflow→Investments with sub-sections (Existing/Monthly/Portfolio Summary); new Insurance tab (policy tracking with premium frequency, sum assured, nominees); Budget engine rewrite (account-balance-aware "Total Spendable" formula); separated CC fields (Previous Month CC Bill vs Current Month CC Spending); Quick Update consolidation (added Expenditure Balance field, removed standalone Reconciliation, shows untracked expenses inline); Delete Account feature (Settings→Danger Zone, deletes Firestore data + Firebase Auth); month-end carry forward banner (auto-detects unclosed months); improved UI with summary hints/descriptions on all fields; investment category field (Existing/Monthly) for sub-section filtering. |
| 3.2 | 2026-06-04 | Changed UI pattern from Edit/Save/Cancel to Edit/Done for all tabs except Liability; Liability page keeps Save button for fixed monthly income field; removed Cancel buttons from all tabs except Liability; added theme-based favicon switching (logo_dark/logo_light); fixed auto-calculated badge tooltip. |
| 3.1 | 2026-06-04 | Monthly Budget: removed Insurance and Rent/Maintenance from Cash Outflow; removed SIP/Monthly Investment and Monthly Saving from On-Demand Outflow; renamed "Outflow" → "Cash Outflow"; added hover tooltips for auto-calculated fields showing breakdown; removed insurance from annual summary and pie charts; removed duplicate save button. |
| 3.0 | 2026-06-04 | Liabilities tab renamed; added Frequency field; Insurance Premium → Insurance. Monthly Budget: "Investing" → "On-Demand Outflow"; merged credit card fields; removed untrackedExpense and retirement; added on-demand fields; removed monthEndBalance; added "Balance to Spend" and "Amount Available to Spend"; budget edit supports Cancel with snapshot/restore; on-demand section hidden when empty. Accounts: Only one Saving account allowed; default sort (Primary → Saving → others by balance); purposeOther field for custom purposes. Delete confirmation for all entries. iOS safe-area support. Bug fixes: currentAge restored; budget snapshot month key fix; CC carryover removed. |
| 2.0 | 2026-05-28 | Added Net Worth, Tax Plan, Gifts, Emergency Fund tabs. Removed Misc and One-Time Budget tabs. Added Reset All Data feature with double confirmation. Updated all tabs with Preview/Edit modes and summary calculations. Added graphs and charts for Monthly Fixed Expense, Investments, and Net Worth. |
| 1.0 | 2026-05-28 | Initial release with authentication, 11 tabs, Excel export |

---

*SmartFin – Smart Financial Planning*
*Built with Firebase Firestore for cross-device sync*
