# Domain Model

Version: 1.0

Status: Approved

---

# Overview

The Restaurant POS System is centered around a single core entity called **Order**.

Every business transaction flows through the Order entity regardless of whether the order is Dine In, Take Away, or Delivery.

Other entities exist to support the Order lifecycle.

---

# Domain Diagram

Restaurant

│

├── Categories

│      └── Menu Items

│

├── Tables

│

├── Customers

│

├── Delivery Riders

│

├── Orders

│      ├── Order Items
│      ├── Payment
│      ├── Discount
│      └── Service Charge

│

├── Expenses

│

├── Returns

│

└── Audit Logs

---

# Entity: User

## Description

Represents an authenticated system user.

Version 1 supports only cashiers or restaurant owners.

## Responsibilities

- Login
- Logout
- Create Orders
- Record Expenses
- Process Returns

---

# Entity: Category

## Description

Groups menu items together.

## Responsibilities

- Organize the restaurant menu.

## Relationships

One Category

↓

Many Menu Items

---

# Entity: Menu Item

## Description

Represents a food or drink available for sale.

## Responsibilities

- Display on POS screen.
- Added to Orders.

## Relationships

Belongs To

↓

One Category

Can Exist In

↓

Many Order Items

---

# Entity: Table

## Description

Represents a physical restaurant table.

## Responsibilities

- Hold one active Dine In Order.

## Relationships

One Table

↓

One Active Order

---

# Entity: Customer

## Description

Represents restaurant customers.

## Responsibilities

- Store contact information.
- Speed up order creation.

## Relationships

One Customer

↓

Many Orders

---

# Entity: Delivery Rider

## Description

Represents the employee responsible for deliveries.

## Responsibilities

- Deliver customer orders.
- Generate daily delivery reports.

## Relationships

One Rider

↓

Many Delivery Orders

---

# Entity: Order

## Description

The central business entity.

Represents every sale in the restaurant.

Supported Types

- Dine In
- Take Away
- Delivery

Supported Statuses

- Hold
- Completed
- Returned

## Responsibilities

- Store ordered items.
- Calculate totals.
- Apply discounts.
- Apply service charge.
- Handle payment.
- Print receipts.

## Relationships

Order

↓

Many Order Items

Optional

↓

Customer

Optional

↓

Table

Optional

↓

Delivery Rider

One

↓

Payment

Zero or One

↓

Discount

Zero or One

↓

Service Charge

---

# Entity: Order Item

## Description

Represents one menu item inside an order.

## Responsibilities

- Quantity
- Unit Price
- Notes
- Subtotal

## Relationships

Belongs To

↓

One Order

References

↓

One Menu Item

---

# Entity: Payment

## Description

Represents the payment information of a completed order.

## Responsibilities

- Store payment method.
- Store paid amount.

## Relationships

One Payment

↓

One Order

---

# Entity: Discount

## Description

Represents an optional discount applied to an order.

## Responsibilities

- Fixed Amount
- Percentage

## Relationships

One Discount

↓

One Order

---

# Entity: Service Charge

## Description

Represents an optional service fee.

## Responsibilities

- Increase final order total.

## Relationships

One Service Charge

↓

One Order

---

# Entity: Return

## Description

Represents returned items from a completed order.

## Responsibilities

- Refund products.
- Adjust reports.

## Relationships

Belongs To

↓

One Order

---

# Entity: Expense

## Description

Represents restaurant operating expenses.

## Responsibilities

- Reduce daily revenue.

---

# Entity: Audit Log

## Description

Stores important user activities.

## Responsibilities

- Financial traceability.
- User accountability.

---

# Aggregate Root

The aggregate root of the system is:

Order

Everything related to sales is managed through the Order aggregate.

Order controls:

- Order Items
- Payment
- Discount
- Service Charge

No entity should directly modify Order Items except through the Order.

---

# Future Domain Expansion

The domain model is designed to support future modules without major redesign.

Planned future entities include:

- Inventory
- Ingredients
- Suppliers
- Purchase Orders
- Branches
- Roles & Permissions
- Kitchen Display System
- Loyalty Program
- Offers & Promotions

# Settings

## Description

Represents restaurant configuration.

## Responsibilities

- Store business information.
- Store tax settings.
- Store service charge settings.
- Store receipt footer.

## Relationships

One System

↓

Many Orders (via settings)
