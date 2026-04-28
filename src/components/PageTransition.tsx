// src/components/PageTransition.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Black overlay that slides in/out between route changes.
// Wrap around page content in Layout.tsx.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, type ReactNode, type JSX } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps): JSX.Element {
  const location = useLocation();
  const [phase, setPhase] = useState<"idle" | "enter" | "exit">("idle");
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Phase 1: slide black panel IN (cover old page)
    setPhase("enter");

    const swapTimer = setTimeout(() => {
      // Phase 2: swap page content while panel is covering screen
      setDisplayChildren(children);
      setPhase("exit");
    }, 400); // matches the enter transition duration

    const idleTimer = setTimeout(() => {
      // Phase 3: panel fully gone, back to idle
      setPhase("idle");
    }, 800);

    return () => {
      clearTimeout(swapTimer);
      clearTimeout(idleTimer);
    };
  }, [location.pathname]);

  // Update children immediately on idle (no transition on first load)
  useEffect(() => {
    if (phase === "idle") setDisplayChildren(children);
  }, [children, phase]);

  return (
    <div className="relative">
      {/* Page content */}
      <div
        style={{
          opacity: phase === "enter" ? 0 : 1,
          transition: phase === "exit" ? "opacity 0.3s ease 0.1s" : "opacity 0.15s ease",
        }}
      >
        {displayChildren}
      </div>

      {/* Black overlay panel */}
      <div
        className="fixed inset-0 z-[100] bg-black pointer-events-none"
        style={{
          transform:
            phase === "idle"
              ? "translateY(-100%)"        // hidden above
              : phase === "enter"
              ? "translateY(0%)"           // covering screen
              : "translateY(100%)",        // sliding out below
          transition:
            phase === "enter"
              ? "transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)"
              : phase === "exit"
              ? "transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)"
              : "none",
        }}
      >
        {/* SLUT wordmark shown during transition */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bebas text-white tracking-widest select-none"
            style={{
              fontSize: "clamp(48px, 10vw, 96px)",
              opacity: phase === "enter" ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            SLUT
          </span>
        </div>

        {/* Red top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
      </div>
    </div>
  );
}