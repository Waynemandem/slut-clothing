// src/pages/Account.tsx
import { useEffect, useState, type JSX } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, ShoppingBag, User, Shield, ChevronRight, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import type { CartItem } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: CartItem[];
  paystack_reference: string | null;
  shipping_address: {
    name: string;
    city: string;
    state: string;
  } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

const STATUS_STYLES: Record<string, string> = {
  paid:      "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  shipped:   "bg-blue-100 text-blue-700",
  delivered: "bg-black text-white",
};

export default function Account(): JSX.Element {
  const navigate = useNavigate();
  const { user, isAdmin } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // ── Fetch orders ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Orders fetch error:", error.message);
        setOrders((data as Order[]) ?? []);
        setOrdersLoading(false);
      });
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast("Signed out");
    navigate("/", { replace: true });
  };

  if (!user) return <></>;

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

        {/* ── Admin link ── */}
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
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={13} className="text-neutral-400" />
              <h2 className="text-[11px] font-bold tracking-widest uppercase">Order History</h2>
            </div>
            {orders.length > 0 && (
              <span className="text-[11px] text-neutral-400">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            )}
          </div>

          {/* Loading */}
          {ordersLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-neutral-300" />
            </div>
          )}

          {/* Empty state */}
          {!ordersLoading && orders.length === 0 && (
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
          )}

          {/* Orders list */}
          {!ordersLoading && orders.length > 0 && (
            <div className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <div key={order.id}>
                  {/* Order row */}
                  <button
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex flex-col gap-1">
                      {/* Reference */}
                      <p className="text-xs font-mono text-neutral-400">
                        {order.paystack_reference ?? order.id.slice(0, 12)}
                      </p>
                      {/* Date + items count */}
                      <p className="text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="text-neutral-400 font-normal ml-2">
                          · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </p>
                      {/* Shipping destination */}
                      {order.shipping_address && (
                        <p className="text-[11px] text-neutral-400">
                          {order.shipping_address.city}, {order.shipping_address.state}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      {/* Total */}
                      <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                      {/* Status badge */}
                      <span
                        className={`text-[9px] font-bold tracking-widest uppercase px-2 py-1