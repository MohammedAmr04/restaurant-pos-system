# Functional Requirements

Version: 1.0

---

# FR-001 Authentication

## Description

The system shall allow authorized users to securely access the application.

Version 1 supports authentication only.

Authorization and role-based permissions are out of scope.

---

## Functional Requirements

The user shall be able to:

- Login using username and password.
- Logout from the application.
- Stay authenticated until logout or session expiration.

---

## Business Rules

- Every operation requires an authenticated user.
- All important authentication events are stored in the Audit Log.
- Passwords must never be stored as plain text.

---

## Acceptance Criteria

✅ User can login with valid credentials.

✅ Invalid credentials display an error.

✅ User can logout successfully.

---

# FR-002 Category Management

## Description

The system shall manage restaurant menu categories.

---

## Functional Requirements

The cashier can:

- Create category.
- Edit category.
- Delete category.
- View category list.

---

## Category Fields

- Name
- Display Order (Optional)

---

## Business Rules

- Category names must be unique.
- Categories cannot be deleted if menu items belong to them.

---

## Acceptance Criteria

✅ Category created successfully.

✅ Category updated successfully.

✅ Category cannot be deleted while referenced.

---

# FR-003 Menu Item Management

## Description

The system shall manage menu items.

---

## Functional Requirements

Create

Edit

Delete

View

Search

Enable / Disable availability

---

## Menu Item Fields

- Name
- Price
- Category
- Available
- Image (Optional)
- Notes (Optional)

---

## Business Rules

- Price must be greater than zero.
- Every item belongs to one category.
- Menu item names should be unique inside the same category.
- Only one price is supported in Version 1.

---

## Acceptance Criteria

✅ Create menu item.

✅ Edit menu item.

✅ Disable unavailable items.

---

# FR-004 Table Management

## Description

The system shall manage restaurant tables.

---

## Functional Requirements

Create table

Edit table

Delete table

View status

Move order between tables

---

## Table Fields

- Table Number

---

## Business Rules

- Table numbers must be unique.
- Only one active order per table.
- Orders can be moved to another available table.

---

## Acceptance Criteria

✅ Create table.

✅ Move order successfully.

✅ Prevent assigning multiple active orders.

---

# FR-005 Customer Management

## Description

The system stores customer information for faster ordering.

---

## Functional Requirements

Create customer

Update customer

Search customer

View customer history

---

## Customer Fields

- Name
- Phone
- Address
- Notes

---

## Business Rules

- Phone number should be unique.
- Existing customer information can be updated.
- Customer search is primarily performed by phone number.

---

## Acceptance Criteria

✅ Existing customer loads automatically.

✅ Customer information updates correctly.

---

# FR-006 Delivery Rider Management

## Description

The system manages delivery riders.

---

## Functional Requirements

Create rider

Update rider

Delete rider

View riders

---

## Rider Fields

- Name
- Phone
- Notes

---

## Business Rules

Delivery reports depend on assigned rider.

---

## Acceptance Criteria

✅ Rider assigned successfully.

---

# FR-007 Order Management

## Description

The Order is the core business entity.

All sales are represented as Orders.

Order Types:

- Dine In
- Take Away
- Delivery

---

## Functional Requirements

Create order

Update Hold order

Delete Hold order

Complete order

Print order

Move order

Apply discounts

Apply service charge

Choose payment method

---

## Business Rules

- Orders begin as Draft (Hold).
- Hold orders are not included in reports.
- Completed orders cannot be edited.
- Only Hold orders can be deleted.
- One active order per table.
- Delivery orders require customer.
- Delivery orders require rider.
- Take Away requires customer.
- Dine In requires table.

---

## Acceptance Criteria

✅ Hold order saved.

✅ Resume Hold order.

✅ Complete payment.

✅ Completed order becomes read-only.

---

# FR-008 Order Items

## Description

Manage menu items inside an order.

---

## Functional Requirements

Add item

Remove item

Increase quantity

Decrease quantity

Update notes

---

## Business Rules

- Quantity must be greater than zero.
- Notes are optional.

---

## Acceptance Criteria

✅ Item added.

✅ Quantity updated.

---

# FR-009 Discounts

## Functional Requirements

Apply fixed discount.

Apply percentage discount.

---

## Business Rules

Only one discount per order.

Discount applies before payment.

---

# FR-010 Service Charge

## Functional Requirements

Apply service charge.

Remove service charge.

---

## Business Rules

Optional.

Configured from system settings.

---

# FR-011 Payments

## Functional Requirements

Select payment method.

Complete payment.

Generate invoice.

---

## Supported Methods

- Cash
- Visa
- Instapay
- Wallet

---

## Business Rules

Completed payment finalizes the order.

---

# FR-012 Returns

## Functional Requirements

Search invoice.

Return items.

Return quantities.

Complete return.

---

## Business Rules

Returns only apply to completed invoices.

Partial returns supported.

Full returns supported.

Reason is optional.

---

# FR-013 Expenses

## Functional Requirements

Create expense.

Edit expense.

Delete expense.

View expenses.

---

## Expense Fields

- Title
- Amount
- Date
- Notes

---

## Business Rules

Expenses affect end-of-day reports.

---

# FR-014 Daily Closing

## Functional Requirements

Generate end-of-day report.

---

## Report Includes

Total Sales

Take Away Sales

Delivery Sales

Dine In Sales

Returns

Expenses

Revenue Before Expenses

Revenue After Expenses

Delivery Rider Summary

---

# FR-015 Reports

Generate

Daily Report

Monthly Report

Custom Report

Expense Report

Returns Report

Delivery Report

---

# FR-016 Printing

Print three copies.

Kitchen Copy.

Cashier Copy.

Customer Copy.

Single printer.

---

# FR-017 Audit Log

The system records:

- Login
- Logout
- Menu Changes
- Customer Changes
- Order Creation
- Order Completion
- Hold Updates
- Hold Deletion
- Returns
- Expenses

---

## Audit Log Fields

- User
- Action
- Entity
- Entity Id
- Timestamp
- Details


# FR-018 Settings

## Description

The system shall provide a centralized settings module to configure restaurant information and system behavior.

## Functional Requirements

The user can:

- View restaurant settings.
- Update restaurant settings.
- Enable or disable Service Charge.
- Configure Service Charge percentage.
- Enable or disable Tax.
- Configure Tax percentage.
- Update receipt footer.
- Update restaurant information.

## Acceptance Criteria

✅ Settings are saved successfully.

✅ Updated settings affect newly created orders only.