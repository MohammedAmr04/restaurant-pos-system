# Development Guidelines

Version: 1.0

Status: Approved

---

# Project Architecture

The project follows a Client-Server architecture.

Frontend:

- Next.js
- Static Export

Backend:

- ASP.NET Web API

Database:

- SQLite

The generated frontend build is copied into the backend's `wwwroot` folder and served as static files.

---


# Solution Architecture

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

SQLite Database

---

# Frontend Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Lucide React

---



# Backend Stack

- ASP.NET Web API 2
- Dapper
- SQLite
- JWT Authentication
- FluentValidation
- Serilog

Reason

The application is deployed on Windows 7 devices where modern .NET versions are not supported.

# Backend Architecture

The backend follows a Feature-Based Architecture.

Example:

src/

Features/

    Authentication/

    Categories/

    MenuItems/

    Customers/

    DeliveryRiders/

    Orders/

    Returns/

    Expenses/

    Reports/

    Settings/

Shared/

Infrastructure/

Persistence/

Common/

Each feature contains:

- Controllers
- DTOs
- Services
- Validators
- Mappings
- Interfaces

Business logic should remain inside the feature layer.

Avoid creating large shared service classes.

# Database

SQLite is the official database for Version 1.

Reasons:

- Single branch restaurant.
- Single local machine.
- No SQL Server installation required.
- Easy backup.
- Excellent performance for local POS systems.

---

# Date & Time

The system uses:

DateTime.Now

instead of

DateTime.UtcNow

Reason:

The application is deployed locally on a single machine inside the restaurant.

No timezone conversion is required.

---

# Frontend Rendering

The frontend must be generated using Static Export.

Workflow:

Next.js Build

↓

Static Export

↓

out/

↓

Copy to Backend wwwroot

↓

Served by ASP.NET

No SSR.

No Server Actions.

No Middleware.

No API Routes inside Next.js.

The frontend communicates only with the ASP.NET Web API.

---

# Component Strategy

Reusable components must always be preferred.

Avoid duplicated UI implementation.

Common components include:

- AppButton
- AppInput
- AppTextarea
- AppSelect
- AppDialog
- ConfirmDialog
- DeleteDialog
- AppTable
- AppPagination
- AppSearch
- AppCard
- EmptyState
- ErrorState
- LoadingOverlay

Feature-specific components remain inside their corresponding feature folders.

---

# Feature-Based Structure

The frontend follows a Feature-Based Architecture.

Example:

src/

features/

components/

hooks/

lib/

store/

types/

utils/

Each feature owns:

- Components
- Hooks
- Services
- Validation
- Types

---

# State Management

Use TanStack Query for all server state.

Use React local state whenever possible.

Avoid unnecessary global state.

Global state should only be used when data must be shared across multiple features.

---

# Forms

All forms use:

- React Hook Form
- Zod Validation

Validation rules must exist on both frontend and backend.

---

# UI Direction

The application is RTL-first.

HTML root:

dir="rtl"

Language:

Arabic

The UI should be designed in a way that allows future localization without requiring layout changes.

---

# Icons

Use Lucide React icons exclusively.

Do not use emoji icons inside the application.

---

# Internationalization

The application uses next-intl.

Version 1 ships with Arabic only.

All text displayed in the UI must come from translation files.

Hardcoded strings inside components are not allowed.

The project structure should allow adding additional languages in future versions without modifying components.

# Navigation

All navigation labels, page titles, menu items, breadcrumbs and button labels must come from translation files.

Example:

Navigation

Sales

Customers

Reports

Settings

The UI must never contain hardcoded navigation text.

lib/

# Project Constants

All reusable constant values must be centralized.

Avoid hardcoded strings and magic numbers throughout the application.

Example structure:

Frontend

src/
└── lib/
    └── constants/
        ├── routes.ts
        ├── query-keys.ts
        ├── order-status.ts
        ├── order-types.ts
        ├── payment-methods.ts
        ├── expense-types.ts
        ├── validation.ts
        └── storage-keys.ts

---

## Routes

Application routes must be defined in a single constants file.

Do not hardcode route paths inside components.

Example:

ROUTES.LOGIN

ROUTES.POS

ROUTES.CATEGORIES

ROUTES.MENU_ITEMS

ROUTES.CUSTOMERS

ROUTES.TABLES

ROUTES.DELIVERY_RIDERS

ROUTES.EXPENSES

ROUTES.RETURNS

ROUTES.REPORTS

ROUTES.SETTINGS

---

## Query Keys

TanStack Query keys must be centralized.

Example:

QUERY_KEYS.CATEGORIES

QUERY_KEYS.MENU_ITEMS

QUERY_KEYS.CUSTOMERS

QUERY_KEYS.TABLES

QUERY_KEYS.ORDERS

QUERY_KEYS.EXPENSES

QUERY_KEYS.RETURNS

QUERY_KEYS.REPORTS

QUERY_KEYS.SETTINGS

---

## Business Constants

Business-related values should be defined as constants instead of hardcoded strings.

Examples:

ORDER_STATUS

- Hold
- Completed
- Returned

ORDER_TYPE

- DineIn
- TakeAway
- Delivery

PAYMENT_METHOD

- Cash
- Visa
- Instapay
- Wallet

---

## Storage Keys

Browser storage keys must be centralized.

Examples:

STORAGE_KEYS.ACCESS_TOKEN

STORAGE_KEYS.USER

STORAGE_KEYS.THEME

---

## Validation Constants

Frequently used validation rules should be reusable.

Examples:

Maximum Name Length

Maximum Notes Length

Phone Number Length

Password Minimum Length

---

## UI Constants

Reusable UI configuration should be centralized.

Examples:

Default Page Size

Maximum Upload Size

Accepted Image Types

Pagination Options

---

## Translation Keys

All visible UI text must come from next-intl translation files.

Navigation labels, page titles, button text, table headers, dialogs, validation messages, and notifications must never be hardcoded.

---

## Development Rule

If a value is expected to be reused in more than one place, it should be extracted into a constant instead of being duplicated.

This applies to:

- Routes
- Query Keys
- Order Statuses
- Payment Methods
- Validation Rules
- Storage Keys
- UI Configuration

# Styling

Use:

- Tailwind CSS
- shadcn/ui

Avoid inline styles.

Favor reusable UI primitives.

---

# User Feedback

Every user action must provide immediate visual feedback.

Examples:

- Success notification
- Error notification
- Loading state
- Disabled submit buttons during requests

The user should always understand the result of every action.

---

# API Consumption

The frontend communicates directly with the ASP.NET Web API.

TanStack Query manages:

- Fetching
- Caching
- Refetching
- Mutations

---

# Error Handling

Every API response must follow a unified response contract.

Validation errors should be displayed near their corresponding fields.

Unexpected errors should display a generic error message.

---

# Naming Conventions

Frontend

Components

PascalCase

Variables

camelCase

Hooks

useXxx

Backend

Classes

PascalCase

Methods

PascalCase

Properties

PascalCase

Private Fields

_camelCase

Database

Tables

Plural

Columns

PascalCase

---

# Entity Design

Every entity inherits from BaseEntity.

BaseEntity contains:

- Id
- CreatedAt
- UpdatedAt
- DeletedAt

Financial entities are immutable after completion.

---

# Soft Delete

Soft Delete is enabled for:

- Users
- Categories
- MenuItems
- Customers
- DeliveryRiders
- RestaurantTables

Soft Delete is NOT used for:

- Orders
- OrderItems
- Returns
- ReturnItems
- Expenses
- AuditLogs

---

# Snapshot Pricing

OrderItems always store UnitPrice.

Historical invoices must never be affected by future price changes.

---
# Printing Architecture

The system uses Windows GDI+ rendering for receipt generation.

Receipts are rendered as images instead of sending Arabic text directly to the printer.

Reason:

Thermal printers have limited Unicode and Arabic text support.

The application uses Windows rendering to guarantee correct Arabic shaping and RTL support.

---

## Printing Flow

Order Data

↓

Receipt Model

↓

Receipt Builder

↓

System.Drawing Bitmap

↓

Convert Bitmap to Bytes

↓

ESC/POS Commands

↓

Printer Service

↓

Windows Print Spooler

↓

Thermal Printer

---

# Printing Feature Structure

The printing module should be isolated as a separate feature.

Example:

Features/

Printing/

├── PrinterService.cs

├── ReceiptModels.cs

├── ReceiptRenderer.cs

├── CustomerReceiptBuilder.cs

├── KitchenReceiptBuilder.cs

├── CashierReceiptBuilder.cs

└── EscPosEncoder.cs

---

# Receipt Types

The system supports different receipt formats:

## Kitchen Receipt

Contains:

- Order Items
- Quantities
- Notes

Does not contain:

- Prices
- Payment Information


## Customer Receipt

Contains:

- Restaurant Information
- Invoice Number
- Date
- Items
- Prices
- Discount
- Service Charge
- Tax
- Total Amount
- Payment Method


## Cashier Receipt

Contains:

- Full invoice information
- Payment details
- Order summary

---

# Arabic Printing Rules

Arabic text must never be sent directly as printer text.

All Arabic content must be rendered using:

- System.Drawing
- Bitmap
- GDI+ Text Rendering

The renderer should use Arabic-supported fonts.

Recommended fonts:

- Tahoma
- Arial
- Segoe UI

RTL rendering must use:

StringFormatFlags.DirectionRightToLeft

---

# Printer Service

The printer service is responsible only for sending generated bytes to the printer.

It should not contain:

- Business logic
- Receipt formatting
- Order calculations
- Arabic handling

Its responsibility:

Bitmap/ESC-POS Bytes

↓

Windows Printer Spooler

---

# Printer Configuration

Printer settings should be configurable.

Example:

PrinterSettings

Contains:

- Printer Name
- Paper Width
- Copies
- Active Status

The application should not depend on a hardcoded printer name.

---

# Printing Rules

Printing happens only after order completion.

Hold orders must never be printed.

Cancelled orders must not be printed.

The same printer can be used for:

- Kitchen Copy
- Customer Copy
- Cashier Copy

---

# Printing Design Principles

- Keep receipt rendering independent from order logic.
- Use reusable receipt components.
- Support future printer changes without modifying order features.
- Keep Arabic rendering logic isolated.
# Clean Code Principles

- Keep methods small.
- Keep components focused.
- Avoid duplicated logic.
- Prefer composition over inheritance.
- Separate UI from business logic.
- Separate validation from controllers.

---

# Performance

Avoid unnecessary re-renders.

Use memoization only when needed.

Paginate large datasets.

Lazy load heavy screens when appropriate.

---

# Logging

Use Serilog for backend logging.

Use Audit Logs for business operations.

Application logs and Audit Logs serve different purposes.

---

# Git Workflow

Main

↓

Feature Branch

↓

Merge

Feature naming:

feature/orders

feature/customers

feature/reports

feature/settings

---

# Documentation

Every new feature should update:

- Functional Requirements (if behavior changes)
- Business Rules (if business logic changes)
- API Specification
- Database Design (if schema changes)

Documentation remains the single source of truth.

---

# Development Philosophy

- Business Rules drive the implementation.
- Domain Model drives the database.
- Database drives the API.
- API drives the frontend.
- Reusability over duplication.
- Simplicity over unnecessary abstraction.
- Build Version 1 for stability, not complexity.