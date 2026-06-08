import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

import { getDashboardStats, getDashboardAnalytics } from "../controllers/dashboardController.js";

const router = Router();

// ADMIN DASHBOARD
router.get("/stats", protect, authorizeRoles("admin"), getDashboardStats);

router.get("/analytics", protect, authorizeRoles("admin", "manager"), getDashboardAnalytics);

export default router;
