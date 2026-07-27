import React from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function OrderSuccess() {
  const { id } = useParams();

  const downloadReceipt = async () => {
    const res = await axiosInstance.get(`/orders/${id}/receipt`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-[600px] mx-auto px-8 py-24 text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-3xl font-display mb-3">Order placed!</h1>
      <p className="opacity-70 mb-8">
        Your order has been confirmed. You can download your receipt or track it under My Orders.
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={downloadReceipt} className="btn-outline">Download Receipt</button>
        <Link to="/my-orders" className="btn-primary">My Orders</Link>
      </div>
    </div>
  );
}