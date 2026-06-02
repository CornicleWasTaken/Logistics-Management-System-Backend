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
router.post("/", protect, createOrder);

// GET
router.get("/", protect, getOrders);

// UPDATE STATUS
router.put("/:id", protect, updateOrderStatus);

// DELETE
router.delete("/:id", protect, authorizeRoles("admin"), deleteOrder);

export default router;
