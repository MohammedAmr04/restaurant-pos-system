# Reports Specification

Version: 1.0

Status: Approved

---

# Daily Sales Report

Displays:

Business Date

Total Orders

Completed Orders

Total Sales

Discounts

Service Charge

Returns

Expenses

Revenue Before Expenses

Revenue After Expenses

---

# Monthly Sales Report

Displays:

Daily Sales Summary

Monthly Total

Monthly Expenses

Monthly Returns

Net Revenue

---

# Custom Date Range Report

Displays:

Start Date

End Date

Total Orders

Sales

Returns

Expenses

Net Revenue

---

# Delivery Report

Displays:

Delivery Rider

Number of Orders

Total Sales

---

# Expense Report

Displays:

Expense Title

Amount

Created By

Date

Notes

Total Expenses

---

# Returns Report

Displays:

Invoice Number

Return Date

Returned Items

Refund Amount

Cashier

---

# Filters

Reports support filtering by:

Date

Order Type

Cashier

Delivery Rider

Payment Method

---

# Export

Future Versions

PDF

Excel

CSV

---

# Business Rules

Only completed orders are included.

Hold orders are excluded.

Deleted Hold orders are excluded.

Returns and Expenses are reported separately.
# Daily Closing

## Description

Represents the end-of-day closing process.

## Responsibilities

- Calculate total revenue.
- Count cash.
- Calculate expected cash.
- Record closing time.

## Process

1. User selects "Close Day".
2. System displays summary:
   - Total Sales
   - Total Expenses
   - Cash Collected
   - Expected Cash (Sales - Expenses)
3. User counts physical cash.
4. User compares with Expected Cash.
5. System saves the closing record.

## Relationships

One User

↓

Many Closing Records

One Closing Record

↓

Daily Sales Report

One Closing Record

↓

Expense Report