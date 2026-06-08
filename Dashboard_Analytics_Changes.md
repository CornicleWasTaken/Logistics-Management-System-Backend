# Dashboard Analytics Changes Log

This document records the backend modifications implemented to support advanced frontend dashboard analytics, in accordance with the `Dashboard_Analytics_Plan.md`.

## 1. Schema Modifications (Database Models)

The following fields were added to existing Mongoose models to support new aggregations:

### `models/Order.js`
*   `totalAmount` (Number): Required field with a default of 0. Necessary to calculate Monthly Revenue.
*   `warehouseId` (ObjectId, ref: "Warehouse"): Optional reference for Hub-wise performance tracking.

### `models/Shipment.js`
*   `estimatedDeliveryDate` (Date): Necessary to determine if a shipment is delayed.
*   `actualDeliveryDate` (Date): Necessary to accurately log when the driver completed the delivery.
*   `warehouseId` (ObjectId, ref: "Warehouse"): Necessary for Hub-wise performance tracking.

### `models/Driver.js`
*   `completedDeliveries` (Number): Default of 0. Used for quick driver performance ranking.
*   `rating` (Number): Default of 5. Used for driver performance metrics.

## 2. API Additions

A new controller function `getDashboardAnalytics` was created in `controllers/dashboardController.js` to handle advanced MongoDB aggregations.

### New Endpoint
**Route:** `GET /api/dashboard/analytics`
**Access:** Protected, Requires Roles: `admin`, `manager`

#### Request Payload
*   **Method:** GET
*   **Headers:** `Authorization: Bearer <token>`
*   **Body:** None required.

#### Expected Response Schema
The API returns a JSON object with a `data` property containing the results of several aggregation pipelines.

```json
{
  "success": true,
  "data": {
    "monthlyRevenue": [
      {
        "revenue": 5000,
        "month": 1,
        "year": 2024
      }
    ],
    "deliveriesPerMonth": [
      {
        "deliveries": 120,
        "month": 1,
        "year": 2024
      }
    ],
    "driverPerformance": [
      {
        "completedDeliveries": 45,
        "driverName": "John Doe"
      }
    ],
    "delayedShipmentAnalysis": {
      "delayed": 15,
      "onTime": 85
    },
    "hubWisePerformance": [
      {
        "totalShipments": 300,
        "delivered": 290,
        "hub": "NY Central"
      }
    ]
  }
}
```

*   **`monthlyRevenue`:** Array of objects grouped by month and year, detailing the summed `$totalAmount` from uncancelled Orders.
*   **`deliveriesPerMonth`:** Array of objects grouped by month and year, detailing the count of delivered Shipments based on their `actualDeliveryDate`.
*   **`driverPerformance`:** Array of top 10 drivers (by completed deliveries), including their `driverName` fetched via a lookup, and their delivery count.
*   **`delayedShipmentAnalysis`:** Object containing a count of `delayed` shipments (either delivered late or currently overdue) versus `onTime` deliveries.
*   **`hubWisePerformance`:** Array of objects grouping total shipments and successfully delivered shipments by `warehouseId`, including the `hub` name fetched via a lookup.