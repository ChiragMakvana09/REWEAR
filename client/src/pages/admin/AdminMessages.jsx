import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/EmptyState";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    axiosInstance.get("/admin/contact").then((res) => setMessages(res.data.messages)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    await axiosInstance.put(`/admin/contact/${id}/read`);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await axiosInstance.delete(`/admin/contact/${id}`);
    showToast("Message deleted");
    load();
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Contact Messages</h1>

      {loading ? (
        <p className="opacity-60">Loading...</p>
      ) : messages.length === 0 ? (
        <EmptyState icon="📬" title="No messages yet" subtitle="Messages from the Contact page will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m._id} className={`border rounded-sm p-5 ${m.isRead ? "border-line" : "border-mustard bg-mustard/10"}`}>
              <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                <div>
                  <div className="font-display font-medium">{m.name} <span className="opacity-50 text-sm">· {m.email}</span></div>
                  {m.subject && <div className="text-sm opacity-70">{m.subject}</div>}
                </div>
                <div className="flex gap-3 items-center">
                  <span className="mono text-[11px] opacity-50">{new Date(m.createdAt).toLocaleDateString("en-IN")}</span>
                  {!m.isRead && <button onClick={() => markRead(m._id)} className="text-xs underline font-semibold">Mark read</button>}
                  <button onClick={() => handleDelete(m._id)} className="text-xs text-rose underline font-semibold">Delete</button>
                </div>
              </div>
              <p className="text-sm opacity-80">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
