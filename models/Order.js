import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    product: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Packed", "Dispatched", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
