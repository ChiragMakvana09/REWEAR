import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const SECTIONS = [
  { to: "/admin/products", label: "Products", desc: "Add, edit, delete products & images", icon: "👗" },
  { to: "/admin/categories", label: "Categories", desc: "Manage shop categories", icon: "🗂️" },
  { to: "/admin/orders", label: "Orders", desc: "View orders, edit address, update status", icon: "📦" },
  { to: "/admin/stories", label: "Stories", desc: "Manage customer stories & testimonials", icon: "💬" },
  { to: "/admin/how-it-works", label: "How It Works", desc: "Edit steps & reorder them", icon: "🔁" },
  { to: "/admin/home-content", label: "Home Content", desc: "Hero, banner & footer text", icon: "🏠" },
  { to: "/admin/messages", label: "Messages", desc: "Contact form submissions", icon: "📬" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  const cards = stats
    ? [
        { label: "Total Sales", value: `₹${stats.totalSales}` },
        { label: "Total Orders", value: stats.totalOrders },
        { label: "Pending Orders", value: stats.pendingOrders },
        { label: "Total Products", value: stats.totalProducts },
        { label: "Stock Value", value: `₹${stats.totalStockValue}` },
      ]
    : [];

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Admin Dashboard</h1>

      {!stats ? (
        <p className="opacity-60 mb-12">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
          {cards.map((c) => (
            <div key={c.label} className="bg-putty-light rounded-sm p-5">
              <div className="text-xs uppercase tracking-wide opacity-60 mb-2">{c.label}</div>
              <div className="text-2xl font-display font-semibold">{c.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="border border-line rounded-sm p-6 hover:border-ink transition block">
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className="font-display text-lg mb-1">{s.label}</div>
            <div className="text-sm opacity-60">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
