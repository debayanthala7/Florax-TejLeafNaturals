import React, { useState } from "react";
import { toast } from "sonner";
import api from "../lib/api";

const HARVEST = "https://images.pexels.com/photos/27177517/pexels-photo-27177517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function FarmersPage() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", village: "", district: "",
    farm_size_acres: "", crops: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/partners", { ...form, farm_size_acres: parseFloat(form.farm_size_acres || "0") });
      toast.success("Application received", { description: "Our field team will reach out within a week." });
      setSuccess(true);
      setForm({ full_name: "", email: "", phone: "", village: "", district: "", farm_size_acres: "", crops: "", notes: "" });
    } catch (err) {
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main data-testid="farmers-page" className="pt-28 lg:pt-32">
      <section className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-12">
        <div className="lg:col-span-7">
          <p className="overline text-florax-muted">Kisan Sajhedari Karyakram</p>
          <h1 className="mt-4 font-editorial text-5xl sm:text-6xl lg:text-7xl text-florax-primary leading-[0.95]">
            Grow with us.<br />
            <span className="italic text-florax-accent">Be paid like a partner.</span>
          </h1>
          <p className="mt-8 max-w-xl text-florax-muted text-lg leading-relaxed">
            FLORAX works with twelve families across East and North Sikkim. We commit to multi-year buying
            contracts, supply microbial inputs at cost, and run quarterly field training. We are slowly opening
            this circle to more farms.
          </p>
        </div>
        <div className="lg:col-span-5">
          <img src={HARVEST} alt="Organic harvest" className="w-full h-[60vh] object-cover" />
        </div>
      </section>

      <section className="py-20 bg-florax-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { t: "Multi-year contract", b: "Three-year minimum buying commitment, indexed to inflation." },
            { t: "Inputs at cost", b: "Compost activator, nettle tonic and mother seeds at our manufacturing cost." },
            { t: "Quarterly training", b: "Our agronomists visit on rotation. Soil tests once a year." },
            { t: "Lab access", b: "Free product testing for any partner farm at our Gangtok lab." },
          ].map((x, i) => (
            <div key={i}>
              <p className="font-editorial text-3xl text-florax-primary">0{i + 1}</p>
              <h4 className="font-editorial text-xl text-florax-primary mt-3">{x.t}</h4>
              <p className="text-sm text-florax-muted mt-2 leading-relaxed">{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="overline text-florax-muted">Apply</p>
          <h2 className="mt-4 font-editorial text-4xl lg:text-5xl text-florax-primary leading-tight">
            Tell us about your farm.
          </h2>
          <p className="mt-4 text-florax-muted">
            Our field team responds to every application within 7 working days.
          </p>
          {success ? (
            <div data-testid="partner-success" className="mt-12 border border-florax-border p-10 bg-florax-alt">
              <p className="font-editorial text-2xl text-florax-primary">Thank you.</p>
              <p className="text-florax-muted mt-2">Your application is on our field team's desk in Gangtok. They'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="partner-form" className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Field label="Full name" required value={form.full_name} onChange={update("full_name")} testid="partner-name" />
              <Field label="Email" type="email" required value={form.email} onChange={update("email")} testid="partner-email" />
              <Field label="Phone" required value={form.phone} onChange={update("phone")} testid="partner-phone" />
              <Field label="Village" required value={form.village} onChange={update("village")} testid="partner-village" />
              <Field label="District" required value={form.district} onChange={update("district")} testid="partner-district" />
              <Field label="Farm size (acres)" type="number" step="0.1" required value={form.farm_size_acres} onChange={update("farm_size_acres")} testid="partner-size" />
              <div className="md:col-span-2">
                <Field label="Primary crops" required value={form.crops} onChange={update("crops")} testid="partner-crops" />
              </div>
              <div className="md:col-span-2">
                <label className="overline text-florax-muted block mb-2">Notes (optional)</label>
                <textarea
                  data-testid="partner-notes"
                  value={form.notes}
                  onChange={update("notes")}
                  rows={4}
                  className="w-full bg-transparent border-b border-florax-border focus:border-florax-primary outline-none py-2 text-florax-text"
                />
              </div>
              <div className="md:col-span-2 mt-6">
                <button data-testid="partner-submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                  {submitting ? "Sending…" : "Submit application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

const Field = ({ label, value, onChange, type = "text", required, step, testid }) => (
  <div>
    <label className="overline text-florax-muted block mb-2">{label}</label>
    <input
      data-testid={testid}
      type={type}
      step={step}
      value={value}
      required={required}
      onChange={onChange}
      className="w-full bg-transparent border-b border-florax-border focus:border-florax-primary outline-none py-2 text-florax-text"
    />
  </div>
);
