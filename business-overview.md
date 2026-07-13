# Business Overview

## Project Name

Restaurant POS System

---

# Overview

Restaurant POS System is a desktop application designed to manage the daily operations of restaurants. It enables cashiers and restaurant owners to efficiently handle orders, customers, tables, delivery operations, expenses, returns, daily closing, and reporting through a simple and fast workflow.

The system is designed with scalability in mind, allowing future versions to introduce additional modules such as inventory management, kitchen displays, employee permissions, loyalty programs, and online ordering without requiring major architectural changes.

Version 1 focuses on providing a complete point-of-sale experience while keeping the workflow simple and practical for restaurants.

---

# Project Goals

- Speed up order creation.
- Reduce cashier mistakes.
- Organize delivery operations.
- Simplify daily accounting.
- Generate accurate sales reports.
- Support restaurant dine-in workflow.
- Maintain a complete audit history of important operations.

---

# Target Users

- Restaurant Owner
- Cashier

Future Versions

- Manager
- Waiter
- Kitchen Staff
- Accountant

---

# Restaurant Workflow

Customers can place orders using one of three order types:

- Dine In
- Take Away
- Delivery

Regardless of the order type, every sale is represented internally as an **Order**.

The Order Type determines the business workflow without changing the underlying data structure.

---

# Order Types

## Dine In

Customers eat inside the restaurant.

Workflow:

- Select table.
- Create order.
- Add menu items.
- Put order on Hold.
- Resume order later.
- Apply service charge (optional).
- Apply discount.
- Complete payment.
- Print receipts.

---

## Take Away

Customers receive their order immediately and leave.

Workflow:

- Select existing customer or create a new one.
- Create order.
- Complete payment immediately.
- Print receipts.

---

## Delivery

Orders are assigned to delivery riders.

Workflow:

- Select customer.
- Assign delivery rider.
- Create order.
- Print receipts.
- Rider collects payment and returns it at the end of the day.

---

# Core Business Concepts

## Category

Represents a section of the restaurant menu.

Examples:

- Sandwiches
- Pizza
- Grills
- Drinks
- Desserts

---

## Menu Item

Represents a sellable food item.

Version 1 supports:

- Single Price
- Single Size

Each Menu Item contains:

- Name
- Price
- Category
- Availability
- Image (Optional)
- Notes (Optional)

---

## Table

Represents a physical restaurant table.

Business Rules:

- Each table has a unique number.
- One active order per table.
- Orders can be moved between tables.
- Tables have availability status.

---

## Customer

Stores customer information for faster order creation.

Fields:

- Name
- Phone Number
- Address
- Notes (Optional)

Customers are primarily identified using their phone number.

---

## Delivery Rider

Represents the employee responsible for delivery orders.

Stores:

- Name
- Phone Number
- Notes

End-of-day reports will show:

- Number of delivered orders
- Total assigned sales
- Total collected amount

---

# Order Lifecycle

Every order passes through the following stages.

Draft (Hold)

↓

Completed

↓

Returned (Optional)

Business Rules

- Hold orders are considered drafts.
- Hold orders are not included in reports.
- Hold orders generate no revenue.
- Completed orders cannot be edited.
- Returns are created from completed invoices only.

---

# Invoice Numbering

Invoice numbers restart every business day.

Example

20260713-0001

20260713-0002

20260713-0003

The sequence resets at the beginning of each new day.

---

# Payments

Version 1 supports multiple payment methods.

Supported methods:

- Cash
- Visa
- Instapay
- Wallet

Future payment methods can be added without changing the order workflow.

---

# Discounts

Supported:

- Fixed Amount Discount
- Percentage Discount

Discounts are applied before completing the order.

---

# Service Charge

Optional.

Can be enabled or disabled from system settings.

Applied when needed, especially for dine-in orders.

---

# Returns

Returns are processed by searching for an existing invoice.

Version 1 supports:

- Partial Return
- Full Return

Return reason is optional.

---

# Expenses

Restaurant expenses can be recorded during the business day.

Examples:

- Supplies
- Transportation
- Maintenance
- Utilities

Expenses affect end-of-day financial reports.

---

# Daily Closing

At the end of each business day the system generates a closing report including:

- Total Sales
- Dine In Sales
- Take Away Sales
- Delivery Sales
- Number of Orders
- Returns
- Expenses
- Revenue Before Expenses
- Revenue After Expenses
- Delivery Rider Summary

---

# Reports

Version 1 includes:

- Daily Sales Report
- Monthly Sales Report
- Custom Date Range Report
- Expense Report
- Returns Report
- Delivery Rider Report

---

# Printing

The restaurant uses a single receipt printer.

Every completed order prints three copies:

- Kitchen Copy
- Customer Copy
- Cashier Copy

---

# Authentication

Version 1 includes:

- Login
- Logout

Permissions and role management are intentionally postponed to future versions.

---

# Audit Log

The system records important user actions including:

- Login
- Logout
- Order Creation
- Order Completion
- Hold Order Updates
- Hold Order Deletion
- Returns
- Expenses
- Menu Item Changes
- Customer Updates
- System Settings Changes

Each log entry stores:

- User
- Action
- Entity
- Entity ID
- Timestamp
- Additional Details

---

# Version 1 Scope

Included

- Authentication
- Categories
- Menu Items
- Tables
- Customers
- Delivery Riders
- Orders
- Hold Orders
- Discounts
- Service Charge
- Multiple Payment Methods
- Returns
- Expenses
- Daily Closing
- Reports
- Printing
- Audit Log

Not Included

- Inventory Management
- Employee Permissions
- Multiple Branches
- Offers & Promotions
- Loyalty Programs
- Kitchen Display System (KDS)
- Online Ordering
- Multi-size Menu Items
- Combo Meals

---

# Design Principles

The system follows these principles:

- Business-first architecture.
- Single Order model for all order types.
- Simple cashier workflow.
- Extensible architecture for future versions.
- Clear audit trail.
- Reliable daily financial reporting.