const PDFDocument = require("pdfkit");

/**
 * Streams a PDF receipt for the given order directly to an Express response.
 * @param {import('express').Response} res
 * @param {object} order - Mongoose order document (should be populated where needed)
 */
function generateReceipt(res, order) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${order._id}.pdf`
  );

  doc.pipe(res);

  // Header
  doc
    .fontSize(22)
    .fillColor("#2B3A2C")
    .text("ReWear", { continued: false })
    .fontSize(10)
    .fillColor("#666")
    .text("Second life, first choice")
    .moveDown(1.5);

  doc
    .fontSize(14)
    .fillColor("#211F1B")
    .text("Order Receipt", { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .fillColor("#211F1B")
    .text(`Order ID: ${order._id}`)
    .text(`Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`)
    .text(`Payment Status: ${order.paymentStatus}`)
    .text(`Order Status: ${order.orderStatus}`)
    .moveDown(1);

  // Shipping address
  const addr = order.shippingAddress || {};
  doc
    .fontSize(12)
    .text("Shipping To:", { underline: true })
    .fontSize(10)
    .text(addr.name || "")
    .text(addr.phone || "")
    .text(`${addr.street || ""}, ${addr.city || ""}`)
    .text(`${addr.state || ""} - ${addr.pincode || ""}`)
    .moveDown(1);

  // Items table
  doc.fontSize(12).text("Items", { underline: true }).moveDown(0.5);

  const startY = doc.y;
  doc.fontSize(10);
  doc.text("Item", 50, startY, { width: 220 });
  doc.text("Qty", 280, startY, { width: 60 });
  doc.text("Price", 350, startY, { width: 80 });
  doc.text("Subtotal", 440, startY, { width: 100 });
  doc.moveDown(0.5);
  doc
    .moveTo(50, doc.y)
    .lineTo(540, doc.y)
    .strokeColor("#cccccc")
    .stroke();
  doc.moveDown(0.3);

  (order.items || []).forEach((item) => {
    const rowY = doc.y;
    doc.text(item.title, 50, rowY, { width: 220 });
    doc.text(String(item.quantity), 280, rowY, { width: 60 });
    doc.text(`Rs. ${item.price}`, 350, rowY, { width: 80 });
    doc.text(`Rs. ${item.price * item.quantity}`, 440, rowY, { width: 100 });
    doc.moveDown(0.7);
  });

  doc.moveDown(0.5);
  doc
    .moveTo(50, doc.y)
    .lineTo(540, doc.y)
    .strokeColor("#cccccc")
    .stroke();
  doc.moveDown(0.5);

  doc
    .fontSize(12)
    .fillColor("#211F1B")
    .text(`Total Paid: Rs. ${order.totalAmount}`, { align: "right" });

  doc.moveDown(2);
  doc
    .fontSize(9)
    .fillColor("#888")
    .text("Thank you for shopping preloved with ReWear.", { align: "center" });

  doc.end();
}

module.exports = generateReceipt;
