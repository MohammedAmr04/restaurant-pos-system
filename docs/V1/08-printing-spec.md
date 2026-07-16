# Printing Specification

Version: 1.0

Status: Approved

---

# Overview

Every completed order generates printed receipts.

A single receipt printer is used.

---

# Receipt Copies

The system prints:

- Kitchen Copy
- Customer Copy
- Cashier Copy

---

# Receipt Header

Contains:

Restaurant Name

Phone

Address

Invoice Number

Date

Time

Cashier Name

Order Type

Table Number (If Dine In)

Customer Name (If Exists)

Delivery Rider (If Delivery)

---

# Items Section

Each item displays:

Quantity

Item Name

Unit Price

Line Total

Notes (Optional)

---

# Totals

Subtotal

Discount

Service Charge

Tax

Grand Total

Paid Amount

Payment Method

---

# Receipt Footer

Receipt Footer Text

Thank You Message

---

# Printing Rules

Kitchen Copy

- Shows menu items.
- Shows notes.
- Does NOT show prices.

Customer Copy

- Shows complete pricing.

Cashier Copy

- Shows complete pricing.

---

# Printing Trigger

Printing occurs immediately after order completion.

Hold orders are never printed.