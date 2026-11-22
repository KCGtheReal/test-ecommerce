# 🌐 REST API SPECIFICATION

## 1. Overview
This document specifies the RESTful API contract for the e-commerce application corresponding to `លំហាត់អនុវត្ត.pdf` (Practical Exercises 1, 2, 3 & 4).

All requests and responses use `application/json` content type.

---

## 2. API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all 4 products with category details |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/orders` | Create a new order (Checkout submission) |
| `GET` | `/api/orders/:orderNumber` | Retrieve order confirmation details by Order Number |
| `GET` | `/api/orders` | Retrieve list of all orders |
| `GET` | `/api/schema` | Retrieve database schema metadata for the interactive ERD page |

---

## 3. Endpoints Details

### 3.1 `GET /api/products`
Retrieves all available products matching Practical Exercise 1:
- Laptop ($650)
- Mouse ($15)
- Keyboard ($25)
- Monitor ($120)

#### Response: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "slug": "laptop",
      "description": "High performance laptop with ultra-fast processor and crystal clear retina display.",
      "price": 650.0,
      "imageUrl": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "stock": 50,
      "category": {
        "id": 1,
        "name": "Computers",
        "slug": "computers"
      }
    },
    {
      "id": 2,
      "name": "Mouse",
      "slug": "mouse",
      "description": "Ergonomic precision optical wireless mouse with silent clicks.",
      "price": 15.0,
      "imageUrl": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      "stock": 120,
      "category": {
        "id": 2,
        "name": "Accessories",
        "slug": "accessories"
      }
    },
    {
      "id": 3,
      "name": "Keyboard",
      "slug": "keyboard",
      "description": "Mechanical tactile RGB gaming keyboard with customizable hot-swappable switches.",
      "price": 25.0,
      "imageUrl": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "stock": 80,
      "category": {
        "id": 2,
        "name": "Accessories",
        "slug": "accessories"
      }
    },
    {
      "id": 4,
      "name": "Monitor",
      "slug": "monitor",
      "description": "27-inch 4K IPS bezel-less display with 144Hz refresh rate and HDR color accuracy.",
      "price": 120.0,
      "imageUrl": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      "stock": 35,
      "category": {
        "id": 3,
        "name": "Displays",
        "slug": "displays"
      }
    }
  ]
}
```

---

### 3.2 `POST /api/orders`
Creates an order when the customer clicks "Place Order" in Practical Exercise 2.
- Creates or retrieves existing `Customer` record based on email.
- Generates a sequential `orderNumber` formatted as `ORD-0001`, `ORD-0002`, etc.
- Calculates server-side subtotal, applies shipping cost ($0 for Free, $9 for Express), and verifies pricing.
- Stores `OrderItem` records linking products and snapshots unit price.
- Returns status `"Pending"` matching Slide 28.

#### Request Body:
```json
{
  "customer": {
    "firstName": "Sokha",
    "lastName": "Chan",
    "email": "sokha.chan@example.com",
    "phone": "+855 12 345 678",
    "address": "#123, St. 2004",
    "city": "Phnom Penh",
    "state": "Phnom Penh",
    "zipCode": "12000"
  },
  "shippingMethod": "express",
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 2
    }
  ]
}
```

#### Field Validation Rules:
- `customer.firstName`: Required, string, min 1 char.
- `customer.lastName`: Required, string, min 1 char.
- `customer.email`: Required, valid email format.
- `customer.phone`: Required, valid telephone format.
- `customer.address`: Required, string, min 3 chars.
- `customer.city`: Required, string.
- `customer.state`: Required, string.
- `customer.zipCode`: Required, string.
- `shippingMethod`: Required, enum: `"free"` | `"express"`.
- `items`: Required, array with at least 1 item; `quantity >= 1`.

#### Response: `201 Created`
```json
{
  "success": true,
  "message": "Order Placed Successfully!",
  "data": {
    "id": 1,
    "orderNumber": "ORD-0001",
    "customer": {
      "id": 1,
      "firstName": "Sokha",
      "lastName": "Chan",
      "email": "sokha.chan@example.com",
      "phone": "+855 12 345 678",
      "address": "#123, St. 2004",
      "city": "Phnom Penh",
      "state": "Phnom Penh",
      "zipCode": "12000"
    },
    "status": "Pending",
    "subtotal": 680.0,
    "shippingMethod": "Express Shipping ($9)",
    "shippingCost": 9.0,
    "tax": 0.0,
    "total": 689.0,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Laptop",
        "price": 650.0,
        "quantity": 1,
        "total": 650.0
      },
      {
        "id": 2,
        "productId": 2,
        "productName": "Mouse",
        "price": 15.0,
        "quantity": 2,
        "total": 30.0
      }
    ],
    "createdAt": "2026-11-22T07:15:00.000Z"
  }
}
```

#### Response: `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "First name is required",
    "Valid email is required"
  ]
}
```

---

### 3.3 `GET /api/orders/:orderNumber`
Fetches full order details by order number (e.g. `ORD-0001`) for the Practical Exercise 3 Order Confirmation page.

#### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD-0001",
    "status": "Pending",
    "createdAt": "2026-11-22T07:15:00.000Z",
    "customerName": "Sokha Chan",
    "customer": {
      "firstName": "Sokha",
      "lastName": "Chan",
      "email": "sokha.chan@example.com",
      "phone": "+855 12 345 678",
      "address": "#123, St. 2004, Phnom Penh, 12000"
    },
    "shippingMethod": "Express Shipping ($9)",
    "shippingCost": 9.0,
    "subtotal": 680.0,
    "tax": 0.0,
    "total": 689.0,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "name": "Laptop",
        "price": 650.0,
        "quantity": 1,
        "total": 650.0
      },
      {
        "id": 2,
        "productId": 2,
        "name": "Mouse",
        "price": 15.0,
        "quantity": 2,
        "total": 30.0
      }
    ]
  }
}
```

#### Response: `404 Not Found`
```json
{
  "success": false,
  "error": "Order ORD-0001 not found"
}
```

---

### 3.4 `GET /api/orders`
Retrieves all orders in reverse chronological order (used for orders list / order history inspection).

#### Response: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-0001",
      "customerName": "Sokha Chan",
      "email": "sokha.chan@example.com",
      "total": 689.0,
      "itemCount": 2,
      "status": "Pending",
      "createdAt": "2026-11-22T07:15:00.000Z"
    }
  ]
}
```

---

### 3.5 `GET /api/schema`
Provides schema metadata and tables dictionary for Exercise 4 interactive viewer page (`/erd`).

#### Response: `200 OK`
```json
{
  "success": true,
  "tables": [
    {
      "name": "customers",
      "label": "Customers",
      "columns": [
        { "name": "id", "type": "INTEGER", "pk": true },
        { "name": "firstName", "type": "TEXT" },
        { "name": "lastName", "type": "TEXT" },
        { "name": "email", "type": "TEXT", "unique": true },
        { "name": "phone", "type": "TEXT" },
        { "name": "address", "type": "TEXT" },
        { "name": "city", "type": "TEXT" },
        { "name": "state", "type": "TEXT" },
        { "name": "zipCode", "type": "TEXT" },
        { "name": "createdAt", "type": "DATETIME" },
        { "name": "updatedAt", "type": "DATETIME" }
      ]
    },
    {
      "name": "categories",
      "label": "Categories",
      "columns": [
        { "name": "id", "type": "INTEGER", "pk": true },
        { "name": "name", "type": "TEXT", "unique": true },
        { "name": "slug", "type": "TEXT", "unique": true },
        { "name": "description", "type": "TEXT" }
      ]
    },
    {
      "name": "products",
      "label": "Products",
      "columns": [
        { "name": "id", "type": "INTEGER", "pk": true },
        { "name": "name", "type": "TEXT" },
        { "name": "slug", "type": "TEXT", "unique": true },
        { "name": "price", "type": "REAL" },
        { "name": "stock", "type": "INTEGER" },
        { "name": "categoryId", "type": "INTEGER", "fk": "categories.id" }
      ]
    },
    {
      "name": "orders",
      "label": "Orders",
      "columns": [
        { "name": "id", "type": "INTEGER", "pk": true },
        { "name": "orderNumber", "type": "TEXT", "unique": true },
        { "name": "customerId", "type": "INTEGER", "fk": "customers.id" },
        { "name": "status", "type": "TEXT" },
        { "name": "subtotal", "type": "REAL" },
        { "name": "shippingMethod", "type": "TEXT" },
        { "name": "shippingCost", "type": "REAL" },
        { "name": "tax", "type": "REAL" },
        { "name": "total", "type": "REAL" },
        { "name": "createdAt", "type": "DATETIME" }
      ]
    },
    {
      "name": "order_items",
      "label": "Order Items",
      "columns": [
        { "name": "id", "type": "INTEGER", "pk": true },
        { "name": "orderId", "type": "INTEGER", "fk": "orders.id" },
        { "name": "productId", "type": "INTEGER", "fk": "products.id" },
        { "name": "quantity", "type": "INTEGER" },
        { "name": "price", "type": "REAL" },
        { "name": "total", "type": "REAL" }
      ]
    }
  ]
}
```
