import Inventory from "../models/Inventory.js";

const createHistoryEntry = ({ action, changedBy, before, after, changes, reason }) => ({
  action,
  changedBy,
  before,
  after,
  changes,
  reason,
  timestamp: new Date(),
});

// ADD INVENTORY
export const addInventory = async (req, res) => {
  try {
    const { itemName, category, quantity, warehouse, price } = req.body;

    const inventory = await Inventory.create({
      itemName,
      category,
      quantity,
      warehouse,
      price,
      history: [
        createHistoryEntry({
          action: "created",
          changedBy: req.user?.id || "system",
          before: null,
          after: { itemName, category, quantity, warehouse, price },
          changes: { itemName, category, quantity, warehouse, price },
          reason: "initial inventory creation",
        }),
      ],
    });

    res.status(201).json({
      success: true,
      message: "Inventory Added",
      inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL INVENTORY
export const getInventory = async (req, res) => {
  try {
    const inventories = await Inventory.find();

    res.status(200).json({
      success: true,
      count: inventories.length,
      inventories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET INVENTORY HISTORY
export const getInventoryHistory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).select("itemName history");

    if (!inventory) {
      return res.status(404).json({ success: false, message: "Inventory not found" });
    }

    res.status(200).json({
      success: true,
      itemName: inventory.itemName,
      count: inventory.history.length,
      history: inventory.history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET INVENTORY CATALOG
export const getInventoryCatalog = async (req, res) => {
  try {
    const inventories = await Inventory.find().select("itemName quantity price warehouse");

    const products = inventories.map((item) => ({
      id: item._id,
      itemName: item.itemName,
      quantity: item.quantity,
      price: item.price,
      warehouse: item.warehouse,
    }));

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE INVENTORY
export const updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ success: false, message: "Inventory not found" });
    }

    const updates = req.body;
    const changedFields = {};
    const previousValues = {
      itemName: inventory.itemName,
      category: inventory.category,
      quantity: inventory.quantity,
      warehouse: inventory.warehouse,
      price: inventory.price,
    };

    ["itemName", "category", "quantity", "warehouse", "price"].forEach((field) => {
      if (field in updates && inventory[field] !== updates[field]) {
        changedFields[field] = {
          before: inventory[field],
          after: updates[field],
        };
      }
    });

    inventory.set(updates);

    if (Object.keys(changedFields).length > 0) {
      inventory.history.push(
        createHistoryEntry({
          action: "updated",
          changedBy: req.user?.id || "system",
          before: previousValues,
          after: {
            ...previousValues,
            ...updates,
          },
          changes: changedFields,
          reason: updates.reason || "inventory update",
        }),
      );
    }

    await inventory.save();

    res.status(200).json({
      success: true,
      message: "Inventory Updated",
      inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE INVENTORY
export const deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Inventory Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
