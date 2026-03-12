import { Link } from "react-router-dom";
import { Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <h2
              className="text-4xl font-black tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              SLUT
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Unapologetically bold. Wear your truth.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-neutral-300">Shop</h3>
            <ul className="space-y-2">
              {["New In", "All Products", "T-Shirts", "Hoodies", "Accessories"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-neutral-300">Help</h3>
            <ul className="space-y-2">
              {["FAQ", "Shipping & Returns", "Size Guide", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-neutral-300">Company</h3>
            <ul className="space-y-2">
              {["About", "Careers", "Press", "Sustainability"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-neutral-600 text-xs tracking-widest">
            © {new Date().getFullYear()} SLUT CLOTHING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-neutral-600 hover:text-white text-xs tracking-wider transition-colors">PRIVACY</Link>
            <Link to="/" className="text-neutral-600 hover:text-white text-xs tracking-wider transition-colors">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}