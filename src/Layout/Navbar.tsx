// src/components/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Fixed top navigation.
//
// BEHAVIOURS:
//   - Transparent with white text on the Home page hero (before scroll)
//   - Glassmorphism frosted panel after scrolling 40px (or on all non-home pages)
//   - Shrinks slightly on scroll (height: 64px → 52px via padding)
//   - Cart icon opens CartDrawer (slide-in sheet)
//   - Mobile hamburger opens a full-height black Sheet menu
//   - Shows Login or Account icon based on Supabase auth state
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import CartDrawer from "./CartDrawer";
import { useApp } from "../context/AppContext";

const NAV_LINKS = [
  { label: "New In",      href: "/shop?filter=new" },
  { label: "Shop",        href: "/shop"             },
  { label: "Collections", href: "/shop?sort=newest" },
  { label: "About",       href: "/about"            },
];

export default function Navbar() {
  const { cartCount, user } = useApp();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // ── Scroll listener ────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ── Style logic ────────────────────────────────────────────────────────
  // transparent = true only on home page before the user scrolls
  const transparent = isHome && !scrolled;

  const navBg = transparent
    ? "bg-transparent"
    : "glass border-b border-white/10"; // glassmorphism when scrolled / non-home

  const textColor   = transparent ? "text-white"    : "text-foreground";
  const hoverColor  = transparent ? "hover:text-white/60" : "hover:text-neutral-400";
  const paddingY    = scrolled    ? "py-3"           : "py-4"; // shrinks on scroll

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${navBg} ${paddingY}
        `}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            to="/"
            className={`text-xl font-black tracking-[0.3em] uppercase transition-colors duration-300 ${textColor}`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            SLUT
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`
                  text-[11px] font-semibold tracking-[0.15em] uppercase
                  transition-colors duration-200
                  ${textColor} ${hoverColor}
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className={`flex items-center gap-4 ${textColor}`}>

            {/* Search (desktop) */}
            <button
              className={`hidden md:flex transition-colors duration-200 ${hoverColor}`}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Account (desktop) */}
            <Link
              to={user ? "/account" : "/login"}
              className={`hidden md:flex transition-colors duration-200 ${hoverColor}`}
              aria-label={user ? "Account" : "Login"}
            >
              <User size={18} />
            </Link>

            {/* Cart icon — opens CartDrawer */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className={`relative transition-colors duration-200 ${hoverColor}`}
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  className={`
                    absolute -top-2 -right-2
                    text-[9px] font-bold w-4 h-4 rounded-full
                    flex items-center justify-center leading-none
                    transition-colors duration-300
                    ${transparent
                      ? "bg-white text-black"
                      : "bg-black text-white border border-white"
                    }
                  `}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className={`md:hidden transition-colors duration-200 ${hoverColor}`}
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>
              </SheetTrigger>

              {/* Mobile menu drawer */}
              <SheetContent
                side="right"
                showCloseButton={false}
                className="w-72 bg-black text-white border-none p-0"
              >
                <div className="flex flex-col h-full">

                  {/* Mobile menu header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <span
                      className="text-lg font-black tracking-[0.3em] uppercase"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      SLUT
                    </span>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Mobile nav links */}
                  <nav className="flex flex-col px-6 py-8 gap-6 flex-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-bold tracking-[0.1em] uppercase text-white hover:text-white/50 transition-colors"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile menu footer */}
                  <div className="px-6 py-6 border-t border-white/10 flex gap-3">
                    <Link
                      to={user ? "/account" : "/login"}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/30 text-white bg-transparent hover:bg-white hover:text-black rounded-none text-[10px] tracking-widest uppercase"
                      >
                        {user ? "Account" : "Login"}
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => {
                        setMobileOpen(false);
                        setCartDrawerOpen(true);
                      }}
                      className="flex-1 bg-white text-black hover:bg-neutral-200 rounded-none text-[10px] tracking-widest uppercase"
                    >
                      Bag {cartCount > 0 && `(${cartCount})`}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* CartDrawer lives outside the header so it overlays the whole page */}
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}