# API Specification

Version: 1.0

Status: Approved

Base URL

/api/v1

---

# Authentication

## Login

POST /auth/login

Description

Authenticate user.

Request

{
    "username": "admin",
    "password": "********"
}

Response

{
    "token": "...",
    "user": {}
}

---

## Logout

POST /auth/logout

---

# Categories

GET /categories

GET /categories/{id}

POST /categories

PUT /categories/{id}

DELETE /categories/{id}

---

# Menu Items

GET /menu-items

GET /menu-items/{id}

POST /menu-items

PUT /menu-items/{id}

DELETE /menu-items/{id}

PATCH /menu-items/{id}/availability

---

# Restaurant Tables

GET /tables

GET /tables/{id}

POST /tables

PUT /tables/{id}

DELETE /tables/{id}

PATCH /tables/{id}/move-order

---

# Customers

GET /customers

GET /customers/{id}

GET /customers/phone/{phone}

POST /customers

PUT /customers/{id}

DELETE /customers/{id}

---

# Delivery Riders

GET /delivery-riders

GET /delivery-riders/{id}

POST /delivery-riders

PUT /delivery-riders/{id}

DELETE /delivery-riders/{id}

---

# Orders

GET /orders

GET /orders/{id}

POST /orders

PUT /orders/{id}

DELETE /orders/{id}

---

# Hold Orders

GET /orders/hold


PATCH /orders/{id}/resume

DELETE /orders/{id}

---

# Order Items

POST /orders/{id}/items

PUT /orders/{id}/items/{itemId}

DELETE /orders/{id}/items/{itemId}

---

# Discounts

PATCH /orders/{id}/discount

DELETE /orders/{id}/discount

---

# Service Charge

PATCH /orders/{id}/service-charge

DELETE /orders/{id}/service-charge

---

# Payment

PATCH /orders/{id}/payment

PATCH /orders/{id}/complete

---

# Returns

GET /returns

GET /returns/{id}

POST /returns

---

# Expenses

GET /expenses

GET /expenses/{id}

POST /expenses

PUT /expenses/{id}

DELETE /expenses/{id}

---

# Reports

GET /reports/daily

GET /reports/monthly

GET /reports/custom

GET /reports/delivery

GET /reports/expenses

GET /reports/returns

---

# Daily Closing

GET /daily-closing

---

# Printing

POST /orders/{id}/print

---

# Audit Logs

GET /audit-logs

GET /audit-logs/{id}


# Settings

GET /settings

PUT /settings
