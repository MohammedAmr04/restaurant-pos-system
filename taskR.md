# Receipt Layout & Typography Improvements

The current printing functionality works correctly.

Do NOT modify the printing pipeline.

Do NOT modify PrinterService.

Do NOT modify receipt generation flow.

Only improve the visual layout of the receipts.

---

## Objective

Match the visual appearance of the previous POS project.

The previous project had much better typography, spacing and readability.

Use it only as a visual reference.

Do not copy code directly.

---

# 1. Restaurant Name

The restaurant name should be the largest text on the receipt.

Requirements:

- Bold
- Larger font size
- Center aligned
- Clearly separated from the rest of the receipt

Restaurant Name:

مطعم ومشويات بيت المعز

It should visually act as the receipt title.

---

# 2. Typography

Increase the overall font sizes to match the previous project.

Use a clear visual hierarchy.

Suggested hierarchy:

Restaurant Name
Largest + Bold

Section Titles
Large + Bold

Invoice Information
Medium

Items
Normal

Totals
Large + Bold

Grand Total
Largest after the restaurant name

The receipt should be easy to read from a distance.

---

# 3. Spacing

Increase vertical spacing between sections.

Examples:

Restaurant Name

↓

Receipt Type

↓

Invoice Information

↓

Items

↓

Totals

↓

Footer

Avoid a crowded layout.

---

# 4. Cashier Receipt Item Alignment

The current item layout is not visually aligned.

Fix the items table.

Expected layout:

Quantity

↓

Item Name

↓

Unit Price

↓

Line Total

Columns should stay aligned regardless of item name length.

Long item names should wrap correctly without breaking the layout.

Arabic RTL alignment must remain correct.

Numbers should remain LTR where appropriate.

---

# 5. RTL Improvements

Review the cashier receipt.

Ensure:

- Arabic text is RTL.
- Numeric values remain aligned correctly.
- Prices line up vertically.
- Quantities line up vertically.
- Totals line up vertically.

Avoid mixed RTL/LTR rendering issues.

---

# 6. Totals Section

The totals area should stand out visually.

Increase spacing before totals.

Grand Total should:

- Use bold font.
- Use a larger font.
- Be visually separated by horizontal lines.

---

# 7. Receipt Width

Keep compatibility with 80mm thermal printers.

Do not change the printer width.

Instead improve the internal layout to better utilize the available width.

---

# 8. Visual Consistency

Ensure all receipt types use the same typography rules.

This includes:

- Kitchen Receipt
- Cashier Receipt
- Customer Receipt

Each receipt should have consistent spacing and font hierarchy while keeping only the information relevant to that receipt.

---

# 9. Preserve Existing Functionality

Do NOT modify:

- Printing pipeline
- ESC/POS communication
- PrinterService
- Receipt routing
- Receipt selection
- Business logic

Only improve presentation and layout.

---

## Deliverables

After implementation provide:

- List of modified files.
- Summary of typography improvements.
- Summary of layout improvements.
- Confirmation that printing functionality remains unchanged.

# 10. Typography

Improve the receipt typography to match the previous POS project.

Use the following typography hierarchy as a reference.

Restaurant Name

- Font Family: Tahoma
- Font Size: 28
- Font Weight: Bold
- Center Aligned

Receipt Title

Examples:

- فاتورة الكاشير
- المطبخ
- طلب العميل

- Font Family: Tahoma
- Font Size: 20
- Font Weight: Bold
- Center Aligned

Invoice Information

Examples:

- رقم الطلب
- التاريخ
- الوقت
- نوع الطلب
- الكاشير
- العميل

- Font Family: Tahoma
- Font Size: 16
- Font Weight: Bold

Items

Examples:

- الكمية
- الصنف
- السعر
- الإجمالي

- Font Family: Tahoma
- Font Size: 16
- Font Weight: Regular

Totals

Examples:

- الإجمالي الفرعي
- الخصم
- الخدمة

- Font Family: Tahoma
- Font Size: 18
- Font Weight: Bold

Grand Total

The final amount should be the second largest text on the receipt.

- Font Family: Tahoma
- Font Size: 22
- Font Weight: Bold

Footer

Examples:

- شكراً لزيارتكم
- أرقام الهاتف
- العنوان

- Font Family: Tahoma
- Font Size: 14
- Font Weight: Regular

---

## Spacing

Increase spacing between all major sections.

Recommended spacing:

Restaurant Name

↓

20px

↓

Receipt Title

↓

20px

↓

Invoice Information

↓

15px

↓

Items Table

↓

15px

↓

Totals

↓

20px

↓

Footer

Add horizontal separator lines between sections.

Avoid crowded layouts.

---

## Visual Hierarchy

The receipt should naturally draw attention in this order:

1. Restaurant Name
2. Grand Total (Cashier Receipt only)
3. Receipt Type
4. Invoice Information
5. Items
6. Totals
7. Footer

---

## Important

Do not hardcode these values if a typography configuration already exists.

If reusable font definitions are available, update them instead so all receipt types automatically share the same typography.

Maintain full compatibility with 80mm thermal printers.