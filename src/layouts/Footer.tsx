// ─────────────────────────────────────────────────────────────────────────────
// src/layout/Footer.tsx
// Full-width brand footer. Pure presentational — no hooks or data fetching.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';
import { JSX } from 'react';

const SHOP_LINKS = ['New In', 'All Products', 'T-Shirts', 'Hoodies', 'Accessories'];
const HELP_LINKS = ['FAQ', 'Shipping & Returns', 'Size Guide', 'Contact Us'];
const COMPANY_LINKS = ['About', 'Careers', 'Press', 'Sustainability'];

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-black  text-white pt-16 pb-8">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <h2
              className="text-4xl font-black tracking-[0.25em] mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              SLUT
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mb-5">
              Unapologetically bold. Wear your truth.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Twitter size={17} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(item => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Help
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(item => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(item => (
                <li key={item}>
                  <Link
                    to="/about"
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Legal row ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-neutral-600 text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} SLUT™. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link
                key={item}
                to="/"
                className="text-neutral-600 hover:text-white text-[10px] tracking-wider uppercase transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}