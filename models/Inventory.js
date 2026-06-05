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
