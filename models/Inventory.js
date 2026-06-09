import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    quantity: {
      type: Number,
      required: true,
    },

    warehouse: {
      type: String,
    },

    price: {
      type: Number,
    },

    history: [
      {
        action: { type: String, required: true },
        changedBy: { type: String, default: "system" },
        reason: { type: String, default: "inventory change" },
        before: { type: mongoose.Schema.Types.Mixed },
        after: { type: mongoose.Schema.Types.Mixed },
        changes: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

inventorySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
