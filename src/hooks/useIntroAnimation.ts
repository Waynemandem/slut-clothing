// src/hooks/useIntroAnimation.ts
// ─────────────────────────────────────────────────────────────────────────────
// Controls whether the intro animation should show.
// Only fires once per browser session using sessionStorage.
// Returning visitors within the same tab won't see it again.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

const STORAGE_KEY = "slut_intro_seen";

export function useIntroAnimation() {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
    if (!alreadySeen) {
      setShowIntro(true);
      // Prevent body scroll during animation
      document.body.style.overflow = "hidden";
    } else {
      setIntroComplete(true);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    document.body.style.overflow = "";
    setShowIntro(false);
    setIntroComplete(true);
  };

  return { showIntro, introComplete, handleComplete };
}