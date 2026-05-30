import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Search, UserCircle, Menu, X, Home } from "lucide-react";
import { useCart } from "../context/CartContext";
import { SearchPanel } from "./SearchPanel";

const links = [
  { to: "/why-florax", label: "Why FLORAX?" },
  { to: "/products", label: "Pahadon Wala Pyaar" },
  { to: "/sustainability", label: "Kahaniyan Pahadon Ki", calligraphic: true },
  { to: "/farmers", label: "Kisan" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const loc = useLocation();

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close search on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderLabel = (l) => {
    if (!l.calligraphic) return l.label;
    const parts = l.label.split(" ");
    return (
      <>
        <span className="font-editorial italic text-base align-middle">{parts[0]}</span>{" "}
        <span className="align-middle">{parts.slice(1).join(" ")}</span>
      </>
    );
  };

  return (
    <>
      <header
        data-testid="site-navbar"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-florax-bg/85 backdrop-blur-xl border-b border-florax-border/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-4">
          <Link to="/" data-testid="brand-logo" className="flex items-center gap-3 shrink-0">
            <img
              src="/florax-logo.png"
              alt="FLORAX"
              className="h-8 lg:h-10 w-auto object-contain"
            />
            <span className="overline text-florax-muted hidden xl:inline">Sikkim · Est. 2024</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-${l.label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                className={({ isActive }) =>
                  `text-sm tracking-wide whitespace-nowrap link-underline ${
                    isActive ? "text-florax-primary" : "text-florax-muted hover:text-florax-primary"
                  }`
                }
              >
                {renderLabel(l)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 lg:gap-5 shrink-0">
            <Link
              to="/"
              data-testid="nav-home-icon"
              aria-label="Home"
              className="text-florax-primary hover:opacity-80 transition"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button
              data-testid="search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="text-florax-primary hover:opacity-80 transition"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/account"
              data-testid="account-link"
              aria-label="Account"
              className="text-florax-primary hover:opacity-80 transition"
            >
              <UserCircle className="w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              data-testid="nav-cart"
              aria-label="Cart"
              className="relative inline-flex items-center text-florax-primary hover:opacity-80"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-3 bg-florax-accent text-florax-bg text-[10px] w-5 h-5 grid place-items-center rounded-full"
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              data-testid="mobile-menu-toggle"
              className="lg:hidden text-florax-primary"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden bg-florax-bg border-t border-florax-border">
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  data-testid={`mobile-nav-${l.label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                  className={({ isActive }) =>
                    `text-base ${isActive ? "text-florax-primary" : "text-florax-muted"}`
                  }
                >
                  {renderLabel(l)}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </>
  );
};
