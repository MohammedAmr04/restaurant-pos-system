# PDF & Invoice Printing Improvements

Version: 1.0

Status: Approved

---

# Objective

Improve PDF generation and invoice reprinting to provide a production-ready experience.

---

# 1. Arabic PDF Support

## Current Issue

Exported PDF reports do not correctly render Arabic text.

Arabic characters appear as:

- Broken
- Disconnected
- Garbled
- Squares
- Question marks

This is unacceptable.

---

## Expected Behavior

All exported PDFs must fully support Arabic.

Requirements:

- Correct RTL layout.
- Proper Arabic glyph shaping.
- Embedded Arabic font.
- Right-aligned Arabic text.
- Arabic table headers.
- Arabic report titles.
- Arabic totals.

Every generated report must be readable when opened on another computer without requiring additional fonts.

---

## Applies To

Arabic support is mandatory for every exported report:

- Daily Sales
- Monthly Sales
- Custom Period
- Delivery
- Expenses
- Returns
- Order Invoices

---

# 2. Invoice Reprint Behavior

## Current Behavior

When clicking Print from the Order Invoices page, the system prints the invoice directly without respecting the restaurant printing workflow.

---

## Expected Behavior

The Order Invoices page should reuse the exact same printing pipeline used when completing a new order.

The reprint process must behave exactly like the original print process.

---

## Customer Copy

Clicking "Print" from the Order Invoices page should print only:

Customer Copy

The system should not print:

- Kitchen Copy
- Cashier Copy

Those copies are only required during the initial order completion.

A historical reprint is intended for the customer only.

---

## Printing Pipeline

The implementation should reuse the existing receipt generation service.

The invoice must preserve:

- Invoice Number
- Items
- Quantities
- Unit Prices
- Discount
- Service Charge
- Grand Total
- Payment Method
- Date & Time

The reprinted invoice should be visually identical to the original Customer Copy.

Do not create a separate receipt layout for reprints.

Reuse the existing ReceiptBuilder and PrinterService.

---

# Acceptance Criteria

The implementation is complete when:

- All exported PDFs correctly display Arabic text.
- Arabic fonts are embedded in exported PDFs.
- RTL layout is preserved.
- Clicking Print from Order Invoices prints only the Customer Copy.
- The existing receipt generation pipeline is reused.
- The reprinted receipt matches the original customer receipt.