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
import { PERMISSIONS, ROLES } from "../utils/roles.js";

const router = Router();

router.post("/", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), addInventory);

router.get("/catalog", protect, authorizeRoles(ROLES.CUSTOMER, ...PERMISSIONS.MANAGE_INVENTORY), getInventoryCatalog);
router.get("/", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), getInventory);
router.get("/:id/history", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), getInventoryHistory);

router.put("/:id", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), updateInventory);

router.delete("/:id", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), deleteInventory);

export default router;