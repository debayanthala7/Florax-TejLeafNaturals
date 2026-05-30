import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export const ProductCard = ({ product }) => {
  const { add } = useCart();
  return (
    <div data-testid={`product-card-${product.slug}`} className="group">
      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-florax-alt">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="pt-5 pb-2 flex items-start justify-between gap-4">
        <div>
          <p className="overline text-florax-muted">{product.category}</p>
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-editorial text-2xl text-florax-primary mt-1 leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-florax-muted mt-2 line-clamp-2 max-w-[28ch]">
            {product.short_description}
          </p>
        </div>
        <div className="text-right">
          <p className="font-body text-florax-primary text-lg">₹{product.price.toFixed(0)}</p>
          <p className="text-xs text-florax-muted">{product.unit}</p>
        </div>
      </div>
      <button
        data-testid={`add-to-cart-${product.slug}`}
        onClick={() => {
          add(product);
          toast.success(`${product.name} added`, { description: "Find it in your cart." });
        }}
        className="mt-2 text-sm tracking-wide text-florax-primary border-b border-florax-primary/40 hover:border-florax-primary transition pb-0.5"
      >
        Add to cart →
      </button>
    </div>
  );
};
