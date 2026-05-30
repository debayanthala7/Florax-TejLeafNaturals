import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import api from "../lib/api";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    address_line1: "", address_line2: "", city: "", state: "Sikkim", pincode: "",
    notes: "",
  });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const shipping = subtotal >= 1500 ? 0 : 80;

  const place = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", { ...form, items });
      setConfirmed(data);
      clear();
    } catch {
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <main data-testid="checkout-success" className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="overline text-florax-accent">Order confirmed</p>
          <h1 className="mt-4 font-editorial text-5xl lg:text-6xl text-florax-primary leading-tight">
            Thank you, {confirmed.customer_name.split(" ")[0]}.
          </h1>
          <p className="mt-6 text-florax-muted">
            Order <span className="text-florax-primary">#{confirmed.id.slice(0, 8)}</span> is being packed in Gangtok.
            A confirmation has been logged to <span className="text-florax-primary">{confirmed.customer_email}</span>.
          </p>
          <div className="mt-10 inline-block bg-florax-alt px-8 py-6 border border-florax-border text-left">
            <p className="text-sm text-florax-muted">Total paid</p>
            <p className="font-editorial text-3xl text-florax-primary">₹{confirmed.total.toFixed(0)}</p>
          </div>
          <div className="mt-12">
            <button data-testid="continue-shopping" onClick={() => nav("/products")} className="btn-primary">Continue shopping</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="checkout-page" className="pt-28 lg:pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <p className="overline text-florax-muted">Checkout</p>
        <h1 className="mt-4 font-editorial text-5xl lg:text-6xl text-florax-primary leading-tight">A few last details.</h1>
        <form onSubmit={place} className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <KField label="Full name" required value={form.customer_name} onChange={update("customer_name")} testid="co-name" />
            <KField label="Email" type="email" required value={form.customer_email} onChange={update("customer_email")} testid="co-email" />
            <KField label="Phone" required value={form.customer_phone} onChange={update("customer_phone")} testid="co-phone" />
            <KField label="Pincode" required value={form.pincode} onChange={update("pincode")} testid="co-pincode" />
            <div className="md:col-span-2"><KField label="Address line 1" required value={form.address_line1} onChange={update("address_line1")} testid="co-addr1" /></div>
            <div className="md:col-span-2"><KField label="Address line 2 (optional)" value={form.address_line2} onChange={update("address_line2")} testid="co-addr2" /></div>
            <KField label="City" required value={form.city} onChange={update("city")} testid="co-city" />
            <KField label="State" required value={form.state} onChange={update("state")} testid="co-state" />
            <div className="md:col-span-2">
              <label className="overline text-florax-muted block mb-2">Notes (optional)</label>
              <textarea data-testid="co-notes" rows={3} value={form.notes} onChange={update("notes")} className="w-full bg-transparent border border-florax-border focus:border-florax-primary outline-none p-3" />
            </div>
            <div className="md:col-span-2">
              <button data-testid="place-order-btn" disabled={submitting} className="btn-primary w-full justify-center">
                {submitting ? "Placing order…" : `Place order — ₹${(subtotal + shipping).toFixed(0)}`}
              </button>
              <p className="text-xs text-florax-muted mt-3">Cash on delivery / bank transfer. Payment confirmation by email.</p>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="bg-florax-alt p-8 border border-florax-border">
              <p className="overline text-florax-muted">Your basket</p>
              <ul className="mt-6 divide-y divide-florax-border">
                {items.map((it) => (
                  <li key={it.product_id} className="py-3 flex justify-between text-sm">
                    <span className="text-florax-primary">{it.name} <span className="text-florax-muted">× {it.quantity}</span></span>
                    <span>₹{(it.price * it.quantity).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-florax-muted">Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-florax-muted">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="border-t border-florax-border pt-3 flex justify-between font-editorial text-2xl text-florax-primary">
                  <span>Total</span><span>₹{(subtotal + shipping).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

const KField = ({ label, value, onChange, type = "text", required, testid }) => (
  <div>
    <label className="overline text-florax-muted block mb-2">{label}</label>
    <input data-testid={testid} type={type} value={value} required={required} onChange={onChange} className="w-full bg-transparent border-b border-florax-border focus:border-florax-primary outline-none py-2 text-florax-text" />
  </div>
);
