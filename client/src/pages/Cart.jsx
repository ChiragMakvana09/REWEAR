import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate("/login?redirect=/checkout");
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1180px] mx-auto px-8 py-16">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          subtitle="Looks like you haven't added anything yet."
          action={<Link to="/shop" className="btn-primary">Browse the Rack</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border-b border-line pb-6">
              <img src={item.image || "https://loremflickr.com/200/250/clothing"} alt={item.title} className="w-24 h-28 object-cover rounded-sm" />
              <div className="flex-1">
                <div className="font-display font-medium mb-1">{item.title}</div>
                <div className="mono text-sm opacity-70 mb-3">₹{item.price}</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 border border-ink rounded-sm text-sm">−</button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 border border-ink rounded-sm text-sm">+</button>
                  <button onClick={() => removeFromCart(item.productId)} className="text-xs opacity-50 hover:opacity-100 ml-4 underline">Remove</button>
                </div>
              </div>
              <div className="font-display font-semibold">₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>
        <div className="bg-putty-light rounded-sm p-6 h-fit">
          <div className="flex justify-between mb-2 text-sm opacity-70">
            <span>Subtotal</span><span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between mb-6 font-display font-semibold text-lg">
            <span>Total</span><span>₹{totalAmount}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full text-center">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
