// src/components/CheckoutForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Checkout form + Paystack popup integration.
// Collects shipping details, then triggers Paystack payment.
// On success, saves order to Supabase and redirects to confirmation page.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface CheckoutFormProps {
  onClose: () => void;
}

// ── Paystack types (no package needed — loaded via script) ────────────────────
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // in kobo
  currency: string;
  ref: string;
  metadata: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

// ── Generate unique reference ─────────────────────────────────────────────────
function generateRef(): string {
  return `SLUT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// ── Format price ──────────────────────────────────────────────────────────────
function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CheckoutForm({ onClose }: CheckoutFormProps): JSX.Element {
  const navigate = useNavigate();
  const { cart, cartTotal, user, clearCart } = useApp();

  const [form, setForm] = useState<ShippingDetails>({
    fullName: "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<Partial<ShippingDetails>>({});
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 1500000 ? 0 : 150000; // free over ₦15,000
  const total = cartTotal + shipping;

  // ── Field setter ──────────────────────────────────────────────────────────
  const set = (key: keyof ShippingDetails, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<ShippingDetails> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.phone.trim() || form.phone.length < 10)
      errs.phone = "Valid phone number is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save order to Supabase ────────────────────────────────────────────────
  const saveOrder = async (reference: string) => {
    const { error } = await supabase.from("orders").insert({
      user_id: user?.id ?? null,
      items: cart,
      total,
      status: "paid",
      shipping_address: {
        name: form.fullName,
        line1: form.address,
        city: form.city,
        state: form.state,
        phone: form.phone,
        country: "Nigeria",
      },
      paystack_reference: reference,
    });

    if (error) console.error("Order save error:", error.message);
  };

  // ── Load Paystack script dynamically ─────────────────────────────────────
  const loadPaystack = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.PaystackPop) return resolve();
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };

  // ── Handle checkout ───────────────────────────────────────────────────────
  const handleCheckout = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      await loadPaystack();

      const ref = generateRef();
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: total, // already in kobo
        currency: "NGN",
        ref,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", value: form.fullName },
            { display_name: "Phone", value: form.phone },
            { display_name: "Address", value: `${form.address}, ${form.city}, ${form.state}` },
          ],
        },
        callback: async (response) => {
          // Payment successful
          await saveOrder(response.reference);
          clearCart();
          navigate("/order-confirmation", {
            state: {
              reference: response.reference,
              total,
              items: cart,
              shipping: form,
            },
          });
        },
        onClose: () => {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack error:", err);
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  }, [form, total, cart, clearCart, navigate]);

  // ── Field component ───────────────────────────────────────────────────────
  const Field = ({
    label,
    field,
    type = "text",
    placeholder,
    half,
  }: {
    label: string;
    field: keyof ShippingDetails;
    type?: string;
    placeholder?: string;
    half?: boolean;
  }) => (
    <div className={half ? "flex-1" : "w-full"}>
      <label className="block text-[11px] font-bold tracking-widest uppercase mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 border px-4 text-sm focus:outline-none transition-colors ${
          errors[field]
            ? "border-red-400 focus:border-red-500"
            : "border-neutral-300 focus:border-black"
        }`}
      />
      {errors[field] && (
        <p className="text-red-500 text-[11px] mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="font-bebas text-2xl tracking-wide">Checkout</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-4">

          {/* Section label */}
          <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
            Shipping Details
          </p>

          {/* Full name */}
          <Field label="Full Name" field="fullName" placeholder="Wayne Mandem" />

          {/* Email + Phone */}
          <div className="flex gap-3">
            <Field label="Email" field="email" type="email" placeholder="you@email.com" half />
            <Field label="Phone" field="phone" type="tel" placeholder="08012345678" half />
          </div>

          {/* Address */}
          <Field label="Street Address" field="address" placeholder="12 Lagos Street" />

          {/* City + State */}
          <div className="flex gap-3">
            <Field label="City" field="city" placeholder="Lagos" half />
            <Field label="State" field="state" placeholder="Lagos State" half />
          </div>

          {/* Order summary */}
          <div className="border-t border-neutral-100 pt-4 space-y-2">
            <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 mb-3">
              Order Summary
            </p>
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-neutral-600 truncate max-w-[220px]">
                  {item.name}{" "}
                  <span className="text-neutral-400">× {item.quantity}</span>
                  <span className="text-neutral-400 ml-1">({item.size})</span>
                </span>
                <span className="font-medium flex-shrink-0 ml-4">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-neutral-100 pt-2 space-y-1">
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-12 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Pay {formatPrice(total)} <ArrowRight size={14} />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-neutral-400 mt-3 tracking-wide">
            Secured by Paystack · Your payment info is never stored
          </p>
        </div>
      </div>
    </div>
  );
}