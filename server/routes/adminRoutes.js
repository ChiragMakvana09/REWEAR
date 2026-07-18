const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrder,
  getDashboardStats,
} = require("../controllers/adminController");

router.use(verifyToken, verifyAdmin);

// Products
router.get("/products", getAllProductsAdmin);
router.post("/products", upload.array("images", 6), createProduct);
router.put("/products/:id", upload.array("images", 6), updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderByIdAdmin);
router.put("/orders/:id", updateOrder);

// Dashboard
router.get("/dashboard", getDashboardStats);

module.exports = router;
