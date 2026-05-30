import React from "react";
import { Link } from "react-router-dom";
import { Sprout, Bug, Zap, PackageCheck } from "lucide-react";

const HERO = "https://images.unsplash.com/photo-1685426797195-1ac5d8b5647a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzaWtraW0lMjB0ZXJyYWNlZCUyMGZhcm1zJTIwaGltYWxheWFzfGVufDB8fHx8MTc3NzA5NTQwNnww&ixlib=rb-4.1.0&q=85";

const SOLUTIONS = [
  {
    icon: Sprout,
    title: "Low Yields & Nutrient Deficiency",
    challenge: "Declining soil health and nutrient depletion across long-cultivated terraces.",
    solution:
      "Advanced liquid bio-fertilizers and customised micronutrient blends that enrich soil vitality and ensure higher, healthier yields — entirely without chemicals.",
  },
  {
    icon: Bug,
    title: "Uncontrollable Pests & Disease",
    challenge: "High infestation of pests and fungal diseases in Sikkim's primary cash crops.",
    solution:
      "High-efficiency, certified organic bio-pesticides and bio-fungicides formulated to protect large cardamom, ginger and high-altitude vegetables.",
  },
  {
    icon: Zap,
    title: "Labour Intensity & Slow Growth",
    challenge: "Steep terraces make organic practices punishingly labour-intensive.",
    solution:
      "Innovative plant growth regulators (PGRs) and organic inputs that improve crop speed and vigour, reducing the manual intervention every season demands.",
  },
  {
    icon: PackageCheck,
    title: "Low Market Value & Perishability",
    challenge: "High spoilage and non-premium prices erode whatever the season returns.",
    solution:
      "Post-harvest care technology that extends shelf life, paired with our partner network connecting Kisans directly to markets that pay what organic is worth.",
  },
];

export default function WhyFloraxPage() {
  return (
    <main data-testid="why-florax-page" className="pt-28 lg:pt-32">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="overline text-florax-muted">Why FLORAX?</p>
        <h1 className="mt-4 font-editorial text-5xl sm:text-6xl lg:text-8xl text-florax-primary leading-[0.95] max-w-5xl">
          Tailored agri-biotech<br />
          <span className="italic text-florax-accent">for Sikkim's organic future.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-florax-muted text-lg leading-relaxed">
          At FLORAX, we understand the unique spirit of Sikkim's "100% Organic" journey — and the
          intense challenges that come with it. As a specialised agri-biotech firm, we don't just provide
          products; we offer scientifically tailored solutions to make your organic farm more productive,
          resilient, and profitable.
        </p>
      </section>

      <section className="mt-20">
        <img src={HERO} alt="Sikkim Himalayas" className="w-full h-[55vh] object-cover" />
      </section>

      {/* Vision */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <p className="overline text-florax-muted">Our Vision for Sikkim</p>
          <h2 className="mt-4 font-editorial text-4xl lg:text-5xl text-florax-primary leading-tight">
            We are bridging the gap between traditional organic farming and modern biotechnology
            <span className="text-florax-accent"> — to ensure the long-term sustainability of Sikkim's agriculture.</span>
          </h2>
        </div>
      </section>

      {/* Challenges We Solve */}
      <section className="py-24 bg-florax-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="overline text-florax-muted">The Challenges We Solve</p>
          <h2 className="mt-4 font-editorial text-5xl lg:text-6xl text-florax-primary leading-[1.05] max-w-4xl">
            Four problems on every Sikkim farm.<br />
            <span className="italic text-florax-accent">Four answers, in the bag.</span>
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-florax-border">
            {SOLUTIONS.map((s, i) => (
              <div
                key={i}
                data-testid={`why-solution-${i + 1}`}
                className="bg-florax-bg p-10 lg:p-12 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <s.icon className="w-8 h-8 text-florax-accent" strokeWidth={1.4} />
                  <span className="font-editorial text-4xl text-florax-secondary">0{i + 1}</span>
                </div>
                <h3 className="font-editorial text-3xl text-florax-primary mt-6 leading-tight">
                  {s.title}
                </h3>
                <div className="mt-6">
                  <p className="overline text-florax-accent mb-2">Challenge</p>
                  <p className="text-florax-muted leading-relaxed">{s.challenge}</p>
                </div>
                <div className="mt-6">
                  <p className="overline text-florax-primary mb-2">FLORAX Solution</p>
                  <p className="text-florax-text leading-relaxed">{s.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 lg:py-32 bg-florax-primary text-florax-bg">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p className="overline text-florax-secondary">FLORAX</p>
          <p className="mt-6 font-editorial text-4xl lg:text-6xl leading-[1.05] italic">
            Nurturing your soil,<br />
            <span className="text-florax-secondary">empowering your future.</span>
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/farmers" data-testid="why-cta-partner" className="px-6 py-3 bg-florax-secondary text-florax-primary text-sm tracking-wide hover:bg-florax-bg transition">
              Partner with us →
            </Link>
            <Link to="/products" data-testid="why-cta-shop" className="px-6 py-3 border border-florax-bg/40 text-florax-bg text-sm tracking-wide hover:bg-florax-bg hover:text-florax-primary transition">
              Visit our shop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
