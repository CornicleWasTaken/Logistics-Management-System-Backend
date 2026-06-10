import { Router } from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../utils/roles.js";

const router = Router();

router.post("/", protect, authorizeRoles(PERMISSIONS.PLACE_CUSTOMER_ORDER), createOrder);
router.get("/", protect, authorizeRoles(PERMISSIONS.PLACE_CUSTOMER_ORDER), getOrders);
router.put("/:id", protect, authorizeRoles(PERMISSIONS.CREATE_OR_EDIT_ORDERS), updateOrderStatus);
router.delete("/:id", protect, authorizeRoles(PERMISSIONS.CREATE_OR_EDIT_ORDERS), deleteOrder);

export default router;