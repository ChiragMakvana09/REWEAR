const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    size: { type: String, required: true },
    condition: {
      type: String,
      enum: ["Like New", "Gently Used", "Well Loved"],
      required: true,
    },
    category: { type: String, required: true },
    images: { type: [imageSchema], default: [] },
    stock: { type: Number, required: true, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    soldCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
