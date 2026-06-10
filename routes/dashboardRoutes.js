import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getDashboardStats, getDashboardAnalytics } from "../controllers/dashboardController.js";
import { PERMISSIONS } from "../utils/roles.js";

const router = Router();

router.get("/stats", protect, authorizeRoles(PERMISSIONS.VIEW_DASHBOARD), getDashboardStats);
router.get("/analytics", protect, authorizeRoles(PERMISSIONS.VIEW_ANALYTICS), getDashboardAnalytics);

export default router;