import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import EmptyState from "../components/EmptyState";

const statusColor = {
  placed: "bg-putty-light",
  processing: "bg-mustard/30",
  shipped: "bg-rose/30",
  delivered: "bg-bottle/20",
  cancelled: "bg-red-200",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  const downloadReceipt = async (id) => {
    const res = await axiosInstance.get(`/orders/${id}/receipt`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <div className="max-w-[1180px] mx-auto px-8 py-24 text-center opacity-60">Loading...</div>;

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          subtitle="Your placed orders will show up here."
          action={<Link to="/shop" className="btn-primary">Start Shopping</Link>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-line rounded-sm p-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                <div>
                  <div className="text-xs opacity-50 mono">#{order._id.slice(-8).toUpperCase()}</div>
                  <div className="text-sm opacity-70">{new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor[order.orderStatus] || "bg-putty-light"}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${order.paymentStatus === "paid" ? "bg-bottle/20" : "bg-red-100"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm opacity-80">
                    <span>{item.title} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-line">
                <div className="font-display font-semibold">Total: ₹{order.totalAmount}</div>
                {order.paymentStatus === "paid" && (
                  <button onClick={() => downloadReceipt(order._id)} className="text-sm underline font-semibold">
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
