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
router.post("/", protect, createShipment);

// GET
router.get("/", protect, getShipments);

// UPDATE
router.put("/:id", protect, authorizeRoles("admin"), updateShipment);

// DELETE
router.delete("/:id", protect, authorizeRoles("admin"), deleteShipment);
// tracking id
router.get("/tracking/:trackingId", protect, getShipmentByTrackingId);
//Complete
router.put("/:id/complete", protect, authorizeRoles("admin"), completeShipment);

export default router;
