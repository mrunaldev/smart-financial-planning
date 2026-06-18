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
17. [Backup & Restore](#backup--restore)
18. [Cross-Device Sync](#cross-device-sync)
19. [Precautions & Common Pitfalls](#precautions--common-pitfalls)
20. [FAQ](#faq)

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
- **Emergency Fund** — Fund adequacy calculator based on fixed obligations + average variable expenses

All data syncs in real-time across devices via Firebase Firestore.

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project configured (see README.md)
- Internet connection

### First-Time Setup

1. Open `index.html` in your browser (or the hosted URL)
2. **Register** with name, date of birth, email, and password
3. Go to **Accounts** tab → Add a **Primary (Expenditure)** account and a **Salary** account
4. This unlocks all other tabs
5. **Before your first budget month**, complete this recommended setup order:

#### Recommended Setup Order (Critical)

| Step | Tab | What to do | Why |
|------|-----|-----------|-----|
| 1 | **Accounts** | Add Primary + Salary accounts (balance = 0 if starting fresh) | Unlocks all tabs |
| 2 | **Accounts** | Add Saving, Investment accounts if applicable | Transfer will credit these |
| 3 | **Outflow** | Add ALL fixed deductions (EMIs, rent, insurance premiums, savings, investments) | These must exist BEFORE Execute Transfer |
| 4 | **Insurance** | Add policy details (separate from outflow premiums) | For tracking coverage |
| 5 | **Investments** | Add existing investments (FDs, stocks, MFs, etc.) | For portfolio tracking |
| 6 | **Budget** | Enter Primary Income → Execute Transfer | Only after steps 1–3 are complete |

> **⚠️ CRITICAL:** Add ALL outflow items **before** clicking Execute Transfer. The transfer uses the outflow items that exist *at the moment you click the button*. If you add outflow items afterward, those deductions will NOT have been taken from salary, causing incorrect variable expenditure calculations.

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
| **Total Outflow** | Recurring monthly obligations only | Sum of Cash Outflow fields only (excludes On-Demand Outflow) |
| **Salary A/c Balance** | Current salary account balance | Auto-set when Primary Income entered |
| **Expenditure Account Balance** | Current spending account balance | From Accounts tab |
| **Total Spendable This Month** | What you can afford to spend | Inflow total − fixed monthly outflow |
| **Variable Expenses** | Spending from expenditure account + CC | variableExpenditure + midMonthCCOutstanding |

### Budget Status Banner

| Status | Condition |
|--------|----------|
| ⚠️ **No accounts** | Missing Primary or Salary account — setup guidance shown |
| *Empty* | No income or outflows entered yet |
| ⚪ **Enter income** | Outflows exist but no income entered |
| 🟢 **Budget Surplus** | Spendable > Variable Expenses |
| 🔴 **Over Budget** | Variable Expenses > Spendable |
| ⚪ **Budget Balanced** | Spendable = Variable Expenses |
| 🟢🔒 **Closed** | Month is closed and read-only |

### Budget Categories

**Cash Inflow:**
- Primary Income (auto-calculated from Salary account)
- Secondary Income
- Borrowing/Money Back
- Interest/Dividend
- Others

**Cash Outflow:**
- Auto-calculated Liabilities (EMIs) — auto-linked from Outflow tab
- Auto-calculated Insurance Premiums — auto-linked from Outflow tab
- Auto-calculated Fixed Saving — auto-linked from Outflow tab
- Auto-calculated Fixed Investment — auto-linked from Outflow tab
- Auto-calculated Fixed Expenditure — auto-linked from Outflow tab
- Auto-calculated Variable Expenditure — auto: totalFunded − current exp balance
- Previous Month CC Bill (Unpaid) — auto from previous closed month's CC spending
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

### Monthly Budget Flow

```
Month Start                          Mid-Month                      Month End
    │                                    │                              │
    ▼                                    ▼                              ▼
┌──────────┐  ┌─────────────────┐  ┌────────────┐  ┌──────────────────┐
│ Enter    │→ │ Execute Transfer │→ │ Quick      │→ │ Close Month      │
│ Primary  │  │ (salary → accs) │  │ Update     │  │ (read-only,      │
│ Income   │  │                 │  │ (exp bal,  │  │  carry forward)  │
│          │  │                 │  │  CC spend) │  │                  │
└──────────┘  └─────────────────┘  └────────────┘  └──────────────────┘
```

1. **Enter Primary Income** (salary credited this month) → salary account balance auto-updated
2. **Review the Transfer Breakdown** — verify all outflow items are listed and amounts look correct
3. **Execute Transfer** → Salary deducted to ₹0, funds routed to Expenditure/Saving/Investment accounts
4. **Mid-month**: Update Expenditure Account Balance & Current Month CC Spending via Quick Update
5. **End of month** (when next salary credited): **Close Current Month Budget** → marks read-only, carries forward balance, navigates to next month

> **Note:** Salary account balance is auto-managed (set when income entered, zeroed on transfer). It cannot be manually updated.

### Transfer Mismatch Warning

If you add or change outflow items **after** executing the transfer, a red **"⚠️ Transfer Mismatch Detected"** banner will appear showing:

- **Transfer Used** — the amount that was actually transferred (based on old outflows)
- **Correct Transfer** — what it should be with current outflows
- **Difference** — the discrepancy

Click **Recalculate Transfer** to fix the budget metadata (`_transferDone`, `_initialBalance`). This corrects the variable expenditure calculation but does **not** change actual account balances. Verify your account balances manually after recalculating.

> This feature is blocked on closed months — you must fix the mismatch before closing.

### Quick Update (Mid-Month)

Update account balances and CC spending without editing the full budget (located in edit mode):

| Field | What it does |
|-------|-------------|
| **Expenditure Account Balance** | Updates the Primary account balance + auto-calculates variable expenditure |
| **Current Month CC Spending** | Stores as `midMonthCCOutstanding` (separate from previous month's CC bill) |

When you update Expenditure Balance, the system calculates variable expenditure:
`Variable Expenditure = totalFunded − current balance`
where `totalFunded = account initial balance + carry forward from last month + salary leftover transferred` (`_initialBalance` captures this post-transfer; fallback before transfer: `_transferDone + prevCarryForward`)

### Close Current Month Budget

Shown after Execute Transfer is done (current or past months only).

Clicking **Close Month** will:
- Mark the month as **read-only** (no more edits)
- Carry forward the remaining expenditure balance to next month
- Set current month's CC spending as next month's "Previous Month CC Bill (Unpaid)"
- Navigate to the next month

**Requires:** Transfer must be executed first. Cannot close an already-closed month.

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

Recurring outflows (Monthly/Quarterly/Semi-Annual/Annual) are auto-debited from Salary and routed by type. **One-Time items are excluded** from auto-debit and budget auto-calculation:

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
- Each item shows: **Current**, **@ 70 yrs** (projected), **@ 70 yrs real** (inflation-adjusted at 6%)
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
- System calculates **Minimum Monthly Need** = Fixed Liabilities/Insurance + Fixed Expenditure + Average Variable Expenses
- Saving and Investment outflows are excluded (can be stopped in an emergency)
- Shows practical scenarios: 3 months (bare minimum), 6 months (recommended), 12 months (ideal)
- Monthly need breakdown shows each component
- Status: EXCELLENT (≥12 mo), READY (6–12), ADEQUATE (3–6), LOW (<3)

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

## Backup & Restore

### Export Backup

- Go to **Settings** (⚙️) → **Export Backup**
- Downloads `smartfin-backup-YYYY-MM-DD.json` containing ALL your data
- Includes: accounts, investments, outflows, insurance, budget data, goals, net worth, tax plan, gifts, emergency fund
- **Recommended**: Export before and after major changes

### Import Backup

- Go to **Settings** (⚙️) → **Import Backup**
- Select a previously exported `.json` file
- **Warning**: This **overwrites ALL current data** with the imported backup
- A confirmation dialog shows the backup date before proceeding
- After import, the app verifies your accounts and re-checks onboarding status

### When to Use

- **Before Delete Account / Reset All Data** — always export first
- **To fix corrupt data** — export, edit the JSON, import the corrected version
- **To migrate between Firebase projects** — export from old, import to new
- **Monthly safety backup** — export at month end for offline records

---

## Cross-Device Sync

- **Real-time** via Firebase Firestore
- **Automatic** — no manual sync needed
- **Same data** on all devices with same account
- **Data location**: `users/{uid}` in Firestore

---

## Precautions & Common Pitfalls

### Before Execute Transfer

| Pitfall | What happens | How to avoid |
|---------|-------------|-------------|
| **Outflow items added AFTER transfer** | Transfer amount is too high; variable expenditure inflated | Add ALL outflow items before clicking Execute Transfer |
| **Wrong salary amount** | All calculations cascade incorrectly | Double-check Primary Income matches actual salary credited |
| **Missing Saving/Investment account** | Transfer can't credit those accounts | Add accounts before first transfer |
| **Account balance not zero** | Pre-existing balance included in totalFunded | Set balance to 0 if starting fresh; or verify the balance is accurate |

### During the Month

| Pitfall | What happens | How to avoid |
|---------|-------------|-------------|
| **Forgetting Quick Update** | Variable expenditure stays at 0 or stale value | Update expenditure balance whenever you check your bank |
| **Editing outflow amounts after transfer** | Mismatch warning appears; budget calculations off | Use Recalculate Transfer button if this happens |
| **Manually changing salary account balance** | Not possible — salary is auto-managed | Use Primary Income field only |

### At Month End

| Pitfall | What happens | How to avoid |
|---------|-------------|-------------|
| **Not closing the month** | Carry forward doesn't happen; next month can't start clean | Always Close Month before entering next month's income |
| **Closing with wrong exp balance** | Wrong carry forward to next month | Update exp balance via Quick Update before closing |
| **Closing without transfer** | Not allowed — transfer is required first | Execute Transfer before Close Month |

### Data Safety

| Pitfall | What happens | How to avoid |
|---------|-------------|-------------|
| **Reset All Data without backup** | All data permanently lost | Always Export Backup before Reset |
| **Delete Account without backup** | Firebase Auth + data permanently deleted | Export Backup first; this is irreversible |
| **Importing old/wrong backup** | Overwrites all current data | Verify backup date in confirmation dialog; export current data first |

---

## FAQ

### General

### Q: How do I delete my account?
**A:** Go to Settings → Danger Zone → Delete Account. Type "DELETE ACCOUNT" to confirm. This permanently deletes your Firestore data and Firebase Auth record.

### Q: Is my data secure?
**A:** Yes. Data is in Firebase Firestore with user-specific authentication. Only you can access your data with your login credentials.

### Q: What currency does the app use?
**A:** Indian Rupee (₹) with Indian number formatting (₹12,34,567).

### Q: Can multiple people use the same app?
**A:** Yes. Each user registers their own account. Data is completely separate per user — stored under `users/{uid}` in Firestore.

### Accounts

### Q: What accounts do I need to set up?
**A:** At minimum: one **Primary (Expenditure)** account and one **Salary** account. Optionally add a **Saving** and **Investment** account if you want the transfer to credit those.

### Q: What balance should I enter when adding accounts?
**A:** Enter the **actual current balance** from your bank. If you're starting fresh and want the app to track from zero, enter 0. The balance you enter becomes the starting point for all calculations.

### Q: Can I have multiple Saving accounts?
**A:** No. The app enforces one Saving, one Primary, and one Salary account. You can have multiple Investment, Loan, and Others accounts.

### Budget & Transfer

### Q: What happens when I click Execute Transfer?
**A:** The app deducts all fixed outflows from your salary, credits the remaining (salary leftover) to your Expenditure account, and also credits Saving/Investment accounts with their respective fixed amounts. Salary account goes to ₹0.

### Q: I added outflow items after Execute Transfer. What do I do?
**A:** A red **"Transfer Mismatch Detected"** banner will appear. Click **Recalculate Transfer** to correct the budget metadata. This fixes the variable expenditure calculation. Verify your actual account balances manually afterward.

### Q: What is Variable Expenditure?
**A:** It's automatically calculated as `totalFunded − current expenditure account balance`. It represents how much money has left your expenditure account since the transfer. Update your expenditure balance via Quick Update to keep this accurate.

### Q: What is totalFunded / _initialBalance?
**A:** The expenditure account balance right after Execute Transfer. Formula: `pre-existing balance + carry forward from last month + salary leftover`. This snapshot is stored and never changes for the rest of the month.

### Q: How is Total Outflow calculated?
**A:** Total Outflow = sum of all Cash Outflow fields only (recurring monthly obligations). It **excludes** On-Demand Outflow items and any one-time investments.

### Q: What's the difference between Outflow and Insurance tabs?
**A:** Outflow tracks **premium payments** (monthly deductions from salary). Insurance tracks **policy details** (coverage, nominees, dates). Policies with active premiums should appear in both.

### Q: What does "Previous Month CC Bill" vs "Current Month CC Spending" mean?
**A:** Previous Month CC Bill is the unpaid credit card balance from last month (auto-carried from previous month's close). Current Month CC Spending is what you've charged this month (updated via Quick Update).

### Q: How is "Total Spendable" calculated?
**A:** `Total Inflow − Fixed Monthly Outflow`. This shows how much of your income remains after all recurring deductions. If negative, your fixed obligations exceed your income.

### Q: What is the Monthly Distribution pie chart?
**A:** It shows your outflow broken into 6 categories: **Investment**, **Liability**, **Savings**, **Expenditure**, **Insurance**, **Others**. It only includes recurring outflow items — one-time and on-demand items are excluded.

### Investments & Outflow

### Q: What's the Portfolio Summary view in Investments?
**A:** It consolidates your investments from three sources: Existing (lump sum), Monthly (SIPs/RDs), and One-Time (from Budget on-demand investments).

### Q: Are One-Time outflow items included in the budget?
**A:** No. One-Time frequency items in Outflow and Investments are **excluded** from monthly auto-calculation. They don't appear in auto-debit routing, pie charts, or Total Outflow. They are tracked for reference only.

### Q: What's the difference between Outflow frequency and amount?
**A:** The amount is what you pay per occurrence. The app converts it to a monthly equivalent: Quarterly ÷ 3, Semi-Annual ÷ 6, Annual ÷ 12. This monthly equivalent is what appears in the budget.

### Net Worth & Emergency Fund

### Q: How does Net Worth projection work?
**A:** Each item shows three values: **Current** (today's value), **@ 70 yrs** (projected using expected growth rate), **@ 70 yrs real** (inflation-adjusted at 6%). The projection chart shows net worth growth over time.

### Q: How is Emergency Fund adequacy calculated?
**A:** Minimum Monthly Need = Fixed Liabilities/Insurance + Fixed Expenditure + Average Variable Expenses. Saving and Investment outflows are excluded (they can be paused in an emergency). Status: EXCELLENT (≥12 months), READY (6–12), ADEQUATE (3–6), LOW (<3).

### Backup & Data

### Q: How do I fix wrong data?
**A:** Export a backup, edit the JSON file to correct values, then import the corrected backup. For transfer mismatch issues, use the Recalculate Transfer button instead.

### Q: Will importing a backup lose any data?
**A:** Import preserves all fields from the backup file. It maps all tab data (cards, inflow, outflow, insurance, etc.), budget data, user settings, and metadata. No fields are dropped during import.

---

## Tips & Best Practices

### Setup (Do Once)

1. **Set up Accounts first** — Primary + Salary accounts unlock all features
2. **Add ALL Outflow items before your first Execute Transfer** — this is the single most important step to avoid data issues
3. **Set account balances accurately** — enter 0 if starting fresh, or your actual bank balance
4. **Add Insurance policies** in both the Insurance tab (details) and Outflow tab (premium payments)

### Monthly Routine

5. **Start of month**: Enter Primary Income → Review Transfer Breakdown → Execute Transfer
6. **Mid-month** (weekly or biweekly): Quick Update → enter current Expenditure Account Balance from your bank app + CC spending
7. **End of month**: Final Quick Update with latest balance → Close Month → move to next month
8. **Export backup monthly** — download JSON backup at month end for safety

### Ongoing

9. **If you add new outflow items after transfer**: Use the Recalculate Transfer button when the mismatch warning appears
10. **Check Portfolio Summary** for a consolidated investment view across all sources
11. **Review Emergency Fund** quarterly — update currentFund amount as your savings grow
12. **Don't manually edit salary balance** — it's auto-managed as a transit account
13. **Keep Insurance tab updated** separately from Outflow premiums
14. **Use On-Demand fields** for irregular expenses (gifts, medical, travel) that aren't monthly

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 5.2 | 2026-06-18 | **Transfer Mismatch Detection**: red warning banner when outflows change after Execute Transfer, with Recalculate Transfer button to fix `_transferDone` and `_initialBalance`. **Outflow snapshot**: `_transferOutflowSnapshot` stored at transfer time for audit trail. **Variable Expenditure breakdown**: popup now shows individual components (Carry Forward, Salary Leftover, Pre-existing Balance) instead of combined total. **Recalculate formula**: correctly handles pre-existing account balance + carry forward without double-counting. |
| 5.1 | 2026-06-18 | **Pie chart fix**: 6 categories (added Insurance); excludes on-demand/one-time items from monthly & annual distribution. **Total Outflow fix**: shows recurring outflow only (excludes On-Demand investing). **One-Time exclusion**: One-Time frequency outflow and inflow items excluded from `buildMonthlyAutoValues` auto-calculation. **Transfer message**: restructured confirm dialog showing salary leftover explicitly. **Net worth display**: each item shows Current, @ 70 yrs, @ 70 yrs real (inflation-adjusted). **Emergency fund fix**: Details text field preserved on edit (pre-fills all fields, not just currentFund). |
| 5.0 | 2026-06-09 | **Auto-debit routing**: fixedSaving/fixedInvestment/fixedExpenditure/insurancePremiums moved to outflow; variableExpenditure auto-calculated; creditCardOutstanding auto from previous closed month; salary is transit-only account (no manual edit); Execute Transfer deducts full salary, credits all accounts; replaced Carry Forward with Close Current Month Budget (read-only months); updated emergency fund calculation (fixed obligations + avg variable, excludes saving/investment); budget status handles no-data/no-accounts/no-income edge cases; transfer section responsive for mobile; monthly need breakdown in emergency fund |
| 4.0 | 2026-06-08 | **Major restructure**: Inflow→Investments with sub-sections (Existing/Monthly/Portfolio Summary); new Insurance tab (policy tracking with premium frequency, sum assured, nominees); Budget engine rewrite (account-balance-aware "Total Spendable" formula); separated CC fields (Previous Month CC Bill vs Current Month CC Spending); Quick Update consolidation (added Expenditure Balance field, removed standalone Reconciliation, shows untracked expenses inline); Delete Account feature (Settings→Danger Zone, deletes Firestore data + Firebase Auth); month-end carry forward banner (auto-detects unclosed months); improved UI with summary hints/descriptions on all fields; investment category field (Existing/Monthly) for sub-section filtering. |
| 3.2 | 2026-06-04 | Changed UI pattern from Edit/Save/Cancel to Edit/Done for all tabs except Liability; Liability page keeps Save button for fixed monthly income field; removed Cancel buttons from all tabs except Liability; added theme-based favicon switching (logo_dark/logo_light); fixed auto-calculated badge tooltip. |
| 3.1 | 2026-06-04 | Monthly Budget: removed Insurance and Rent/Maintenance from Cash Outflow; removed SIP/Monthly Investment and Monthly Saving from On-Demand Outflow; renamed "Outflow" → "Cash Outflow"; added hover tooltips for auto-calculated fields showing breakdown; removed insurance from annual summary and pie charts; removed duplicate save button. |
| 3.0 | 2026-06-04 | Liabilities tab renamed; added Frequency field; Insurance Premium → Insurance. Monthly Budget: "Investing" → "On-Demand Outflow"; merged credit card fields; removed untrackedExpense and retirement; added on-demand fields; removed monthEndBalance; added "Balance to Spend" and "Amount Available to Spend"; budget edit supports Cancel with snapshot/restore; on-demand section hidden when empty. Accounts: Only one Saving account allowed; default sort (Primary → Saving → others by balance); purposeOther field for custom purposes. Delete confirmation for all entries. iOS safe-area support. Bug fixes: currentAge restored; budget snapshot month key fix; CC carryover removed. |
| 2.0 | 2026-05-28 | Added Net Worth, Tax Plan, Gifts, Emergency Fund tabs. Removed Misc and One-Time Budget tabs. Added Reset All Data feature with double confirmation. Updated all tabs with Preview/Edit modes and summary calculations. Added graphs and charts for Monthly Fixed Expense, Investments, and Net Worth. |
| 1.0 | 2026-05-28 | Initial release with authentication, 11 tabs, Excel export |

---

*SmartFin – Smart Financial Planning*
*Built with Firebase Firestore for cross-device sync*
