import React from "react";
import { Link } from "react-router-dom";
import { CloudRain, Bug, Leaf, MountainSnow, Truck, Users, Wallet, Microscope } from "lucide-react";

const TERRACES = "https://images.pexels.com/photos/8220089/pexels-photo-8220089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const HERO = "https://images.unsplash.com/photo-1685426797195-1ac5d8b5647a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzaWtraW0lMjB0ZXJyYWNlZCUyMGZhcm1zJTIwaGltYWxheWFzfGVufDB8fHx8MTc3NzA5NTQwNnww&ixlib=rb-4.1.0&q=85";
const HARVEST = "https://images.pexels.com/photos/27177517/pexels-photo-27177517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const LAB = "https://images.pexels.com/photos/8851404/pexels-photo-8851404.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const CHALLENGES = [
  {
    icon: Leaf,
    pct: "60%",
    title: "Cardamom blight",
    body: "The Chirkey and Foorkey viral diseases swept Sikkim's large cardamom belt in the 2000s, wiping out nearly 60% of plantations. Many partner families have not seen pre-disease yields in twenty years. Most still re-plant from infected mother stock because clean planting material is scarce and unaffordable.",
  },
  {
    icon: CloudRain,
    pct: "+12 days",
    title: "An unreliable monsoon",
    body: "Flowering in cardamom and millet runs eight to twelve days late on average compared to a decade ago. Cloudbursts and hailstorms — rare in our grandparents' diaries — now strike two to three times a season, flattening standing crops in minutes.",
  },
  {
    icon: Bug,
    pct: "↑",
    title: "New pests, warmer slopes",
    body: "Stem borers in maize, fruit flies in citrus, and aphids in cardamom are creeping uphill as winters get milder. Without chemical pesticides (Sikkim is fully organic), Kisans face these pressures with neem decoctions and prayer.",
  },
  {
    icon: MountainSnow,
    pct: "≤ 1.5 ac",
    title: "Tiny holdings on steep ground",
    body: "Average operational holding in Sikkim is under 1.5 acres, often spread across non-contiguous terraces at different elevations. Mechanisation is impossible; everything moves on the back, the head, or the mule. Labour shortage compounds the burden every year.",
  },
  {
    icon: Truck,
    pct: "30–40%",
    title: "Post-harvest losses",
    body: "Roads wash out for weeks during monsoon. Cold storage is virtually absent in rural blocks. By the time tomatoes, leafy greens or fresh cardamom reach Siliguri, 30–40% of value is lost to spoilage and rejection.",
  },
  {
    icon: Wallet,
    pct: "₹0",
    title: "No premium for being organic",
    body: "Sikkim went fully organic in 2016. Eight years on, most Kisans are still paid generic mandi prices — middlemen rarely separate certified-organic produce from conventional. The promise of a premium has remained largely on paper.",
  },
  {
    icon: Users,
    pct: "55+",
    title: "An ageing farm workforce",
    body: "The median age of an active Sikkimese Kisan is now over 55. Sons and daughters leave for Bengaluru, Delhi, or the Gulf. Without a viable economic case to stay, the next generation watches the terraces go fallow.",
  },
  {
    icon: Microscope,
    pct: "0",
    title: "No public extension science",
    body: "Once-active KVK and state extension support has thinned. There is no village-level lab a Kisan can walk into to test soil, pest, or microbial load. They are diagnosing nineteenth-century plagues with twentieth-century books.",
  },
];

const ANSWERS = [
  {
    n: "01",
    title: "Tissue-cultured, virus-free cardamom",
    body: "We are propagating Chirkey- and Foorkey-clean cardamom suckers in our Gangtok lab and supplying them to partner Kisans at cost. The first 4,200 saplings went out in 2024.",
  },
  {
    n: "02",
    title: "Indigenous microbial inputs",
    body: "Trichoderma, Pseudomonas and other strains isolated from Sikkim soil — formulated locally, sold to partner Kisans at production cost. No imports, no patents on living things from this land.",
  },
  {
    n: "03",
    title: "Direct-to-shelf supply chain",
    body: "Every product we sell pays its grower above mandi rates and is traceable to a slope and a season. We refuse to be middlemen of our own Kisans' work.",
  },
  {
    n: "04",
    title: "Field laboratory, on rotation",
    body: "Quarterly visits with portable soil, pest and water testing kits to all twelve partner Kisans. Reports are written in Nepali and English, left with the Kisan, and discussed.",
  },
  {
    n: "05",
    title: "Climate-resilient cropping plans",
    body: "Co-designed with each farm: drought-tolerant millet on upper terraces, hail-netted cardamom under shade trees, kitchen-garden polyculture for monsoon income.",
  },
  {
    n: "06",
    title: "A long contract, written down",
    body: "Three-year minimum buying contract, indexed to inflation. The Kisan can leave any year. We cannot. This single clause has changed every conversation we have had since.",
  },
];

export default function SustainabilityPage() {
  return (
    <main data-testid="sustainability-page" className="pt-28 lg:pt-32">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="overline text-florax-muted">
          <span className="font-editorial italic normal-case text-base">Kahaniyan</span> Pahadon Ki
        </p>
        <h1 className="mt-4 font-editorial text-5xl sm:text-6xl lg:text-8xl text-florax-primary leading-[0.95] max-w-5xl">
          The Himalayas don't<br />
          <span className="italic text-florax-accent">need our optimism.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-florax-muted text-lg leading-relaxed">
          They need our patience. FLORAX is the long apprenticeship of a young agri-biotech firm
          to one of the oldest landscapes still feeding people on Earth — and to the Kisans who, against
          steepening odds, still feed it back.
        </p>
      </section>

      <section className="mt-20">
        <img src={HERO} alt="Sikkim Himalayas" className="w-full h-[60vh] object-cover" />
      </section>

      {/* The 2016 promise */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <p className="overline text-florax-muted mb-4">The 2016 promise</p>
          <h2 className="font-editorial text-4xl lg:text-5xl text-florax-primary leading-tight">
            Sikkim, in the eastern crook of the Himalayas, became the world's first fully organic state in 2016.
          </h2>
          <p className="mt-8 text-florax-muted leading-relaxed text-lg">
            On paper, the declaration outlawed every chemical fertilizer and synthetic pesticide on every acre of every district.
            Eight years on, the soil is healthier and the conversation has matured.
          </p>
          <p className="mt-6 text-florax-muted leading-relaxed text-lg">
            But behind the headline lives a quieter, harder reality — one we cannot honestly skip past.
          </p>
        </div>
      </section>

      {/* The Burden — deep dive */}
      <section className="py-24 bg-florax-primary text-florax-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="overline text-florax-secondary">The Burden</p>
          <h2 className="mt-4 font-editorial text-5xl lg:text-6xl leading-[1.05] max-w-4xl">
            What it actually costs<br />
            <span className="italic text-florax-secondary">to farm in Sikkim today.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-florax-bg/75 text-lg leading-relaxed">
            We hear these eight problems on every farm we visit. They are not abstractions; they are the daily arithmetic
            of being a Sikkimese smallholder in the 2020s.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-florax-bg/15">
            {CHALLENGES.map((c, i) => (
              <div key={i} className="bg-florax-primary p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <c.icon className="w-7 h-7 text-florax-secondary" strokeWidth={1.4} />
                  <span className="font-editorial text-3xl text-florax-secondary">{c.pct}</span>
                </div>
                <h3 className="font-editorial text-2xl mt-6 leading-tight">{c.title}</h3>
                <p className="mt-3 text-florax-bg/75 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice from the field */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <img src={TERRACES} alt="A terraced farm in Dzongu" className="w-full h-[60vh] object-cover" />
          </div>
          <div className="lg:col-span-7">
            <p className="overline text-florax-muted">A voice from Dzongu</p>
            <p className="mt-6 font-editorial text-3xl lg:text-4xl text-florax-primary leading-tight italic">
              "My grandfather had cardamom this tall." <br />
              <span className="not-italic text-florax-accent">— hand at his shoulder. </span>
              "My father, this tall." <br />
              <span className="not-italic text-florax-accent">— hand at his hip. </span>
              "Mine, this." <br />
              <span className="not-italic text-florax-accent">— knee high. </span>
              "And the rain comes when it likes."
            </p>
            <p className="mt-6 overline text-florax-muted">— Pem Lepcha, partner Kisan · Dzongu, 67</p>
            <p className="mt-10 text-florax-muted leading-relaxed">
              We carry conversations like this with us into every meeting in Gangtok and every batch test in the lab.
              Sustainability for FLORAX cannot mean stewardship of a museum landscape. It has to mean making farming
              <em> economically livable </em>for the people who still know how to do it.
            </p>
          </div>
        </div>
      </section>

      {/* What we do — the answers */}
      <section className="py-24 bg-florax-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="overline text-florax-muted">Our answer</p>
          <h2 className="mt-4 font-editorial text-5xl lg:text-6xl text-florax-primary leading-[1.05] max-w-4xl">
            Six commitments,<br />
            <span className="italic text-florax-accent">written down and dated.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-florax-muted text-lg leading-relaxed">
            Every problem above has a corresponding line item in our budget and our calendar. This is what
            agri-biotech actually looks like when it is built around its Kisans, not around a pitch deck.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
            {ANSWERS.map((a) => (
              <div key={a.n}>
                <p className="font-editorial text-5xl text-florax-accent">{a.n}</p>
                <h4 className="font-editorial text-2xl text-florax-primary mt-4 leading-tight">{a.title}</h4>
                <p className="text-sm text-florax-muted mt-3 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab + harvest split */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="overline text-florax-muted">The middle path</p>
            <h3 className="mt-4 font-editorial text-4xl lg:text-5xl text-florax-primary leading-tight">
              Pure organic farming without modern soil biology is a slow climb.
            </h3>
            <p className="mt-6 text-florax-muted leading-relaxed">
              Modern agri-biotech without rooted ecological knowledge is an export. FLORAX tries to live
              in the middle — indigenous microbes, modern characterisation, transparent supply, fair contracts.
              No genetically engineered crops. No imported strains. No patents on living things from Sikkim.
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img src={LAB} alt="Gangtok lab" className="w-full h-72 lg:h-[400px] object-cover" />
            <img src={HARVEST} alt="Organic harvest" className="w-full h-72 lg:h-[400px] object-cover mt-12" />
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="py-24 lg:py-32 bg-florax-primary text-florax-bg">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p className="font-editorial text-3xl lg:text-4xl leading-tight italic">
            "We are not building a brand. We are trying to be worthy of a place — and of the people who have
            already given it everything."
          </p>
          <p className="mt-6 overline text-florax-secondary">— Debayan Pramanik, Founder</p>
          <Link to="/farmers" data-testid="sustain-cta" className="mt-12 inline-block px-6 py-3 bg-florax-secondary text-florax-primary text-sm tracking-wide hover:bg-florax-bg transition">
            Partner with us →
          </Link>
        </div>
      </section>
    </main>
  );
}
