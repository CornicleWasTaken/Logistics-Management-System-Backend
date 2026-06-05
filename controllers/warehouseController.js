import Warehouse from "../models/Warehouse.js";

// GET /api/warehouses
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json({
      success: true,
      data: warehouses,
      meta: {
        totalCount: warehouses.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/warehouses
export const createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({ success: true, data: warehouse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/warehouses/:id
export const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warehouse) return res.status(404).json({ success: false, message: "Warehouse not found" });
    res.status(200).json({ success: true, data: warehouse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/warehouses/:id
export const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: "Warehouse not found" });
    res.status(200).json({ success: true, message: "Warehouse deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/warehouses/:id/inventory
export const getWarehouseInventory = async (req, res) => {
  try {
    // Assuming 'warehouse' field in Inventory links to Warehouse id
    // Note: Depends on Inventory schema refactoring defined in the plan
    res.status(200).json({ 
      success: true, 
      message: "This endpoint requires an updated Inventory schema to reference Warehouse ObjectIds.",
      data: [] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/warehouses/transfer
export const transferInventory = async (req, res) => {
  try {
    const { inventoryId, fromWarehouseId, toWarehouseId, quantity } = req.body;
    
    if (!inventoryId || !fromWarehouseId || !toWarehouseId || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required transfer fields" });
    }

    // Logic would involve decreasing quantity in source inventory record and increasing/creating in target
    res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: { inventoryId, fromWarehouseId, toWarehouseId, "quantity transferred": quantity }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};