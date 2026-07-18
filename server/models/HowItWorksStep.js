const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "✦" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HowItWorksStep", stepSchema);
