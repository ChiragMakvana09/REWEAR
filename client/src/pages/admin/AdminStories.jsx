import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";

const emptyForm = { userName: "", location: "", title: "", description: "", rating: 5, date: "" };

export default function AdminStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    axiosInstance.get("/admin/stories").then((res) => setStories(res.data.stories)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({
      userName: s.userName,
      location: s.location,
      title: s.title,
      description: s.description,
      rating: s.rating,
      date: s.date ? s.date.slice(0, 10) : "",
    });
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
      if (file) data.append("photo", file);

      if (editingId) {
        await axiosInstance.put(`/admin/stories/${editingId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Story updated");
      } else {
        await axiosInstance.post("/admin/stories", data, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Story added");
      }
      resetForm();
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not save story", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    await axiosInstance.delete(`/admin/stories/${id}`);
    showToast("Story deleted");
    load();
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Manage Stories</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-putty-light p-6 rounded-sm mb-10">
        <input name="userName" placeholder="Customer name" value={form.userName} onChange={handleChange} required className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input name="title" placeholder="Story title" value={form.title} onChange={handleChange} required className="md:col-span-2 bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <textarea name="description" placeholder="Story description" value={form.description} onChange={handleChange} required rows={3} className="md:col-span-2 bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <select name="rating" value={form.rating} onChange={handleChange} className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm">
          {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>)}
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm self-center md:col-span-2" />
        <div className="md:col-span-2 flex gap-3">
          <button disabled={saving} className="btn-primary">{saving ? "Saving..." : editingId ? "Save Changes" : "+ Add Story"}</button>
          {editingId && <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>}
        </div>
      </form>

      {loading ? (
        <p className="opacity-60">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {stories.map((s) => (
            <div key={s._id} className="flex items-center gap-4 border border-line rounded-sm p-4">
              <img src={s.photo?.url || "https://loremflickr.com/100/100/portrait"} alt={s.userName} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-display font-medium">{s.userName} · {s.location}</div>
                <div className="text-xs opacity-60 line-clamp-1">{s.title} — {"★".repeat(s.rating)}</div>
              </div>
              <button onClick={() => startEdit(s)} className="text-sm underline font-semibold">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="text-sm text-rose underline font-semibold">Delete</button>
            </div>
          ))}
          {stories.length === 0 && <p className="opacity-60">No stories yet.</p>}
        </div>
      )}
    </div>
  );
}
