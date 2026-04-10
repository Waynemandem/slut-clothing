// src/pages/Account.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Account page — profile info, order history placeholder, sign out.
// Protected: redirects to /login if not authenticated.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, type JSX } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, ShoppingBag, User, Shield, ChevronRight, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";

export default function Account(): JSX.Element {
  const navigate = useNavigate();
  const { user, isAdmin } = useApp();

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  if (!user) return <></>;

  // Derive display name from email
  const displayName = user.email?.split("@")[0] ?? "Member";
  const joinDate = new Date(user.created_at).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ── Header ── */}
      <div className="bg-black text-white px-6 md:px-10 py-10">
        <div className="max-w-screen-md mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-2">
            My Account
          </p>
          <h1 className="font-bebas text-4xl tracking-wide">
            Welcome, {displayName}
          </h1>
          <p className="text-neutral-500 text-xs tracking-wide mt-1">
            Member since {joinDate}
          </p>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-6 md:px-10 py-10 space-y-6">

        {/* ── Profile card ── */}
        <div className="bg-white border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <User size={13} className="text-neutral-400" />
            <h2 className="text-[11px] font-bold tracking-widest uppercase">Profile</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] tracking-widest uppercase text-neutral-400">Email</span>
              <span className="text-sm text-black">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] tracking-widest uppercase text-neutral-400">Account ID</span>
              <span className="text-xs text-neutral-400 font-mono">{user.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] tracking-widest uppercase text-neutral-400">Status</span>
              <span className="text-[11px] font-bold tracking-wider uppercase bg-black text-white px-2 py-0.5">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Admin panel link — only visible to admins ── */}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center justify-between bg-black text-white px-6 py-4 hover:bg-neutral-900 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield size={15} />
              <div>
                <p className="text-xs font-bold tracking-widest uppercase">Admin Dashboard</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">Manage products, inventory</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-neutral-500 group-hover:text-white transition-colors" />
          </Link>
        )}

        {/* ── Order history ── */}
        <div className="bg-white border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <ShoppingBag size={13} className="text-neutral-400" />
            <h2 className="text-[11px] font-bold tracking-widest uppercase">Order History</h2>
          </div>
          {/* Empty state — replace this with real orders once Stripe is set up */}
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
            <Package size={32} strokeWidth={1} className="text-neutral-300" />
            <div>
              <p className="text-sm font-medium text-black">No orders yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Your completed orders will appear here once you make a purchase.
              </p>
            </div>
            <Link
              to="/shop"
              className="mt-2 h-10 px-6 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center hover:bg-neutral-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>

        {/* ── Sign out ── */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 h-11 border border-neutral-300 text-xs font-bold tracking-widest uppercase text-neutral-600 hover:border-black hover:text-black transition-colors bg-white"
        >
          <LogOut size={13} />
          Sign Out
        </button>

      </div>
    </div>
  );
}