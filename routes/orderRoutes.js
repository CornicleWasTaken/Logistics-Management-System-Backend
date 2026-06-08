import { Router } from "express";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// CREATE
router.post("/", protect, authorizeRoles("customer", "manager", "admin"), createOrder);

// GET
router.get("/", protect, authorizeRoles("customer", "manager", "admin"), getOrders);

// UPDATE STATUS
router.put("/:id", protect, authorizeRoles("manager", "admin"), updateOrderStatus);

// DELETE
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteOrder);

export default router;
