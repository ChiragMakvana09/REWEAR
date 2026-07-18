const Order = require("../models/Order");
const Product = require("../models/Product");
const generateReceipt = require("../utils/generateReceipt");

// Creates an order in "pending" state before payment is initiated.
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Recompute prices/stock from DB so client can't tamper with amounts.
    let totalAmount = 0;
    const verifiedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product unavailable: ${item.title || item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.title}` });
      }
      totalAmount += product.price * item.quantity;
      verifiedItems.push({
        productId: product._id,
        title: product.title,
        image: product.images[0] ? product.images[0].url : "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: verifiedItems,
      shippingAddress,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Could not create order", error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders", error: err.message });
  }
};

exports.getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch order", error: err.message });
  }
};

exports.downloadReceipt = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Receipt is available only after payment is confirmed" });
    }
    generateReceipt(res, order);
  } catch (err) {
    res.status(500).json({ message: "Could not generate receipt", error: err.message });
  }
};
