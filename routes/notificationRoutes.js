import express from "express";
import { getNotifications, sendNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getNotifications);
router.post("/send", sendNotification);

export default router;