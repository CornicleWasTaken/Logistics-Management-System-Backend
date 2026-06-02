# Logistics Management System (LOMS) Backend Documentation

## 1. Project Overview

**Project Name:** Logistics Management System (LOMS)
LOMS backend is designed to manage logistics operations including:
* User Authentication & Authorization
* Inventory Management
* Order Processing
* Shipment Tracking
* Dashboard Analytics
The backend follows a modular architecture using REST APIs and MVC design pattern.
---
# 2. Technology Stack

| Technology         | Usage               |
| ------------------ | ------------------- |
| Node.js            | Runtime Environment |
| Express.js         | Backend Framework   |
| MongoDB            | Database            |
| Mongoose           | ODM for MongoDB     |
| JWT                | Authentication      |
| bcryptjs           | Password Hashing    |
| Helmet             | Security Middleware |
| Morgan             | Logging             |
| Express Rate Limit | API Protection      |
| ES Modules         | Module System       |

---

# 3. Project Structure

```plaintext
loms-backend/

├── config/
│   └── db.js

├── controllers/
│   ├── authController.js
│   ├── inventoryController.js
│   ├── orderController.js
│   ├── shipmentController.js
│   └── dashboardController.js

├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js

├── models/
│   ├── User.js
│   ├── Inventory.js
│   ├── Order.js
│   └── Shipment.js

├── routes/
│   ├── authRoutes.js
│   ├── inventoryRoutes.js
│   ├── orderRoutes.js
│   ├── shipmentRoutes.js
│   ├── dashboardRoutes.js
│   └── testRoutes.js

├── .env
├── package.json
├── server.js
```

---

# 4. Architecture Flow

```plaintext
Client Request
      ↓
Routes
      ↓
Middleware Layer
(Auth / Roles / Validation)
      ↓
Controllers
      ↓
Models
      ↓
MongoDB
      ↓
Response
```

---

# 5. Database Design (MongoDB + Mongoose)
MongoDB is used as database with Mongoose schemas.

---
## User Schema

File:

```plaintext
models/User.js
```

Fields:

```plaintext
name        : String
email       : String (unique)
password    : String
role        : admin / user
timestamps
```

Purpose:

```plaintext
Authentication
Authorization
Role Management
```
---
## Inventory Schema
File:

```plaintext
models/Inventory.js
```
Fields:
```plaintext
itemName
category
quantity
warehouse
price
timestamps
```
Purpose:

```plaintext
Stock Management
Inventory Tracking
```
---
## Order Schema

File:
```plaintext
models/Order.js
```
Fields:
```plaintext
customerName
product
quantity
deliveryAddress
status
timestamps
```
Status Values:

```plaintext
Pending
Packed
Dispatched
Delivered
```
Purpose:

```plaintext
Order Processing
Order Tracking
```
---

## Shipment Schema
File:
```plaintext
models/Shipment.js
```
Fields:
```plaintext
trackingId
orderId (ObjectId Ref)
currentLocation
status
timestamps
```
Relationship:

```plaintext
Shipment
   ↓
orderId
   ↓
Order Collection
```

Purpose:
```plaintext
Shipment Tracking
Order Mapping
```
---

# 6. Authentication System
## Register API

```http
POST /api/auth/register
```
Features:
```plaintext
Password Hashing
Duplicate User Validation
Role Support
```

---
## Login API

```http
POST /api/auth/login
```

Flow:

```plaintext
Verify User
↓
Compare Password
↓
Generate JWT
↓
Return Token
```

Protected APIs require:

```plaintext
Authorization: Bearer TOKEN
```

---

# 7. Role Based Access

Roles Implemented:

```plaintext
Admin
User
```

Access Flow:

```plaintext
Token
 ↓
authMiddleware
 ↓
roleMiddleware
 ↓
Authorized Access
```

---

# 8. Inventory Module

APIs:

### Create Inventory

```http
POST /api/inventory
```

### Get Inventory

```http
GET /api/inventory
```

### Update Inventory

```http
PUT /api/inventory/:id
```

### Delete Inventory

```http
DELETE /api/inventory/:id
```

---

# 9. Order Module

Workflow:

```plaintext
Create Order
   ↓
Find Product
   ↓
Validate Quantity
   ↓
Reduce Inventory
   ↓
Create Order
```

APIs:

```http
POST /api/orders

GET /api/orders

PUT /api/orders/:id

DELETE /api/orders/:id
```

Additional Features:

```plaintext
Search
Pagination
Filtering
Inventory Auto Reduction
```

Examples:

```http
GET /api/orders?page=1&limit=5

GET /api/orders?keyword=Aman

GET /api/orders?status=Pending
```

---

# 10. Shipment Module

Workflow:

```plaintext
Order Created
     ↓
Shipment Generated
     ↓
Tracking Updates
     ↓
Delivery Completed
```

APIs:

```http
POST /api/shipments

GET /api/shipments

PUT /api/shipments/:id

DELETE /api/shipments/:id
```

---

# 11. Dashboard Analytics

API:

```http
GET /api/dashboard/stats
```

Metrics:

```plaintext
Total Orders
Total Inventory
Total Shipments
Delivered Orders
Pending Orders
Low Stock Count
```

---

# 12. Security Features

Implemented:

```plaintext
JWT Authentication
Password Hashing
Helmet Security
Role Based Access
Rate Limiting
Protected Routes
Error Handling Middleware
```

---

# 13. Environment Variables

`.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret
```

---

# 14. Installation Guide

Install Dependencies:

```bash
npm install
```

Run Project:

```bash
npm run dev
```

---

# 15. API Testing Flow

```plaintext
Register User
    ↓
Login
    ↓
Inventory APIs
    ↓
Orders APIs
    ↓
Shipment APIs
    ↓
Dashboard APIs
```

---

# 16. Current Project Status

Completed:

```plaintext
Authentication Module
Inventory CRUD
Order CRUD
Shipment Management
Dashboard Analytics
MongoDB Integration
ES Module Migration
Security Middleware
```

Pending:

```plaintext
Frontend Integration
Deployment
Swagger Documentation
Advanced Validation
```

Ye documentation structure professional bhi hai aur onboarding-friendly bhi. Isko repo ke root me `README.md` + detailed version `PROJECT_DOCUMENTATION.md` me rakh sakti ho.
