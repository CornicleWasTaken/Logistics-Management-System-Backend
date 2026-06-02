import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    currentLocation: {
      type: String,
      default: "Warehouse",
    },

    status: {
      type: String,
      enum: ["Packed", "In Transit", "Out For Delivery", "Delivered"],
      default: "Packed",
    },
  },
  { timestamps: true },
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
