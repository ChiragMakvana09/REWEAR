const PDFDocument = require("pdfkit");

/**
 * @param {import('express').Response} res
 * @param {object} order - Mongoose order document (should be populated where needed)
 */
function generateReceipt(res, order) {
  // ---- Brand palette ----
  const COLORS = {
    cream: "#f6f1e4",      // card / content background
    bg: "#e8e3d3",         // page background
    ink: "#211f1b",        // primary text
    forest: "#2b3a2c",     // hover/accent dark
    rust: "#b97a6b",       // accent (eyebrow, dividers, highlights)
    muted: "#6b6a63",      // secondary text
    line: "#d8d2bf",       // hairlines
  };

  // ---- Font stand-ins (swap once .ttf files are provided) ----
  const FONT_DISPLAY = "Times-Bold";   // stand-in for Fraunces
  const FONT_MONO = "Courier";         // stand-in for Space Mono
  const FONT_BODY = "Helvetica";       // stand-in for Work Sans
  const FONT_BODY_BOLD = "Helvetica-Bold";

  const doc = new PDFDocument({ size: "A4", margin: 0 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${order._id}.pdf`
  );
  doc.pipe(res);

  const pageW = doc.page.width;
  const marginX = 50;
  const contentW = pageW - marginX * 2;

  // ---- Page background ----
  doc.rect(0, 0, pageW, doc.page.height).fill(COLORS.bg);

  // ---- Header band ----
  const headerH = 130;
  doc.rect(0, 0, pageW, headerH).fill(COLORS.ink);

  doc
    .fillColor(COLORS.cream)
    .font(FONT_DISPLAY)
    .fontSize(28)
    .text("ReWear", marginX, 42);

  doc
    .fillColor(COLORS.rust)
    .font(FONT_MONO)
    .fontSize(10)
    .text("SECOND LIFE, FIRST CHOICE", marginX, 78, {
      characterSpacing: 1.5,
    });

  // status chip, top right
  const chipText = (order.orderStatus || "").toUpperCase();
  doc.font(FONT_MONO).fontSize(9);
  const chipW = doc.widthOfString(chipText) + 24;
  const chipX = pageW - marginX - chipW;
  doc
    .roundedRect(chipX, 44, chipW, 22, 11)
    .lineWidth(1)
    .strokeColor(COLORS.rust)
    .stroke();
  doc
    .fillColor(COLORS.cream)
    .text(chipText, chipX, 50, { width: chipW, align: "center" });

  let y = headerH + 36;

  // ---- Eyebrow + title ----
  doc
    .fillColor(COLORS.rust)
    .font(FONT_MONO)
    .fontSize(11)
    .text("ORDER RECEIPT", marginX, y, { characterSpacing: 1.5 });
  y += 22;

  doc
    .fillColor(COLORS.ink)
    .font(FONT_DISPLAY)
    .fontSize(20)
    .text(`Order #${String(order._id).slice(-8)}`, marginX, y);
  y += 34;

  // ---- Meta row card (order id / date / payment) ----
  const metaCardH = 74;
  doc
    .roundedRect(marginX, y, contentW, metaCardH, 6)
    .fill(COLORS.cream);

  const metaItems = [
    ["ORDER ID", String(order._id)],
    ["DATE", new Date(order.createdAt).toLocaleString("en-IN")],
    ["PAYMENT", (order.paymentStatus || "").toUpperCase()],
  ];
  const metaColW = contentW / metaItems.length;
  metaItems.forEach(([label, value], i) => {
    const cx = marginX + i * metaColW + 20;
    doc
      .fillColor(COLORS.rust)
      .font(FONT_MONO)
      .fontSize(8)
      .text(label, cx, y + 16, { characterSpacing: 1 });
    doc
      .fillColor(COLORS.ink)
      .font(FONT_BODY)
      .fontSize(10)
      .text(value, cx, y + 32, { width: metaColW - 30 });
  });

  y += metaCardH + 30;

  // ---- Shipping ----
  doc
    .fillColor(COLORS.rust)
    .font(FONT_MONO)
    .fontSize(10)
    .text("SHIPPING TO", marginX, y, { characterSpacing: 1.5 });
  y += 18;

  const addr = order.shippingAddress || {};
  doc.fillColor(COLORS.ink).font(FONT_BODY_BOLD).fontSize(11);
  doc.text(addr.name || "", marginX, y);
  y = doc.y + 2;

  doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.muted);
  doc.text(addr.phone || "", marginX, y);
  y = doc.y + 2;
  doc.text(`${addr.street || ""}, ${addr.city || ""}`, marginX, y, {
    width: contentW,
  });
  y = doc.y + 2;
  doc.text(`${addr.state || ""} - ${addr.pincode || ""}`, marginX, y);
  y = doc.y + 26;

  // ---- Divider ----
  doc.moveTo(marginX, y).lineTo(pageW - marginX, y).strokeColor(COLORS.rust).lineWidth(1.5).stroke();
  y += 22;

  // ---- Items ----
  doc
    .fillColor(COLORS.rust)
    .font(FONT_MONO)
    .fontSize(10)
    .text("ITEMS", marginX, y, { characterSpacing: 1.5 });
  y += 20;

  const colItem = marginX;
  const colQty = marginX + 260;
  const colPrice = marginX + 330;
  const colSub = marginX + 420;

  doc.font(FONT_BODY_BOLD).fontSize(9).fillColor(COLORS.ink);
  doc.text("ITEM", colItem, y, { width: 250 });
  doc.text("QTY", colQty, y, { width: 60 });
  doc.text("PRICE", colPrice, y, { width: 80 });
  doc.text("SUBTOTAL", colSub, y, { width: 100, align: "right" });
  y += 16;

  doc.moveTo(marginX, y).lineTo(pageW - marginX, y).strokeColor(COLORS.line).lineWidth(1).stroke();
  y += 12;

  doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.ink);
  (order.items || []).forEach((item) => {
    const rowH = 22;
    doc.text(item.title, colItem, y, { width: 250 });
    doc.text(String(item.quantity), colQty, y, { width: 60 });
    doc.text(`Rs. ${item.price}`, colPrice, y, { width: 80 });
    doc.text(`Rs. ${item.price * item.quantity}`, colSub, y, {
      width: 100,
      align: "right",
    });
    y += rowH;
    doc.moveTo(marginX, y - 6).lineTo(pageW - marginX, y - 6).strokeColor(COLORS.line).lineWidth(0.5).stroke();
  });

  y += 14;

  // ---- Total block ----
  const totalBoxW = 220;
  const totalBoxX = pageW - marginX - totalBoxW;
  doc
    .roundedRect(totalBoxX, y, totalBoxW, 50, 6)
    .fill(COLORS.ink);
  doc
    .fillColor(COLORS.rust)
    .font(FONT_MONO)
    .fontSize(8)
    .text("TOTAL PAID", totalBoxX + 18, y + 12, { characterSpacing: 1 });
  doc
    .fillColor(COLORS.cream)
    .font(FONT_DISPLAY)
    .fontSize(18)
    .text(`Rs. ${order.totalAmount}`, totalBoxX + 18, y + 24);

  y += 90;

  // ---- Footer ----
  doc
    .fillColor(COLORS.muted)
    .font(FONT_MONO)
    .fontSize(9)
    .text("THANK YOU FOR SHOPPING PRELOVED WITH REWEAR", marginX, y, {
      width: contentW,
      align: "center",
      characterSpacing: 1,
    });

  doc.end();
}

module.exports = generateReceipt;