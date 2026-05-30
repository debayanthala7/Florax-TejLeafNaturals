import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Microscope, Leaf, Mountain } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { Section } from "../components/Section";
import { TejLeafBanner } from "./TejLeafPage";
import api from "../lib/api";

const HERO_IMG =
  "https://images.unsplash.com/photo-1685426797195-1ac5d8b5647a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzaWtraW0lMjB0ZXJyYWNlZCUyMGZhcm1zJTIwaGltYWxheWFzfGVufDB8fHx8MTc3NzA5NTQwNnww&ixlib=rb-4.1.0&q=85";
const TERRACES =
  "https://images.pexels.com/photos/8220089/pexels-photo-8220089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const LAB =
  "https://images.pexels.com/photos/8851404/pexels-photo-8851404.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const HARVEST =
  "https://images.pexels.com/photos/27177517/pexels-photo-27177517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Curated home highlights: Darjeeling, Apricot Oil, Herbal Tea, Cardamom
    const wanted = [
      "florax-spring-flush-darjeeling",
      "florax-apricot-oil",
      "florax-herbal-tea",
      "sikkim-large-cardamom",
    ];
    api.get("/products").then((r) => {
      const map = new Map(r.data.map((p) => [p.slug, p]));
      setFeatured(wanted.map((s) => map.get(s)).filter(Boolean));
    });
    api.get("/blog").then((r) => setPosts(r.data.slice(0, 3)));
  }, []);

  return (
    <main data-testid="home-page" className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[88vh]">
          <div className="lg:col-span-5 px-6 lg:px-10 py-16 lg:py-24 flex flex-col justify-between">
            <div>
              <p className="overline text-florax-muted fade-in">East Sikkim · 27.3°N · 1,650 m</p>
              <h1 className="mt-8 font-editorial text-[3.2rem] sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-florax-primary fade-up">
                Agri-biotech, with the<br />
                <span className="italic text-florax-accent">patience of a mountain.</span>
              </h1>
              <p className="mt-8 max-w-md text-florax-muted text-base leading-relaxed fade-up" style={{ animationDelay: "150ms" }}>
                FLORAX is an agri-biotech house from Sikkim — growing organic produce, microbial
                and a quieter way of feeding the world.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 fade-up" style={{ animationDelay: "300ms" }}>
                <Link to="/products" data-testid="hero-shop-cta" className="btn-primary">
                  Pahadon Wala Pyaar
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link to="/sustainability" data-testid="hero-story-cta" className="btn-ghost">
                  <span className="font-editorial italic">Kahaniyan</span>&nbsp;Pahadon Ki
                </Link>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="font-editorial text-3xl text-florax-primary">12</p>
                <p className="overline text-florax-muted mt-1">Partner Kisans</p>
              </div>
              <div>
                <p className="font-editorial text-3xl text-florax-primary">06</p>
                <p className="overline text-florax-muted mt-1">Microbial strains</p>
              </div>
              <div>
                <p className="font-editorial text-3xl text-florax-primary">100%</p>
                <p className="overline text-florax-muted mt-1">Organic certified</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 relative bg-florax-alt overflow-hidden">
            <img src={HERO_IMG} alt="Sikkim Himalayas" className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-8 right-8 lg:left-12 bg-florax-bg/85 backdrop-blur p-5 max-w-sm border border-florax-border/50">
              <p className="overline text-florax-accent">Field note · Spring</p>
              <p className="font-editorial text-xl text-florax-primary mt-2 leading-tight">
                Cardamom flowering on the Dzongu slopes — eight days late this year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 lg:py-32 border-t border-florax-border">
        <Section overline="What we do" title="Three pillars, one valley.">
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-florax-border">
            {[
              { icon: Mountain, title: "Heritage agriculture", body: "We farm in partnership with twelve Sikkim families using terraced, low-intervention methods passed down for generations." },
              { icon: Microscope, title: "Lab-verified agri-biotech", body: "Indigenous microbial strains and disease-resistant planting material, characterised in our Gangtok R&D lab, returned to the slopes as living inputs." },
              { icon: Leaf, title: "Single-origin organics", body: "Every cardamom pod, honey jar and tisane tin is traceable to a slope, a season and a hand." },
            ].map((p, i) => (
              <div key={i} className="bg-florax-bg p-10">
                <p.icon className="w-7 h-7 text-florax-accent" strokeWidth={1.4} />
                <h3 className="font-editorial text-3xl text-florax-primary mt-6 leading-tight">{p.title}</h3>
                <p className="mt-4 text-florax-muted text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-florax-alt">
        <Section overline="Pahadon Wala Pyaar" title="Single-origin, lab-verified.">
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
            {featured.map((p) => (
              <div key={p.id} className="flex flex-col">
                <ProductCard product={p} />
                <div
                  data-testid={`home-out-of-stock-${p.slug}`}
                  className="mt-5 py-2 text-center text-[10px] tracking-[0.22em] uppercase font-medium bg-florax-accent text-florax-bg"
                >
                  Out of Stock :-(
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link to="/products" data-testid="all-products-link" className="link-underline text-florax-primary">
              View all of Pahadon Wala Pyaar →
            </Link>
          </div>
        </Section>
      </section>

      {/* TejLeaf sister brand banner */}
      <TejLeafBanner />

      {/* Kisan CTA */}
      <section className="py-24 bg-florax-primary text-florax-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="overline text-florax-secondary">Kisan Sajhedari Karyakram</p>
            <h2 className="mt-4 font-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              We don't source from Kisans.<br />
              <span className="italic text-florax-secondary">We grow with them.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-florax-bg/75 leading-relaxed">
              Fair, multi-year contracts. Seed and microbial inputs at cost. Field training every quarter.
              If you farm anywhere in Sikkim, we want to hear from you.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img src={HARVEST} alt="Organic harvest" className="w-full h-80 object-cover" />
            <Link to="/farmers" data-testid="farmers-cta" className="mt-6 inline-block px-6 py-3 bg-florax-secondary text-florax-primary text-sm tracking-wide hover:bg-florax-bg transition">
              Join the Program →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
