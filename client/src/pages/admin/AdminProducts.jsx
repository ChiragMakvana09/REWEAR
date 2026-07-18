import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axiosInstance
      .get("/admin/products")
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This also removes its images from Cloudinary.")) return;
    await axiosInstance.delete(`/admin/products/${id}`);
    load();
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <h1 className="text-4xl font-display">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      {loading ? (
        <p className="opacity-60">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 border border-line rounded-sm p-4">
              <img
                src={p.images?.[0]?.url || "https://loremflickr.com/100/120/clothing"}
                alt={p.title}
                className="w-14 h-16 object-cover rounded-sm"
              />
              <div className="flex-1">
                <div className="font-display font-medium">{p.title}</div>
                <div className="text-xs opacity-60">{p.category} · {p.condition} · Stock: {p.stock}</div>
              </div>
              <div className="font-display font-semibold">₹{p.price}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-bottle/20" : "bg-red-100"}`}>
                {p.isActive ? "Active" : "Hidden"}
              </span>
              <Link to={`/admin/products/${p._id}/edit`} className="text-sm underline font-semibold">Edit</Link>
              <button onClick={() => handleDelete(p._id)} className="text-sm text-rose underline font-semibold">Delete</button>
            </div>
          ))}
          {products.length === 0 && <p className="opacity-60">No products yet.</p>}
        </div>
      )}
    </div>
  );
}
