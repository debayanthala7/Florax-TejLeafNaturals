import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, updateQty, remove, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 80;

  return (
    <main data-testid="cart-page" className="pt-28 lg:pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <p className="overline text-florax-muted">Your basket</p>
        <h1 className="mt-4 font-editorial text-5xl lg:text-6xl text-florax-primary leading-tight">Cart</h1>

        {items.length === 0 ? (
          <div className="mt-16 border-t border-florax-border pt-16 text-center">
            <p className="font-editorial text-2xl text-florax-primary">Your basket is quiet.</p>
            <Link to="/products" data-testid="empty-cart-shop" className="mt-6 inline-block btn-primary">
              Visit the shop
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 divide-y divide-florax-border border-y border-florax-border">
              {items.map((it) => (
                <div key={it.product_id} data-testid={`cart-row-${it.product_id}`} className="py-6 flex gap-6">
                  <img src={it.image} alt={it.name} className="w-24 h-28 object-cover bg-florax-alt" />
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-editorial text-2xl text-florax-primary">{it.name}</h3>
                    <p className="text-sm text-florax-muted mt-1">₹{it.price.toFixed(0)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-florax-border w-fit">
                        <button onClick={() => updateQty(it.product_id, it.quantity - 1)} className="p-2 hover:bg-florax-alt"><Minus className="w-4 h-4" /></button>
                        <span className="px-4 text-sm">{it.quantity}</span>
                        <button onClick={() => updateQty(it.product_id, it.quantity + 1)} className="p-2 hover:bg-florax-alt"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => remove(it.product_id)} data-testid={`remove-${it.product_id}`} className="text-florax-muted hover:text-florax-accent">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-editorial text-xl text-florax-primary self-start">₹{(it.price * it.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <aside className="lg:col-span-4">
              <div className="bg-florax-alt p-8 border border-florax-border space-y-4">
                <div className="flex justify-between text-sm"><span className="text-florax-muted">Subtotal</span><span data-testid="cart-subtotal">₹{subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-florax-muted">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="border-t border-florax-border pt-4 flex justify-between font-editorial text-2xl text-florax-primary">
                  <span>Total</span><span data-testid="cart-total">₹{(subtotal + shipping).toFixed(0)}</span>
                </div>
                <button data-testid="checkout-btn" onClick={() => navigate("/checkout")} className="btn-primary w-full justify-center mt-2">
                  Proceed to checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
