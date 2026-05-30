import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { X, Search } from "lucide-react";
import api from "../lib/api";

export const SearchPanel = ({ onClose }) => {
  const [q, setQ] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim().toLowerCase();
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.short_description || "").toLowerCase().includes(term)
      )
      .slice(0, 10);
  }, [q, products]);

  return (
    <div
      data-testid="search-panel"
      className="fixed inset-0 z-[60] bg-florax-bg/95 backdrop-blur-xl animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="max-w-3xl mx-auto px-6 pt-28"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <p className="overline text-florax-muted">Search Pahadon Wala Pyaar</p>
          <button
            data-testid="search-close"
            onClick={onClose}
            aria-label="Close search"
            className="text-florax-primary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b-2 border-florax-primary py-2">
          <Search className="w-6 h-6 text-florax-primary" />
          <input
            data-testid="search-input"
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, herbs, gifts…"
            className="flex-1 bg-transparent outline-none text-2xl font-editorial text-florax-primary placeholder:text-florax-muted/60"
          />
        </div>

        <div className="mt-8 space-y-2 max-h-[60vh] overflow-y-auto">
          {q && filtered.length === 0 && (
            <p className="text-florax-muted text-sm py-8 text-center">No matches for "{q}".</p>
          )}
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.slug}`}
              data-testid={`search-result-${p.slug}`}
              onClick={onClose}
              className="flex gap-4 items-center p-3 hover:bg-florax-alt transition"
            >
              <img src={p.image} alt={p.name} className="w-14 h-16 object-cover bg-florax-alt" />
              <div className="flex-1">
                <p className="overline text-florax-muted">{p.category}</p>
                <p className="font-editorial text-xl text-florax-primary leading-tight">{p.name}</p>
              </div>
              <p className="font-editorial text-lg text-florax-primary">₹{p.price.toFixed(0)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
