# SmartFin – Smart Financial Planning

A comprehensive dark-themed personal finance app with login/register, cross-device sync via Firebase, and tabbed sections for complete financial management.

## Features

### Tabs & Functionality

1. **Monthly Budget** - Track income and expenses with category-based fields
   - Inflow categories: Primary Income, Secondary Income, Borrowing, Interest, Other
   - Outflow categories include loan EMI, insurance, untracked actual expense, credit card due/outstanding, utilities, family expenditure, and miscellaneous expenses
   - Investment and liability fields can auto-populate from the Investments and Liabilities tabs for current/future months
   - Month-to-month navigation
   - Financial-year annual view with Apr-Mar calculations and matching monthly chart colors
   - Budget status indicator turns negative when unpaid credit card outstanding pushes the month over budget
   - Pie chart visualization for Investment, Liability, Saving, Expenditure, Insurance, and Other

2. **Financial Goal** - Set and track financial goals
   - Target amount, current amount, target date
   - Automatic status selection: Planned, Ongoing, Achieved, or Missed
   - Progress tracking with status-based colors
   - Preview/Edit mode
   - Summary calculations

3. **Monthly Fixed Expense** - Track recurring monthly expenses
   - Type, amount, bank name, end date, time remaining
   - Summary by type (Insurance, Liability, Saving, Expenditure)
   - Bar graphs: Amount by Bank, Amount by Type
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
   - Bank/NBFC name, account present, balance, debit card, credit card, credit limit, purpose of use, address/KYC updated, nominee added
   - Primary accounts automatically use `Expenditure` as purpose and disable manual purpose edits
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

- **Add/Edit/Delete** - List rows include Edit and Delete actions. Edit populates the existing item into the form and the submit button becomes Save.
- **Preview/Edit Toggle** - Switch between view and edit modes for custom tabs
- **Excel Export** - Export tab data to Excel format
- **Data Reset** - Clear all local data with confirmation
- **Cross-Device Sync** - Firebase Firestore synchronization
- **Responsive Design** - Works on desktop and mobile

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
- Permanently deletes all budget entries, monthly budget data, goals, investments, insurances, cards, net worth data, tax plan, gifts, and emergency fund data
- **This action cannot be undone**

## Libraries Used

- Firebase (Auth, Firestore) - Authentication and data sync
- Chart.js - Data visualization (pie charts, bar charts, line charts)
- SheetJS (XLSX) - Excel export functionality
