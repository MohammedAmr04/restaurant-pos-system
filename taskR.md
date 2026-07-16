# POS Screen Redesign Specification

Version: 1.0

Status: Approved

---

# Objective

Redesign the POS (Orders) screen to provide a modern, touch-friendly restaurant POS experience.

The new design should prioritize speed, usability, and cashier workflow.

This redesign replaces the current Orders screen while preserving all existing business logic.

Only the UI/UX should change.

---

# General Layout

The screen should be divided into two primary sections.

```
+-------------------------------------------------------------+
|                     Top Navigation                           |
+----------------------+--------------------------------------+
|                      |                                      |
|                      |                                      |
|   Order Panel        |         Menu Items Panel             |
|                      |                                      |
|                      |                                      |
|                      |                                      |
+----------------------+--------------------------------------+
```

The Menu Items section should occupy approximately **70%** of the screen width.

The Order Panel should occupy approximately **30%**.

The interface should fully utilize the available screen width.

---

# Order Panel (Left Side)

The order panel should remain visible at all times.

It contains:

- Order Number
- Hold Badge
- Order Type
- Table Selector
- Customer Selector (Delivery / Takeaway)
- Notes
- Ordered Items
- Totals
- Action Buttons

---

# Hold Orders

Selecting a held order must reopen it in edit mode.

The cashier must be able to:

- Add new menu items.
- Remove menu items.
- Increase quantity.
- Decrease quantity.
- Change notes.
- Apply discount.
- Apply service charge.
- Complete payment.

Hold orders are editable until they are completed.

Completed orders are immutable.

---

# Order Items

Each order item row should contain:

- Delete Button
- Increase Quantity Button
- Quantity
- Decrease Quantity Button
- Item Name
- Unit Price

Buttons must be large enough for touch screens.

Minimum height:

48px

Preferred:

56px

Spacing should allow fast interaction.

---

# Totals Section

The totals section must always remain visible.

Display:

Subtotal

↓

Discount

↓

Service Charge

↓

Tax (Future)

↓

Grand Total

The Grand Total should be visually dominant.

Example:

Font Size:

32px

Bold

Primary Color

---

# Primary Actions

The bottom of the Order Panel should contain large buttons.

Priority order:

1.

Complete Order

Green

Largest button

2.

Save Hold

Primary Color

3.

Print

Secondary

4.

Send to Kitchen

Secondary

5.

Cancel Order

Danger

Buttons should be touch friendly.

Minimum height:

56px

---

# Menu Section

The menu should occupy most of the screen.

The cashier should never feel constrained.

The current implementation is too narrow.

Increase available width significantly.

---

# Categories

Categories appear horizontally.

Example:

[ All ]

[ Grills ]

[ Sandwiches ]

[ Drinks ]

[ Desserts ]

Horizontal scrolling is allowed.

The active category must be highlighted.

---

# Search

A large search input appears above the menu.

Placeholder:

Search menu items...

---

# Menu Items Grid

Menu Items should appear as cards.

Each card contains:

- Image
- Name
- Price
- Add Button

Example:

+------------------------+

[ Image ]

Chicken BBQ

35 EGP

[ + Add ]

+------------------------+

Cards should be responsive.

Desktop:

4–6 cards per row.

Touch friendly.

---

# Menu Item Images

Version 1 now supports images.

Each Menu Item contains:

- Name
- Category
- Price
- Available
- Notes
- Image

Image is optional.

Supported formats:

- JPG
- PNG
- WEBP

Maximum size:

2 MB

Store image path only in database.

Images are stored inside:

/uploads/menu-items

---

# Categories Management

Categories now support images.

Each category contains:

- Name
- Description
- Image

Image is optional.

Stored inside:

/uploads/categories

Displayed inside category cards when available.

---

# Add/Edit Category Dialog

Fields:

- Name
- Description
- Image Upload

Image Preview

Save

Cancel

---

# Add/Edit Menu Item Dialog

Fields:

- Name
- Category
- Price
- Available

Notes

Image Upload

Image Preview

Save

Cancel

---

# Upload Component

Use one reusable component.

AppImageUpload

Supports:

- Drag & Drop
- Click to Upload
- Preview
- Replace Image
- Remove Image

Validation:

- JPG
- PNG
- WEBP

Maximum:

2 MB

---

# Visual Design

Style:

Modern POS

Minimal

Large whitespace

Rounded corners

Large buttons

Soft shadows

Light theme

Use existing project colors.

---

# Icons

Use Lucide React only.

Examples:

Trash

Plus

Minus

Printer

Receipt

Chef Hat

Search

Upload

Camera

Image

---

# Responsive Behaviour

Desktop First.

Target resolution:

1920×1080

Minimum supported width:

1366px

The screen should efficiently utilize wide monitors.

---

# User Experience Improvements

The redesign should improve:

- Faster order creation.
- Better touch usability.
- Clear financial summary.
- Easier category navigation.
- Larger menu browsing area.
- Larger action buttons.
- Better spacing.
- Better readability.

---

# Existing Business Logic

Do NOT change any business logic.

Do NOT change:

- Order lifecycle.
- Hold logic.
- Pricing.
- Reports.
- Printing.
- Authentication.

Only redesign the interface.

---

# Acceptance Criteria

The redesign is complete when:

- Hold orders are fully editable.
- Menu occupies most of the screen.
- Order panel remains fixed.
- Grand Total is clearly visible.
- Buttons are touch friendly.
- Menu Items support images.
- Categories support images.
- Image upload works.
- Existing APIs continue to work.
- Existing business rules remain unchanged.
