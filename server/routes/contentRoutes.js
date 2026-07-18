const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const categoryUpload = upload.forFolder("categories");
const storyUpload = upload.forFolder("stories");
const homeUpload = upload.forFolder("home");

const ctrl = require("../controllers/contentController");

// ---------- PUBLIC ----------
router.get("/categories", ctrl.getCategories);
router.get("/stories", ctrl.getStories);
router.get("/steps", ctrl.getSteps);
router.get("/home", ctrl.getHomeContent);
router.post("/contact", ctrl.submitContactMessage);
router.post("/newsletter", ctrl.subscribeNewsletter);

// ---------- ADMIN ----------
const adminOnly = [verifyToken, verifyAdmin];

// Categories
router.get("/admin/categories", ...adminOnly, ctrl.getCategoriesAdmin);
router.post("/admin/categories", ...adminOnly, categoryUpload.single("image"), ctrl.createCategory);
router.put("/admin/categories/:id", ...adminOnly, categoryUpload.single("image"), ctrl.updateCategory);
router.delete("/admin/categories/:id", ...adminOnly, ctrl.deleteCategory);

// Stories
router.get("/admin/stories", ...adminOnly, ctrl.getStoriesAdmin);
router.post("/admin/stories", ...adminOnly, storyUpload.single("photo"), ctrl.createStory);
router.put("/admin/stories/:id", ...adminOnly, storyUpload.single("photo"), ctrl.updateStory);
router.delete("/admin/stories/:id", ...adminOnly, ctrl.deleteStory);

// How It Works steps
router.post("/admin/steps", ...adminOnly, ctrl.createStep);
router.put("/admin/steps/reorder", ...adminOnly, ctrl.reorderSteps);
router.put("/admin/steps/:id", ...adminOnly, ctrl.updateStep);
router.delete("/admin/steps/:id", ...adminOnly, ctrl.deleteStep);

// Home content
router.put(
  "/admin/home",
  ...adminOnly,
  homeUpload.fields([{ name: "heroImage", maxCount: 1 }, { name: "promoBannerImage", maxCount: 1 }]),
  ctrl.updateHomeContent
);

// Contact messages
router.get("/admin/contact", ...adminOnly, ctrl.getContactMessages);
router.put("/admin/contact/:id/read", ...adminOnly, ctrl.markMessageRead);
router.delete("/admin/contact/:id", ...adminOnly, ctrl.deleteContactMessage);

// Newsletter subscribers
router.get("/admin/newsletter", ...adminOnly, ctrl.getNewsletterSubscribers);

module.exports = router;
