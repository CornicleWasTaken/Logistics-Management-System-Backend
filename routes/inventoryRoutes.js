import { Router } from "express";

import {
  addInventory,
  getInventory,
  getInventoryCatalog,
  getInventoryHistory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/", protect, authorizeRoles("admin"), addInventory);

router.get("/catalog", protect, authorizeRoles("customer", "manager", "admin"), getInventoryCatalog);
router.get("/", protect, getInventory);
router.get("/:id/history", protect, getInventoryHistory);

router.put("/:id", protect, authorizeRoles("admin"), updateInventory);

router.delete("/:id", protect, authorizeRoles("admin"), deleteInventory);

export default router;
