import express from "express";
import {
  assignDispatch,
  getTrackingDetails,
  optimizeRoute,
} from "../controllers/dispatchController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../utils/roles.js";

const router = express.Router();

router.post("/shipments/:id/assign", protect, authorizeRoles(PERMISSIONS.CREATE_SHIPMENTS), assignDispatch);
router.get("/shipments/:id/tracking", protect, authorizeRoles(PERMISSIONS.READ_SHIPMENTS), getTrackingDetails);
router.post("/dispatch/optimize-route", protect, authorizeRoles(PERMISSIONS.VIEW_ANALYTICS), optimizeRoute);

export default router;