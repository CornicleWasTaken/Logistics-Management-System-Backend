import express from "express";
import { getCustomerShipments } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me/shipments", protect, authorizeRoles("customer"), getCustomerShipments);

export default router;
