const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Factory so any content type (products, categories, stories, home) can get
// its own Cloudinary folder while sharing the same multer/Cloudinary setup.
function makeUploader(folder) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `rewear/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1000, height: 1300, crop: "limit" }],
    },
  });
  return multer({ storage });
}

// Default export kept for backwards compatibility (products)
const upload = makeUploader("products");
upload.forFolder = makeUploader;

module.exports = upload;
