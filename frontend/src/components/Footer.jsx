import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      const { data } = await api.post("/newsletter/subscribe", { email });
      setDone(true);
      toast.success(data.already ? "You're already on the list." : "Welcome to the FLORAX list.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p data-testid="newsletter-success" className="text-sm text-florax-bg/80">
        Thank you. The next dispatch lands in your inbox before the next monsoon.
      </p>
    );
  }

  return (
    <form data-testid="newsletter-form" onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
      <input
        data-testid="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent border-b border-florax-bg/50 focus:border-florax-secondary outline-none py-2 text-florax-bg placeholder:text-florax-bg/45"
      />
      <button
        data-testid="newsletter-submit"
        disabled={busy}
        className="px-6 py-2 bg-florax-secondary text-florax-primary text-sm tracking-wide hover:bg-florax-bg transition disabled:opacity-50"
      >
        {busy ? "Subscribing…" : "Subscribe →"}
      </button>
    </form>
  );
};

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-florax-primary text-florax-bg mt-32">
      {/* Newsletter bar */}
      <div className="border-b border-florax-bg/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <p className="overline text-florax-secondary">Stay close to the mountain</p>
            <h3 className="mt-3 font-editorial text-3xl lg:text-4xl leading-tight">
              Subscribe to our newsletter <span className="italic text-florax-secondary">for exclusive offers.</span>
            </h3>
          </div>
          <div className="lg:col-span-7">
            <NewsletterForm />
            <p className="mt-3 text-xs text-florax-bg/55">
              One dispatch a month. Single-harvest releases, partner-farm news, and quiet discounts you won't find anywhere else.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          {/* Brand chip with logo on light background so logo reads on dark footer */}
          <div className="inline-flex items-center gap-3 bg-florax-bg px-5 py-3 mb-8">
            <img src="/florax-logo.png" alt="FLORAX" className="h-9 w-auto object-contain" />
          </div>
          <h3 className="font-editorial text-4xl lg:text-5xl leading-none">
            Rooted in Sikkim.<br />
            <span className="text-florax-secondary italic">Reaching beyond.</span>
          </h3>
          <p className="mt-6 text-florax-bg/70 max-w-md text-sm leading-relaxed">
            FLORAX is a Himalayan agri-biotech house growing organic produce, microbial
            inputs and field science with the Kisans of Sikkim.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="overline text-florax-bg/60 mb-4">Visit</p>
          <ul className="space-y-2 text-sm text-florax-bg/85">
            <li>R&D Lab — Tadong, Gangtok</li>
            <li>East Sikkim, India 737102</li>
            <li className="pt-2"><span className="overline text-florax-bg/60">Owner</span><br />Debayan Pramanik</li>
            <li>debclutch07x33@gmail.com</li>
            <li>+91 97338 74268</li>
            <li className="pt-3 border-t border-florax-bg/15 mt-3">
              <span className="overline text-florax-bg/60">TejLeaf Naturals</span><br />
              Originated by Suvajit Mandal<br />
              +91 89673 00470
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="overline text-florax-bg/60 mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-florax-secondary" to="/products">Pahadon Wala Pyaar</Link></li>
            <li><Link className="hover:text-florax-secondary" to="/sustainability"><span className="font-editorial italic">Kahaniyan</span> Pahadon Ki</Link></li>
            <li><Link className="hover:text-florax-secondary" to="/farmers">Kisan</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="overline text-florax-bg/60 mb-4">Inside</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-florax-secondary" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-florax-secondary" to="/account">My Account</Link></li>
            <li><Link className="hover:text-florax-secondary" to="/admin/login">Admin</Link></li>
          </ul>
          <p className="overline text-florax-bg/60 mt-8 mb-3">Follow us</p>
          <a
            href="https://www.instagram.com/debayan.thala7"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="instagram-link"
            aria-label="Instagram"
            className="inline-flex items-center justify-center w-10 h-10 border border-florax-bg/40 rounded-full hover:bg-florax-secondary hover:text-florax-primary hover:border-florax-secondary transition"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="border-t border-florax-bg/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-florax-bg/55">
          <span>© 2024 FLORAX Agri-Biotechnologies Pvt. Ltd. All rights reserved.</span>
          <span>Crafted in the Himalayas. Verified in our lab.</span>
        </div>
      </div>
    </footer>
  );
};
