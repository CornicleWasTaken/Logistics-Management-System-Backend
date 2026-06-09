import express from "express";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "manager"), getDrivers);
router.post("/", protect, authorizeRoles("admin"), createDriver);
router.get("/me/assignments", protect, authorizeRoles("driver"), getDriverAssignments);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateDriver);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDriver);

export default router;