const mongoose = require("mongoose");

// Singleton document holding editable homepage content
const homeContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Second life, first choice." },
    heroSubtitle: {
      type: String,
      default: "Curated preloved fashion, hand-checked and honestly priced.",
    },
    heroButtonText: { type: String, default: "Shop the rack" },
    heroImage: {
      url: { type: String, default: "https://loremflickr.com/700/875/vintagefashion?lock=1" },
      public_id: { type: String, default: "" },
    },
    promoBannerText: {
      type: String,
      default: "Get first pick of new drops, every Friday.",
    },
    promoBannerImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    footerTagline: {
      type: String,
      default: "A preloved fashion marketplace for clothes that deserve a second chapter.",
    },
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com" },
      twitter: { type: String, default: "https://twitter.com" },
      facebook: { type: String, default: "https://facebook.com" },
      pinterest: { type: String, default: "https://pinterest.com" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
