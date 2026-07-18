const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    location: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    date: { type: Date, default: Date.now },
    photo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
