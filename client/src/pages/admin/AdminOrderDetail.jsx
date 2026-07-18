import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ORDER_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosInstance.get(`/admin/orders/${id}`).then((res) => {
      const o = res.data.order;
      setOrder(o);
      setAddress(o.shippingAddress);
      setOrderStatus(o.orderStatus);
      setPaymentStatus(o.paymentStatus);
    });
  }, [id]);

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await axiosInstance.put(`/admin/orders/${id}`, {
        orderStatus,
        paymentStatus,
        shippingAddress: address,
      });
      setOrder(res.data.order);
      setMessage("Order updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update order");
    } finally {
      setSaving(false);
    }
  };

  if (!order || !address) {
    return <div className="max-w-[1180px] mx-auto px-8 py-24 text-center opacity-60">Loading...</div>;
  }

  return (
    <div className="max-w-[900px] mx-auto px-8 py-16">
      <button onClick={() => navigate("/admin/orders")} className="text-sm opacity-60 hover:opacity-100 mb-6">← Back to orders</button>
      <h1 className="text-3xl font-display mb-2">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="opacity-60 text-sm mb-10">
        Placed by {order.userId?.name} ({order.userId?.email}) on {new Date(order.createdAt).toLocaleString("en-IN")}
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-display mb-4">Items</h2>
          <div className="flex flex-col gap-2 mb-8">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.title} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-display font-semibold pt-3 border-t border-line mt-2">
              <span>Total</span><span>₹{order.totalAmount}</span>
            </div>
          </div>

          <h2 className="text-xl font-display mb-4">Status</h2>
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-wide opacity-60">Order Status</label>
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm">
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="text-xs uppercase tracking-wide opacity-60 mt-2">Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm">
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display mb-4">Shipping Address (editable)</h2>
          <div className="flex flex-col gap-3">
            <input name="name" placeholder="Full name" value={address.name} onChange={handleAddressChange} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm" />
            <input name="phone" placeholder="Phone" value={address.phone} onChange={handleAddressChange} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm" />
            <input name="street" placeholder="Street" value={address.street} onChange={handleAddressChange} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm" />
            <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm" />
            <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm" />
            <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleAddressChange} className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm" />
          </div>
        </div>
      </div>

      {message && <p className="text-sm mt-6 opacity-80">{message}</p>}
      <button onClick={handleSave} disabled={saving} className="btn-primary mt-8">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
