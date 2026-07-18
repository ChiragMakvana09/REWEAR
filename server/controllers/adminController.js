const Product = require("../models/Product");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");

// ---------- PRODUCTS ----------

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, originalPrice, size, condition, category, stock, rating } = req.body;

    const images = (req.files || []).map((f) => ({
      url: f.path,
      public_id: f.filename,
    }));

    const product = await Product.create({
      title,
      description,
      price,
      originalPrice,
      size,
      condition,
      category,
      stock,
      rating,
      images,
    });

    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: "Could not create product", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const fields = ["title", "description", "price", "originalPrice", "size", "condition", "category", "stock", "rating", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    if (req.files && req.files.length) {
      const newImages = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Could not update product", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const img of product.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (e) {
        console.warn("Cloudinary delete failed for", img.public_id, e.message);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete product", error: err.message });
  }
};

exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch products", error: err.message });
  }
};

// ---------- ORDERS ----------

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const orders = await Order.find(filter).populate("userId", "name email").sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders", error: err.message });
  }
};

exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch order", error: err.message });
  }
};

// Update order status and/or edit shipping address
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { orderStatus, paymentStatus, shippingAddress } = req.body;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (shippingAddress) {
      order.shippingAddress = { ...order.shippingAddress.toObject(), ...shippingAddress };
    }

    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Could not update order", error: err.message });
  }
};

// ---------- DASHBOARD ----------

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalSales = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalProducts = await Product.countDocuments();
    const totalStockValue = await Product.aggregate([
      { $group: { _id: null, value: { $sum: { $multiply: ["$price", "$stock"] } } } },
    ]);
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ["placed", "processing"] } });

    res.json({
      totalOrders,
      totalSales,
      totalProducts,
      pendingOrders,
      totalStockValue: totalStockValue[0]?.value || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch dashboard stats", error: err.message });
  }
};
