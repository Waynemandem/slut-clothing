// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom";
import { type JSX } from "react";
import SEO from "@/components/SEO"

export default function NotFound(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
    <SEO
    title="404 - Page Not Found" 
    url=""
    />
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background 404 */}
      <span
        className="absolute font-bebas text-[clamp(160px,40vw,320px)] text-white select-none pointer-events-none leading-none"
        style={{ opacity: 0.04 }}
      >
        404
      </span>

      {/* CRT lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
        }}
      />

      {/* Red top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <p className="text-[11px] font-mono tracking-[0.4em] uppercase text-red-500">
          Error 404
        </p>
        <h1 className="font-bebas text-white text-[clamp(48px,12vw,96px)] leading-none tracking-wide">
          Page Not Found
        </h1>
        <p className="text-neutral-500 text-sm max-w-xs tracking-wide">
          This page doesn't exist or has been moved. Don't get lost — the collection is waiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => navigate("/")}
            className="h-11 px-8 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-100 transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="h-11 px-8 border border-neutral-700 text-white text-xs font-bold tracking-widest uppercase hover:border-white transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-8 flex justify-between w-full px-8">
        <span className="font-mono text-[9px] tracking-widest text-neutral-700 uppercase">SLUT™ Clothing</span>
        <span className="font-mono text-[9px] tracking-widest text-neutral-700 uppercase">SS/2025</span>
      </div>
    </div>
    </>
  );
}