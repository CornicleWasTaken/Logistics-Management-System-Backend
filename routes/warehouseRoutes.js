import express from "express";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getWarehouseInventory, transferInventory } from "../controllers/warehouseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { PERMISSIONS, ROLES } from "../utils/roles.js";

const router = express.Router();

router.get("/", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), getWarehouses);
router.post("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), createWarehouse);
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), updateWarehouse);
router.delete("/:id", protect, authorizeRoles(ROLES.ADMIN), deleteWarehouse);

router.get("/:id/inventory", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), getWarehouseInventory);
router.post("/transfer", protect, authorizeRoles(PERMISSIONS.MANAGE_INVENTORY), transferInventory);

export default router;