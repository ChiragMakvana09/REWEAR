import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../context/ToastContext";

export default function Newsletter({ heading = "Get first pick of new drops, every Friday." }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post("/newsletter", { email });
      showToast(res.data.message || "Subscribed!");
      setEmail("");
    } catch {
      showToast("Could not subscribe right now", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mustard rounded-md p-8 md:p-14 flex flex-wrap justify-between items-center gap-8">
      <h2 className="text-2xl md:text-[32px] max-w-md font-display text-ink">{heading}</h2>
      <form onSubmit={handleSubmit} className="flex bg-cream-paper rounded-sm overflow-hidden border border-ink">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="bg-transparent px-4 py-3.5 text-sm w-56 outline-none"
        />
        <button type="submit" disabled={loading} className="bg-ink text-cream-paper px-6 font-semibold text-xs uppercase tracking-wide">
          {loading ? "..." : "Notify Me"}
        </button>
      </form>
    </div>
  );
}
