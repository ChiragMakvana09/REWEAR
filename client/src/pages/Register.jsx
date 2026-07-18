import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[420px] mx-auto px-8 py-24">
      <h1 className="text-3xl font-display mb-8 text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        {error && <p className="text-rose text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full text-center">{loading ? "Creating..." : "Register"}</button>
      </form>
      <p className="text-center text-sm opacity-70 mt-6">
        Already have an account? <Link to="/login" className="underline font-semibold">Login</Link>
      </p>
    </div>
  );
}
