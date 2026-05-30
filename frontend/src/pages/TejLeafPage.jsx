import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf, FlaskConical, Heart, Sparkles } from "lucide-react";

const HERO = "https://images.unsplash.com/photo-1685426797195-1ac5d8b5647a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzaWtraW0lMjB0ZXJyYWNlZCUyMGZhcm1zJTIwaGltYWxheWFzfGVufDB8fHx8MTc3NzA5NTQwNnww&ixlib=rb-4.1.0&q=85";

// Tej Leaf brand palette — borrows FLORAX greens, slightly warmer cream backdrop
const TEJ_BG = "#F5F2EA";
const TEJ_GREEN = "#1F3A2C";
const TEJ_GOLD = "#A98B3A";

const HAIR_SHAMPOOS = [
  { name: "Anti Dandruff Shampoo", size: "200 ml", price: 430, note: "Tea Tree · Neem", type: "shampoo", color: "#1F3A2C" },
  { name: "Hydra Source Shampoo", size: "200 ml", price: 360, note: "Aloe Vera · Bamboo", type: "shampoo", color: "#7A4E2D" },
  { name: "Smooth Proof Anti-Frizz Shampoo", size: "200 ml", price: 360, note: "Jatamanshi · Licorice", type: "shampoo", color: "#3E4A2E" },
];
const HAIR_CONDITIONERS = [
  { name: "Anti Dandruff Conditioner", size: "100 ml", price: 340, type: "conditioner", color: "#1F3A2C" },
  { name: "Hydra Source Conditioner", size: "100 ml", price: 280, type: "conditioner", color: "#274D71" },
  { name: "Smooth Proof Anti-Frizz Conditioner", size: "100 ml", price: 280, type: "conditioner", color: "#7A4E2D" },
];
const HAIR_SERUMS = [
  { name: "Anti Dandruff Scalp Serum", size: "100 ml", price: 450, type: "dropper", color: "#3E4A2E" },
  { name: "Anti Hairfall Serum", size: "100 ml", price: 420, type: "dropper", color: "#7A4E2D" },
];
const HAIR_MASKS = [
  { name: "Anti Dandruff Mask", size: "500 ml", price: 850, type: "jar", color: "#3E4A2E" },
  { name: "Full Rescue Restorative Mask", size: "500 ml", price: 800, type: "jar", color: "#7A4E2D" },
  { name: "Complete Solution Mask", size: "500 ml", price: 800, type: "jar", color: "#2C2A28" },
];

const WINTER_SKIN = [
  { name: "TejLeaf Wild Honey & Turmeric Hydrating Cleanser", size: "100 g", price: 250, note: "Wild Honey · Turmeric", type: "tube", color: "#C9A66B" },
  { name: "TejLeaf Himalayan A2 Shaded Ghee Intense Moisturiser", size: "50 g", price: 499, note: "Himalayan A2 Ghee", type: "jar", color: "#E2C089" },
  { name: "TejLeaf Rice Water + Himalayan Sea Buckthorn Sunscreen", size: "50 g", price: 399, note: "Rice Water · Sea Buckthorn", type: "tube", color: "#F1D58B" },
  { name: "TejLeaf Mustard Seed Oil & Camelia Wax Nourishing Body Lotion", size: "100 ml", price: 200, note: "Mustard · Camelia Wax", type: "pump", color: "#7A4E2D" },
  { name: "TejLeaf Yak Butter + Mint Restorative Lip Balm", size: "15 g", price: 120, note: "Yak Butter · Mint", type: "lipbalm", color: "#5A1F2D" },
];

const SUMMER_SKIN = [
  { name: "TejLeaf Himalayan Orange Blossom Oil-Control Cleanser", size: "100 g", price: 350, note: "Orange Blossom", type: "tube", color: "#DDA74F" },
  { name: "TejLeaf Teesta Deep-Pore Scrubber", size: "50 g", price: 290, note: "Riverbed Minerals", type: "jar", color: "#274D71" },
  { name: "TejLeaf Mattifying Face Mask", size: "50 g", price: 275, note: "Kaolin · Green Clay", type: "jar", color: "#3E4A2E" },
  { name: "TejLeaf Changu Hydrating Serum", size: "50 ml", price: 360, note: "Glacial Hydration", type: "dropper", color: "#274D71" },
  { name: "TejLeaf Rhododendron Oil-Free Moisturiser", size: "50 g", price: 325, note: "Rhododendron Petal", type: "pump", color: "#9C5243" },
  { name: "TejLeaf Himalayan Buckthorn Sunscreen", size: "50 g", price: 399, note: "Sea Buckthorn", type: "tube", color: "#DDA74F" },
  { name: "TejLeaf Temi Glow De-Tan", size: "50 g", price: 349, note: "Temi Tea Polyphenols", type: "tube", color: "#3E4A2E" },
];

const BODY_CARE = [
  { name: "De-Tox Body Wash", size: "300 ml", price: 599, type: "body", color: "#3E4A2E" },
  { name: "Acne Body Wash", size: "300 ml", price: 699, type: "body", color: "#274D71" },
  { name: "Daily Care Body Wash", size: "300 ml", price: 499, type: "body", color: "#7A4E2D" },
];

const PRO_SPA = [
  { name: "Anti Dandruff Hair Spa", size: "500 g", price: 999, type: "spa-jar", color: "#3E4A2E" },
  { name: "Moisturizing Hair Spa", size: "500 g", price: 799, type: "spa-jar", color: "#274D71" },
  { name: "Smoothing Hair Spa", size: "500 g", price: 799, type: "spa-jar", color: "#A98B3A" },
  { name: "Repairing Hair Spa", size: "500 g", price: 799, type: "spa-jar", color: "#5A1F2D" },
];

// --- Pictorial product illustrations (inline SVG) ---
const ProductArt = ({ type, color = "#1F3A2C" }) => {
  const stroke = "#1F3A2C";
  const cap = "#0E1F18";
  const label = "#F4ECDC";
  const common = { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 120 140", className: "w-24 h-32" };

  if (type === "shampoo") {
    return (
      <svg {...common}>
        <rect x="48" y="6" width="24" height="14" rx="2" fill={cap} />
        <path d="M70 18 L70 28 L82 28 L82 34 L78 34 L78 30" fill="none" stroke={cap} strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="28" width="56" height="100" rx="6" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="38" y="62" width="44" height="30" fill={label} />
        <text x="60" y="78" textAnchor="middle" fontFamily="serif" fontSize="9" fill={stroke}>TejLeaf</text>
        <text x="60" y="88" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fill={stroke}>SHAMPOO</text>
      </svg>
    );
  }
  if (type === "conditioner") {
    return (
      <svg {...common}>
        <rect x="50" y="6" width="20" height="10" rx="2" fill={cap} />
        <path d="M40 16 Q40 22 48 22 L72 22 Q80 22 80 16" fill={color} stroke={stroke} strokeWidth="1.5" />
        <path d="M40 16 L36 130 Q60 138 84 130 L80 16 Z" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="42" y="58" width="36" height="28" fill={label} />
        <text x="60" y="74" textAnchor="middle" fontFamily="serif" fontSize="8" fill={stroke}>TejLeaf</text>
        <text x="60" y="83" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill={stroke}>CONDITIONER</text>
      </svg>
    );
  }
  if (type === "tube") {
    return (
      <svg {...common}>
        <rect x="52" y="6" width="16" height="10" rx="1.5" fill={cap} />
        <path d="M38 16 L38 130 Q60 138 82 130 L82 16 Z" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="42" y="55" width="36" height="32" fill={label} />
        <text x="60" y="70" textAnchor="middle" fontFamily="serif" fontSize="8" fill={stroke}>TejLeaf</text>
        <text x="60" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill={stroke}>FACE WASH</text>
      </svg>
    );
  }
  if (type === "dropper") {
    return (
      <svg {...common}>
        <rect x="52" y="2" width="16" height="14" rx="2" fill={cap} />
        <rect x="56" y="16" width="8" height="44" fill={cap} opacity="0.85" />
        <ellipse cx="60" cy="60" rx="6" ry="3" fill={cap} />
        <rect x="36" y="58" width="48" height="74" rx="4" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="42" y="80" width="36" height="28" fill={label} />
        <text x="60" y="96" textAnchor="middle" fontFamily="serif" fontSize="8" fill={stroke}>TejLeaf</text>
        <text x="60" y="105" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill={stroke}>SERUM</text>
      </svg>
    );
  }
  if (type === "jar") {
    return (
      <svg {...common}>
        <rect x="26" y="36" width="68" height="14" rx="2" fill={cap} />
        <rect x="22" y="50" width="76" height="78" rx="6" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="30" y="76" width="60" height="26" fill={label} />
        <text x="60" y="92" textAnchor="middle" fontFamily="serif" fontSize="10" fill={stroke}>TejLeaf</text>
        <text x="60" y="101" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill={stroke}>HAIR MASK</text>
      </svg>
    );
  }
  if (type === "spa-jar") {
    return (
      <svg {...common}>
        <rect x="20" y="32" width="80" height="16" rx="2" fill={cap} />
        <ellipse cx="60" cy="48" rx="40" ry="6" fill={cap} />
        <rect x="22" y="48" width="76" height="80" rx="6" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="30" y="74" width="60" height="30" fill={label} />
        <text x="60" y="89" textAnchor="middle" fontFamily="serif" fontSize="10" fill={stroke}>TejLeaf</text>
        <text x="60" y="99" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fill={stroke}>HAIR SPA</text>
      </svg>
    );
  }
  if (type === "pump") {
    return (
      <svg {...common}>
        <rect x="52" y="6" width="14" height="6" rx="1.5" fill={cap} />
        <rect x="56" y="12" width="8" height="16" fill={cap} />
        <path d="M64 20 L80 20 L80 26 L74 26" fill="none" stroke={cap} strokeWidth="3" strokeLinecap="round" />
        <rect x="34" y="28" width="52" height="100" rx="6" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="40" y="62" width="40" height="30" fill="#FFFFFF" stroke={stroke} strokeWidth="0.5" />
        <text x="60" y="77" textAnchor="middle" fontFamily="serif" fontSize="8" fill={stroke}>TejLeaf</text>
        <text x="60" y="86" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill={stroke}>MOISTURISER</text>
      </svg>
    );
  }
  if (type === "body") {
    return (
      <svg {...common}>
        <rect x="50" y="2" width="20" height="10" rx="2" fill={cap} />
        <path d="M70 12 L70 22 L84 22 L84 30 L78 30" fill="none" stroke={cap} strokeWidth="3" strokeLinecap="round" />
        <path d="M30 30 Q30 24 36 24 L84 24 Q90 24 90 30 L90 128 Q90 134 84 134 L36 134 Q30 134 30 128 Z" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="38" y="60" width="44" height="34" fill={label} />
        <text x="60" y="76" textAnchor="middle" fontFamily="serif" fontSize="9" fill={stroke}>TejLeaf</text>
        <text x="60" y="86" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill={stroke}>BODY WASH</text>
      </svg>
    );
  }
  if (type === "lipbalm") {
    return (
      <svg {...common}>
        {/* twist-up lip balm tube */}
        <rect x="46" y="20" width="28" height="14" rx="2" fill={cap} />
        <rect x="44" y="34" width="32" height="6" fill={cap} opacity="0.85" />
        <rect x="44" y="40" width="32" height="80" rx="3" fill={color} stroke={stroke} strokeWidth="1.5" />
        <rect x="48" y="64" width="24" height="34" fill={label} />
        <text x="60" y="80" textAnchor="middle" fontFamily="serif" fontSize="7" fill={stroke}>TejLeaf</text>
        <text x="60" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="3.6" fill={stroke}>LIP BALM</text>
        <rect x="44" y="120" width="32" height="8" rx="1" fill={cap} />
      </svg>
    );
  }
  return null;
};

const PromiseChip = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-sm" style={{ color: TEJ_GREEN }}>
    <Icon className="w-4 h-4" strokeWidth={1.6} />
    <span>{text}</span>
  </div>
);

const ProductTile = ({ name, size, price, note, idx, type, color }) => (
  <div
    data-testid={`tej-product-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
    className="group p-6 lg:p-7 border transition-all duration-300 hover:-translate-y-1 flex flex-col"
    style={{ background: "#FFFFFF", borderColor: "#D8D2BF" }}
  >
    <div className="flex items-start justify-between gap-4">
      <span className="font-editorial text-2xl" style={{ color: TEJ_GREEN }}>
        0{idx + 1}
      </span>
      <Leaf className="w-5 h-5" strokeWidth={1.4} style={{ color: TEJ_GOLD }} />
    </div>

    {/* Pictorial illustration */}
    <div
      className="my-4 flex items-center justify-center py-4 rounded-sm"
      style={{ background: "linear-gradient(180deg, #FAF6E9 0%, #F1ECDB 100%)" }}
    >
      <ProductArt type={type} color={color} />
    </div>

    <h4 className="font-editorial text-xl lg:text-2xl mt-2 leading-snug" style={{ color: TEJ_GREEN }}>
      {name}
    </h4>
    <p className="text-xs tracking-[0.18em] uppercase mt-2" style={{ color: "#7A7660" }}>
      {size}
    </p>
    {note && (
      <p className="text-xs italic mt-3" style={{ color: "#7A7660" }}>
        {note}
      </p>
    )}
    <div className="mt-6 pt-4 flex items-end justify-between border-t" style={{ borderColor: "#E7E1CC" }}>
      <span className="font-editorial text-3xl" style={{ color: TEJ_GREEN }}>
        ₹{price}
      </span>
      <span className="overline" style={{ color: TEJ_GOLD }}>MRP</span>
    </div>
    <p className="mt-3 text-[10.5px] leading-snug" style={{ color: "#5C5847" }}>
      🌱 100% Botanics &nbsp;|&nbsp; Strict 6-Month Freshness Window.<br />
      Store in a cool, dark place.
    </p>
    <div
      className="mt-4 -mx-6 lg:-mx-7 -mb-6 lg:-mb-7 px-6 lg:px-7 py-2.5 text-center text-xs tracking-[0.22em] uppercase font-medium"
      style={{ background: TEJ_GREEN, color: TEJ_BG }}
    >
      Coming Soon :-)
    </div>
  </div>
);

const CategoryBlock = ({ overline, title, products }) => (
  <div className="mt-16">
    <div className="flex items-end justify-between border-b pb-4" style={{ borderColor: "#D8D2BF" }}>
      <div>
        <p className="overline" style={{ color: TEJ_GOLD }}>{overline}</p>
        <h3 className="font-editorial text-3xl lg:text-4xl mt-2" style={{ color: TEJ_GREEN }}>
          {title}
        </h3>
      </div>
      <p className="text-xs tracking-[0.18em] uppercase hidden md:block" style={{ color: "#7A7660" }}>
        {products.length} formulas
      </p>
    </div>
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((p, i) => <ProductTile key={p.name} {...p} idx={i} />)}
    </div>
  </div>
);

export default function TejLeafPage() {
  return (
    <main data-testid="tejleaf-page" className="pt-28 lg:pt-32" style={{ background: TEJ_BG }}>
      {/* Hero */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          <div className="lg:col-span-7 px-6 lg:px-14 py-16 lg:py-24">
            <div className="flex items-center gap-4">
              <img src="/tejleaf-logo.png" alt="TejLeaf Naturals" className="h-16 w-16 object-contain" />
              <div>
                <p className="font-editorial text-3xl lg:text-4xl" style={{ color: TEJ_GREEN }}>
                  TejLeaf Naturals
                </p>
                <p className="overline" style={{ color: TEJ_GOLD }}>Powered by FLORAX</p>
              </div>
            </div>
            <h1
              className="mt-10 font-editorial text-6xl sm:text-7xl lg:text-[7rem] leading-[0.92] tracking-tight"
              style={{ color: TEJ_GREEN }}
            >
              100% Botanic.<br />
              <span className="italic" style={{ color: TEJ_GOLD }}>Nature in every drop.</span>
            </h1>
            <p className="mt-10 max-w-xl text-base lg:text-lg leading-relaxed" style={{ color: "#3C3A2E" }}>
              <strong>TejLeaf Naturals</strong> is the high-potency cosmetic arm of FLORAX Agri-Biotech.
              We reject synthetic bases, chemical polymers, and long-tail artificial shelf-stabilizers.
              Backed by high-altitude lab science and partner farmers in Sikkim, we bottle raw, living
              plant chemistry into strict <strong>6-month micro-batches</strong>.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <PromiseChip icon={Leaf} text="100% Botanics" />
              <PromiseChip icon={FlaskConical} text="Backed by Research" />
              <PromiseChip icon={Sparkles} text="Clean Formulations" />
              <PromiseChip icon={Heart} text="Made with Love" />
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <img src={HERO} alt="Himalayan source" className="w-full h-full min-h-[420px] object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(31,58,44,0) 60%, rgba(31,58,44,0.6) 100%)" }}
            />
            <div className="absolute bottom-8 left-6 right-6 text-white">
              <p className="font-editorial text-2xl italic leading-tight">
                Rooted in the Himalayas. <br /> Made for everyday you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="overline" style={{ color: TEJ_GOLD }}>Nature's Wisdom</p>
              <h2 className="mt-4 font-editorial text-4xl lg:text-6xl leading-[1.05]" style={{ color: TEJ_GREEN }}>
                Carefully chosen.<br />
                <span className="italic">Scientifically backed.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed" style={{ color: "#3C3A2E" }}>
                Every TejLeaf formula draws on potent botanicals from the Himalayas — Kofal, Buransh,
                Kutki, Jatamanshi, Tulsi, Manjistha — characterised in our lab and balanced for
                modern skin and hair routines. Pure botanicals. Himalayan purity. Visible results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL · Anti Dandruff Kit */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            className="relative overflow-hidden border-2"
            style={{ background: "#FFFFFF", borderColor: TEJ_GREEN }}
          >
            {/* Ribbon */}
            <div
              className="absolute -top-3 left-6 lg:left-10 px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase font-medium"
              style={{ background: TEJ_GOLD, color: "#FFFFFF" }}
              data-testid="special-kit-ribbon"
            >
              ★ Limited Launch · Featured
            </div>

            <div className="p-8 lg:p-14 pt-12 lg:pt-16">
              <p className="overline" style={{ color: TEJ_GOLD }}>TejLeaf Naturals Special</p>
              <h2
                className="mt-4 font-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02]"
                style={{ color: TEJ_GREEN }}
              >
                Anti Dandruff Kit
              </h2>
              <p className="mt-4 max-w-2xl text-sm lg:text-base leading-relaxed" style={{ color: "#3C3A2E" }}>
                A three-step botanical ritual built around{" "}
                <span className="italic" style={{ color: TEJ_GREEN }}>Vaccinium piliferum</span> —
                the Himalayan Blue Berry. Cleanse with rosemary + AHA, condition with blueberry actives,
                seal with the complete solution serum.
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    name: "TejLeaf Rosemary & Himalayan Blue Berry AHA Anti Dandruff Shampoo",
                    size: "200 ml",
                    price: 950,
                    note: "Super ingredient · Vaccinium piliferum",
                    type: "shampoo",
                    color: "#274D71",
                  },
                  {
                    name: "TejLeaf Himalayan Blue Berry Anti Dandruff Conditioner",
                    size: "100 g",
                    price: 450,
                    note: "Vaccinium piliferum",
                    type: "conditioner",
                    color: "#1F3A2C",
                  },
                  {
                    name: "TejLeaf Himalayan Blue Berry Complete Solution Serum",
                    size: "100 ml",
                    price: 675,
                    note: "Vaccinium piliferum",
                    type: "dropper",
                    color: "#274D71",
                  },
                ].map((p, i) => (
                  <div
                    key={p.name}
                    data-testid={`special-kit-product-${i + 1}`}
                    className="border flex flex-col transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: "#D8D2BF", background: "#FAF6E9" }}
                  >
                    <div className="px-6 pt-6 flex items-center justify-between">
                      <span
                        className="text-[10px] tracking-[0.25em] uppercase font-medium px-2 py-1"
                        style={{ background: TEJ_GREEN, color: TEJ_BG }}
                      >
                        Step 0{i + 1}
                      </span>
                      <Leaf className="w-5 h-5" strokeWidth={1.4} style={{ color: TEJ_GOLD }} />
                    </div>
                    <div className="flex items-center justify-center py-6">
                      <ProductArt type={p.type} color={p.color} />
                    </div>
                    <div className="px-6 pb-6 flex-1 flex flex-col" style={{ background: "#FFFFFF" }}>
                      <h4
                        className="font-editorial text-lg lg:text-xl leading-snug pt-5"
                        style={{ color: TEJ_GREEN }}
                      >
                        {p.name}
                      </h4>
                      <p className="text-[10px] tracking-[0.18em] uppercase mt-3" style={{ color: "#7A7660" }}>
                        {p.size}
                      </p>
                      <p className="text-xs italic mt-2" style={{ color: TEJ_GOLD }}>{p.note}</p>
                      <div
                        className="mt-5 pt-4 flex items-end justify-between border-t"
                        style={{ borderColor: "#E7E1CC" }}
                      >
                        <span className="font-editorial text-2xl" style={{ color: TEJ_GREEN }}>
                          ₹{p.price}
                        </span>
                        <span className="overline" style={{ color: TEJ_GOLD }}>MRP</span>
                      </div>
                      <p className="mt-3 text-[10.5px] leading-snug" style={{ color: "#5C5847" }}>
                        🌱 100% Botanics &nbsp;|&nbsp; Strict 6-Month Freshness Window.<br />
                        Store in a cool, dark place.
                      </p>
                    </div>
                    <div
                      className="py-2.5 text-center text-[10px] tracking-[0.22em] uppercase font-medium"
                      style={{ background: TEJ_GREEN, color: TEJ_BG }}
                    >
                      Coming Soon :-)
                    </div>
                  </div>
                ))}
              </div>

              {/* Bundle CTA */}
              <div
                className="mt-8 p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-dashed"
                style={{ borderColor: TEJ_GREEN, background: "#FAF6E9" }}
                data-testid="trio-bundle"
              >
                <div>
                  <p className="overline" style={{ color: TEJ_GOLD }}>Bundle offer</p>
                  <p
                    className="mt-3 font-editorial text-3xl lg:text-4xl leading-tight"
                    style={{ color: TEJ_GREEN }}
                  >
                    Buy the Anti Dandruff Trio at{" "}
                    <span className="italic" style={{ color: TEJ_GOLD }}>₹1,100</span>
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "#7A7660" }}>
                    Save ₹975 vs. individual MRP · All three steps · Free shipping above ₹1,500
                  </p>
                </div>
                <span
                  className="px-7 py-3 text-sm tracking-wide whitespace-nowrap"
                  style={{ background: TEJ_GREEN, color: "#fff" }}
                >
                  Coming Soon :-)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hair Solutions */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="overline" style={{ color: TEJ_GOLD }}>Hair Solutions</p>
          <h2 className="mt-4 font-editorial text-5xl lg:text-7xl leading-[1] max-w-3xl" style={{ color: TEJ_GREEN }}>
            For every kind <span className="italic">of hair day.</span>
          </h2>
          <CategoryBlock overline="Shampoos" title="Hair Care · Shampoos" products={HAIR_SHAMPOOS} />
          <CategoryBlock overline="Conditioners" title="Hair Care · Conditioners" products={HAIR_CONDITIONERS} />
          <CategoryBlock overline="Scalp & Roots" title="Scalp Care Serums" products={HAIR_SERUMS} />
          <CategoryBlock overline="Treatments" title="Hair Treatment Masks" products={HAIR_MASKS} />
        </div>
      </section>

      {/* Skin Solutions */}
      <section className="py-20" style={{ background: "#EFEADA" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="overline" style={{ color: TEJ_GOLD }}>Skin Solutions</p>
          <h2 className="mt-4 font-editorial text-5xl lg:text-7xl leading-[1] max-w-3xl" style={{ color: TEJ_GREEN }}>
            Skin that glows <span className="italic">by nature.</span>
          </h2>

          {/* Face Care — seasonal collections */}
          <div className="mt-16">
            <div
              className="border-l-4 pl-6 py-2"
              style={{ borderColor: TEJ_GOLD }}
              data-testid="face-care-banner"
            >
              <p className="overline" style={{ color: TEJ_GOLD }}>Face Care</p>
              <h3 className="font-editorial text-3xl lg:text-4xl mt-1" style={{ color: TEJ_GREEN }}>
                Two seasons. <span className="italic">One regimen for each.</span>
              </h3>
            </div>
          </div>

          {/* Winter sub-banner */}
          <div
            className="mt-12 px-8 lg:px-12 py-8 lg:py-10 flex items-center gap-6 border-2"
            style={{ background: "#FFFFFF", borderColor: TEJ_GREEN }}
            data-testid="winter-banner"
          >
            <span
              className="hidden sm:flex w-14 h-14 rounded-full items-center justify-center text-2xl"
              style={{ background: "#E8F0F4", color: TEJ_GREEN }}
              aria-hidden
            >
              ❄
            </span>
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Seasonal Edit · Cold months</p>
              <h3 className="font-editorial text-3xl lg:text-5xl mt-1" style={{ color: TEJ_GREEN }}>
                Winter Skin Care Essentials
              </h3>
              <p className="text-sm mt-2" style={{ color: "#3C3A2E" }}>
                Slow-rich textures for dry mountain air — raw honey, hand-churned A2 ghee, yak butter,
                and wild sea buckthorn. Formulated without chemical fillers. Hand-poured fresh.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WINTER_SKIN.map((p, i) => <ProductTile key={p.name} {...p} idx={i} />)}
          </div>

          {/* Winter bundle CTA */}
          <div
            className="mt-8 p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-dashed"
            style={{ borderColor: TEJ_GREEN, background: "#FFFFFF" }}
            data-testid="winter-bundle"
          >
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Bundle offer · Winter</p>
              <p
                className="mt-3 font-editorial text-3xl lg:text-4xl leading-tight"
                style={{ color: TEJ_GREEN }}
              >
                Winter Box Bundle at{" "}
                <span className="italic" style={{ color: TEJ_GOLD }}>₹1,999</span>
              </p>
              <p className="mt-2 text-sm" style={{ color: "#7A7660" }}>
                All five winter essentials · Save vs. individual MRP
              </p>
            </div>
            <span
              className="px-7 py-3 text-sm tracking-wide whitespace-nowrap"
              style={{ background: TEJ_GREEN, color: "#fff" }}
            >
              Coming Soon :-)
            </span>
          </div>

          {/* Summer sub-banner */}
          <div
            className="mt-20 px-8 lg:px-12 py-8 lg:py-10 flex items-center gap-6 border-2"
            style={{ background: "#FFFFFF", borderColor: TEJ_GOLD }}
            data-testid="summer-banner"
          >
            <span
              className="hidden sm:flex w-14 h-14 rounded-full items-center justify-center text-2xl"
              style={{ background: "#FBEFD8", color: TEJ_GOLD }}
              aria-hidden
            >
              ☀
            </span>
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Seasonal Edit · Warm months</p>
              <h3 className="font-editorial text-3xl lg:text-5xl mt-1" style={{ color: TEJ_GREEN }}>
                Summer Skin Care
              </h3>
              <p className="text-sm mt-2" style={{ color: "#3C3A2E" }}>
                Lightweight, oil-free formulas tuned for humid valleys and high-altitude sun — orange blossom, Teesta minerals, rhododendron, Temi tea.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUMMER_SKIN.map((p, i) => <ProductTile key={p.name} {...p} idx={i} />)}
          </div>

          {/* Summer bundle CTA */}
          <div
            className="mt-8 p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-dashed"
            style={{ borderColor: TEJ_GOLD, background: "#FFFFFF" }}
            data-testid="summer-bundle"
          >
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Bundle offer · Summer</p>
              <p
                className="mt-3 font-editorial text-3xl lg:text-4xl leading-tight"
                style={{ color: TEJ_GREEN }}
              >
                Summer Box Bundle at{" "}
                <span className="italic" style={{ color: TEJ_GOLD }}>₹2,399</span>
              </p>
              <p className="mt-2 text-sm" style={{ color: "#7A7660" }}>
                All seven summer formulas · Save ₹949 vs. individual MRP
              </p>
            </div>
            <span
              className="px-7 py-3 text-sm tracking-wide whitespace-nowrap"
              style={{ background: TEJ_GREEN, color: "#fff" }}
            >
              Coming Soon :-)
            </span>
          </div>

          {/* Body Care unchanged */}
          <CategoryBlock overline="Body Care" title="Body Washes" products={BODY_CARE} />
        </div>
      </section>

      {/* Professional Care */}
      <section className="py-20 lg:py-28" style={{ background: TEJ_GREEN }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="overline" style={{ color: TEJ_GOLD }}>Professional Care</p>
              <h2 className="mt-4 font-editorial text-5xl lg:text-7xl leading-[1] text-white">
                Hair Spa <span className="italic" style={{ color: TEJ_GOLD }}>Therapy.</span>
              </h2>
              <p className="mt-8 text-white/80 leading-relaxed max-w-md">
                Salon-grade botanical hair spas formulated for professionals and at-home rituals
                alike. Heavy on actives, light on chemistry — the way nature intended care to be.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PRO_SPA.map((p, i) => (
                  <div
                    key={p.name}
                    data-testid={`tej-spa-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-7 border bg-white flex flex-col"
                    style={{ borderColor: "#3a5a48" }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-editorial text-2xl" style={{ color: TEJ_GREEN }}>0{i + 1}</span>
                      <Sparkles className="w-5 h-5" strokeWidth={1.4} style={{ color: TEJ_GOLD }} />
                    </div>
                    <div
                      className="my-4 flex items-center justify-center py-4 rounded-sm"
                      style={{ background: "linear-gradient(180deg, #FAF6E9 0%, #F1ECDB 100%)" }}
                    >
                      <ProductArt type={p.type} color={p.color} />
                    </div>
                    <h4 className="font-editorial text-2xl mt-2" style={{ color: TEJ_GREEN }}>{p.name}</h4>
                    <p className="text-xs tracking-[0.18em] uppercase mt-2" style={{ color: "#7A7660" }}>{p.size}</p>
                    <p className="font-editorial text-3xl mt-5" style={{ color: TEJ_GREEN }}>₹{p.price}</p>
                    <p className="mt-3 text-[10.5px] leading-snug" style={{ color: "#5C5847" }}>
                      🌱 100% Botanics &nbsp;|&nbsp; Strict 6-Month Freshness Window.<br />
                      Store in a cool, dark place.
                    </p>
                    <div
                      className="mt-4 -mx-7 -mb-7 px-7 py-2.5 text-center text-xs tracking-[0.22em] uppercase font-medium"
                      style={{ background: TEJ_GREEN, color: TEJ_BG }}
                    >
                      Coming Soon :-)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* R&D Trust Badge */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div
            className="relative overflow-hidden border-2 px-8 lg:px-14 py-10 lg:py-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
            style={{ background: "#FFFFFF", borderColor: TEJ_GREEN }}
            data-testid="rd-trust-badge"
          >
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full shrink-0 text-3xl lg:text-4xl"
              style={{ background: TEJ_GREEN, color: TEJ_GOLD }}
              aria-hidden
            >
              🔬
            </div>
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Quality Assurance · Lab Verified</p>
              <p
                className="mt-3 font-editorial text-2xl lg:text-4xl leading-tight"
                style={{ color: TEJ_GREEN }}
              >
                Formulated &amp; <span className="italic">stability verified</span> at the
                FLORAX R&amp;D Labs, Tadong, Gangtok.
              </p>
              <p className="mt-3 text-sm" style={{ color: "#5C5847" }}>
                Every TejLeaf micro-batch is HPLC-tested for active concentration, microbially
                screened, and stability-aged before it leaves the lab.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p className="font-editorial text-3xl lg:text-5xl leading-[1.15] italic" style={{ color: TEJ_GREEN }}>
            From the Himalayas to you, <br />
            <span style={{ color: TEJ_GOLD }}>the power of nature, perfected by science.</span>
          </p>
          <p className="mt-10 text-base lg:text-lg" style={{ color: "#3C3A2E" }}>
            Thank you for choosing Nature. Choosing Care. Choosing Tej Leaf Naturals.
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:info.tejleafnaturals@gmail.com"
              data-testid="tej-contact-cta"
              className="px-7 py-3 text-sm tracking-wide transition"
              style={{ background: TEJ_GREEN, color: "#fff" }}
            >
              Wholesale & Enquiries →
            </a>
            <Link
              to="/"
              data-testid="tej-back-cta"
              className="px-7 py-3 text-sm tracking-wide border transition"
              style={{ color: TEJ_GREEN, borderColor: TEJ_GREEN }}
            >
              Back to FLORAX
            </Link>
          </div>

          <div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b py-10 text-left"
            style={{ borderColor: "#D8D2BF" }}
          >
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Get in touch</p>
              <p className="mt-3 text-sm" style={{ color: "#3C3A2E" }}>
                <a href="tel:+918967300470" className="block hover:underline" data-testid="tej-phone">
                  +91 89673 00470
                </a>
                <a href="mailto:info.tejleafnaturals@gmail.com" className="block hover:underline mt-1" data-testid="tej-email">
                  info.tejleafnaturals@gmail.com
                </a>
              </p>
            </div>
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Studio</p>
              <p className="mt-3 text-sm" style={{ color: "#3C3A2E" }}>
                Matigara,<br />
                West Bengal, India
              </p>
            </div>
            <div>
              <p className="overline" style={{ color: TEJ_GOLD }}>Powered by</p>
              <p className="mt-3 text-sm" style={{ color: "#3C3A2E" }}>
                <Link to="/" className="hover:underline">FLORAX Agri-Biotech</Link><br />
                Gangtok, Sikkim
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs tracking-[0.2em] uppercase" style={{ color: "#7A7660" }}>
            Tej Leaf Naturals · Nature in every drop
          </p>
        </div>
      </section>
    </main>
  );
}

// Compact home-page banner — exported separately so HomePage can mount it
export const TejLeafBanner = () => (
  <section className="py-12 lg:py-16" style={{ background: TEJ_BG }}>
    <Link
      to="/tejleaf"
      data-testid="tejleaf-home-banner"
      className="group block max-w-7xl mx-auto px-6 lg:px-10"
    >
      <div
        className="relative overflow-hidden border transition-all duration-500 hover:shadow-lg"
        style={{ borderColor: "#D8D2BF", background: "#FFFFFF" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 lg:p-14">
            <div className="flex items-center gap-3">
              <img src="/tejleaf-logo.png" alt="TejLeaf Naturals" className="h-12 w-12 object-contain" />
              <span className="overline" style={{ color: TEJ_GOLD }}>Sister Brand · Cosmetic Partner</span>
            </div>
            <h3
              className="mt-6 font-editorial text-4xl lg:text-6xl leading-[1.02]"
              style={{ color: TEJ_GREEN }}
            >
              TejLeaf Naturals<br />
              <span className="italic" style={{ color: TEJ_GOLD }}>Nature in every drop.</span>
            </h3>
            <p className="mt-5 max-w-xl text-sm lg:text-base leading-relaxed" style={{ color: "#3C3A2E" }}>
              100% botanical hair care, skin care and everyday grooming — developed by
              Mr. Suvajit Mandal and powered by FLORAX R&D.
            </p>
            <span
              className="mt-7 inline-flex items-center gap-2 text-sm tracking-wide border-b pb-1 transition group-hover:gap-3"
              style={{ color: TEJ_GREEN, borderColor: TEJ_GREEN }}
            >
              Explore the catalogue
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="lg:col-span-5 relative h-56 lg:h-full min-h-[260px] order-first lg:order-last">
            <img src={HERO} alt="Himalayan source" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 50%)" }}
            />
          </div>
        </div>
      </div>
    </Link>
  </section>
);
