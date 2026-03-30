// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Home.tsx
// Landing page: Hero → Marquee → Featured Products → Editorial Split →
// Brand Manifesto → Newsletter
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { FormEvent, JSX } from 'react';

type Panel = {
  img: string;
  label: string;
  title: string;
  href: string;
  cta: string;
};

const editorialPanels: Panel[] = [
    {
      img: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80',
      label: 'Collection',
      title: 'THE ESSENTIALS',
      href: '/shop?filter=essentials',
      cta: 'Shop Now',
    },
    {
      img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
      label: 'Limited',
      title: 'NIGHT SERIES',
      href: '/shop?filter=limited',
      cta: 'Explore',
    },
  ];


export default function Home(): JSX.Element {
  const { products, loading } = useFeaturedProducts();

  
  return (
    <div className="bg-white">

      {/* ── 1. Hero ── */}
      <HeroSection />

      {/* ── 2. Marquee strip ── */}
      <div className="relative bg-black py-3 overflow-hidden select-none" aria-hidden>
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="text-white text-[10px] tracking-[0.25em] font-medium mx-4 uppercase opacity-80"
            >
              SLUT CLOTHING · NEW COLLECTION · SS25 · FREE SHIPPING OVER $150 ·{' '}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Featured products ── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] text-neutral-400 tracking-[0.35em] uppercase mb-2">
              Featured
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '0.02em',
              }}
            >
              BESTSELLERS
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:opacity-40 transition-opacity"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <ProductGrid
          products={products}
          loading={loading}
        />

        <div className="text-center mt-10 md:hidden">
          <Link to="/shop">
            <Button
              variant="outline"
              className="rounded-none border-black text-[10px] tracking-widest uppercase px-8"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* ── 4. Editorial split ── */}
      <section className="grid md:grid-cols-2 w-full overflow-hidden">
        {editorialPanels.map(panel => (
          <div
            key={panel.title}
            className="relative aspect-square bg-neutral-900 overflow-hidden group"
          >
            <img
              src={panel.img}
              alt={panel.title}
              loading="lazy"
              className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/75 to-transparent">
              <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-1">
                {panel.label}
              </p>
              <h3
                className="text-white text-3xl font-black tracking-wide mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {panel.title}
              </h3>
              <Link to={panel.href}>
                <Button
                  size="sm"
                  className="rounded-none bg-white text-black hover:bg-neutral-100 text-[10px] tracking-widest uppercase w-fit"
                >
                  {panel.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── 5. Brand manifesto ── */}
      <section className="bg-black text-white py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-6">
            Our Story
          </p>
          <blockquote
            className="text-4xl md:text-6xl font-black leading-tight mb-8"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.02em',
            }}
          >
            "FASHION IS THE ARMOR TO SURVIVE THE REALITY OF EVERYDAY LIFE."
          </blockquote>
          <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
            Born from the streets, refined for the bold. SLUT Clothing is more
            than a brand — it's a statement. Every piece challenges norms and
            celebrates authentic self-expression.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 mt-8 text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors"
          >
            Read Our Story <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── 6. Newsletter ── */}
      <section className="bg-neutral-50 py-20 px-6 text-center">
        <p className="text-[10px] tracking-[0.45em] uppercase text-neutral-400 mb-3">
          Stay Bold
        </p>
        <h2
          className="text-3xl md:text-4xl font-black mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          JOIN THE MOVEMENT
        </h2>
        <p className="text-neutral-400 text-sm mb-8 max-w-md mx-auto">
          Early access to drops, exclusive offers, and behind-the-scenes
          content.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e: FormEvent) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 border border-black px-4 py-3 text-sm focus:outline-none rounded-none bg-transparent"
          />
          <Button className="rounded-none bg-black text-white hover:bg-neutral-800 text-[10px] font-bold tracking-widest uppercase px-6">
            Subscribe
          </Button>
        </form>
      </section>

    </div>
  );
}