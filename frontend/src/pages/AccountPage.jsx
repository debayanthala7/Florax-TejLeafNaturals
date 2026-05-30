import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import api from "../lib/api";

const STORAGE_TOKEN = "florax_user_token";
const STORAGE_NAME = "florax_user_name";
const STORAGE_EMAIL = "florax_user_email";

export default function AccountPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState("signup"); // signup | login
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loggedIn = typeof window !== "undefined" && !!localStorage.getItem(STORAGE_TOKEN);
  if (loggedIn) return <Navigate to="/account/me" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const path = mode === "signup" ? "/users/register" : "/users/login";
      const payload = mode === "signup" ? form : { email: form.email, password: form.password };
      const { data } = await api.post(path, payload);
      localStorage.setItem(STORAGE_TOKEN, data.token);
      localStorage.setItem(STORAGE_NAME, data.name || form.name || "");
      localStorage.setItem(STORAGE_EMAIL, data.email || form.email);
      toast.success(mode === "signup" ? "Welcome to FLORAX." : "Welcome back.");
      nav("/account/me");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Could not complete. Try again.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main data-testid="account-page" className="pt-28 lg:pt-32 pb-24 min-h-screen">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center">
          <img src="/florax-logo.png" alt="FLORAX" className="h-12 mx-auto object-contain" />
          <p className="overline text-florax-muted mt-6">Account</p>
          <h1 className="mt-3 font-editorial text-4xl text-florax-primary">
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </h1>
          <p className="mt-3 text-sm text-florax-muted">
            {mode === "signup"
              ? "Track your orders, save the slopes you love."
              : "Sign in to your FLORAX account."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-6">
          {mode === "signup" && (
            <Field label="Full name" required value={form.name} onChange={update("name")} testid="acc-name" />
          )}
          <Field label="Email" type="email" required value={form.email} onChange={update("email")} testid="acc-email" />
          {mode === "signup" && (
            <Field label="Phone (optional)" value={form.phone} onChange={update("phone")} testid="acc-phone" />
          )}
          <Field label="Password" type="password" required value={form.password} onChange={update("password")} testid="acc-password" />
          <button data-testid="acc-submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-florax-muted">
          {mode === "signup" ? "Already have an account?" : "New to FLORAX?"}{" "}
          <button
            type="button"
            data-testid="acc-mode-toggle"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="link-underline text-florax-primary"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>

        <p className="mt-4 text-xs text-center text-florax-muted">
          By continuing you agree to the FLORAX terms.{" "}
          <Link to="/" className="link-underline">Back home</Link>
        </p>
      </div>
    </main>
  );
}

export function AccountHome() {
  const nav = useNavigate();
  const name = localStorage.getItem(STORAGE_NAME);
  const email = localStorage.getItem(STORAGE_EMAIL);
  const token = localStorage.getItem(STORAGE_TOKEN);
  if (!token) return <Navigate to="/account" replace />;

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_NAME);
    localStorage.removeItem(STORAGE_EMAIL);
    toast.success("Signed out");
    nav("/");
  };

  return (
    <main data-testid="account-home" className="pt-28 lg:pt-32 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <img src="/florax-logo.png" alt="FLORAX" className="h-10 object-contain" />
        <p className="overline text-florax-muted mt-10">My Account</p>
        <h1 className="mt-3 font-editorial text-5xl text-florax-primary">
          Namaste, {name || "friend"}.
        </h1>
        <p className="mt-4 text-florax-muted">{email}</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/products" className="border border-florax-border p-8 hover:bg-florax-alt transition">
            <p className="overline text-florax-muted">Catalogue</p>
            <p className="mt-3 font-editorial text-2xl text-florax-primary">Pahadon Wala Pyaar</p>
            <p className="mt-2 text-sm text-florax-muted">Visit the shop</p>
          </Link>
          <Link to="/contact" className="border border-florax-border p-8 hover:bg-florax-alt transition">
            <p className="overline text-florax-muted">Support</p>
            <p className="mt-3 font-editorial text-2xl text-florax-primary">Talk to Gangtok</p>
            <p className="mt-2 text-sm text-florax-muted">Reach the team</p>
          </Link>
        </div>

        <button
          data-testid="acc-logout"
          onClick={logout}
          className="mt-12 inline-flex items-center gap-2 text-sm text-florax-muted hover:text-florax-accent"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </main>
  );
}

const Field = ({ label, value, onChange, type = "text", required, testid }) => (
  <div>
    <label className="overline text-florax-muted block mb-2">{label}</label>
    <input
      data-testid={testid}
      type={type}
      value={value}
      required={required}
      onChange={onChange}
      className="w-full bg-transparent border-b border-florax-border focus:border-florax-primary outline-none py-2 text-florax-text"
    />
  </div>
);
