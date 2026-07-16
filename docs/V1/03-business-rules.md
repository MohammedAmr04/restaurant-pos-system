# Business Rules

Version: 1.0

---

# BR-001 Authentication Required

All system operations require an authenticated user.

Anonymous access is not allowed.

---

# BR-002 Order Is The Core Entity

All restaurant sales are represented internally as Orders.

Order Type determines the business workflow without changing the underlying order structure.

Supported Order Types:

- Dine In
- Take Away
- Delivery

---

# BR-003 Order Status

Every order must have one of the following statuses:

- Hold (Draft)
- Completed
- Returned

No other statuses are supported in Version 1.

---

# BR-004 Hold Orders

Hold orders are considered draft orders.

Hold orders:

- Can be edited.
- Can be deleted.
- Can be resumed.
- Do not affect reports.
- Do not generate revenue.
- Are not considered completed sales.

---

# BR-005 Completed Orders

Completed orders represent finalized sales.

Completed orders:

- Cannot be edited.
- Cannot be deleted.
- Can only be returned through the Returns module.

---

# BR-006 Returned Orders

Returns are only allowed for completed orders.

Version 1 supports:

- Full Return
- Partial Return

Return reason is optional.

---

# BR-007 One Active Order Per Table

A restaurant table may have only one active order at any given time.

Active means:

- Hold

Completed orders immediately free the table.

---

# BR-008 Order Transfer

A Hold Dine In order may be transferred to another available table.

Transfer is not allowed if the destination table already has an active order.

---

# BR-009 Dine In Orders

Dine In orders must be assigned to a table.

A table is required before creating the order.

---

# BR-010 Take Away Orders

Take Away orders must be linked to a customer.

Customer information may be selected from existing records or created during checkout.

---

# BR-011 Delivery Orders

Delivery orders require:

- Customer
- Delivery Rider

An order cannot be completed without both.

---

# BR-012 Customer Phone Number

Customers are uniquely identified by their phone number.

If a phone number already exists, customer information should be updated instead of creating a duplicate record.

---

# BR-013 Menu Item Availability

Unavailable menu items cannot be added to new orders.

Existing completed orders remain unchanged.

---

# BR-014 Category Deletion

A category cannot be deleted if menu items belong to it.

---

# BR-015 Menu Item Price

Every menu item has a single fixed price in Version 1.

Multiple sizes or price variations are not supported.

---

# BR-016 Discounts

An order may have only one discount.

Supported types:

- Fixed Amount
- Percentage

Discount is applied before payment.

---

# BR-017 Service Charge

Service Charge is optional.

It may be enabled or disabled by the cashier before completing the order.

---

# BR-018 Payment

An order must have exactly one payment method.

Supported methods:

- Cash
- Visa
- Instapay
- Wallet

Payment finalizes the order.

---

# BR-019 Invoice Number

Invoice numbers restart every business day.

Example:

20260713-0001

20260713-0002

20260713-0003

Invoice numbers must remain unique within the same business day.

---

# BR-020 Printing

Completing an order automatically prints:

- Kitchen Copy
- Cashier Copy
- Customer Copy

All copies are printed using the same receipt printer.

---

# BR-021 Expenses

Expenses must be recorded with:

- Title
- Amount
- Date

Expenses reduce the final daily revenue.

---

# BR-022 Daily Closing

Daily Closing calculates:

- Total Sales
- Total Orders
- Dine In Sales
- Take Away Sales
- Delivery Sales
- Returns
- Expenses
- Revenue Before Expenses
- Revenue After Expenses
- Delivery Rider Summary

Only completed orders are included.

---

# BR-023 Delivery Rider Summary

Each completed Delivery order contributes to the assigned rider's daily summary.

The summary includes:

- Number of Orders
- Total Sales Amount

---

# BR-024 Customer Address

Each customer has a single address in Version 1.

The address may be updated when necessary.

Address history is not maintained.

---

# BR-025 Audit Log

The following operations must be recorded:

- Login
- Logout
- Order Creation
- Order Completion
- Hold Update
- Hold Deletion
- Returns
- Expenses
- Menu Item Changes
- Customer Updates
- Settings Changes

Each log entry stores:

- User
- Action
- Entity
- Entity Identifier
- Timestamp
- Details

---

# BR-026 Table Availability

A table can be in one of two states:

- Available
- Occupied

A table becomes Occupied when a Hold Dine In order is created.

A table becomes Available immediately after the order is completed or deleted.

---

# BR-027 Reports

Reports include only completed business transactions.

The following are excluded:

- Hold Orders
- Deleted Hold Orders

Returns and Expenses are reported separately.

---

# BR-028 Data Integrity

The system must prevent duplicate or inconsistent business data.

Examples:

- Duplicate customer phone numbers.
- Multiple active orders for one table.
- Invalid payment methods.
- Negative quantities.
- Negative prices.

---

# BR-029 Auditability

Every important financial operation must be traceable to the authenticated user who performed it.

Financial operations include:

- Sales
- Returns
- Expenses
- Discounts

---

# BR-030 Future Compatibility

The business model shall support future expansion without requiring major redesign.

Future versions may introduce:

- Inventory Management
- Employee Permissions
- Multiple Branches
- Loyalty Programs
- Offers & Promotions
- Kitchen Display System (KDS)
- Online Ordering
- Multiple Menu Item Sizes

# BR-031 Calendar Day

The system uses the current system date as the business date.

All business transactions, including Orders, Returns, Expenses, Reports, and Invoice Numbering, are grouped by the current calendar day.

Invoice numbering resets automatically at the beginning of each new calendar day (00:00).

Invoice numbers must remain unique within the same calendar day.

Example:

20260713-0001
20260713-0002

After midnight:

20260714-0001

# BR-032 Financial Data Immutability

Financial transactions must remain immutable after completion.

Completed Orders, Returns, and Expenses cannot be permanently deleted.

If a financial record needs to be corrected, a new business transaction must be created instead of modifying or deleting the original record.

This rule ensures accurate reporting and maintains financial integrity.

# BR-033 Menu Item Pricing

Each Menu Item represents a complete sellable product with its own predefined price.

Different package sizes or portions (e.g., Half Kilo, One Kilo) are modeled as separate Menu Items.

The system does not calculate prices based on weight or fractional quantities in Version 1.