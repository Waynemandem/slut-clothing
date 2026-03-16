// ─────────────────────────────────────────────────────────────────────────────
// src/components/HeroSection.tsx
// Cinematic full-viewport hero. Background image with gradient overlay,
// glass card with headline and CTAs.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  /** Background image URL */
  imageUrl?: string;
  /** Top eyebrow label */
  eyebrow?: string;
  /** Large display heading (can include \n for line breaks) */
  heading?: string;
  /** Subheading paragraph */
  subheading?: string;
  /** Primary CTA */
  primaryCta?: { label: string; href: string };
  /** Secondary CTA */
  secondaryCta?: { label: string; href: string };
}

export default function HeroSection({
  imageUrl = 'https://i.pinimg.com/736x/16/2f/3f/162f3f5e00d991a4cf2db0a129012182.jpg',
  eyebrow = 'SS 2025 Collection',
  heading = 'WEAR YOUR\nTRUTH',
  subheading = 'Unapologetically bold. Designed for those who refuse to blend in.',
  primaryCta = { label: 'Shop Now', href: '/shop' },
  secondaryCta = { label: 'New Arrivals', href: '/shop?filter=new' },
}: HeroSectionProps) {
  return (
    <section className="relative w-full h-screen min-h-[640px] flex items-end overflow-hidden">

      {/* ── Background layer ── */}
      <div className="absolute inset-0 bg-black">
        <img
          src={imageUrl}
          alt="Hero background"
          className="w-full h-full object-cover opacity-55"
          // Priority image — no lazy load for above-the-fold
          loading="eager"
        />
        {/* Cinematic gradient: heavy at bottom, light at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-10 pb-20 md:pb-28">
        {/*
          glass-dark is defined in index.css:
          backdrop-blur-xl bg-black/40 border border-white/10 shadow-xl
        */}
        <div className="max-w-xl glass-dark p-8 md:p-10 rounded-2xl">
          <p className="text-white/50 text-[10px] tracking-[0.45em] uppercase mb-4 font-medium">
            {eyebrow}
          </p>

          <h1
            className="text-white leading-none mb-6 whitespace-pre-line"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              letterSpacing: '0.02em',
              lineHeight: 0.9,
            }}
          >
            {heading.split('\n').map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span className="text-white/25">{line}</span>
                ) : (
                  line
                )}
                {i < heading.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            {subheading}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={primaryCta.href}>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-neutral-100 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase px-8 h-12 transition-colors"
              >
                {primaryCta.label}
              </Button>
            </Link>
            <Link to={secondaryCta.href}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black rounded-none text-[10px] font-bold tracking-[0.2em] uppercase px-8 h-12 transition-all"
              >
                {secondaryCta.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 right-10 hidden md:flex items-center gap-3 text-white/30">
        <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-10 h-px bg-white/20" />
      </div>
    </section>
  );
}