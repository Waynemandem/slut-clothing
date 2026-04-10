// src/pages/Login.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Handles Sign In, Sign Up, and Password Reset in a single page.
// Uses Supabase auth. Redirects to /account on success.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";

type Mode = "signin" | "signup" | "reset";

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useApp();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/account", { replace: true });
  }, [user, navigate]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    clearMessages();
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    clearMessages();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    // ── Sign Up ──
    if (mode === "signup") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Check your email to confirm your address.");
      }
      return;
    }

    // ── Password Reset ──
    if (mode === "reset") {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Reset link sent. Check your email.");
      }
      return;
    }

    // ── Sign In ──
    if (!password) {
      setError("Password is required.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error.message
      );
    }
    // successful signin triggers onAuthStateChange → AppContext updates user → useEffect above redirects
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const titles: Record<Mode, string> = {
    signin: "Welcome Back",
    signup: "Create Account",
    reset: "Reset Password",
  };

  const subtitles: Record<Mode, string> = {
    signin: "Sign in to your SLUT account",
    signup: "Join the movement",
    reset: "We'll send you a reset link",
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── Left panel — branding (desktop only) ── */}
      <div className="hidden lg:flex w-1/2 bg-black flex-col justify-between p-16 relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Logo */}
        <Link to="/" className="relative z-10">
          <span className="font-bebas text-white text-3xl tracking-widest">SLUT</span>
        </Link>
        {/* Center quote */}
        <div className="relative z-10">
          <p className="font-bebas text-white text-6xl leading-tight tracking-wide mb-4">
            DESIRE IS<br />NOT A<br />CRIME
          </p>
          <p className="text-neutral-500 text-sm tracking-widest uppercase">
            SS 2025 Collection
          </p>
        </div>
        {/* Bottom */}
        <p className="relative z-10 text-neutral-700 text-xs tracking-widest uppercase">
          © 2026 SLUT Clothing
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden block mb-10">
            <span className="font-bebas text-3xl tracking-widest">SLUT</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-bebas text-4xl tracking-wide mb-1">{titles[mode]}</h1>
            <p className="text-neutral-500 text-sm">{subtitles[mode]}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs tracking-wide">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-xs tracking-wide">
              {success}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-11 border border-neutral-300 px-4 text-sm focus:outline-none focus:border-black transition-colors"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            {mode !== "reset" && (
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 border border-neutral-300 px-4 pr-11 text-sm focus:outline-none focus:border-black transition-colors"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm password — signup only */}
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 border border-neutral-300 px-4 text-sm focus:outline-none focus:border-black transition-colors"
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>

          {/* Forgot password link */}
          {mode === "signin" && (
            <div className="mt-2 text-right">
              <button
                onClick={() => switchMode("reset")}
                className="text-[11px] text-neutral-400 hover:text-black tracking-wide transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-11 bg-black text-white text-xs font-bold tracking-widest uppercase mt-6 flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "reset" && "Send Reset Link"}
                <ArrowRight size={14} />
              </>
            )}
          </button>

          {/* Mode switcher */}
          <div className="mt-6 text-center text-xs text-neutral-500">
            {mode === "signin" && (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-black font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("signin")}
                  className="text-black font-semibold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
            {mode === "reset" && (
              <button
                onClick={() => switchMode("signin")}
                className="text-black font-semibold hover:underline"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}