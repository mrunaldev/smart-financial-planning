# SmartFin – Smart Financial Planning

![Version](https://img.shields.io/badge/version-2.4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Firebase](https://img.shields.io/badge/firebase-enabled-orange.svg)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile-lightgrey.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

A comprehensive dark-themed personal finance app with login/register, cross-device sync via Firebase, and tabbed sections for complete financial management.

## What's New in v2.4.0 - Major Feature Release 🚀

### **New Features**
- **✨ Expense Tracking Tab**: Complete expense tracking system with category-wise breakdown
  - Month-by-month expense tracking with calendar navigation
  - 11 predefined expense categories (Food & Dining, Transportation, Shopping, etc.)
  - Visual pie chart showing category-wise spending distribution
  - Automatic comparison with Budget's Variable Expenditure
  - "Unidentified" category for budget vs actual differences
  - Syncs with Budget tab lifecycle (auto-advances when month is closed)
  - Optional tracking - leave blank for months you don't want to track
  - Edit/Done toggle pattern consistent with other tabs
  - List view showing expenses grouped by category
  - Full CRUD operations (Create, Read, Update, Delete) for expenses

### **Dashboard Improvements**
- **🏠 Clickable Logo**: App logo and name now navigate to Dashboard tab
- **📱 Mobile-Friendly Tooltips**: Financial Health Score tooltips now work on mobile (tap to show/hide)
- **📐 Responsive Design**: All dashboard elements optimized for mobile, tablet, and desktop views
- **🎯 Better Layout**: Moved Alerts & Notifications and Financial Health Score below Insights & Recommendations for improved information hierarchy
- **💚 Optimized Health Score Card**: Better width handling across all screen sizes

### **Technical Improvements**
- Enhanced responsive CSS with proper breakpoints for all devices
- Touch-friendly tooltip system with both hover (desktop) and tap (mobile) support
- Keyboard navigation support for logo click (Enter/Space keys)
- Data structure updates to support expense tracking across months
- Improved mobile experience with larger touch targets and better spacing

## Previous Updates

## What's New in v2.3.21 - Tax Data Load Bug Fix 🔧

- **Fixed**: Tax data now loads correctly from Firestore after page refresh
- **Fixed**: Firestore data loading now includes taxData in appData object
- **Fixed**: Added console logging to verify taxData load/save operations
- **Fixed**: Footer version display background (now transparent)
- **Added**: Search functionality to App Logs panel

### **What Was Broken:**
- Salary and house property details were saved to Firestore successfully
- But when loading data back from Firestore, taxData was missing from appData
- This caused all tax data to be lost on page refresh
- The save was working, but the load was incomplete

### **What's Fixed:**
- Added `taxData: d.taxData || {}` to the Firestore data loading in startListening()
- Tax data now persists correctly across page refreshes
- Console logs now show taxData being loaded: `📥 Loading data from Firestore...`
- Console logs now show taxData being saved: `💼 Saving salary details...`

## Previous Update - v2.3.14 - Tax Data Import/Export Fix 💾

- **Fixed**: Tax data (salary details, house property) now included in import/export
- **Fixed**: Import function now restores taxData from backup files
- **Fixed**: normalizeAppDataModel now ensures taxData is always initialized
- **Verified**: Tax data saves correctly to Firestore (confirmed via scheduleSave)

### **What Was Broken:**
- Export worked (taxData was in appData), but import didn't restore it
- Import function's safeImport object was missing taxData field
- Salary and house property details lost when importing backup
- normalizeAppDataModel didn't check for taxData

### **What's Fixed:**
- Added `taxData: imported.taxData || {}` to safeImport object
- Added taxData initialization in normalizeAppDataModel
- Tax data now persists across imports/exports
- Salary details and house property details now save and restore correctly

### **How It Works:**
- **Export**: Downloads entire appData (includes taxData, tabData, etc.)
- **Import**: Restores all fields including taxData (salary, house property)
- **Firestore**: Saves entire appData with merge: true (includes taxData)

## Previous Update - v2.3.13 - Tax Saving Banner Style Update 🎨

- **Changed**: Tax-saving banner now uses border color instead of background gradient
- **Improved**: Lighter, cleaner look with blue border on light background
- **Better readability**: Dark text on light background instead of white on blue gradient

### **Visual Change:**

**Before (v2.3.12):**
- Blue gradient background (#3b82f6 to #2563eb)
- White text
- Darker, more prominent banner

**After (v2.3.13):**
- Light gray background (var(--surf2))
- Blue border (#3b82f6, 2px)
- Dark text (var(--text))
- Lighter, cleaner appearance

## Previous Update - v2.3.12 - Tax Plan Auto-Save Fix 🔧

- **Fixed**: "saveData is not defined" error when clicking "✓ Done" in Tax Plan
- **Fixed**: Salary and house property details now save correctly using scheduleSave()
- **Fixed**: Auto-save functionality now works as expected

### **What Was Broken:**
- Salary details and house property details were not saving when clicking "✓ Done"
- Error: "saveData is not defined"
- saveData() function didn't exist in the codebase

### **What's Fixed:**
- Changed from `saveData()` to `scheduleSave()` (the correct function used by other tabs)
- Salary details now save automatically when clicking "✓ Done"
- House property details now save automatically when clicking "✓ Done"

## Previous Update - v2.3.10 - Financial Year Date Filtering 📅

- **Fixed**: Auto-calculated tax deductions now respect financial year dates
- **Fixed**: Investments only counted for the selected financial year (April to March)
- **Fixed**: One-time investments filtered by start date
- **Fixed**: Monthly investments pro-rated based on months in financial year
- **Improved**: More accurate tax calculation based on actual investment dates

### **How It Works:**

**Before (v2.3.9):**
- All investments counted regardless of when they were made
- Historical investments from previous years included in current tax year
- Overestimated deductions

**After (v2.3.10):**
- **One-time investments**: Only included if start date falls in selected FY (April 1 to March 31)
- **Monthly investments**: Pro-rated based on months within the selected FY
  - If no start date: Assumes full 12 months
  - If start date in FY: Counts months from start to March 31
- **Quarterly/Semi-Annual/Annual**: Full amount (assumes regular payments)
- **Insurance payments**: Full annual amount (can be refined with date tracking)

### **Example:**

**Scenario:**
- Selected FY: 2024-25 (April 1, 2024 to March 31, 2025)
- PPF investment: ₹50,000 on January 15, 2025 → **Included** ✓
- PPF investment: ₹50,000 on March 2024 → **Excluded** ✗
- Monthly SIP: ₹10,000 started November 2024 → ₹50,000 (5 months) ✓

## Previous Update - v2.3.9 - Tax Plan Complete appData.taxData Fix 🔧

- **Fixed**: "Cannot read properties of undefined (reading 'houseProperty')" error in renderTaxBreakdown
- **Fixed**: All remaining `appData.taxData` accesses now have proper null checks
- **Fixed**: `renderTaxBreakdown()` now safely checks if `appData.taxData` exists
- **Fixed**: `renderTaxSavingBanner()` now safely checks if `appData.taxData` exists
- **Fixed**: `populateSalaryDetailsForm()` now safely checks if `appData.taxData` exists
- **Fixed**: `populateHousePropertyForm()` now safely checks if `appData.taxData` exists

### **Additional Locations Fixed (v2.3.9):**
- ✅ `renderTaxBreakdown()` - Line 4866
- ✅ `renderTaxSavingBanner()` - Line 4953
- ✅ `populateSalaryDetailsForm()` - Line 4994
- ✅ `populateHousePropertyForm()` - Line 5098

### **Total Locations Fixed (v2.3.8 + v2.3.9):**
- ✅ `renderSalaryDetails()`
- ✅ `renderHousePropertyDetails()`
- ✅ `getEffectiveDeductions()` (2 locations)
- ✅ `calculateTaxSummary()`
- ✅ `renderTaxBreakdown()`
- ✅ `renderTaxSavingBanner()`
- ✅ `populateSalaryDetailsForm()`
- ✅ `populateHousePropertyForm()`

**All 8 locations now safely handle undefined `appData.taxData`**

## Previous Update - v2.3.8 - Tax Plan appData.taxData Fix 🔧

- **Fixed**: "Cannot read properties of undefined (reading 'salary')" error
- **Fixed**: All `appData.taxData` accesses now have proper null checks
- **Fixed**: `renderSalaryDetails()` now safely checks if `appData.taxData` exists
- **Fixed**: `renderHousePropertyDetails()` now safely checks if `appData.taxData` exists
- **Fixed**: `getEffectiveDeductions()` now safely checks if `appData.taxData` exists
- **Fixed**: `calculateTaxSummary()` now safely checks if `appData.taxData` exists

### **What Was Broken:**
```
TypeError: Cannot read properties of undefined (reading 'salary')
at renderSalaryDetails (line 5066:36)
```

When `appData.taxData` was undefined (for users who haven't added salary/house property details yet), the app crashed trying to access `.salary` or `.houseProperty` on undefined.

### **What's Fixed:**
```javascript
// Before (v2.3.6):
const salary = appData.taxData.salary || {}; // CRASH if appData.taxData is undefined!

// After (v2.3.8):
const salary = (appData.taxData || {}).salary || {}; // SAFE!
```

All 4 locations fixed:
- ✅ `renderSalaryDetails()`
- ✅ `renderHousePropertyDetails()`
- ✅ `getEffectiveDeductions()` (2 locations)
- ✅ `calculateTaxSummary()`

## Previous Update - v2.3.6 - Tax Plan Rendering Fix 🔧

- **Fixed**: Tax plan rendering error - "An error rendering taxplan"
- **Fixed**: `getAllTaxDeductions()` now correctly gets manual tax plan entries
- **Fixed**: `renderTaxPlan()` now correctly gets tax plan entries instead of active tab entries
- **Fixed**: Function signatures updated - removed unused `entries` parameter
- **Fixed**: `calculateTaxSummary()` now has safety checks for all DOM elements
- **Improved**: Better error handling and null checks throughout tax plan rendering

### **What Was Broken:**
- Tax plan page showed "An error rendering taxplan"
- `getAllTaxDeductions()` was calling `activeEntries()` which returned wrong tab data
- `renderTaxPlan()` was using `activeEntries()` instead of tax plan specific entries
- Functions expected `entries` parameter but didn't use it correctly
- `calculateTaxSummary()` tried to access DOM elements without null checks

### **What's Fixed:**
- ✅ Tax plan page renders without errors
- ✅ Auto-deductions display correctly (all 20+ items from Inflow/Outflow)
- ✅ Manual tax-saving items display correctly
- ✅ Tax breakdown shows complete calculation
- ✅ Regime recommendation banner shows
- ✅ Tax-saving banner shows ₹5.85L+ scope
- ✅ Edit mode works (form fields and table)
- ✅ Done button works (saves and switches to preview)

## Previous Update - v2.3.5 - Tax Plan Done Button Fix 🔧

- **Fixed**: "An unexpected error occurred" when clicking "✓ Done" button in Tax Plan edit mode
- **Fixed**: toggleTaxPlanEdit element now properly initialized
- **Fixed**: taxPlanUI element now properly initialized
- **Added**: Comprehensive error handling in toggle event listener
- **Added**: Error handling in saveSalaryDetailsAuto() and saveHousePropertyDetailsAuto()
- **Improved**: Better error messages with console logging

### **What Was Broken:**
- Clicking "✓ Done" button crashed with "An unexpected error occurred"
- toggleTaxPlanEdit was declared as `const` before DOM loaded
- No error handling in toggle event listener
- No error handling in auto-save functions

### **What's Fixed:**
- ✅ "✓ Done" button works without errors
- ✅ Switches from Edit to Preview mode smoothly
- ✅ Auto-saves salary and house property details
- ✅ All elements properly initialized
- ✅ Comprehensive error handling with helpful messages

## Previous Update - v2.3.4 - Tax Plan Critical Fix 🚨

- **Fixed**: "An unexpected error occurred" when clicking Tax Plan tab
- **Fixed**: Auto-calculated tax deductions now display correctly
- **Fixed**: Tax breakdown now shows properly
- **Fixed**: Regime recommendation banner restored
- **Fixed**: All tax plan elements now initialize correctly after authentication

### **What Was Broken:**
- Tax plan page crashed with error when switching to the tab
- Auto-pulled deductions (from Inflow/Outflow) were not displaying
- Tax breakdown section was missing
- Regime comparison banner was gone
- Element initialization timing issues

### **What's Fixed:**
- ✅ Tax plan page loads without errors
- ✅ All 20+ auto-pulled deductions display correctly
- ✅ Tax breakdown shows complete calculation
- ✅ Regime recommendation banner shows savings
- ✅ Form fields render properly
- ✅ Table shows manual entries
- ✅ Everything saves on "✓ Done"

## Previous Update - v2.3.3 - Tax Plan Form Fix 🔧

- **Fixed**: Tax-saving items form fields now display correctly in Edit mode
- **Fixed**: Tax-saving items table now shows all manual entries
- **Fixed**: Element initialization timing issue resolved
- **Improved**: Added safety checks for tax plan elements

### **What Was Fixed:**
- Form fields (Tax Saving Item, Amount, Section, Details) now render properly
- Table with existing tax-saving items now displays correctly
- "Actions" column header now shows in table
- Element references initialized after authentication

## Previous Update - v2.3.2 - Tax Plan UX Improvement 🎯

- **Auto-Save on Done**: Salary and house property details now save automatically when clicking "✓ Done"
- **Removed Extra Buttons**: No more "Save Salary Details" or "Save House Property" buttons
- **Consistent UX**: Tax Plan now works like all other tabs - edit, then click Done to save
- **Cleaner Interface**: Less clutter, same functionality

## Previous Update - v2.3.1 - Dashboard Card Merge & Icons 🎨

- **Merged Cards**: Combined "Preparedness" and "Budget vs Actual" into single "Preparedness & Budget" card
- **Compact Layout**: Insurance progress bars and budget stats now in one unified card
- **All Cards with Icons**: Every dashboard card now has a descriptive emoji icon
- **Cleaner Dashboard**: Reduced card count while maintaining all information

### **Card Icons Added:**
- 📅 This Month
- 🏦 Accounts & Net Worth
- 🎯 Goals & Investment Planning
- 🛡️ Preparedness & Budget
- 💚 Financial Health Score
- 💡 Insights & Recommendations
- 📊 6-Month Trend
- ⚡ Quick Actions

## Previous Update - v2.3.0 - Comprehensive Tax Planning for ITR-2 🎯

### **Major Tax Calculation Overhaul:**

- **Salary Details Section**: Add basic salary, HRA received, rent paid, and metro/non-metro city
- **HRA Exemption Calculation**: Automatic calculation per Section 10(13A) rules
- **House Property Income**: Track rental income, municipal taxes, and home loan interest
- **Section 24(b) Deduction**: Home loan interest deduction (₹2L limit for self-occupied)
- **Section 80TTA**: Savings account interest deduction (₹10K limit)
- **Enhanced Tax Sections**: Added 24(b), 80TTA, and HRA to tax planning
- **Comprehensive Tax-Saving Banner**: 
  - **Old Regime**: Shows ₹5,85,000+ investment scope with detailed breakdown
  - **New Regime**: Shows ₹90,000+ deduction scope
  - Real-time utilization tracking
  - Potential tax savings calculation

### **Improved Tax Calculation:**
- Gross total income now includes house property income
- HRA exemption automatically calculated and applied
- House property loss set-off (max ₹2L)
- Standard deduction updated (₹75K for new regime, ₹50K for old)
- Detailed tax breakdown with all deductions listed

### **Dashboard Cleanup:**
- Removed redundant "Cash Flow Summary" card
- All information available in "This Month" card and Financial Health Score

## Previous Updates

### v2.2.1 - Financial Health Score Tooltips ℹ️

- **Detailed Tooltips**: Hover over each Financial Health Score component to see calculation details
- **Transparent Scoring**: Understand exactly how each score is calculated
- **Current vs Ideal**: See your current values compared to ideal benchmarks
- **Scoring Thresholds**: Know what it takes to improve each component

### v2.2.0 - Expense Tracking Tab 💰

- **New Expense Tracking Tab**: Track all variable expenses in detail with 50+ categories
- **Category-wise Tracking**: Groceries, Medical, Travel, Dining, Shopping, Home, Entertainment, and more
- **Auto-Validation**: Compare tracked expenses with Auto-calculated Variable Expenditure from Budget tab
- **Visual Insights**: See category breakdown and spending patterns
- **Match Percentage**: Know if your tracked expenses match the budget calculations

## Previous Update - v2.1.7 - Dashboard Layout Adjustment 📐

## Previous Update - v2.1.6 - Financial Health Score Accuracy Fixes 🎯

- **Fixed Savings Rate**: Now calculates actual savings made (not just available)
- **Variable Expenditure Display**: Shows auto-calculated variable expenditure from budget
- **More Accurate Scores**: All Financial Health components now use correct data sources

## Previous Update - v2.1.5 - Dashboard Metric Update 📊

## Previous Update - v2.1.4 - Fixed Debt Management Calculation 🔧

- **Critical Bug Fix**: Monthly commitments now correctly exclude Savings and Investments
- **More Accurate Scores**: Debt Management score now reflects only mandatory obligations
- **Better Financial Health**: Your score will likely improve significantly if you have savings/investments

## Previous Update - v2.1.3 - Enhanced Mobile Compatibility 📱

- **Touch/Swipe Support**: Swipe left/right to navigate alerts on mobile
- **Keyboard Navigation**: Use arrow keys on desktop for accessibility
- **Mouse Drag**: Drag to navigate on desktop browsers
- **Universal Compatibility**: Works perfectly on web and mobile devices
- **Documented Standards**: Comprehensive mobile/web compatibility guidelines in APP_SPEC.md

## Previous Update - v2.1.2 - Carousel Alerts 🎠

- **Carousel Alerts**: One alert at a time with left/right arrow navigation
- **Circular Rotation**: Loops back to first alert after last (infinite scroll)
- **Dot Indicators**: Click dots to jump to any alert instantly
- **Smooth Animations**: Beautiful slide transitions between alerts

## v2.1.0 - Major Dashboard Enhancement 🎉

### P1 Features (High Priority)
- **⚡ Alerts & Notifications**: Real-time alerts for over-budget categories, low emergency fund, goals behind schedule, insurance gaps, and high credit card usage
- **⚡ Quick Actions Panel**: One-click access to Budget, Investments, Expenses, Goals, Net Worth, and Tax Planning
- **💚 Financial Health Score**: Comprehensive 0-100 score based on emergency fund (25%), debt management (20%), savings rate (20%), insurance coverage (15%), goal progress (10%), and investment activity (10%)
- **💸 Cash Flow Summary**: Clear view of income vs expenses with net cash flow and savings rate percentage
- **📈 Budget vs Actual**: Track budget adherence with surplus/deficit display and spending comparison

### P2 Features (Medium Priority)
- **💡 Insights & Recommendations**: AI-like suggestions for improving financial health, optimizing spending, and achieving goals faster

### Technical Excellence
- All features use existing data and calculations - no duplicates
- Ensures complete data consistency across the dashboard
- Fully responsive design (mobile, tablet, desktop)
- Performance optimized with no additional API calls

## Previous Updates (v2.0.11)

- **Location Enhancement**: Added "Other" option to location dropdown for custom cities (assumed non-metro for insurance calculations)
- **Dashboard Layout**: Improved card distribution across all screen sizes with responsive grid system
- **Development Process**: Added comprehensive development process documentation in APP_SPEC.md

## Previous Updates (v2.0.10)

- **Dashboard Enhancements**: 
  - Mobile-responsive bar chart (numbers hidden on mobile for better readability)
  - Credit card usage and expenditure account balance in "This Month" section
  - Combined Accounts & Net Worth into single card
  - Combined Goals & Investment Planning into single card
  - Navigation links to Budget, Fixed Outflow, Net Worth, and Goals tabs
- **Tax Planning**: Comprehensive tax saving banner showing investment scope for Old Tax Regime (ITR-2 focused)
- **UI Improvements**: Removed "Purpose:" label from Accounts tab, actual user location in insurance text
- **Gifts Tracking**: Date display for on-demand gifts, month display for recurring gifts
- **Project Files**: Added LICENSE (Personal Use Only), .codeowners, and comprehensive tax calculation test suite

## Features

### Tabs & Functionality

1. **Budget** – Monthly income & expense tracking with category-based fields
   - **Cash Inflow**: Primary Income, Secondary Income, Borrowing/Money Back, Interest/Dividend, Others
   - **Cash Outflow**: Auto-calculated Liabilities, Insurance Premiums, Fixed Saving, Fixed Investment, Fixed Expenditure, Variable Expenditure (auto), Previous Month CC Bill, Current Month CC Spending, Debt Repayment/Lending, Utility Bills, Family Expenditure, Miscellaneous Expenses
   - **On-Demand Outflow**: On-Demand Saving, On-Demand Investment, On-Demand Expenditure, On-Demand Liability
   - Auto-calculated fields with **clickable breakdown popups** showing source items (both edit & preview modes)
   - **Monthly Transfer Breakdown**: Primary Income − Auto-deducted Fixed Outflow = Salary Leftover → Expenditure A/c
   - **Execute Transfer** button: deducts full salary to ₹0, credits Expenditure/Saving/Investment accounts; one-time per month
   - **Close Current Month Budget**: marks month read-only, carries forward balance, navigates to next month
   - **Mid-Month Quick Update**: update Expenditure Account balance and CC outstanding from budget edit mode (salary is auto-managed, not editable)
   - Summary: Total Inflow, Total Outflow (recurring monthly obligations only), Salary Balance, Expenditure Balance, Total Spendable, Variable Expenses
   - Budget status banner: **Surplus** / **Over Budget** / **Balanced** + edge cases (no accounts, no income, closed month)
   - Budget status preserved when month is closed (shows surplus/deficit along with lock indicator)
   - Month navigation: cannot go before onboarding month; next month viewable if current month is closed
   - Financial-year annual view with Apr–Mar calculations (averages based on months with data)
   - Annual monthly breakdown shows under/over budget status per month with lock icon for closed months
   - Pie chart: 6 categories (Investment, Liability, Savings, Expenditure, Insurance, Others) — recurring instruments only, excludes on-demand/one-time items
   - Edit mode with snapshot/restore on Cancel

2. **Goals** – Set and track financial goals
   - Target amount, current amount, target date
   - Automatic status: Planned, Ongoing, Achieved, or Missed
   - Progress tracking with status-based colors
   - Preview/Edit mode with summary

3. **Inflow** – Track income sources & investments (replaces old Investments tab)
   - Name, Type (FD/RD/MF/Stocks/PPF/NPS/Gold/Real Estate/Other), Frequency, Amount, Current Value, Interest Rate (decimal supported, e.g., 7.5%), Start/End Date, Details
   - Current value calculation based on start date, amount, and annual interest rate
   - Bar chart visualization; grouped preview cards
   - Auto-populates budget investing fields for Monthly frequency items

4. **Outflow** – Track recurring liabilities & insurance (replaces old Liabilities + Insurances tabs)
   - Name, Type (Liability/Insurance/Expenditure/Saving/Investment), Bank, Frequency, Amount, End Date, Details
   - Items grouped by type in preview with subtotals per group
   - Recurring items (Monthly/Quarterly/Semi-Annual/Annual) auto-populate budget outflow; **One-Time items excluded** from auto-calc
   - Recurring items auto-debited from salary account at month start
   - Summary: Fixed Monthly Income, Monthly Deductions, Remaining, Total Items
   - Bar charts: Amount by Bank, Amount by Type

5. **Accounts** – Manage bank accounts
   - Bank/NBFC Name, Primary Account, Balance, Debit/Credit Card, Credit Limit, Purpose (Salary/Expenditure/Saving/Investment/Loan/Others)
   - Summary cards: No of Accounts, No of Debit Cards, Total Balance, No of Credit Cards, Total Credit Limit
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
   - Each item shows: Current, @ 70 yrs (projected), @ 70 yrs real (inflation-adjusted at 6%)
   - Net worth projection graph (till age 70), inflation-adjusted (6%)

7. **Tax Plan** – Tax liability under new/old regimes
   - Auto-pulled deductions from recurring investments (Monthly/Annual SIPs, not one-time holdings)
   - Insurance premiums from Outflow tab
   - Manual tax saving items (80C, 80D, 80CCD, etc.)
   - New Tax Regime (FY 2024-25) and Old Tax Regime calculations
   - Dashboard shows total tax items logged

8. **Gifts** – Track gifts and charitable giving
   - Category: Fixed Every Year / On Demand
   - Optional date field (defaults to current date)
   - Summary: Total Gifts count, Fixed Every Year count & amount, Spent This Year, Overall Total
   - Monthly spending chart for current financial year (April-March)

9. **Emergency Fund** – Calculate emergency fund requirements
   - Minimum Monthly Need = Fixed Liabilities/Insurance + Fixed Expenditure + Avg Variable Expenses
   - Excludes Saving & Investment (stoppable in emergency)
   - Practical scenarios: 3-month (bare min), 6-month (recommended), 12-month (ideal)
   - Monthly need breakdown with component details
   - Status: EXCELLENT (≥12), READY (6–12), ADEQUATE (3–6), LOW (<3)
   - Click **Done** to save changes (removed separate Update button)

### Dashboard Features (v6.1)

- **This Month**: Income, commitments, available funds, and budget surplus/deficit status
- **Net Worth**: Assets, liabilities, and net worth with auto-sync from Net Worth tab
- **Goals**: Combined progress bar showing all active goals together
- **Preparedness**: Progress bars for Emergency Fund, Health Insurance, and Term Insurance with ideal calculations
  - Emergency Fund: 6 months of expenses (fixed + variable)
  - Health Insurance: Based on 50% annual income, age adjustment, and location (metro/non-metro)
  - Term Insurance: Based on 10-15x annual income minus savings (age-dependent multiplier)
- **Accounts**: Total balance and mandatory account setup status
- **Investments & Planning**: Portfolio value, monthly investment, and tax items logged
- **6-Month Trend**: Bar chart showing Investment, Liability, Saving, Expenditure, and Others
- **PDF Export**: Download dashboard summary as HTML (print to PDF from browser)

### Additional Features

- **Add/Edit/Delete** – Edit and Delete buttons side-by-side on desktop, stacked on mobile. Delete requires confirmation for all entries.
- **Preview/Edit Toggle** – Switch between view and edit modes. Budget edit supports Cancel with snapshot/restore.
- **Data Migration** – Automatic one-time migration from old tab structure (investments/liabilities/insurances → inflow/outflow)
- **Onboarding** – New users start on Accounts tab with location selection; existing users go to Budget
- **Excel Export** – Export tab data as `.xlsx`
- **Data Reset** – Double confirmation (confirm + type "DELETE")
- **Cross-Device Sync** – Firebase Firestore real-time sync
- **Responsive Design** – Desktop & mobile with iOS safe-area support, compact dashboard cards

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
| **On-Demand Investment** (auto part) | Inflow tab | Sum of recurring Inflow items (Monthly/Quarterly/Semi-Annual/Annual in matching months). One-Time excluded. |

#### Summary Grid

| Field | Formula |
|---|---|
| **Total Inflow** | Same as Cash Inflow Total |
| **Total Outflow** | Cash Outflow Total only (recurring monthly obligations; excludes On-Demand Outflow) |
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
| **Salary Leftover → Expenditure A/c** | `Primary Income − Total Fixed Monthly Outflow` (green if ≥ 0; red = shortfall) |

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
| **Expenditure** | Sum of: Fixed Expenditure + Variable Expenditure + Utility Bills + Family Expenditure + Misc Expenses + CC Outstanding + CC Spending (per month) |
| **Saving** | Sum of Fixed Saving per month |
| **Investment** | Sum of Fixed Investment per month |
| **Liability** | Sum of Loan EMI + Debt Repayment per month |
| **Insurance** | Sum of Insurance Premiums per month |
| **Other** | `Cash Outflow Total − (Liability + Insurance + Expenditure + Saving + Investment)` per month (catches any unclassified items) |
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
| **Monthly** | Distribution of 6 categories: Investment, Liability, Savings, Expenditure, Insurance, Others — recurring outflow only, excludes on-demand/one-time (from `getMonthlyDistribution`) |
| **Annual** | Same 6 categories summed across 12 FY months |

## Libraries Used

- Firebase (Auth, Firestore) – Authentication and data sync
- Chart.js – Pie charts, bar charts, line charts
- SheetJS (XLSX) – Excel export
