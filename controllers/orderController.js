import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { customerName, product, quantity, deliveryAddress } = req.body;

    // Find inventory item
    const inventoryItem = await Inventory.findOne({
      itemName: product,
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in inventory",
      });
    }

    // Check stock
    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Reduce stock
    inventoryItem.quantity -= quantity;

    await inventoryItem.save();

    // Create order
    const order = await Order.create({
      customerName,
      product,
      quantity,
      deliveryAddress,
    });

    res.status(201).json({
      success: true,
      message: "Order Created",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({
      ...keyword,
      ...statusFilter,
    });

    const orders = await Order.find({
      ...keyword,
      ...statusFilter,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      count: orders.length,
      orders,
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
