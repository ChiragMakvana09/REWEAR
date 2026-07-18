import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";

const emptyForm = { name: "", description: "", icon: "", order: 0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    axiosInstance.get("/admin/categories").then((res) => setCategories(res.data.categories)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, description: c.description, icon: c.icon, order: c.order });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("image", file);

      if (editingId) {
        await axiosInstance.put(`/admin/categories/${editingId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Category updated");
      } else {
        await axiosInstance.post("/admin/categories", data, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Category added");
      }
      resetForm();
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not save category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await axiosInstance.delete(`/admin/categories/${id}`);
    showToast("Category deleted");
    load();
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-putty-light p-6 rounded-sm mb-10">
        <input name="name" placeholder="Category name" value={form.name} onChange={handleChange} required className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input name="icon" placeholder="Icon (emoji, e.g. 👖)" value={form.icon} onChange={handleChange} className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <textarea name="description" placeholder="Short description" value={form.description} onChange={handleChange} rows={2} className="md:col-span-2 bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input name="order" type="number" placeholder="Display order" value={form.order} onChange={handleChange} className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm self-center" />
        <div className="md:col-span-2 flex gap-3">
          <button disabled={saving} className="btn-primary">{saving ? "Saving..." : editingId ? "Save Changes" : "+ Add Category"}</button>
          {editingId && <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>}
        </div>
      </form>

      {loading ? (
        <p className="opacity-60">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center gap-4 border border-line rounded-sm p-4">
              <img src={c.image?.url || "https://loremflickr.com/100/100/fashion"} alt={c.name} className="w-14 h-14 object-cover rounded-sm" />
              <div className="flex-1">
                <div className="font-display font-medium">{c.icon} {c.name}</div>
                <div className="text-xs opacity-60 line-clamp-1">{c.description}</div>
              </div>
              <button onClick={() => startEdit(c)} className="text-sm underline font-semibold">Edit</button>
              <button onClick={() => handleDelete(c._id)} className="text-sm text-rose underline font-semibold">Delete</button>
            </div>
          ))}
          {categories.length === 0 && <p className="opacity-60">No categories yet.</p>}
        </div>
      )}
    </div>
  );
}
