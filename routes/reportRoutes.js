import express from "express";
import {
  getDeliveriesReport,
  getRevenueReport,
  getDriversReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin", "manager"));

router.get("/deliveries", getDeliveriesReport);
router.get("/revenue", getRevenueReport);
router.get("/drivers", getDriversReport);

export default router;