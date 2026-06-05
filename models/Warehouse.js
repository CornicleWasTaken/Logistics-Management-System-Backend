import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacityPercent: { type: Number, default: 0 },
    allocated: { type: Number, default: 0 },
    available: { type: Number, required: true },
    quarantine: { type: Number, default: 0 },
  },
  { timestamps: true }
);

warehouseSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;