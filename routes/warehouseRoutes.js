import express from "express";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getWarehouseInventory, transferInventory } from "../controllers/warehouseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "manager"), getWarehouses);
router.post("/", protect, authorizeRoles("admin"), createWarehouse);
router.put("/:id", protect, authorizeRoles("admin"), updateWarehouse);
router.delete("/:id", protect, authorizeRoles("admin"), deleteWarehouse);

router.get("/:id/inventory", protect, authorizeRoles("admin", "manager"), getWarehouseInventory);
router.post("/transfer", protect, authorizeRoles("admin", "manager"), transferInventory);

export default router;