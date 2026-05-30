import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${slug}`).then((r) => setP(r.data)).catch(() => setP(false));
  }, [slug]);

  if (p === null) return <div className="pt-32 text-center text-florax-muted">Loading…</div>;
  if (p === false)
    return (
      <div className="pt-32 text-center">
        <p className="text-florax-muted">Product not found.</p>
        <Link className="link-underline mt-4 inline-block" to="/products">Back to shop</Link>
      </div>
    );

  return (
    <main data-testid="product-detail" className="pt-28 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Link to="/products" data-testid="back-to-shop" className="inline-flex items-center text-sm text-florax-muted hover:text-florax-primary">
          <ChevronLeft className="w-4 h-4" /> Back to shop
        </Link>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="aspect-[4/5] bg-florax-alt overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="overline text-florax-muted">{p.category}</p>
            <h1 className="mt-3 font-editorial text-4xl lg:text-5xl text-florax-primary leading-tight">{p.name}</h1>
            <p className="mt-4 text-florax-muted leading-relaxed">{p.description}</p>
            <div className="mt-8 flex items-center gap-6">
              <p className="font-editorial text-3xl text-florax-primary">₹{p.price.toFixed(0)}</p>
              <p className="text-sm text-florax-muted">{p.unit}</p>
            </div>
            <div className="mt-8 flex items-center border border-florax-border w-fit">
              <button
                data-testid="qty-decrement"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-florax-alt"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span data-testid="qty-value" className="px-6 text-sm">{qty}</span>
              <button
                data-testid="qty-increment"
                onClick={() => setQty((q) => q + 1)}
                className="p-3 hover:bg-florax-alt"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              data-testid="add-to-cart-detail"
              onClick={() => {
                add(p, qty);
                toast.success(`${qty} × ${p.name} added`);
              }}
              className="btn-primary mt-8 w-full justify-center"
            >
              Add to cart — ₹{(p.price * qty).toFixed(0)}
            </button>
            <div className="mt-10 border-t border-florax-border pt-6 text-sm text-florax-muted space-y-2">
              <p>· Lab batch certificate included with every order.</p>
              <p>· Ships from Gangtok in 24 hours.</p>
              <p>· Free shipping on orders above ₹1,500.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
