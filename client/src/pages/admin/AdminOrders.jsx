import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/admin/orders", { params: statusFilter ? { status: statusFilter } : {} })
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <h1 className="text-4xl font-display">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="opacity-60">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/admin/orders/${o._id}`}
              className="flex justify-between items-center border border-line rounded-sm p-4 hover:bg-putty-light transition"
            >
              <div>
                <div className="mono text-xs opacity-50">#{o._id.slice(-8).toUpperCase()}</div>
                <div className="font-display font-medium">{o.userId?.name || "Unknown"} · {o.userId?.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full bg-putty capitalize">{o.orderStatus}</span>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${o.paymentStatus === "paid" ? "bg-bottle/20" : "bg-red-100"}`}>
                  {o.paymentStatus}
                </span>
                <span className="font-display font-semibold">₹{o.totalAmount}</span>
              </div>
            </Link>
          ))}
          {orders.length === 0 && <p className="opacity-60">No orders found.</p>}
        </div>
      )}
    </div>
  );
}
