import express from "express";
import { getNotifications, sendNotification, markNotificationRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "manager"), getNotifications);
router.post("/send", protect, authorizeRoles("admin", "manager"), sendNotification);
router.put("/:id/read", protect, authorizeRoles("admin", "manager"), markNotificationRead);

export default router;