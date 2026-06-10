import express from "express";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "../controllers/driverController.js";
import { getDriverAssignments } from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

const router = express.Router();

router.get("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), getDrivers);
router.post("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), createDriver);
router.get("/me/assignments", protect, authorizeRoles(ROLES.DRIVER), getDriverAssignments);
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), updateDriver);
router.delete("/:id", protect, authorizeRoles(ROLES.ADMIN), deleteDriver);

export default router;