# Database Design

Version: 1.0

Status: Approved

---

# Tables Overview

- Users
- Categories
- MenuItems
- RestaurantTables
- Customers
- DeliveryRiders
- Orders
- OrderItems
- Returns
- ReturnItems
- Expenses
- AuditLogs

---

# Users

Purpose

Stores authenticated users.

Columns

- Id
- Username
- PasswordHash
- FullName
- IsActive
- CreatedAt

Relationships

One User

↓

Many Orders

↓

Many Expenses

↓

Many Audit Logs

---

# Categories

Columns

- Id
- Name
- DisplayOrder
- CreatedAt

Relationships

One Category

↓

Many MenuItems

---

# MenuItems

Columns

- Id
- CategoryId
- Name
- Price
- Image
- Notes
- DisplayOrder
- IsAvailable
- CreatedAt

Relationships

Belongs To Category

Appears In Many OrderItems

---

# RestaurantTables

Columns

- Id
- Number
- IsOccupied

Relationships

One Table

↓

Many Orders (History)

One Active Hold Order

---

# Customers

Columns

- Id
- Name
- Phone
- Address
- Notes
- CreatedAt

Relationships

One Customer

↓

Many Orders

---

# DeliveryRiders

Columns

- Id
- Name
- Phone
- Notes
- CreatedAt

Relationships

One Rider

↓

Many Delivery Orders

---

# Orders

Columns

- Id

- InvoiceNumber

- OrderType

- Status

- UserId

- CustomerId (Nullable)

- TableId (Nullable)

- DeliveryRiderId (Nullable)

- Subtotal

- DiscountType

- DiscountValue

- ServiceCharge

- Tax

- GrandTotal

- PaymentMethod

- PaidAmount

- BusinessDate

- CompletedAt

- CreatedAt

Relationships

One Order

↓

Many OrderItems

---

# OrderItems

Columns

- Id

- OrderId

- MenuItemId

- Quantity

- UnitPrice

- Notes

- Total

---

# Returns

Columns

- Id

- OrderId

- UserId

- TotalRefund

- CreatedAt

Relationships

One Return

↓

Many ReturnItems

---

# ReturnItems

Columns

- Id

- ReturnId

- OrderItemId

- Quantity

- RefundAmount

---

# Expenses

Columns

- Id

- UserId

- Title

- Amount

- Notes

- BusinessDate

- CreatedAt

---

# AuditLogs

Columns

- Id

- UserId

- Action

- Entity

- EntityId

- Details

- CreatedAt

---

# Enums

OrderType

- DineIn
- TakeAway
- Delivery

OrderStatus

- Hold
- Completed
- Returned

DiscountType

- Amount
- Percentage

PaymentMethod

- Cash
- Visa
- Instapay
- Wallet

AuditAction

- Login
- Logout
- Create
- Update
- Delete
- Complete
- Return

# Settings

Id

RestaurantName

Phone

Address

Logo

TaxEnabled

TaxPercentage

ServiceChargeEnabled

ServiceChargePercentage


Receipt Header

Receipt Footer

CreatedAt

UpdatedAt
