const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  downloadReceipt,
  trackOrder,
} = require("../controllers/orderController");

router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getMyOrderById);
router.get("/:id/receipt", verifyToken, downloadReceipt);
router.get("/track/:id", trackOrder);

module.exports = router;
