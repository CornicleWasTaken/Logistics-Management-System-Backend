import express from "express";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getWarehouseInventory, transferInventory } from "../controllers/warehouseController.js";

const router = express.Router();

router.get("/", getWarehouses);
router.post("/", createWarehouse);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);

router.get("/:id/inventory", getWarehouseInventory);
router.post("/transfer", transferInventory);

export default router;