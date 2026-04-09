// src/components/IntroAnimation.tsx
// ─────────────────────────────────────────────────────────────────────────────
// First-visit glitch intro animation. Shows once per browser session.
// Full-screen black overlay with the SLUT wordmark glitching into focus,
// then the whole screen tears away upward to reveal the site.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState, useRef } from "react";

// Characters used during the scramble effect
const GLITCH_CHARS = "!@#$%^&*<>?/\\|[]{}~XØΔΨΛΣ∞≠≈";

// The final text to lock into
const BRAND_NAME = "SLUT";
const TAGLINE = "DESIRE IS NOT A CRIME";

function useGlitchText(target: string, startDelay: number, duration: number) {
  const [display, setDisplay] = useState(() =>
    Array.from({ length: target.length }, () =>
      GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    ).join("")
  );
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let startTimeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    let lockTimeout: ReturnType<typeof setTimeout>;

    startTimeout = setTimeout(() => {
      let elapsed = 0;
      const step = 40; // ms per frame

      interval = setInterval(() => {
        elapsed += step;
        const progress = elapsed / duration;

        // How many characters have locked in from left
        const lockedCount = Math.floor(progress * target.length);

        setDisplay(
          target
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < lockedCount) return char;
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join("")
        );

        if (elapsed >= duration) {
          clearInterval(interval);
          setDisplay(target);
          setLocked(true);
        }
      }, step);

      lockTimeout = setTimeout(() => {
        setDisplay(target);
        setLocked(true);
      }, duration + 50);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
      clearTimeout(lockTimeout);
    };
  }, [target, startDelay, duration]);

  return { display, locked };
}

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"glitch" | "hold" | "exit" | "done">("glitch");
  const [scanLine, setScanLine] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const brand = useGlitchText(BRAND_NAME, 300, 1000);
  const tagline = useGlitchText(TAGLINE, 900, 800);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 2) % 100);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Phase sequencing
  useEffect(() => {
    // After glitch settles → hold briefly → exit
    const holdTimer = setTimeout(() => setPhase("hold"), 2000);
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#000",
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exit" ? "transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
    >
      {/* Scan line effect */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent ${scanLine - 2}%,
            rgba(255,255,255,0.03) ${scanLine}%,
            transparent ${scanLine + 2}%
          )`,
        }}
      />

      {/* CRT horizontal lines overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* Glitch slice effects — random horizontal tears */}
      {phase === "glitch" && (
        <div className="pointer-events-none absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full"
              style={{
                top: `${20 + i * 25}%`,
                height: "2px",
                backgroundColor: "rgba(255,0,0,0.4)",
                animation: `glitchSlice ${0.15 + i * 0.1}s infinite`,
                animationDelay: `${i * 0.07}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Red accent bar — top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-red-600"
        style={{
          opacity: phase === "hold" ? 1 : 0.6,
          transition: "opacity 0.3s",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-4 select-none">
        {/* Corner brackets */}
        <div className="absolute -inset-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600" />
        </div>

        {/* Brand wordmark */}
        <div className="relative">
          {/* Glitch shadow layers */}
          <span
            className="absolute inset-0 font-bebas text-[clamp(80px,20vw,160px)] leading-none tracking-widest text-red-600 select-none"
            style={{
              transform: phase === "glitch" ? "translate(-3px, 0)" : "translate(0,0)",
              opacity: phase === "glitch" ? 0.7 : 0,
              transition: "all 0.1s",
              clipPath: "inset(30% 0 40% 0)",
            }}
            aria-hidden
          >
            {brand.display}
          </span>
          <span
            className="absolute inset-0 font-bebas text-[clamp(80px,20vw,160px)] leading-none tracking-widest text-blue-400 select-none"
            style={{
              transform: phase === "glitch" ? "translate(3px, 0)" : "translate(0,0)",
              opacity: phase === "glitch" ? 0.5 : 0,
              transition: "all 0.1s",
              clipPath: "inset(60% 0 10% 0)",
            }}
            aria-hidden
          >
            {brand.display}
          </span>

          {/* Main text */}
          <span
            className="relative font-bebas text-[clamp(80px,20vw,160px)] leading-none tracking-widest text-white"
            style={{
              textShadow: brand.locked
                ? "0 0 40px rgba(255,255,255,0.1)"
                : "0 0 20px rgba(255,50,50,0.8)",
            }}
          >
            {brand.display}
          </span>
        </div>

        {/* Tagline */}
        <p
          className="font-mono text-[clamp(8px,2vw,11px)] tracking-[0.4em] uppercase"
          style={{
            color: tagline.locked ? "rgba(255,255,255,0.5)" : "rgba(255,50,50,0.8)",
            transition: "color 0.4s",
          }}
        >
          {tagline.display}
        </p>

        {/* Loading bar */}
        <div className="w-48 h-px bg-neutral-800 mt-4 relative overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-red-600"
            style={{
              width: phase === "hold" || phase === "exit" ? "100%" : "0%",
              transition: "width 0.6s ease-out",
            }}
          />
        </div>
      </div>

      {/* Bottom system text */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8">
        <span className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase">
          SS/2025
        </span>
        <span className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase">
          SLUT™ CLOTHING
        </span>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes glitchSlice {
          0%, 100% { transform: translateX(0); opacity: 0; }
          25% { transform: translateX(-8px); opacity: 1; }
          75% { transform: translateX(8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
