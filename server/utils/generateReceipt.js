const PDFDocument = require("pdfkit");
const qrcode = require("qrcode-generator");

/**
 * @param {import('express').Response} res
 * @param {object} order - Mongoose order document (should be populated where needed)
 * @param {object} [opts]
 * @param {string} [opts.trackingBaseUrl] - base URL used to build the QR tracking link
 */
function generateReceipt(res, order, opts = {}) {
  // ---- Brand palette (matches tailwind.config.js exactly) ----
  const COLORS = {
    bottle: "#2B3A2C",
    putty: "#E8E3D3",
    mustard: "#D9A441",
    mustardDeep: "#B8842E",
    ink: "#211F1B",
    creamPaper: "#F6F1E4",
    line: "#D6D0BC",
    muted: "#5A584F",
  };

  const FONT_DISPLAY = "Times-Bold";
  const FONT_MONO = "Courier-Bold";
  const FONT_BODY = "Helvetica";
  const FONT_BODY_BOLD = "Helvetica-Bold";

  const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true, bufferPages: true });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=receipt-${order._id}.pdf`);
  doc.pipe(res);

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const marginX = 50;
  const contentW = pageW - marginX * 2;

  // Paint background on EVERY page (including any auto-added ones) so nothing is ever blank white
  const paintBackground = () => {
    doc.rect(0, 0, pageW, pageH).fill(COLORS.putty);
  };
  doc.on("pageAdded", paintBackground);
  paintBackground();

  const label = (text, x, yPos, opts2 = {}) =>
    doc
      .font(FONT_MONO)
      .fontSize(opts2.size || 8.5)
      .fillColor(opts2.color || COLORS.mustardDeep)
      .text(text.toUpperCase(), x, yPos, { characterSpacing: 0.6, ...opts2 });

  const stitchLine = (x1, yPos, x2, color = COLORS.line, width = 1) => {
    doc.save();
    doc.dash(3, { space: 3 });
    doc.moveTo(x1, yPos).lineTo(x2, yPos).strokeColor(color).lineWidth(width).stroke();
    doc.undash();
    doc.restore();
  };

  // ---- Header band ----
  const headerH = 84;
  doc.rect(0, 0, pageW, headerH).fill(COLORS.bottle);

  doc.fillColor(COLORS.creamPaper).font(FONT_DISPLAY).fontSize(24).text("ReWear", marginX, 20);
  doc.moveTo(marginX + 2, 50).lineTo(marginX + 34, 50).strokeColor(COLORS.mustard).lineWidth(1.5).stroke();
  label("Second life, first choice", marginX, 58, { size: 8.5, color: COLORS.mustard });

  const chipText = (order.orderStatus || "").toUpperCase();
  doc.font(FONT_MONO).fontSize(8.5);
  const chipW = doc.widthOfString(chipText, { characterSpacing: 1 }) + 26;
  const chipH = 22;
  const chipX = pageW - marginX - chipW;
  const chipY = (headerH - chipH) / 2;
  doc.roundedRect(chipX, chipY, chipW, chipH, chipH / 2).fill(COLORS.mustard);
  doc.fillColor(COLORS.bottle).text(chipText, chipX, chipY + 6.5, { width: chipW, align: "center", characterSpacing: 1 });

  let y = headerH + 22;

  // ---- Eyebrow + title ----
  label("Order Receipt", marginX, y, { size: 9 });
  y += 18;
  doc.fillColor(COLORS.ink).font(FONT_DISPLAY).fontSize(19)
    .text(`Order #${String(order._id).slice(-8).toUpperCase()}`, marginX, y);
  y += 30;

  // ---- Meta row card ----
  const metaCardH = 54;
  doc.roundedRect(marginX, y, contentW, metaCardH, 7).fill(COLORS.creamPaper);
  const metaItems = [
    ["Order ID", String(order._id)],
    ["Date", new Date(order.createdAt).toLocaleString("en-IN")],
    ["Payment", (order.paymentStatus || "").toUpperCase()],
  ];
  const metaColW = contentW / metaItems.length;
  metaItems.forEach(([lbl, value], i) => {
    const cx = marginX + i * metaColW + 16;
    label(lbl, cx, y + 10, { size: 7.5 });
    doc.fillColor(COLORS.ink).font(FONT_BODY_BOLD).fontSize(9.5)
      .text(value, cx, y + 24, { width: metaColW - 24, lineGap: 1 });
  });
  y += metaCardH + 22;

  // ---- Shipping ----
  label("Shipping To", marginX, y, { size: 9 });
  y += 16;
  const addr = order.shippingAddress || {};
  doc.fillColor(COLORS.ink).font(FONT_BODY_BOLD).fontSize(11).text(addr.name || "", marginX, y);
  y = doc.y + 3;
  doc.font(FONT_BODY).fontSize(9.5).fillColor(COLORS.muted);
  doc.text(
    `${addr.phone || ""}  •  ${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`,
    marginX, y, { width: contentW, lineGap: 2 }
  );
  y = doc.y + 18;

  // ---- Divider ----
  stitchLine(marginX, y, pageW - marginX, COLORS.mustard, 1.2);
  y += 20;

  // ---- Items ----
  label("Items", marginX, y, { size: 9 });
  y += 18;

  const colItem = marginX;
  const colQty = marginX + 270;
  const colPrice = marginX + 340;
  const colSub = marginX + 420;

  label("Item", colItem, y, { size: 7.5, color: COLORS.ink, width: 260 });
  label("Qty", colQty, y, { size: 7.5, color: COLORS.ink, width: 60 });
  label("Price", colPrice, y, { size: 7.5, color: COLORS.ink, width: 70 });
  label("Subtotal", colSub, y, { size: 7.5, color: COLORS.ink, width: contentW - (colSub - marginX), align: "right" });
  y += 14;
  doc.moveTo(marginX, y).lineTo(pageW - marginX, y).strokeColor(COLORS.ink).lineWidth(1).stroke();
  y += 12;

  const rowH = 19; // compact row height so 5+ items fit on one page
  (order.items || []).forEach((item) => {
    doc.font(FONT_BODY).fontSize(9.5).fillColor(COLORS.ink)
      .text(item.title, colItem, y, { width: 260, height: rowH, ellipsis: true });
    doc.fillColor(COLORS.muted).text(String(item.quantity), colQty, y, { width: 60 });
    doc.text(`Rs. ${item.price}`, colPrice, y, { width: 70 });
    doc.font(FONT_BODY_BOLD).fillColor(COLORS.ink).fontSize(9.5)
      .text(`Rs. ${item.price * item.quantity}`, colSub, y, { width: contentW - (colSub - marginX), align: "right" });
    y += rowH;
    stitchLine(marginX, y - 6, pageW - marginX, COLORS.line, 0.6);
  });

  y += 16;

  // ---- Total block ----
  const tagW = 210;
  const tagH = 48;
  const tagX = pageW - marginX - tagW;
  const tagY = y;
  const cut = 16;

  doc.save();
  doc.moveTo(tagX + cut, tagY).lineTo(tagX + tagW, tagY).lineTo(tagX + tagW, tagY + tagH)
    .lineTo(tagX, tagY + tagH).lineTo(tagX, tagY + cut).closePath().fill(COLORS.bottle);
  doc.restore();

  const holeCx = tagX + cut * 0.55;
  const holeCy = tagY + cut * 0.55;
  doc.circle(holeCx, holeCy, 3.2).fill(COLORS.putty);
  doc.circle(holeCx, holeCy, 3.2).lineWidth(1).strokeColor(COLORS.mustard).stroke();

  label("Total Paid", tagX + 26, tagY + 10, { size: 7.5, color: COLORS.mustard });
  doc.fillColor(COLORS.creamPaper).font(FONT_DISPLAY).fontSize(18).text(`Rs. ${order.totalAmount}`, tagX + 26, tagY + 21);

  y = tagY + tagH + 24;

  // ---- QR code ----
  const trackingBase = opts.trackingBaseUrl || "https://rewear-bice-seven.vercel.app/track-order";
  const trackingUrl = `${trackingBase}/${order._id}`;

  const qr = qrcode(0, "M");
  qr.addData(trackingUrl);
  qr.make();
  const moduleCount = qr.getModuleCount();
  const qrSize = 64;
  const cellSize = qrSize / moduleCount;
  const qrX = marginX;
  const qrY = y;
  const pad = 8;

  doc.roundedRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, 5).fill(COLORS.creamPaper);
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        doc.rect(qrX + col * cellSize, qrY + row * cellSize, cellSize, cellSize).fill(COLORS.ink);
      }
    }
  }

  const qrTextX = qrX + qrSize + pad * 2 + 16;
  const qrTextW = pageW - marginX - qrTextX;
  label("Track Your Order", qrTextX, qrY - 2, { size: 8.5, color: COLORS.mustardDeep, width: qrTextW });
  doc.fillColor(COLORS.ink).font(FONT_BODY).fontSize(9)
    .text("Scan this code with your phone camera to see live shipping status and delivery updates.", qrTextX, qrY + 16, {
      width: qrTextW, lineGap: 2,
    });

  y = qrY + qrSize + 30;

  // ---- Footer ----
  stitchLine(marginX, y, pageW - marginX, COLORS.line, 1);
  y += 16;
  label("Thank you for shopping preloved with ReWear", marginX, y, {
    size: 8, color: COLORS.ink, width: contentW, align: "center",
  });

  doc.end();
}

module.exports = generateReceipt;