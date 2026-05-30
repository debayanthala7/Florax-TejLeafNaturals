import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/api";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("florax_admin_token");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/admin/login", { email, password });
      localStorage.setItem("florax_admin_token", data.token);
      toast.success("Welcome back");
      nav("/admin");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  if (hasToken) return <Navigate to="/admin" replace />;

  return (
    <main data-testid="admin-login" className="pt-32 pb-24 min-h-screen">
      <div className="max-w-md mx-auto px-6">
        <p className="overline text-florax-muted">FLORAX · Admin</p>
        <h1 className="mt-4 font-editorial text-4xl text-florax-primary">Sign in</h1>
        <form onSubmit={submit} className="mt-10 space-y-6">
          <div>
            <label className="overline text-florax-muted block mb-2">Email</label>
            <input data-testid="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-florax-border focus:border-florax-primary outline-none py-2" />
          </div>
          <div>
            <label className="overline text-florax-muted block mb-2">Password</label>
            <input data-testid="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-florax-border focus:border-florax-primary outline-none py-2" />
          </div>
          <button data-testid="admin-login-btn" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
