import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setError("");
    for (const key of ["name", "phone", "street", "city", "state", "pincode"]) {
      if (!form[key]) return setError("Please fill in all address fields.");
    }
    setPlacing(true);
    try {
      // 1. Create order (pending) in our DB
      const orderRes = await axiosInstance.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, title: i.title, quantity: i.quantity })),
        shippingAddress: form,
      });
      const order = orderRes.data.order;

      // 2. Create Razorpay order
      const rpRes = await axiosInstance.post("/payment/create-order", { orderId: order._id });
      const { razorpayOrderId, amount, currency, keyId } = rpRes.data;

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Could not load payment gateway. Check your connection and try again.");
        setPlacing(false);
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: "ReWear",
        description: "Preloved fashion order",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axiosInstance.post("/payment/verify", {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-success/${order._id}`);
          } catch (err) {
            setError("Payment verification failed. Contact support if money was deducted.");
          }
        },
        prefill: { name: form.name, contact: form.phone },
        theme: { color: "#2B3A2C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-[1180px] mx-auto px-8 py-24 text-center opacity-60">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-xl font-display mb-4">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className="col-span-2 bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
            <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} className="col-span-2 bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
            <input name="street" placeholder="Street address" value={form.street} onChange={handleChange} className="col-span-2 bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
            <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
          </div>
          {error && <p className="text-rose text-sm mt-4">{error}</p>}
        </div>
        <div className="bg-putty-light rounded-sm p-6 h-fit">
          <h2 className="text-xl font-display mb-4">Order Summary</h2>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm mb-2 opacity-80">
              <span>{i.title} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-display font-semibold text-lg mt-4 pt-4 border-t border-line">
            <span>Total</span><span>₹{totalAmount}</span>
          </div>
          <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary w-full text-center mt-6 disabled:opacity-50">
            {placing ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
}
