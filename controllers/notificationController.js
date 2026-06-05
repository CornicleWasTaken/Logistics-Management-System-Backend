import Notification from "../models/Notification.js";

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: notifications,
      meta: { totalCount: notifications.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notifications/send
export const sendNotification = async (req, res) => {
  try {
    const { type, recipient, message } = req.body;
    
    // Create pending notification
    const notification = await Notification.create({ type, recipient, message, status: "Sent" });
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};