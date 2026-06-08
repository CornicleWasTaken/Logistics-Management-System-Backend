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

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    currentLocation: {
      address: {
        type: String,
        default: "Warehouse",
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0], // Optional default
        },
      },
    },

    locationHistory: [
      {
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: ["Packed", "In Transit", "Out For Delivery", "Delivered"],
      default: "Packed",
    },
    estimatedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
  },
  { timestamps: true },
);

shipmentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

shipmentSchema.index({ "currentLocation.coordinates": "2dsphere" });

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
