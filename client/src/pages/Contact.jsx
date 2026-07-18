import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../context/ToastContext";
import FAQAccordion from "../components/FAQAccordion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/contact", form);
      showToast("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      showToast("Could not send message, try again later", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="eyebrow">Get in touch</div>
        <h1 className="text-4xl md:text-5xl font-display mb-3">Contact Us</h1>
        <p className="opacity-70 text-sm mb-12 max-w-md">
          Questions about an order, a return, or just want to say hi? Drop us a line.
        </p>

        <div className="grid md:grid-cols-2 gap-14">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name" required value={form.name} onChange={handleChange}
                placeholder="Your name"
                className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm"
              />
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="Your email"
                className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm"
              />
            </div>
            <input
              name="subject" value={form.subject} onChange={handleChange}
              placeholder="Subject"
              className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm"
            />
            <textarea
              name="message" required value={form.message} onChange={handleChange}
              placeholder="Your message" rows={6}
              className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm resize-none"
            />
            <button type="submit" disabled={loading} className="btn-primary self-start">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="space-y-6">
            <div>
              <h4 className="mono text-xs uppercase tracking-wide opacity-60 mb-1">Email</h4>
              <p className="font-display text-lg">hello@rewear.com</p>
            </div>
            <div>
              <h4 className="mono text-xs uppercase tracking-wide opacity-60 mb-1">Phone</h4>
              <p className="font-display text-lg">+91 98765 43210</p>
            </div>
            <div>
              <h4 className="mono text-xs uppercase tracking-wide opacity-60 mb-1">Studio</h4>
              <p className="font-display text-lg">Ahmedabad, Gujarat, India</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-putty-light py-20">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center mb-12">
            <div className="eyebrow justify-center">Good to know</div>
            <h2 className="text-3xl md:text-4xl font-display">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion />
        </div>
      </section>
    </div>
  );
}
