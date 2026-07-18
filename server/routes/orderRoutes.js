const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  downloadReceipt,
} = require("../controllers/orderController");

router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getMyOrderById);
router.get("/:id/receipt", verifyToken, downloadReceipt);

module.exports = router;
