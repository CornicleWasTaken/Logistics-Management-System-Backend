import express from "express";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

const router = express.Router();

router.get("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), getVehicles);
router.post("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), createVehicle);
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), updateVehicle);
router.delete("/:id", protect, authorizeRoles(ROLES.ADMIN), deleteVehicle);

export default router;