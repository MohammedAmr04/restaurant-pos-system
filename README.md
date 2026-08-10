# Restaurant POS System

A complete, offline-ready point-of-sale system for restaurants, built as a
self-contained PC client. The backend is a C# (.NET Framework 4.8) OWIN self-host
server that serves both the REST API and a static Next.js frontend, backed by a
local SQLite database. Everything runs locally on one machine — no internet or
cloud dependency.

- **Server:** http://localhost:9000
- **Default login:** `admin` / `1234`
- **UI language:** Arabic (RTL); receipts print in Arabic

---

## Features

### Point of Sale (POS)

- Full POS screen with three order types: **DineIn**, **TakeAway**, and **Delivery**.
- Build orders by searching/selecting menu items; line items update the running
  total in real time.
- Apply **discounts**, **service charge**, and payment via **Cash / Visa / Instapay / Wallet**.
- **Hold / resume** pending orders.
- **Live order and table status** — the UI auto-refreshes every 15 seconds so
  kitchen and floor status stay current across multiple screens.
- **Foreign food** items (`IsForeign`) can be flagged and shown on orders/receipts.

### Orders & Invoices

- Create, complete, cancel, and reprint orders.
- **Invoice viewer** with full line-item detail.
- **Returned orders** show the returned items, refund amount, return reason, and
  return date directly in the invoice view.
- Business-day handling: orders are stamped with a **business date** derived from
  the configured shift, so a night shift (e.g. 11:00 → 03:00) rolls into the next
  day's reporting.

### Menu Items

- Manage menu items with **categories**, prices, images, and availability toggle.
- **Search by name** to quickly find items in long menus.
- Foreign-food flag on items for receipt and reporting.

### Tables, Customers & Delivery Riders

- Restaurant **table management** with status tracking.
- **Customer management** (walk-in general customer by default).
- **Delivery rider management** with assignment to delivery orders.

### Returns Processing

- Process returns against completed orders with a refund amount and reason.
- Return details flow through to **invoices, daily reports, and receipts**.

### Expenses

- Record day-to-day expenses; expenses are grouped by business day and deducted
  from revenue in daily reports and closing.

### Reports

- **Daily report** — totals, completed/returned order counts, sales, discounts,
  service charge, returns, expenses, net revenue, and an **order-type breakdown**
  (DineIn / Delivery / TakeAway with counts and amounts).
- **Daily details** — invoice-level drill-down of every order in a day with
  expandable line items, returned-order info, and summary cards.
- **Monthly**, **custom**, **delivery**, **expense**, and **returns** reports.
- **PDF export** for daily details and reports (Arabic RTL).
- **Daily report receipt printing** straight to the thermal printer.
- **Dashboard** summary with today's numbers and available menu item count.

### Daily Closing

- Close the business day: totals, cash count, expense summary, and a closing
  record per business day.

### Printing

- **ESC/POS thermal printing** (80mm) using raster mode — works with most USB
  thermal printers.
- **Kitchen copy**, **customer receipt**, and **cashier copy** per order.
- **Manual kitchen copy reprint** for dine-in orders (button on the order panel).
- Receipts render in **Arabic with RTL layout**, restaurant branding (name, phone,
  address), and itemized totals.

### Settings

- Tax rate, service charge, receipt header/footer text, and **printer selection**.
- **Shift start/end times** for business-day grouping (default 11:00 → 03:00).
- Admin user management (change password, etc.).

### Platform & UX

- Single-machine **PC client** — copy the folder, run `Start.bat`, browser opens
  automatically.
- **SQLite** database (no server installation), auto-migrated on startup.
- Arabic **RTL** interface with toast notifications.
- Audit log of key actions (prints, completions, etc.).
- JWT-based authentication for the API.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Backend   | C#, .NET Framework 4.8, OWIN self-host, ASP.NET Web API, Unity IoC |
| Database  | SQLite (System.Data.SQLite), Dapper, file-based migrations |
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS v3, react-query, next-intl |
| Printing  | ESC/POS raster rendering to thermal printers |
| Auth      | JWT |

---

## Development

```bash
# Backend (from backend/RestaurantPOS)
dotnet build

# Frontend (from frontend)
npm install --legacy-peer-deps
npm run dev
```

## Building a PC Client Release

```bash
# 1. Build the frontend and deploy the static build into the backend wwwroot
cd frontend
npm run deploy

# 2. Build the backend
cd ../backend/RestaurantPOS
dotnet build

# 3. Assemble release/RestaurantPOS-v<version>/ from bin/ (exe, DLLs, wwwroot,
#    Migrations, restaurant-pos.db) plus Start.bat and README.txt, then zip it.
```

## Release History

See [CHANGELOG.md](./CHANGELOG.md). Releases are tagged in git (`v1.0.0` → `v1.3.0`)
and shipped as zips under `release/`.
