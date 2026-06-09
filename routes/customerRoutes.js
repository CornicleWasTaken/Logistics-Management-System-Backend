import express from "express";
import { getCustomerShipments, getCustomerOrders } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me/shipments", protect, authorizeRoles("customer"), getCustomerShipments);
router.get("/me/orders", protect, authorizeRoles("customer"), getCustomerOrders);

export default router;
