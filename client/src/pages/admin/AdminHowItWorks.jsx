import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";

const emptyForm = { icon: "✦", title: "", description: "" };

export default function AdminHowItWorks() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    axiosInstance.get("/steps").then((res) => setSteps(res.data.steps)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({ icon: s.icon, title: s.title, description: s.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/admin/steps/${editingId}`, form);
        showToast("Step updated");
      } else {
        await axiosInstance.post("/admin/steps", { ...form, order: steps.length });
        showToast("Step added");
      }
      resetForm();
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not save step", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this step?")) return;
    await axiosInstance.delete(`/admin/steps/${id}`);
    showToast("Step deleted");
    load();
  };

  const move = async (index, direction) => {
    const newSteps = [...steps];
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= newSteps.length) return;
    [newSteps[index], newSteps[swapWith]] = [newSteps[swapWith], newSteps[index]];
    setSteps(newSteps);
    await axiosInstance.put("/admin/steps/reorder", { order: newSteps.map((s) => s._id) });
    showToast("Order updated");
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Manage How It Works</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-putty-light p-6 rounded-sm mb-10">
        <input name="icon" placeholder="Icon (emoji)" value={form.icon} onChange={handleChange} className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <input name="title" placeholder="Step title" value={form.title} onChange={handleChange} required className="bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <textarea name="description" placeholder="Step description" value={form.description} onChange={handleChange} required rows={3} className="md:col-span-2 bg-cream-paper border border-line rounded-sm px-4 py-3 text-sm" />
        <div className="md:col-span-2 flex gap-3">
          <button disabled={saving} className="btn-primary">{saving ? "Saving..." : editingId ? "Save Changes" : "+ Add Step"}</button>
          {editingId && <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>}
        </div>
      </form>

      {loading ? (
        <p className="opacity-60">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <div key={s._id} className="flex items-center gap-4 border border-line rounded-sm p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="w-7 h-7 border border-ink rounded-sm text-xs disabled:opacity-20">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === steps.length - 1} className="w-7 h-7 border border-ink rounded-sm text-xs disabled:opacity-20">↓</button>
              </div>
              <div className="text-2xl">{s.icon}</div>
              <div className="flex-1">
                <div className="font-display font-medium">{s.title}</div>
                <div className="text-xs opacity-60 line-clamp-1">{s.description}</div>
              </div>
              <button onClick={() => startEdit(s)} className="text-sm underline font-semibold">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="text-sm text-rose underline font-semibold">Delete</button>
            </div>
          ))}
          {steps.length === 0 && <p className="opacity-60">No steps yet.</p>}
        </div>
      )}
    </div>
  );
}
