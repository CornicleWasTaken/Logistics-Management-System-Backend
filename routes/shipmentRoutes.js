import { Router } from "express";
import {
  createShipment,
  getShipments,
  updateShipment,
  deleteShipment,
  completeShipment,
  getShipmentByTrackingId,
  getShipmentHistory,
  updateShipmentLocationPublic,
} from "../controllers/shipmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../utils/roles.js";

const router = Router();

router.post("/", protect, authorizeRoles(PERMISSIONS.CREATE_SHIPMENTS), createShipment);
router.get("/", protect, authorizeRoles(PERMISSIONS.READ_SHIPMENTS), getShipments);
router.put("/:id", protect, authorizeRoles(PERMISSIONS.UPDATE_SHIPMENT_STATUS), updateShipment);
router.delete("/:id", protect, authorizeRoles(PERMISSIONS.CREATE_SHIPMENTS), deleteShipment);
router.get("/tracking/:trackingId", protect, authorizeRoles(PERMISSIONS.READ_SHIPMENTS), getShipmentByTrackingId);
router.get("/:id/history", protect, authorizeRoles(PERMISSIONS.READ_SHIPMENTS), getShipmentHistory);

router.post("/:id/update", updateShipmentLocationPublic);
router.put("/:id/complete", protect, authorizeRoles(PERMISSIONS.UPDATE_SHIPMENT_STATUS), completeShipment);

export default router;