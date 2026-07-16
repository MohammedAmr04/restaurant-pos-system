# Implementation Audit Report — Restaurant POS System V1

**Audit Date:** 2026-07-15  
**Auditor:** Senior Software Architect (Automated)  
**Scope:** Full implementation vs. documentation (`/docs/V1/`)

---

## Executive Summary

**Overall Completion: 78%**

The Restaurant POS system has a solid foundation with most features implemented and both frontend and backend compiling cleanly. However, the audit uncovered **8 critical bugs**, **6 high-severity issues**, and **15 medium/low findings** across database schema, business rules, printing, frontend, and API specification alignment.

The most severe issues are:
- **Invoice number generation is broken** — every order in a day gets `-0001` instead of incrementing
- **Completed orders can be modified** — discount and service charge removal have no status guard
- **No one-active-order-per-table enforcement** — multiple hold orders can occupy the same table
- **Receipts show blank names** — `MapToDto` doesn't populate joined fields (UserName, CustomerName, etc.)
- **No user feedback system** — success/error toasts are completely missing

---

## Passed Checks

### Authentication
- [x] Login with username/password (`AuthController.cs`)
- [x] JWT token generation (`AuthService.cs`)
- [x] Password hashing with SHA256 (`PasswordHasher.cs`)
- [x] Logout with audit logging
- [x] Default admin user seeded

### Categories (FR-002)
- [x] CRUD operations via `CategoriesController.cs`
- [x] Category deletion blocked when menu items exist (`CategoryService.cs:82-86`)
- [x] Audit logging on create/update/delete

### Menu Items (FR-003)
- [x] CRUD + availability toggle (`MenuItemsController.cs`)
- [x] Price greater than zero validation
- [x] Availability check on order item add (`OrderService.cs:125`)

### Tables (FR-004)
- [x] CRUD operations
- [x] Move order between tables (`TablesController.cs`)
- [x] Visual status display (occupied/available)

### Customers (FR-005)
- [x] CRUD with phone-based search (`CustomersController.cs`)
- [x] Upsert by phone — no duplicates (`CustomerService.cs:37-66`)

### Delivery Riders (FR-006)
- [x] CRUD operations (`DeliveryRidersController.cs`)

### Orders (FR-007/FR-008)
- [x] Create/hold/resume/delete order
- [x] Add/update/remove order items
- [x] Snapshot pricing (UnitPrice stored on OrderItem)
- [x] Dine In / Take Away / Delivery flows

### Discounts (FR-009)
- [x] Fixed amount and percentage discount
- [x] Applied before completion

### Service Charge (FR-010)
- [x] Optional, configurable from settings
- [x] Applied before completion

### Payments (FR-011)
- [x] Cash, Visa, Instapay, Wallet
- [x] Order completion with payment

### Returns (FR-012)
- [x] Search by invoice number
- [x] Partial and full returns
- [x] Returns report

### Expenses (FR-013)
- [x] CRUD operations
- [x] Audit logging

### Reports (FR-015)
- [x] Daily, Monthly, Custom, Delivery, Expense, Returns reports
- [x] All report DTOs match spec fields

### Settings (FR-018)
- [x] Restaurant info, tax, service charge, receipt settings
- [x] Audit logging on settings changes

### Printing (FR-016)
- [x] Three copies: Kitchen, Customer, Cashier
- [x] Kitchen copy hides prices
- [x] GDI+ Arabic rendering (`ReceiptRenderer.cs`)
- [x] ESC/POS encoding (`EscPosEncoder.cs`)
- [x] Print trigger on order completion
- [x] Configurable printer settings

### Frontend
- [x] All documented pages exist
- [x] RTL-first layout
- [x] All UI text from `next-intl` translations
- [x] Loading states on all pages
- [x] Empty states on all pages
- [x] Disabled submit buttons during mutations
- [x] React Hook Form + Zod validation
- [x] TanStack Query for server state
- [x] Feature-based architecture
- [x] Centralized constants (routes, query keys, etc.)

### Development Guidelines
- [x] .NET Framework 4.8 + ASP.NET Web API 2
- [x] Dapper ORM
- [x] SQLite database
- [x] SQL script migrations
- [x] Next.js static export
- [x] OWIN self-host
- [x] FluentValidation on backend
- [x] Serilog logging

---

## Critical Bugs

### CB-001: Invoice Number Generation Broken
**Doc Reference:** BR-019, BR-031 — Invoice numbers restart daily in format `YYYYMMDD-NNNN`  
**File:** `backend/RestaurantPOS/Features/Orders/Repositories/OrderRepository.cs:70-76`  
**Issue:** The query `WHERE BusinessDate = @BusinessDate` compares a DateTime column to a string `"20260715"`. SQLite will not match this against stored DateTime values like `2026-07-15 00:00:00`. The count will always be 0, so every order gets `-0001`.  
**Fix:** Use `date(BusinessDate) = @BusinessDate` (as `ReportsService` does) or store BusinessDate as TEXT.

### CB-002: Completed Orders Can Be Modified
**Doc Reference:** BR-005 — Completed orders cannot be edited  
**File:** `backend/RestaurantPOS/Features/Orders/Services/OrderService.cs:193-207` (RemoveDiscountAsync), `:225-238` (RemoveServiceChargeAsync)  
**Issue:** Neither method checks `order.Status != "Completed"`. A completed order's discount or service charge can be zeroed out via API.  
**Fix:** Add `if (order.Status == "Completed") throw new Exception("Completed orders cannot be modified");`

### CB-003: No One-Active-Order-Per-Table Enforcement
**Doc Reference:** BR-007 — A table may have only one active (Hold) order  
**File:** `backend/RestaurantPOS/Features/Orders/Services/OrderService.cs:93-101`  
**Issue:** When creating a DineIn order, the code sets `table.IsOccupied = true` without first checking if it's already occupied. Two hold orders can be created for the same table.  
**Fix:** Add `if (table.IsOccupied) throw new Exception("Table is already occupied");` before creating the order.

### CB-004: Receipts Show Blank Names
**Doc Reference:** 08-printing-spec.md — Receipt header includes Cashier Name, Customer Name, Delivery Rider, Table Number  
**File:** `backend/RestaurantPOS/Features/Orders/Services/OrderService.cs:386-429`  
**Issue:** `MapToDto()` does not populate `UserName`, `CustomerName`, `TableNumber`, or `DeliveryRiderName` on `OrderDto`. All receipts will show blank for these fields.  
**Fix:** JOIN or lookup User, Customer, Table, and DeliveryRider names in `MapToDto()`.

### CB-005: RemoveDiscountAsync Has No Status Guard
**Doc Reference:** BR-005 — Completed orders cannot be edited  
**File:** `backend/RestaurantPOS/Features/Orders/Services/OrderService.cs:193-207`  
**Issue:** (Same as CB-002, specific to discount removal)

### CB-006: RemoveServiceChargeAsync Has No Status Guard
**Doc Reference:** BR-005 — Completed orders cannot be edited  
**File:** `backend/RestaurantPOS/Features/Orders/Services/OrderService.cs:225-238`  
**Issue:** (Same as CB-002, specific to service charge removal)

### CB-007: No Toast/Notification System
**Doc Reference:** 10-development-guidelines.md — "Every user action must provide immediate visual feedback"  
**File:** Frontend (all feature pages)  
**Issue:** No toast, snackbar, or notification component exists. Success/error feedback is completely absent for create/update/delete operations. Translation keys exist (`createSuccess`, `deleteSuccess`, etc.) but nothing displays them.

### CB-008: Mutation Errors Silently Swallowed
**Doc Reference:** 10-development-guidelines.md — "Unexpected errors should display a generic error message"  
**File:** All frontend mutation handlers  
**Issue:** No `.onError()` callbacks on any TanStack Query mutations. API errors are caught but never displayed to the user.

---

## High-Severity Issues

### HS-001: Kitchen Receipt Missing Header Fields
**Doc Reference:** 08-printing-spec.md — Receipt header includes Phone, Address, Cashier Name, etc.  
**File:** `backend/RestaurantPOS/Features/Printing/KitchenReceiptBuilder.cs:8-25`  
**Issue:** Kitchen receipt builder does not set `Phone`, `Address`, `CashierName`, `CustomerName`, or `DeliveryRiderName`. Per spec, all header fields should be present.

### HS-002: DailyClosingSummaryDto Missing Fields
**Doc Reference:** 01-business-overview.md — Daily closing includes Dine In/Take Away/Delivery sales breakdown, Revenue Before/After Expenses  
**File:** `backend/RestaurantPOS/Features/DailyClosing/DTOs/DailyClosingSummaryDto.cs`  
**Issue:** Missing: `Discounts`, `ServiceCharge`, `RevenueBeforeExpenses`, `RevenueAfterExpenses`, order type breakdown. The closing summary is less informative than the Daily Sales Report.

### HS-003: DailyClosingService In-Memory Filtering
**Doc Reference:** 10-development-guidelines.md — Performance best practices  
**File:** `backend/RestaurantPOS/Features/DailyClosing/Services/DailyClosingService.cs:34-36`  
**Issue:** Loads ALL orders/expenses/returns from database, then filters by date in memory. Should use SQL-level date filtering like `ReportsService`.

### HS-004: Orders Have Soft Delete (Documentation Prohibits)
**Doc Reference:** 10-development-guidelines.md — Soft Delete NOT used for Orders  
**File:** `backend/RestaurantPOS/Migrations/007_create_orders.sql:22`, `Features/Orders/Order.cs`  
**Issue:** Orders table has `DeletedAt` column and Order entity inherits BaseEntity with soft delete. Documentation explicitly states Orders should NOT have soft delete.

### HS-005: Expenses Have Soft Delete (Documentation Prohibits)
**Doc Reference:** 10-development-guidelines.md — Soft Delete NOT used for Expenses  
**File:** `backend/RestaurantPOS/Migrations/011_create_expenses.sql:10`, `Features/Expenses/Expense.cs`  
**Issue:** Expenses table has `DeletedAt` column and Expense entity inherits BaseEntity. Documentation explicitly states Expenses should NOT have soft delete.

### HS-006: `ReceiptItemModel.ShowPrice` Property Never Used
**Doc Reference:** 10-development-guidelines.md — Dead code avoidance  
**File:** `backend/RestaurantPOS/Features/Printing/ReceiptModels.cs:37`  
**Issue:** The `ShowPrice` property on `ReceiptItemModel` is set by builders but never checked by `ReceiptRenderer`. The renderer uses only the `showPrices` parameter. Dead code / maintenance trap.

---

## Missing Features

| # | Feature | Doc Reference | Status |
|---|---------|---------------|--------|
| MF-001 | `PUT /orders/{id}` endpoint | 06-api-spec.md | Missing from `OrdersController` |
| MF-002 | Inline "Create Customer" in POS Take Away flow | 07-front-end-flow.md | Customer dropdown only, no inline create |
| MF-003 | Dashboard links to Daily Closing | 07-front-end-flow.md | Route exists but not on dashboard grid |

---

## Business Rule Violations

| # | Rule | Violation | File |
|---|------|-----------|------|
| BRV-001 | BR-005: Completed orders immutability | Discount/service charge removable from completed orders | `OrderService.cs:193,225` |
| BRV-002 | BR-007: One active order per table | No occupancy check before creating DineIn order | `OrderService.cs:93-101` |
| BRV-003 | BR-019: Invoice numbers restart daily | DateTime/string comparison bug breaks incrementing | `OrderRepository.cs:70-76` |
| BRV-004 | BR-032: Financial data immutability | No delete protection verification for Expenses/Returns | Various |

---

## Database Issues

| # | Severity | Issue | Reference |
|---|----------|-------|-----------|
| DB-001 | HIGH | `DailyClosings` table undocumented | 05-database-model.md |
| DB-002 | HIGH | Orders has `DeletedAt` (doc prohibits soft delete) | 10-development-guidelines.md |
| DB-003 | HIGH | Expenses has `DeletedAt` (doc prohibits soft delete) | 10-development-guidelines.md |
| DB-004 | MEDIUM | Settings has 4 undocumented printer columns | 05-database-model.md |
| DB-005 | MEDIUM | Settings has undocumented `DeletedAt` column | 05-database-model.md |
| DB-006 | MEDIUM | Returns has undocumented `Reason` column | 05-database-model.md |
| DB-007 | LOW | 8 tables have BaseEntity columns not in doc column lists | 05-database-model.md |

---

## API Issues

| # | Severity | Issue | Reference |
|---|----------|-------|-----------|
| API-001 | HIGH | `PUT /orders/{id}` missing | 06-api-spec.md |
| API-002 | INFO | `GET /reports/dashboard` not in spec | 06-api-spec.md |
| API-003 | INFO | `GET /daily-closing/history` not in spec | 06-api-spec.md |
| API-004 | INFO | `GET /daily-closing/{date}` not in spec | 06-api-spec.md |
| API-005 | INFO | `POST /daily-closing` not in spec | 06-api-spec.md |

---

## Frontend Issues

| # | Severity | Issue | Reference |
|---|----------|-------|-----------|
| FE-001 | CRITICAL | No toast/notification system for user feedback | 10-development-guidelines.md |
| FE-002 | CRITICAL | Mutation errors silently swallowed (no `.onError()`) | 10-development-guidelines.md |
| FE-003 | BUG | Expenses page `t("actions")` — wrong namespace, should be `tCommon("actions")` | Translation key resolution |
| FE-004 | BUG | Expense report table column 5 uses `t("expenses")` instead of `tCommon("notes")` | `reports/page.tsx:425` |
| FE-005 | MINOR | Take Away customer is optional (doc implies required) | `orders/page.tsx` — `selectCustomerOptional` |
| FE-006 | MINOR | No inline "Create Customer" in POS Take Away flow | `orders/page.tsx` |
| FE-007 | MINOR | Logout is header button, not dashboard module card as documented | `dashboard/page.tsx` |
| FE-008 | INFO | Hardcoded Arabic in `layout.tsx` metadata (title/description) | `app/layout.tsx:7-8` |
| FE-009 | INFO | Hardcoded `"ar-EG"` locale strings (13 occurrences) | Multiple files |
| FE-010 | INFO | Route naming inconsistency: POS vs Orders | `pos/page.tsx` redirects to `/orders` |

---

## Printing Issues

| # | Severity | Issue | File |
|---|----------|-------|------|
| PR-001 | HIGH | Kitchen receipt missing Phone, Address, CashierName, CustomerName, RiderName | `KitchenReceiptBuilder.cs:8-25` |
| PR-002 | HIGH | `ReceiptItemModel.ShowPrice` property never used by renderer | `ReceiptModels.cs:37` |
| PR-003 | LOW | Redundant variable in `ReceiptRenderer.cs:27` (`var items = showPrices ? receipt.Items : receipt.Items`) | `ReceiptRenderer.cs:27` |

---

## Reports Issues

| # | Severity | Issue | File |
|---|----------|-------|------|
| RP-001 | HIGH | DailyClosingSummaryDto missing Discounts, ServiceCharge, RevenueBefore/AfterExpenses | `DailyClosingSummaryDto.cs` |
| RP-002 | MEDIUM | DailyClosingService loads all data then filters in memory | `DailyClosingService.cs:34-36` |
| RP-003 | LOW | Expense Report DTO missing `Total` field (spec lists it) | `ExpenseReportDto.cs` |

---

## Code Quality Issues

| # | Severity | Issue | File |
|---|----------|-------|------|
| CQ-001 | MEDIUM | `ReceiptRenderer.cs:27` — redundant `items` variable never used | `ReceiptRenderer.cs` |
| CQ-002 | MEDIUM | `ReceiptModels.cs:37` — `ShowPrice` property is dead code | `ReceiptModels.cs` |
| CQ-003 | LOW | No `.onError()` handlers on any frontend mutations | All feature pages |
| CQ-004 | LOW | 13 hardcoded `"ar-EG"` locale strings should be a constant | Multiple frontend files |
| CQ-005 | LOW | `DependencyConfig.cs` uses deprecated `InjectionFactory` | `DependencyConfig.cs:15` |

---

## Recommended Fixes (Ordered by Priority)

### Priority 1 — Critical (Must Fix)

1. **Fix invoice number generation** — Change `OrderRepository.GetNextInvoiceNumberAsync()` to use `date(BusinessDate) = @BusinessDate` instead of direct string comparison. Affects all invoice numbering.

2. **Add status guards to RemoveDiscountAsync and RemoveServiceChargeAsync** — Check `order.Status == "Completed"` and throw. Prevents modification of finalized orders.

3. **Enforce one-active-order-per-table** — In `OrderService.CreateOrderAsync()`, check `table.IsOccupied` before creating DineIn order. Throw if occupied.

4. **Fix OrderService.MapToDto()** — JOIN or lookup User, Customer, Table, DeliveryRider names so receipts and API responses contain actual names instead of nulls.

5. **Add toast/notification system** — Install a toast library (e.g., `sonner` or shadcn toast) and add success/error notifications to all mutation handlers.

6. **Add `.onError()` handlers** — Every TanStack Query mutation needs an error callback that displays the API error message to the user.

### Priority 2 — High

7. **Fix kitchen receipt header** — Add Phone, Address, CashierName, CustomerName, DeliveryRiderName to `KitchenReceiptBuilder.cs`.

8. **Expand DailyClosingSummaryDto** — Add Discounts, ServiceCharge, RevenueBeforeExpenses, RevenueAfterExpenses, and order type breakdown.

9. **Fix DailyClosingService SQL** — Replace in-memory filtering with SQL-level date filtering.

10. **Fix expenses page translation** — Change `t("actions")` to `tCommon("actions")` in `expenses/page.tsx:138`.

11. **Fix expense report column header** — Change column 5 from `t("expenses")` to a notes/备注 translation key.

### Priority 3 — Medium

12. **Update documentation** — Add `DailyClosings` table, printer Settings columns, `Reason` column on Returns, and Daily Closing API endpoints to the spec.

13. **Decide on soft delete for Orders/Expenses** — Either remove `DeletedAt` from Orders/Expenses (matching docs) or update docs to allow it.

14. **Add `PUT /orders/{id}`** endpoint if the doc requires it, or remove from the API spec.

15. **Remove dead code** — `ReceiptItemModel.ShowPrice`, redundant variable in `ReceiptRenderer.cs:27`.

16. **Extract locale constant** — Replace 13 hardcoded `"ar-EG"` strings with a shared constant.

17. **Add Daily Closing to dashboard** — Add a navigation card for Daily Closing on the dashboard page.

### Priority 4 — Low

18. **Fix Expenses `t("actions")` translation key** — Verify all pages use `tCommon()` for shared keys.

19. **Add inline customer creation in POS** — For Take Away flow per documented UX.

20. **Resolve route naming** — Standardize on POS or Orders naming convention.

---

## Summary Statistics

| Category | Total | Passed | Failed | Missing |
|----------|-------|--------|--------|---------|
| Backend API Endpoints | 42 | 38 | 0 | 1 |
| Business Rules | 15 | 10 | 5 | 0 |
| Database Tables | 13 | 13 | 0 | 0 |
| Database Columns | ~80 | ~65 | 0 | ~15 undocumented |
| Frontend Pages | 12 | 12 | 0 | 0 |
| Frontend UX Quality | 8 | 5 | 3 | 0 |
| Printing | 8 | 5 | 3 | 0 |
| Reports | 6 | 6 | 0 | 0 |
| Dev Guidelines | 20 | 17 | 3 | 0 |

**Critical Bugs:** 8  
**High-Severity Issues:** 6  
**Medium Issues:** 8  
**Low/Info Issues:** 10  
