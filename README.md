# Logistics Management System (LOMS) Backend Documentation
# 1. Project Overview
**Project Name:** Logistics Management System (LOMS)
LOMS backend is a scalable logistics platform designed for managing:

* Authentication & Authorization
* Inventory Management
* Order Processing
* Shipment Management
* Dispatch Assignment
* Driver & Vehicle Management
* Real-Time Shipment Tracking
* Route Optimization
* Dashboard Analytics
* Warehouse Operations

The backend follows:
* REST API Architecture
* MVC Pattern
* Modular Structure
* JWT Authentication
* Role Based Access Control
* Real-Time Socket Architecture

---
# 2. Technology Stack

| Technology         | Usage              |
| ------------------ | ------------------ |
| Node.js            | Runtime            |
| Express.js         | Backend Framework  |
| MongoDB            | Database           |
| Mongoose           | ODM                |
| JWT                | Authentication     |
| bcryptjs           | Password Hashing   |
| Socket.IO          | Realtime Tracking  |
| Geolib             | Route Optimization |
| Helmet             | Security           |
| Morgan             | Logging            |
| Express Rate Limit | Protection         |
| ES Modules         | Module System      |

---

# 3. Project Structure

```plaintext
loms-backend/
config/
controllers/
middleware/
models/
routes/
sockets/
utils/
.env
server.js
package.json
```
---

# 4. Architecture Flow

```plaintext
Client
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

Realtime Tracking:

Driver Device
   ↓
Socket Events
   ↓
Tracking Rooms
   ↓
Customers / Admin Dashboard
```
---
# 5. Modules Implemented

## Authentication Module

Endpoints:

POST /api/auth/register
POST /api/auth/login

Features:
* Password hashing
* JWT generation
* Protected routes
* Role support
---
## Inventory Module

Endpoints:
POST /api/inventory
GET /api/inventory
GET /api/inventory/:id/history
PUT /api/inventory/:id
DELETE /api/inventory/:id

Features:
* Inventory CRUD
* Low stock monitoring
* Inventory change history
* Audit trail for quantity and metadata changes

---

## Notifications Module

Endpoints:

GET /api/notifications
POST /api/notifications/send
PUT /api/notifications/:id/read

Features:
* Notification send support
* Inbox read / mark-as-read support

---

## Messages Module

Endpoints:

POST /api/messages
GET /api/messages/customer/:customerId
GET /api/messages/shipment/:shipmentId

Features:
* Customer messaging history
* Shipment thread retrieval
* Message creation and storage

---

## Orders Module

Endpoints:

POST /api/orders
GET /api/orders
PUT /api/orders/:id
DELETE /api/orders/:id

Features:
* Inventory reduction
* Status management
* Pagination ready
* Filtering ready

---
## Shipment Module

Endpoints:
POST /api/shipments
GET /api/shipments
PUT /api/shipments/:id
DELETE /api/shipments/:id
PUT /api/shipments/:id/complete
GET /api/shipments/tracking/:trackingId

Features:

* Shipment lifecycle
* Location history
* Tracking ID support
* Delivery completion workflow

---

## Dispatch Module
Endpoints:

POST /api/shipments/:id/assign
GET /api/shipments/:id/tracking

Features:

* Driver assignment
* Vehicle assignment
* Duplicate assignment prevention
* Delivered shipment protection
* Availability validation
---

## Driver Module

Endpoints:

GET /api/drivers
POST /api/drivers
PUT /api/drivers/:id
DELETE /api/drivers/:id

Statuses:

available
assigned
resting
offline

---

## Vehicle Module

Endpoints:
GET /api/vehicles
POST /api/vehicles
PUT /api/vehicles/:id
DELETE /api/vehicles/:id

---

## Warehouse Module

Endpoints:
GET /api/warehouses
POST /api/warehouses
PUT /api/warehouses/:id
DELETE /api/warehouses/:id
POST /api/warehouses/transfer

Features:

* Warehouse inventory allocation
* Inventory transfer support
---

# 6. Real-Time Tracking System

Socket Connection:
```text
http://localhost:5000
```
Authentication:
```js
auth:{
 token:"JWT_TOKEN"
}
```
Events:

subscribe_tracking
update_location
location_updated

Features:
* JWT authenticated sockets
* Tracking rooms
* Live location updates
* Tracking history persistence
* GeoJSON coordinates
---

# 7. Route Optimization

Endpoint:
POST /api/dispatch/optimize-route

Uses:
* Geolib
* Distance calculations
* ETA estimation
* Optimized delivery sequence
---

# 8. Dashboard Analytics

Endpoint:
GET /api/dashboard/stats
-*
Metrics:
* Total Orders
* Inventory Count
* Shipment Count
* Driver Availability
* Vehicle Availability
* Delivered Shipments
* Low Stock Count
---
# 9. Security Features

Implemented:
* JWT Authentication
* Password Hashing
* Role Based Access
* Helmet
* Rate Limiting
* Protected APIs
* Error Middleware
---
# 10. Environment Variables

```env
PORT=5000
MONGO_URI=YOUR_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET
```
---
# 11. Installation
Install:
```bash
npm install
```
Run:
```bash
npm run dev
```
---
# 12. Current Status
Completed:
Authentication
Orders
Inventory
Shipments
Dispatch
Realtime Tracking
Dashboard
Route Optimization
Warehouse Support
Driver Management
Vehicle Management
