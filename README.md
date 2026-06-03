# SmartFin – Smart Financial Planning

A comprehensive dark-themed personal finance app with login/register, cross-device sync via Firebase, and tabbed sections for complete financial management.

## Features

### Tabs & Functionality

1. **Monthly Budget** - Track income and expenses with category-based fields
   - Inflow categories: Primary Income, Secondary Income, Borrowing, Interest, Other
   - Cash Outflow categories: Auto-calculated Liabilities (from Liabilities tab), Credit Card Outstanding, Debt Repayment, Utility Bills, Family Expenditure, Miscellaneous Expenses
   - On-Demand Outflow categories: On-Demand Saving, On-Demand Investment, On-Demand Expenditure, On-Demand Liability
   - Auto-calculated Liabilities field auto-populates from Liabilities tab (Monthly frequency, type="Liability") with hover tooltip showing breakdown
   - Month-to-month navigation with snapshot/restore on Cancel
   - Financial-year annual view with Apr-Mar calculations
   - Budget status indicator based on net cash flow across all incomes and outflows
   - "Balance to Spend This Month" and "Amount Available to Spend" calculated from primary account balance
   - Pie chart visualization (hidden during edit mode)

2. **Financial Goal** - Set and track financial goals
   - Target amount, current amount, target date
   - Automatic status selection: Planned, Ongoing, Achieved, or Missed
   - Progress tracking with status-based colors
   - Preview/Edit mode
   - Summary calculations

3. **Liabilities** - Track recurring monthly expenses
   - Expense Name, Amount, Deduction Type (Insurance, Liability, Saving, Expenditure, Investment), Frequency (Monthly/Quarterly/Semi-Annual/Annual/One-Time), Bank Name, End Date
   - Only Monthly frequency items auto-populate the monthly budget
   - Summary by type with bar graphs (Amount by Bank, Amount by Type)
   - Frequency displayed in expense preview cards
   - Preview/Edit mode

4. **Investments** - Manage investment portfolio
   - Type, initial investment, total accumulated amount, annual interest rate, frequency, start date, maturity date, details
   - Current value/net worth calculation based on start date, amount, and annual interest rate
   - Blank total amount now falls back to initial investment instead of reducing the value to zero
   - Bar graph visualization
   - Preview/Edit mode

5. **Insurances** - Track insurance policies
   - Policy type, premium frequency, company name, start date, maturity date, sum assured, nominee name, NIR linked status
   - Maturity progress bar from start date to maturity date
   - Labeled premium and sum assured values in policy cards
   - Preview/Edit mode
   - Summary calculations

6. **Accounts** - Manage bank accounts and cards
   - Bank/NBFC Name, Primary Account, Account Present, Balance, Debit Card Present, Credit Card Present, Credit Card Limit, Purpose of Use (Income, Expenditure, Saving, Investment, Loan, Others), Custom Purpose (for Others), Address/KYC Updated, Nominee Added
   - Primary account is always Expenditure type (enforced)
   - Only one Saving account allowed
   - Default sort order: Primary → Saving → others by balance descending
   - Account cards show labeled balance and credit limit values
   - Summary: Total Banks, Total Balance, Total Credit Limit, Accounts with Credit Cards
   - Preview/Edit mode

7. **Net Worth** - Calculate and project net worth
   - Assets and liabilities with growth rates
   - Current age input for projections
   - Net worth projection graph (till age 70)
   - Inflation-adjusted growth (6%)
   - Preview/Edit mode

8. **Tax Plan** - Calculate tax liability under new/old regimes
   - Tax saving items with sections (80C, 80D, 80CCD, 80E, 80EEA, 80G)
   - Automatic income integration from Monthly Budget
   - New Tax Regime (FY 2024-25) and Old Tax Regime support
   - Tax breakdown with cess calculation
   - Year-to-date tax liability
   - Preview/Edit mode

9. **Gifts** - Track gifts and charitable giving
   - Gift name, category (Fixed Every Year / On Demand), relative name, occasion, amount, details
   - Summary: Total Gifts, Total Amount, Fixed Every Year count
   - Preview/Edit mode

10. **Emergency Fund** - Calculate emergency fund requirements
    - Automatic average monthly expense calculation from budget data
    - 6-month and 12-month targets
    - Current fund input
    - Status indicator: Green (12+ months), Yellow (6-12 months), Red (<6 months)
    - Amount needed to reach target
    - Edit mode

### Additional Features

- **Add/Edit/Delete** - List rows include Edit and Delete actions. Delete requires confirmation for all entries. Edit populates the existing item into the form and the submit button becomes Save.
- **Preview/Edit Toggle** - Switch between view and edit modes for custom tabs. Budget edit supports Cancel to restore previous state.
- **Excel Export** - Export tab data to Excel format
- **Data Reset** - Clear all local data with double confirmation (confirm dialog + type "DELETE")
- **Cross-Device Sync** - Firebase Firestore synchronization
- **Responsive Design** - Works on desktop and mobile with iOS safe-area support for fullscreen PWA mode

## Structure

- `index.html` — Auth + app markup, ₹ logo SVG
- `assets/css/styles.css` — Responsive dark UI
- `assets/js/firebase-config.js` — **Your Firebase config goes here**
- `assets/js/app.js` — Firebase Auth + Firestore sync, tabs, entries

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
- Permanently deletes all budget entries, monthly budget data, goals, investments, insurances, cards, net worth data, tax plan, gifts, emergency fund data, fixed monthly income, date of birth, and current age
- **This action cannot be undone**

## Libraries Used

- Firebase (Auth, Firestore) - Authentication and data sync
- Chart.js - Data visualization (pie charts, bar charts, line charts)
- SheetJS (XLSX) - Excel export functionality

## Recent Changes

- Liabilities tab renamed from "Monthly Fixed Expenses"; added Frequency field; Insurance Premium → Insurance. Monthly Budget: "Investing" → "On-Demand Outflow"; merged credit card fields; removed untrackedExpense and retirement; added on-demand fields; removed monthEndBalance; added "Balance to Spend" and "Amount Available to Spend"; budget edit supports Cancel with snapshot/restore; on-demand section hidden when empty; removed Insurance and Rent/Maintenance from Cash Outflow; removed SIP/Monthly Investment and Monthly Saving from On-Demand Outflow; renamed "Outflow" → "Cash Outflow"; added hover tooltips for auto-calculated fields showing breakdown; removed insurance from annual summary and pie charts; removed duplicate save button; changed UI pattern from Edit/Save/Cancel to Edit/Done for all tabs except Liability (which keeps Save button for fixed monthly income); removed Cancel buttons from all tabs except Liability; added theme-based favicon switching (logo_dark/logo_light).
- Accounts: Only one Saving account allowed; default sort (Primary → Saving → others by balance); purposeOther field for custom purposes.
- Delete confirmation for all entries. iOS safe-area support.
- Bug fixes: currentAge restored; budget snapshot month key fix; CC carryover removed; removed insurance from annual summary and pie charts
