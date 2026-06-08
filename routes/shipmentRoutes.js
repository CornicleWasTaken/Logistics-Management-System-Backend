import { Router } from "express";

import {
  createShipment,
  getShipments,
  updateShipment,
  deleteShipment,
  completeShipment,
  getShipmentByTrackingId,
} from "../controllers/shipmentController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// CREATE
router.post("/", protect, authorizeRoles("manager", "admin"), createShipment);

// GET
router.get("/", protect, authorizeRoles("manager", "admin", "driver", "customer"), getShipments);

// UPDATE
router.put("/:id", protect, authorizeRoles("manager", "admin", "driver"), updateShipment);

// DELETE
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteShipment);
// tracking id
router.get("/tracking/:trackingId", protect, authorizeRoles("customer", "driver", "manager", "admin"), getShipmentByTrackingId);
//Complete
router.put("/:id/complete", protect, authorizeRoles("admin", "manager", "driver"), completeShipment);

export default router;
