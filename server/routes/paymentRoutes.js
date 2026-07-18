const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify", verifyToken, verifyPayment);

module.exports = router;
