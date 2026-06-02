import Inventory from "../models/Inventory.js";

// ADD INVENTORY
export const addInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);

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

// UPDATE INVENTORY
export const updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

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
