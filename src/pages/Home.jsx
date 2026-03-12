import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(4);
      setFeatured(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="bg-white">
      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-black">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80')",
            }}
          />
          {/* Cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-10 pb-20 md:pb-28">
          <div className="max-w-xl">
            <p className="text-white/60 text-xs tracking-[0.4em] uppercase mb-4 font-medium">
              SS 2025 Collection
            </p>
            <h1
              className="text-white leading-none mb-6"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                fontSize: "clamp(4rem, 12vw, 9rem)",
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
            >
              WEAR YOUR
              <br />
              <span className="text-white/30">TRUTH</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              Unapologetically bold. Designed for those who refuse to blend in.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-neutral-200 rounded-none text-xs font-bold tracking-[0.2em] uppercase px-8 h-12"
                >
                  Shop Now
                </Button>
              </Link>
              <Link to="/shop?filter=new">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white bg-transparent hover:bg-white hover:text-black rounded-none text-xs font-bold tracking-[0.2em] uppercase px-8 h-12"
                >
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-10 hidden md:flex items-center gap-2 text-white/40">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-12 h-px bg-white/30" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-black py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(8).fill("SLUT CLOTHING · NEW COLLECTION · SS25 · FREE SHIPPING OVER $150 · ").map((t, i) => (
            <span key={i} className="text-white text-[11px] tracking-[0.2em] font-medium mx-4 uppercase">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-neutral-400 tracking-[0.3em] uppercase mb-2">Featured</p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
            >
              BESTSELLERS
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:opacity-50 transition-opacity"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-100 aspect-[3/4] mb-3" />
                <div className="h-3 bg-neutral-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Placeholder grid when no Supabase products yet */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {PLACEHOLDER_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/shop">
            <Button variant="outline" className="rounded-none border-black text-xs tracking-widest uppercase px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ── */}
      <section className="grid md:grid-cols-2 gap-0">
        <div className="relative aspect-square bg-neutral-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80"
            alt="Collection A"
            className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-1">Collection</p>
            <h3 className="text-white text-3xl font-black tracking-wide mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              THE ESSENTIALS
            </h3>
            <Link to="/shop?filter=essentials">
              <Button size="sm" className="rounded-none bg-white text-black hover:bg-neutral-200 text-xs tracking-widest uppercase w-fit">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative aspect-square bg-neutral-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
            alt="Collection B"
            className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-1">Limited</p>
            <h3 className="text-white text-3xl font-black tracking-wide mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              NIGHT SERIES
            </h3>
            <Link to="/shop?filter=limited">
              <Button size="sm" className="rounded-none bg-white text-black hover:bg-neutral-200 text-xs tracking-widest uppercase w-fit">
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRAND MANIFESTO ── */}
      <section className="bg-black text-white py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.5em] uppercase text-white/40 mb-6">Our Story</p>
          <blockquote
            className="text-4xl md:text-6xl font-black leading-tight mb-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
          >
            "FASHION IS THE ARMOR TO SURVIVE THE REALITY OF EVERYDAY LIFE."
          </blockquote>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
            Born from the streets, refined for the bold. SLUT Clothing is more than a brand —
            it's a statement. Every piece is designed to challenge norms and celebrate authenticity.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 mt-8 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors">
            Read Our Story <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-neutral-50 py-20 px-6 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-neutral-400 mb-3">Stay Bold</p>
        <h2
          className="text-3xl md:text-4xl font-black mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          JOIN THE MOVEMENT
        </h2>
        <p className="text-neutral-500 text-sm mb-8 max-w-md mx-auto">
          Get early access to drops, exclusive offers, and behind-the-scenes content.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 border border-black px-4 py-3 text-sm focus:outline-none rounded-none"
          />
          <Button className="rounded-none bg-black text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase px-6">
            Subscribe
          </Button>
        </form>
      </section>
    </div>
  );
}

// Placeholder products used before Supabase is connected
const PLACEHOLDER_PRODUCTS = [
  {
    id: "p1",
    name: "Void Oversized Tee",
    price: 48,
    compare_price: null,
    category: "T-Shirts",
    is_new: true,
    is_sale: false,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: "p2",
    name: "Drift Heavy Hoodie",
    price: 95,
    compare_price: 120,
    category: "Hoodies",
    is_new: false,
    is_sale: true,
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
  },
  {
    id: "p3",
    name: "Noir Cargo Pants",
    price: 110,
    compare_price: null,
    category: "Bottoms",
    is_new: true,
    is_sale: false,
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600&q=80",
  },
  {
    id: "p4",
    name: "Statement Bucket Hat",
    price: 35,
    compare_price: null,
    category: "Accessories",
    is_new: false,
    is_sale: false,
    image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
  },
];