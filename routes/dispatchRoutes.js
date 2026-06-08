import express from "express";
import {
  assignDispatch,
  getTrackingDetails,
  optimizeRoute,
} from "../controllers/dispatchController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Mount this base inside server.js under `/api`
router.post("/shipments/:id/assign", protect, authorizeRoles("admin", "manager"), assignDispatch);
router.get("/shipments/:id/tracking", protect, authorizeRoles("admin", "manager", "driver", "customer"), getTrackingDetails);
router.post("/dispatch/optimize-route", protect, authorizeRoles("admin", "manager"), optimizeRoute);

export default router;
