// src/pages/OrderConfirmation.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shown after successful payment. Reads order details from router state.
// ─────────────────────────────────────────────────────────────────────────────
import { type JSX } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { CartItem } from "@/types";

function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

interface OrderState {
  reference: string;
  total: number;
  items: CartItem[];
  shipping: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
  };
}

export default function OrderConfirmation(): JSX.Element {
  const location = useLocation();
  const state = location.state as OrderState | null;

  // If someone navigates here directly with no state, send them home
  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-sm mx-auto px-6 py-16 text-center">

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle size={56} strokeWidth={1.5} className="text-green-500" />
        </div>

        {/* Heading */}
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
          Payment Confirmed
        </p>
        <h1 className="font-bebas text-4xl md:text-5xl tracking-wide mb-4">
          Order Received!
        </h1>
        <p className="text-sm text-neutral-500 mb-2">
          Thank you, <span className="font-semibold text-black">{state.shipping.fullName}</span>.
          Your order is confirmed and will be processed shortly.
        </p>
        <p className="text-xs text-neutral-400 mb-10 font-mono tracking-wide">
          Ref: {state.reference}
        </p>

        {/* Order details */}
        <div className="bg-neutral-50 border border-neutral-200 text-left p-6 mb-6">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-4">
            Order Summary
          </p>
          <div className="space-y-3 mb-4">
            {state.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-neutral-600">
                  {item.name}{" "}
                  <span className="text-neutral-400">× {item.quantity}</span>
                  <span className="text-neutral-400 ml-1">({item.size})</span>
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-sm">
            <span>Total Paid</span>
            <span>{formatPrice(state.total)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-neutral-50 border border-neutral-200 text-left p-6 mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3">
            Shipping To
          </p>
          <div className="text-sm text-neutral-600 space-y-0.5">
            <p className="font-medium text-black">{state.shipping.fullName}</p>
            <p>{state.shipping.address}</p>
            <p>{state.shipping.city}, {state.shipping.state}</p>
            <p>Nigeria</p>
            <p className="text-neutral-400 mt-1">{state.shipping.email}</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/shop"
            className="flex-1 h-11 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping <ArrowRight size={13} />
          </Link>
          <Link
            to="/account"
            className="flex-1 h-11 border border-neutral-300 text-xs font-bold tracking-widest uppercase flex items-center justify-center hover:border-black transition-colors"
          >
            View Account
          </Link>
        </div>
      </div>
    </div>
  );
}