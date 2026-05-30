import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Trash2, Plus } from "lucide-react";
import api from "../lib/api";

const TABS = ["Overview", "Products", "Journal", "Inquiries", "Partners", "Orders"];

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("florax_admin_token");

  const refresh = async () => {
    try {
      const [s, p, b, i, pa, o] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/products"),
        api.get("/blog"),
        api.get("/inquiries"),
        api.get("/partners"),
        api.get("/orders"),
      ]);
      setStats(s.data); setProducts(p.data); setPosts(b.data);
      setInquiries(i.data); setPartners(pa.data); setOrders(o.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("florax_admin_token");
        nav("/admin/login");
      }
    }
  };
  useEffect(() => { if (hasToken) refresh(); }, [hasToken]);

  if (!hasToken) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    localStorage.removeItem("florax_admin_token");
    toast.success("Signed out");
    nav("/admin/login");
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-florax-primary text-florax-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-editorial text-2xl">FLORAX</span>
            <span className="overline text-florax-bg/60">Admin Console</span>
          </div>
          <button data-testid="admin-logout" onClick={logout} className="text-sm flex items-center gap-2 hover:text-florax-secondary">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex gap-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              data-testid={`admin-tab-${t.toLowerCase()}`}
              onClick={() => setTab(t)}
              className={`py-3 text-sm tracking-wide border-b-2 transition ${
                tab === t ? "border-florax-secondary text-florax-secondary" : "border-transparent text-florax-bg/70"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {tab === "Overview" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Products", v: stats.products },
              { l: "New inquiries", v: stats.inquiries_new, sub: `${stats.inquiries} total` },
              { l: "Partner pending", v: stats.partners_pending, sub: `${stats.partners} total` },
              { l: "Orders placed", v: stats.orders_placed, sub: `${stats.orders} total` },
            ].map((c) => (
              <div key={c.l} className="bg-white border border-florax-border p-6">
                <p className="overline text-florax-muted">{c.l}</p>
                <p className="font-editorial text-5xl text-florax-primary mt-3">{c.v}</p>
                {c.sub && <p className="text-xs text-florax-muted mt-2">{c.sub}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "Products" && <ProductsPanel products={products} refresh={refresh} />}
        {tab === "Journal" && <BlogPanel posts={posts} refresh={refresh} />}
        {tab === "Inquiries" && <InquiriesPanel rows={inquiries} refresh={refresh} />}
        {tab === "Partners" && <PartnersPanel rows={partners} refresh={refresh} />}
        {tab === "Orders" && <OrdersPanel rows={orders} refresh={refresh} />}
      </main>
    </div>
  );
}

const ProductsPanel = ({ products, refresh }) => {
  const [show, setShow] = useState(false);
  const empty = { name: "", slug: "", category: "produce", price: 0, unit: "pack", short_description: "", description: "", image: "", stock: 50, featured: false };
  const [form, setForm] = useState(empty);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
      toast.success("Product created");
      setShow(false); setForm(empty); refresh();
    } catch { toast.error("Failed to create"); }
  };
  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Deleted"); refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-editorial text-3xl text-florax-primary">Products</h2>
        <button data-testid="add-product-btn" onClick={() => setShow((v) => !v)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add product</button>
      </div>
      {show && (
        <form onSubmit={submit} className="bg-white border border-florax-border p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name","slug","short_description","description","image"].map((k) => (
            <input key={k} data-testid={`new-product-${k}`} required={k!=="description"} placeholder={k} value={form[k]} onChange={update(k)} className="border border-florax-border p-2 text-sm" />
          ))}
          <select value={form.category} onChange={update("category")} className="border border-florax-border p-2 text-sm">
            {["produce","herbs","biotech-inputs","wellness"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="price" value={form.price} onChange={update("price")} className="border border-florax-border p-2 text-sm" />
          <input placeholder="unit" value={form.unit} onChange={update("unit")} className="border border-florax-border p-2 text-sm" />
          <input type="number" placeholder="stock" value={form.stock} onChange={update("stock")} className="border border-florax-border p-2 text-sm" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={update("featured")} /> Featured</label>
          <button data-testid="save-product-btn" className="md:col-span-2 btn-primary text-sm justify-center">Save product</button>
        </form>
      )}
      <div className="bg-white border border-florax-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-florax-alt"><tr>{["Name","Category","Price","Stock","Featured",""].map((h) => <th key={h} className="text-left p-3 overline text-florax-muted">{h}</th>)}</tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-florax-border">
                <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} className="w-10 h-12 object-cover" alt="" /><span className="text-florax-primary">{p.name}</span></div></td>
                <td className="p-3 text-florax-muted">{p.category}</td>
                <td className="p-3">₹{p.price.toFixed(0)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.featured ? "Yes" : "—"}</td>
                <td className="p-3 text-right"><button data-testid={`del-product-${p.slug}`} onClick={() => del(p.id)} className="text-florax-accent"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BlogPanel = ({ posts, refresh }) => {
  const [show, setShow] = useState(false);
  const empty = { title: "", slug: "", excerpt: "", content: "", cover_image: "", tag: "Field Notes", author: "FLORAX Editorial" };
  const [form, setForm] = useState(empty);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blog", form);
      toast.success("Post published");
      setShow(false); setForm(empty); refresh();
    } catch { toast.error("Failed to publish"); }
  };
  const del = async (id) => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/blog/${id}`); toast.success("Deleted"); refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-editorial text-3xl text-florax-primary">Journal</h2>
        <button onClick={() => setShow((v) => !v)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> New post</button>
      </div>
      {show && (
        <form onSubmit={submit} className="bg-white border border-florax-border p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {["title","slug","excerpt","cover_image","tag","author"].map((k) => (
            <input key={k} placeholder={k} value={form[k]} onChange={update(k)} className="border border-florax-border p-2 text-sm" />
          ))}
          <textarea placeholder="content" rows={4} value={form.content} onChange={update("content")} className="md:col-span-2 border border-florax-border p-2 text-sm" />
          <button className="md:col-span-2 btn-primary text-sm justify-center">Publish</button>
        </form>
      )}
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="bg-white border border-florax-border p-4 flex items-center gap-4">
            <img src={p.cover_image} className="w-16 h-16 object-cover" alt="" />
            <div className="flex-1">
              <p className="overline text-florax-muted">{p.tag}</p>
              <p className="text-florax-primary">{p.title}</p>
            </div>
            <button onClick={() => del(p.id)} className="text-florax-accent"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RowList = ({ title, rows, columns, statuses, endpoint, refresh, testIdPrefix }) => {
  const setStatus = async (id, status) => {
    await api.patch(`/${endpoint}/${id}`, { status });
    toast.success("Updated"); refresh();
  };
  return (
    <div>
      <h2 className="font-editorial text-3xl text-florax-primary mb-6">{title}</h2>
      <div className="bg-white border border-florax-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-florax-alt"><tr>{columns.map((c) => <th key={c.k} className="text-left p-3 overline text-florax-muted">{c.l}</th>)}<th className="p-3 overline text-florax-muted">Status</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} data-testid={`${testIdPrefix}-row-${r.id}`} className="border-t border-florax-border align-top">
                {columns.map((c) => <td key={c.k} className="p-3">{c.r ? c.r(r) : r[c.k]}</td>)}
                <td className="p-3">
                  <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="border border-florax-border p-1 text-xs">
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="p-6 text-center text-florax-muted">Nothing yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InquiriesPanel = ({ rows, refresh }) => (
  <RowList title="Inquiries" rows={rows} refresh={refresh} endpoint="inquiries" testIdPrefix="inq"
    statuses={["new","in-progress","resolved"]}
    columns={[
      { k: "name", l: "Name" },
      { k: "email", l: "Email" },
      { k: "subject", l: "Subject" },
      { k: "message", l: "Message", r: (r) => <span className="line-clamp-2 max-w-md inline-block">{r.message}</span> },
      { k: "created_at", l: "Date", r: (r) => new Date(r.created_at).toLocaleDateString() },
    ]} />
);

const PartnersPanel = ({ rows, refresh }) => (
  <RowList title="Partner Applications" rows={rows} refresh={refresh} endpoint="partners" testIdPrefix="prt"
    statuses={["pending","approved","rejected"]}
    columns={[
      { k: "full_name", l: "Name" },
      { k: "email", l: "Email" },
      { k: "phone", l: "Phone" },
      { k: "village", l: "Village" },
      { k: "district", l: "District" },
      { k: "farm_size_acres", l: "Acres" },
      { k: "crops", l: "Crops" },
    ]} />
);

const OrdersPanel = ({ rows, refresh }) => (
  <RowList title="Orders" rows={rows} refresh={refresh} endpoint="orders" testIdPrefix="ord"
    statuses={["placed","packed","shipped","delivered","cancelled"]}
    columns={[
      { k: "id", l: "Order", r: (r) => "#" + r.id.slice(0, 8) },
      { k: "customer_name", l: "Customer" },
      { k: "customer_email", l: "Email" },
      { k: "city", l: "City" },
      { k: "items", l: "Items", r: (r) => r.items.length },
      { k: "total", l: "Total", r: (r) => "₹" + r.total.toFixed(0) },
      { k: "created_at", l: "Date", r: (r) => new Date(r.created_at).toLocaleDateString() },
    ]} />
);
