import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { useApp } from "../context/AppContext";

const navLinks = [
  { label: "NEW IN", href: "/shop?filter=new" },
  { label: "SHOP", href: "/shop" },
  { label: "COLLECTIONS", href: "/shop?filter=collections" },
  { label: "ABOUT", href: "/about" },
];

export default function Navbar() {
  const { cartCount, user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBase = isHome && !scrolled
    ? "text-white"
    : "text-black";

  const bgClass = isHome && !scrolled
    ? "bg-transparent"
    : "bg-white border-b border-neutral-100";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`text-xl font-black tracking-[0.3em] uppercase transition-colors duration-300 ${navBase}`}
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.25em" }}
        >
          SLUT
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-opacity duration-200 hover:opacity-50 ${navBase}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={`flex items-center gap-4 ${navBase}`}>
          <button className="hidden md:flex hover:opacity-50 transition-opacity">
            <Search size={18} />
          </button>

          <Link
            to={user ? "/account" : "/login"}
            className="hidden md:flex hover:opacity-50 transition-opacity"
          >
            <User size={18} />
          </Link>

          <Link to="/cart" className="relative hover:opacity-50 transition-opacity">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none border border-black">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden hover:opacity-50 transition-opacity">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-black text-white border-none p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <span className="text-lg font-black tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SLUT</span>
                  <button onClick={() => setMobileOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex flex-col p-6 gap-6 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-bold tracking-widest uppercase text-white hover:text-neutral-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-6 border-t border-white/10 flex gap-4">
                  <Link to={user ? "/account" : "/login"} onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="border-white text-white bg-transparent hover:bg-white hover:text-black text-xs tracking-widest">
                      {user ? "ACCOUNT" : "LOGIN"}
                    </Button>
                  </Link>
                  <Link to="/cart" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="bg-white text-black hover:bg-neutral-200 text-xs tracking-widest">
                      CART {cartCount > 0 && `(${cartCount})`}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}