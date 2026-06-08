import express from "express";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "manager"), getVehicles);
router.post("/", protect, authorizeRoles("admin"), createVehicle);
router.put("/:id", protect, authorizeRoles("admin"), updateVehicle);
router.delete("/:id", protect, authorizeRoles("admin"), deleteVehicle);

export default router;