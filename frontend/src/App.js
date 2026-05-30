import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import HomePage from "./pages/HomePage";
import WhyFloraxPage from "./pages/WhyFloraxPage";
import TejLeafPage from "./pages/TejLeafPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SustainabilityPage from "./pages/SustainabilityPage";
import FarmersPage from "./pages/FarmersPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AccountPage, { AccountHome } from "./pages/AccountPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PublicShell = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
          <Route path="/why-florax" element={<PublicShell><WhyFloraxPage /></PublicShell>} />
          <Route path="/tejleaf" element={<PublicShell><TejLeafPage /></PublicShell>} />
          <Route path="/products" element={<PublicShell><ProductsPage /></PublicShell>} />
          <Route path="/products/:slug" element={<PublicShell><ProductDetailPage /></PublicShell>} />
          <Route path="/sustainability" element={<PublicShell><SustainabilityPage /></PublicShell>} />
          <Route path="/farmers" element={<PublicShell><FarmersPage /></PublicShell>} />
          <Route path="/contact" element={<PublicShell><ContactPage /></PublicShell>} />
          <Route path="/cart" element={<PublicShell><CartPage /></PublicShell>} />
          <Route path="/checkout" element={<PublicShell><CheckoutPage /></PublicShell>} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/account" element={<PublicShell><AccountPage /></PublicShell>} />
          <Route path="/account/me" element={<PublicShell><AccountHome /></PublicShell>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
