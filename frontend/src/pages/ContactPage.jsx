import React, { useState } from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/inquiries", form);
      toast.success("Message sent", { description: "We'll write back from Gangtok within 2 business days." });
      setDone(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Could not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main data-testid="contact-page" className="pt-28 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <p className="overline text-florax-muted">Contact</p>
          <h1 className="mt-4 font-editorial text-5xl lg:text-6xl text-florax-primary leading-[1]">
            Write to the<br />
            <span className="italic">mountain side.</span>
          </h1>
          <p className="mt-6 text-florax-muted leading-relaxed">
            Wholesale enquiries, lab collaborations, press, or just curiosity — every message lands on a real desk in
            Gangtok and gets a real reply.
          </p>
          <div className="mt-12 space-y-5 text-sm">
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-florax-accent mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="overline text-florax-muted">Founder</p>
                <p className="text-florax-primary mt-1">Debayan Pramanik</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-florax-accent mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-florax-primary">FLORAX R&D Lab</p>
                <p className="text-florax-muted">Tadong, Gangtok, East Sikkim 737102</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-florax-accent mt-0.5" strokeWidth={1.5} />
              <p className="text-florax-primary">debclutch07x33@gmail.com</p>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-florax-accent mt-0.5" strokeWidth={1.5} />
              <p className="text-florax-primary">+91 97338 74268</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {done ? (
            <div data-testid="contact-success" className="border border-florax-border p-10 bg-florax-alt">
              <p className="font-editorial text-3xl text-florax-primary">Thank you.</p>
              <p className="mt-2 text-florax-muted">A reply will land in your inbox within two working days, signed by name.</p>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="contact-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <CField label="Name" required value={form.name} onChange={update("name")} testid="contact-name" />
              <CField label="Email" type="email" required value={form.email} onChange={update("email")} testid="contact-email" />
              <CField label="Phone (optional)" value={form.phone} onChange={update("phone")} testid="contact-phone" />
              <CField label="Subject" required value={form.subject} onChange={update("subject")} testid="contact-subject" />
              <div className="md:col-span-2">
                <label className="overline text-florax-muted block mb-2">Message</label>
                <textarea
                  data-testid="contact-message"
                  rows={6}
                  required
                  value={form.message}
                  onChange={update("message")}
                  className="w-full bg-transparent border border-florax-border focus:border-florax-primary outline-none p-3 text-florax-text"
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <button data-testid="contact-submit" disabled={sending} className="btn-primary disabled:opacity-60">
                  {sending ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const CField = ({ label, value, onChange, type = "text", required, testid }) => (
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
