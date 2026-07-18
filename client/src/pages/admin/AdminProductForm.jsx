import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const CONDITIONS = ["Like New", "Gently Used", "Well Loved"];
const CATEGORIES = ["Denim", "Dresses", "Outerwear", "Accessories", "Tops", "Skirts", "Footwear", "Knitwear", "Ethnic Wear", "Activewear"];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    size: "",
    condition: "Like New",
    category: "Denim",
    stock: 1,
    rating: 4.5,
    isActive: true,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    axiosInstance.get(`/products/${id}`).then((res) => {
      const p = res.data.product;
      setForm({
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        size: p.size,
        condition: p.condition,
        category: p.category,
        stock: p.stock,
        rating: p.rating || 4.5,
        isActive: p.isActive,
      });
      setExistingImages(p.images);
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      newFiles.forEach((f) => data.append("images", f));

      if (isEdit) {
        await axiosInstance.put(`/admin/products/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/admin/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">{isEdit ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={4} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
          <input name="originalPrice" type="number" placeholder="Original Price (₹)" value={form.originalPrice} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
          <input name="size" placeholder="Size (e.g. M, UK 8)" value={form.size} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
          <input name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5)" value={form.rating} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
          <select name="condition" value={form.condition} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm">
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="category" value={form.category} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Visible on storefront
        </label>

        {existingImages.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wide opacity-60 mb-2">Current Images</div>
            <div className="flex gap-2">
              {existingImages.map((img, i) => (
                <img key={i} src={img.url} alt="" className="w-16 h-20 object-cover rounded-sm" />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs uppercase tracking-wide opacity-60 mb-2">
            {isEdit ? "Add More Images (Cloudinary)" : "Upload Images (Cloudinary)"}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="text-sm"
          />
        </div>

        {error && <p className="text-rose text-sm">{error}</p>}

        <button disabled={saving} className="btn-primary w-full text-center mt-2">
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
