import Notification from "../models/Notification.js";

const buildNotificationQuery = (query) => {
  const filter = {};

  if (query.read === "true") filter.read = true;
  if (query.read === "false") filter.read = false;
  if (query.recipient) filter.recipient = query.recipient;

  return filter;
};

export const getNotifications = async (req, res) => {
  try {
    const filter = buildNotificationQuery(req.query);
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
      meta: { totalCount: notifications.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { type, recipient, message, status } = req.body;

    const notification = await Notification.create({ type, recipient, message, status: status || "Sent" });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};