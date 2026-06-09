import Message from "../models/Message.js";

export const getCustomerMessageHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (req.user.role === "customer" && req.user.id !== customerId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const messages = await Message.find({ customerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipmentMessageHistory = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const messages = await Message.find({ shipmentId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { customerId, shipmentId, sender, recipient, text, type, status, attachments } = req.body;

    if (!customerId || !sender || !recipient || !text) {
      return res.status(400).json({ success: false, message: "customerId, sender, recipient, and text are required." });
    }

    const message = await Message.create({
      customerId,
      shipmentId,
      sender,
      recipient,
      text,
      type,
      status,
      attachments,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
