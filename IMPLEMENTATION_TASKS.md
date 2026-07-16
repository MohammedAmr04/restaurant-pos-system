# Implementation Tasks — Restaurant POS System V1

---

# Epic 1 — Project Setup

- [x] Create Backend Solution (.NET Framework 4.8)
- [x] Configure ASP.NET Web API 2
- [x] Configure OWIN Self Host
- [x] Configure SQLite Database
- [x] Configure Dapper ORM
- [x] Configure SQL Script Based Migrations
- [x] Configure JWT Authentication
- [x] Configure FluentValidation
- [x] Configure Serilog Logging
- [x] Create Feature-Based Folder Structure
- [x] Create Shared Infrastructure (BaseEntity, DB Context)
- [x] Create Next.js Application with TypeScript
- [x] Configure Tailwind CSS
- [x] Configure shadcn/ui
- [x] Configure TanStack Query
- [x] Configure React Hook Form + Zod
- [x] Configure Lucide React Icons
- [x] Configure next-intl (Arabic RTL)
- [x] Configure Static Export
- [x] Configure wwwroot integration
- [x] Create Reusable Common Components (AppButton, AppInput, AppSelect, AppDialog, AppTable, etc.)
- [x] Create Frontend Constants (Routes, Query Keys, Order Status, Payment Methods, Storage Keys)
- [x] Create Arabic Translation Files

---

# Epic 2 — Authentication

## Backend
- [x] Create Users Table SQL Script
- [x] Create User Entity Model
- [x] Create Auth DTOs (LoginRequest, LoginResponse, UserDto)
- [x] Create Auth Interfaces (IAuthService, IUserRepository)
- [x] Create Auth Validators (LoginValidator)
- [x] Create Auth Repository
- [x] Create Auth Service
- [x] Create Auth Controller (Login, Logout)
- [x] Implement JWT Token Generation
- [x] Implement Password Hashing
- [x] Seed Default Admin User
- [x] Add Audit Log for Login/Logout

## Frontend
- [x] Create Login Page
- [x] Create Login Form with Validation
- [x] Create Auth Service (API calls)
- [x] Create Auth Hooks (useLogin, useLogout, useAuth)
- [x] Implement Token Storage
- [x] Implement Auth State Management
- [x] Add Protected Route Handling
- [x] Create Logout Functionality

---

# Epic 3 — Categories

## Backend
- [x] Create Categories Table SQL Script
- [x] Create Category Entity Model
- [x] Create Category DTOs (CreateCategoryDto, UpdateCategoryDto, CategoryDto)
- [x] Create Category Interfaces (ICategoryService, ICategoryRepository)
- [x] Create Category Validators
- [x] Create Category Repository
- [x] Create Category Service
- [x] Create Category Controller (CRUD)
- [x] Add Audit Log for Category Operations

## Frontend
- [x] Create Categories List Page
- [x] Create Categories Table Component
- [x] Create Category Form Dialog
- [x] Create Category Validation (Zod Schema)
- [x] Create Categories Service (API calls)
- [x] Create Categories Hooks (useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory)
- [x] Add Translations for Categories Module

---

# Epic 4 — Menu Items

## Backend
- [x] Create MenuItems Table SQL Script
- [x] Create MenuItem Entity Model
- [x] Create MenuItem DTOs
- [x] Create MenuItem Interfaces
- [x] Create MenuItem Validators
- [x] Create MenuItem Repository
- [x] Create MenuItem Service
- [x] Create MenuItem Controller (CRUD + Availability Toggle)
- [x] Add Audit Log for Menu Item Operations

## Frontend
- [x] Create Menu Items List Page
- [x] Create Menu Items Table Component
- [x] Create Menu Item Form Dialog
- [x] Create Menu Item Validation (Zod Schema)
- [x] Create Menu Items Service (API calls)
- [x] Create Menu Items Hooks
- [x] Add Translations for Menu Items Module

---

# Epic 5 — Tables

## Backend
- [x] Create RestaurantTables Table SQL Script
- [x] Create Table Entity Model
- [x] Create Table DTOs
- [x] Create Table Interfaces
- [x] Create Table Validators
- [x] Create Table Repository
- [x] Create Table Service
- [x] Create Table Controller (CRUD + Move Order)
- [x] Implement Table Availability Logic

## Frontend
- [x] Create Tables List Page
- [x] Create Tables Grid/Visual Component
- [x] Create Table Form Dialog
- [x] Create Table Validation (Zod Schema)
- [x] Create Tables Service (API calls)
- [x] Create Tables Hooks
- [x] Add Translations for Tables Module

---

# Epic 6 — Customers

## Backend
- [x] Create Customers Table SQL Script
- [x] Create Customer Entity Model
- [x] Create Customer DTOs
- [x] Create Customer Interfaces
- [x] Create Customer Validators
- [x] Create Customer Repository
- [x] Create Customer Service
- [x] Create Customer Controller (CRUD + Search by Phone)
- [x] Add Audit Log for Customer Operations

## Frontend
- [x] Create Customers List Page
- [x] Create Customers Table Component
- [x] Create Customer Form Dialog
- [x] Create Customer Validation (Zod Schema)
- [x] Create Customers Service (API calls)
- [x] Create Customers Hooks
- [x] Add Translations for Customers Module

---

# Epic 7 — Delivery Riders

## Backend
- [x] Create DeliveryRiders Table SQL Script
- [x] Create DeliveryRider Entity Model
- [x] Create DeliveryRider DTOs
- [x] Create DeliveryRider Interfaces
- [x] Create DeliveryRider Validators
- [x] Create DeliveryRider Repository
- [x] Create DeliveryRider Service
- [x] Create DeliveryRider Controller (CRUD)

## Frontend
- [x] Create Delivery Riders List Page
- [x] Create Delivery Riders Table Component
- [x] Create Delivery Rider Form Dialog
- [x] Create Delivery Rider Validation (Zod Schema)
- [x] Create Delivery Riders Service (API calls)
- [x] Create Delivery Riders Hooks
- [x] Add Translations for Delivery Riders Module

---

# Epic 8 — Orders (Core)

## Backend
- [x] Create Orders Table SQL Script
- [x] Create OrderItems Table SQL Script
- [x] Create Order Entity Model
- [x] Create OrderItem Entity Model
- [x] Create Order DTOs (CreateOrderDto, OrderDto, OrderItemDto)
- [x] Create Order Interfaces
- [x] Create Order Validators
- [x] Create Order Repository
- [x] Create Order Service
- [x] Create Order Controller (CRUD)
- [x] Implement Invoice Number Generation (Daily Reset)
- [x] Implement Order Type Business Rules (DineIn requires table, TakeAway/Delivery require customer, Delivery requires rider)

## Frontend
- [x] Create POS (Sales) Page
- [x] Create Order Type Selector Component
- [x] Create Menu Items Grid for POS
- [x] Create Order Summary Component
- [x] Create Order Items List Component
- [x] Create Order Validation (Zod Schema)
- [x] Create Orders Service (API calls)
- [x] Create Orders Hooks
- [x] Add Translations for Orders Module

---

# Epic 8.1 — Hold Orders

## Backend
- [x] Implement Hold Order Creation
- [x] Implement Hold Order Update
- [x] Implement Hold Order Delete
- [x] Implement Hold Order Resume
- [x] Implement Get Hold Orders List
- [x] Implement Table Occupation on Hold
- [x] Implement Table Release on Complete/Delete

## Frontend
- [x] Create Hold Orders List View
- [x] Create Hold Order Resume Functionality
- [x] Create Hold Order Delete Confirmation
- [x] Implement Table-based Order Loading

---

# Epic 8.2 — Order Items

## Backend
- [x] Implement Add Item to Order
- [x] Implement Update Order Item (Quantity, Notes)
- [x] Implement Remove Item from Order
- [x] Implement Snapshot Pricing (Store UnitPrice)
- [x] Calculate Order Subtotal

## Frontend
- [x] Create Add Item to Order Flow
- [x] Create Order Item Quantity Controls
- [x] Create Order Item Notes Input
- [x] Create Remove Item Confirmation

---

# Epic 8.3 — Discounts

## Backend
- [x] Implement Apply Fixed Amount Discount
- [x] Implement Apply Percentage Discount
- [x] Implement Remove Discount
- [x] Calculate Discounted Total

## Frontend
- [x] Create Discount Dialog Component
- [x] Create Discount Type Selector
- [x] Create Discount Amount Input
- [x] Display Applied Discount in Order Summary

---

# Epic 8.4 — Service Charge

## Backend
- [x] Implement Apply Service Charge
- [x] Implement Remove Service Charge
- [x] Calculate Service Charge Amount
- [x] Read Service Charge Setting

## Frontend
- [x] Create Service Charge Toggle
- [x] Display Service Charge in Order Summary

---

# Epic 8.5 — Payment & Order Completion

## Backend
- [x] Implement Payment Method Selection
- [x] Implement Order Completion
- [x] Calculate Grand Total (Subtotal - Discount + ServiceCharge + Tax)
- [x] Set PaymentMethod and PaidAmount
- [x] Update Order Status to Completed
- [x] Generate Invoice Number
- [x] Set BusinessDate
- [x] Release Table on Completion (DineIn)

## Frontend
- [x] Create Payment Method Selector
- [x] Create Order Completion Flow
- [x] Create Invoice Preview
- [x] Display Grand Total Calculation

---

# Epic 9 — Returns

## Backend
- [x] Create Returns Table SQL Script
- [x] Create ReturnItems Table SQL Script
- [x] Create Return Entity Model
- [x] Create ReturnItem Entity Model
- [x] Create Return DTOs
- [x] Create Return Interfaces
- [x] Create Return Validators
- [x] Create Return Repository
- [x] Create Return Service
- [x] Create Return Controller
- [x] Implement Invoice Search for Returns
- [x] Implement Partial Return
- [x] Implement Full Return
- [x] Calculate Refund Amount
- [x] Add Audit Log for Returns

## Frontend
- [x] Create Returns Page
- [x] Create Invoice Search Component
- [x] Create Return Items Selection
- [x] Create Return Quantity Input
- [x] Create Return Confirmation Dialog
- [x] Create Returns Service (API calls)
- [x] Create Returns Hooks
- [x] Add Translations for Returns Module

---

# Epic 10 — Expenses

## Backend
- [x] Create Expenses Table SQL Script
- [x] Create Expense Entity Model
- [x] Create Expense DTOs
- [x] Create Expense Interfaces
- [x] Create Expense Validators
- [x] Create Expense Repository
- [x] Create Expense Service
- [x] Create Expense Controller (CRUD)
- [x] Add Audit Log for Expense Operations

## Frontend
- [x] Create Expenses List Page
- [x] Create Expenses Table Component
- [x] Create Expense Form Dialog
- [x] Create Expense Validation (Zod Schema)
- [x] Create Expenses Service (API calls)
- [x] Create Expenses Hooks
- [x] Add Translations for Expenses Module

---

# Epic 11 — Reports

## Backend
- [x] Create Reports Service
- [x] Create Reports Controller
- [x] Implement Daily Sales Report
- [x] Implement Monthly Sales Report
- [x] Implement Custom Date Range Report
- [x] Implement Delivery Report
- [x] Implement Expense Report
- [x] Implement Returns Report

## Frontend
- [x] Create Reports Page
- [x] Create Report Type Selector
- [x] Create Daily Sales Report View
- [x] Create Monthly Sales Report View
- [x] Create Custom Report View
- [x] Create Delivery Report View
- [x] Create Expense Report View
- [x] Create Returns Report View
- [x] Create Report Filters Component
- [x] Create Reports Service (API calls)
- [x] Create Reports Hooks
- [x] Add Translations for Reports Module

---

# Epic 12 — Daily Closing

## Backend
- [x] Create DailyClosing Table SQL Script
- [x] Create DailyClosing Entity Model
- [x] Create DailyClosing DTOs
- [x] Create DailyClosing Service
- [x] Create DailyClosing Controller
- [x] Calculate Daily Summary
- [x] Calculate Expected Cash
- [x] Save Closing Record

## Frontend
- [x] Create Daily Closing Page
- [x] Create Daily Summary Display
- [x] Create Cash Count Input
- [x] Create Closing Confirmation
- [x] Create Daily Closing Service (API calls)
- [x] Create Daily Closing Hooks
- [x] Add Translations for Daily Closing Module

---

# Epic 13 — Printing

## Backend
- [x] Create PrinterService.cs
- [x] Create ReceiptModels.cs
- [x] Create ReceiptRenderer.cs
- [x] Create CustomerReceiptBuilder.cs
- [x] Create KitchenReceiptBuilder.cs
- [x] Create CashierReceiptBuilder.cs
- [x] Create EscPosEncoder.cs
- [x] Implement Arabic GDI+ Rendering
- [x] Implement Bitmap to Bytes Conversion
- [x] Implement Windows Print Spooler Integration
- [x] Create Print Trigger on Order Completion
- [x] Add Printer Configuration Settings

## Frontend
- [x] Create Print Trigger after Order Completion
- [x] Display Print Status Feedback

---

# Epic 14 — Settings

## Backend
- [x] Create Settings Table SQL Script
- [x] Create Settings Entity Model
- [x] Create Settings DTOs
- [x] Create Settings Service
- [x] Create Settings Controller (Get, Update)
- [x] Seed Default Settings
- [x] Add Audit Log for Settings Changes

## Frontend
- [x] Create Settings Page
- [x] Create Restaurant Information Form
- [x] Create Tax Configuration Form
- [x] Create Service Charge Configuration Form
- [x] Create Receipt Settings Form
- [x] Create Settings Service (API calls)
- [x] Create Settings Hooks
- [x] Add Translations for Settings Module

---

# Epic 15 — Audit Log

## Backend
- [x] Create AuditLogs Table SQL Script
- [x] Create AuditLog Entity Model
- [x] Create AuditLog DTOs
- [x] Create AuditLog Service
- [x] Create AuditLog Controller (Get, GetById)
- [x] Implement Audit Log Recording for All Operations

## Frontend
- [x] Create Audit Logs List Page
- [x] Create Audit Logs Table Component
- [x] Create Audit Log Filters
- [x] Create Audit Logs Service (API calls)
- [x] Create Audit Logs Hooks
- [x] Add Translations for Audit Logs Module

---

# Epic 16 — Dashboard

## Backend
- [x] Create Dashboard Summary Endpoint

## Frontend
- [x] Create Dashboard Page
- [x] Create Module Navigation Cards
- [x] Add Translations for Dashboard

---

# Epic 17 — Final Integration & Testing

- [x] Integrate Frontend Build with Backend wwwroot
- [x] Verify All API Endpoints
- [x] Verify All Frontend Pages
- [x] Verify RTL Layout
- [x] Verify Arabic Translations
- [x] Verify Print Functionality
- [x] Verify Reports Accuracy
- [x] Verify Authentication Flow
- [x] Verify Audit Log Coverage
- [x] Build Backend Successfully
- [x] Build Frontend Successfully
- [x] Final Code Review
