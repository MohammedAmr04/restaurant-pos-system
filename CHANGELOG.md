# Changelog

All notable changes to Restaurant POS are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/). Each release is
tagged in git (`v<MAJOR>.<MINOR>.<PATCH>`) and shipped as a self-contained PC
client build in `release/`.

## [1.3.0] - 2026-08-10

### Added

- Foreign food support (`IsForeign`) across menu items, orders, and receipts.
- Shift settings and business date support (`BusinessDayHelper`) — orders and
  expenses are grouped by business day so the night shift rolls into the next
  day's report.
- Return details on orders, invoices, and daily reports — returned items,
  refund amounts, return reason and date are now visible in the invoice viewer
  and reports.
- Daily report order-type breakdown (DineIn / Delivery / TakeAway) with order
  counts and amounts.
- Invoice-level daily details drill-down tab on the Reports page with
  expandable line items, returned-order info, summary cards, and PDF export.
- Daily report receipt printing (print button on the Reports page).
- Manual kitchen copy reprint for dine-in orders (kitchen copy is no longer
  auto-printed when a dine-in order is completed).
- Name search on the menu items page.

### Changed

- Daily closing and daily/monthly sales reports now include `Returned` orders
  alongside `Completed` ones, with a separate returned-orders count.
- React Query configuration: more retries and a 15-second auto-refresh so order
  and table status stay live.

### Fixed

- Dashboard "available menu items" count now uses the `IsAvailable` flag
  instead of `IsActive`.

## [1.2.0] - 2026-08-08

### Added

- Daily report printing (print button on the Reports page).
- Business-day shift settings (shift start/end, default 11:00 - 03:00) with
  business-day grouping for orders and expenses.
- Order-type breakdown (DineIn / Delivery / TakeAway) on the daily report.
- Returned-item details and total refund on invoices for returned orders.

## [1.1.0] - 2026-08-02

### Added

- JWT authentication helper, App configuration, and React Query provider setup.
- Customer contact info on receipts.
- Tailwind v3 downgrade and branding refresh.

## [1.0.0] - 2026-07-18

### Added

- Initial release — POS (DineIn / TakeAway / Delivery), thermal receipt
  printing (Kitchen / Customer / Cashier), menu items, table and customer
  management, delivery riders, invoices with reprint, returns processing,
  expenses tracking, daily/monthly/custom reports with PDF export, daily
  closing, and settings (tax, service charge, receipt header/footer).
- Arabic localization and toast notifications.
