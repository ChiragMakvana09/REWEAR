import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[420px] mx-auto px-8 py-24">
      <h1 className="text-3xl font-display mb-8 text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm" />
        {error && <p className="text-rose text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full text-center">{loading ? "Signing in..." : "Login"}</button>
      </form>
      <p className="text-center text-sm opacity-70 mt-6">
        No account yet? <Link to="/register" className="underline font-semibold">Register</Link>
      </p>
    </div>
  );
}
