import React, { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import api from "../lib/api";

const CATS = [
  { key: "all", label: "All" },
  { key: "produce", label: "Produce & Honey" },
  { key: "herbs", label: "Herbs & Spices" },
  { key: "biotech-inputs", label: "Biotech Inputs" },
  { key: "wellness", label: "Wellness" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data));
  }, []);

  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <main data-testid="products-page" className="pt-28 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="overline text-florax-muted">Pahadon Wala Pyaar</p>
        <h1 className="mt-4 font-editorial text-5xl sm:text-6xl lg:text-7xl text-florax-primary leading-[1] max-w-3xl">
          Everything we grow,<br />
          <span className="italic">everything we vouch for.</span>
        </h1>
        <p className="mt-6 max-w-xl text-florax-muted">
          Each product carries a batch certificate from our Gangtok lab. Ships across India in 4-7 days.
        </p>

      {/* Filter ribbon — Pahadon Wala Pyaar */}
      <div className="mt-12 flex flex-wrap gap-3 border-b border-florax-border pb-6">
        <p className="overline text-florax-muted w-full mb-2">Pahadon Wala Pyaar · Catalogue</p>
        {CATS.map((c) => (
          <button
            key={c.key}
            data-testid={`filter-${c.key}`}
            onClick={() => setFilter(c.key)}
            className={`px-4 py-2 text-sm tracking-wide transition ${
              filter === c.key
                ? "bg-florax-primary text-florax-bg"
                : "text-florax-muted hover:text-florax-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {visible.map((p) => (
            <div key={p.id} className="flex flex-col">
              <ProductCard product={p} />
              <div
                data-testid={`shop-out-of-stock-${p.slug}`}
                className="mt-5 py-2 text-center text-[10px] tracking-[0.22em] uppercase font-medium bg-florax-accent text-florax-bg"
              >
                Out of Stock :-(
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-florax-muted py-20 text-center">Nothing here yet — try another category.</p>
        )}
      </div>
    </main>
  );
}
