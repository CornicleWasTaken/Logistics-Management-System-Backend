import mongoose from "mongoose";
import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import User from "../models/User.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { deliveryAddress, items } = req.body;

    if (!deliveryAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "deliveryAddress and items are required",
      });
    }

    const customerId = req.user.id;
    let customerName = req.user.name;

    if (!customerName) {
      const user = await User.findById(customerId).select("name");
      customerName = user?.name || "Customer";
    }

    const orderItems = [];
    let totalAmount = 0;

    session.startTransaction();

    for (const item of items) {
      const { inventoryId, quantity } = item;

      if (!inventoryId || !quantity || quantity <= 0) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Each item must include inventoryId and a positive quantity",
        });
      }

      const inventoryItem = await Inventory.findOneAndUpdate(
        { _id: inventoryId, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true, session },
      );

      if (!inventoryItem) {
        await session.abortTransaction();
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for inventory item ${inventoryId}`,
        });
      }

      const itemTotal = (inventoryItem.price || 0) * quantity;

      orderItems.push({
        inventoryId: inventoryItem._id,
        itemName: inventoryItem.itemName,
        quantity,
        unitPrice: inventoryItem.price || 0,
        totalPrice: itemTotal,
      });

      totalAmount += itemTotal;
    }

    const orderData = {
      customerId,
      customerName,
      deliveryAddress: deliveryAddress || req.body.destination,
      items: orderItems,
      totalAmount,
    };

    if (orderItems.length === 1) {
      orderData.product = orderItems[0].itemName;
      orderData.quantity = orderItems[0].quantity;
    }

    const [order] = await Order.create([orderData], { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order Created",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          customerName: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const statusFilter = req.query.status ? { status: req.query.status } : {};

    const roleFilter = req.user && req.user.role === "customer" ? { customerId: req.user.id } : {};

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({
      ...keyword,
      ...statusFilter,
      ...roleFilter,
    });

    const orders = await Order.find({
      ...keyword,
      ...statusFilter,
      ...roleFilter,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
      meta: {
        totalCount: totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        limit: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Order Updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
