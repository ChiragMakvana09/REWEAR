/**
 * PUBLIC endpoint — no auth required, because this is hit by someone
 * scanning the QR code on a printed receipt.
 * Only return the minimum needed to show status. Never leak full
 * address, payment details, or internal fields here.
 *
 * Add this function into your existing orderController.js
 * and export it (module.exports = { ...existingExports, trackOrder }).
 */
const Order = require("../models/Order"); // adjust path/model name if different

// Canonical order of stages. Keep this in sync with the enum values
// you use for order.orderStatus in your schema.
const STAGE_SEQUENCE = ["placed", "processing", "shipped", "out for delivery", "delivered"];

const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Basic guard against malformed ids hitting the DB with a weird cast error
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id).select(
      "orderStatus createdAt items totalAmount statusHistory estimatedDelivery cancelledAt"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = (order.orderStatus || "").toLowerCase();
    const isCancelled = currentStatus === "cancelled";

    res.json({
      orderId: order._id,
      shortId: String(order._id).slice(-8).toUpperCase(),
      status: currentStatus,
      isCancelled,
      placedAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery || null,
      cancelledAt: order.cancelledAt || null,
      // statusHistory is optional — if your schema tracks timestamps per
      // stage, send them so the frontend can show real dates on the
      // timeline. If it doesn't exist, frontend falls back gracefully.
      statusHistory: order.statusHistory || [],
      items: (order.items || []).map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: order.totalAmount,
      stageSequence: STAGE_SEQUENCE,
    });
  } catch (err) {
    console.error("trackOrder error:", err);
    res.status(500).json({ message: "Something went wrong while fetching order status" });
  }
};

module.exports = { trackOrder };