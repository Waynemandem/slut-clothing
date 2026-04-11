// src/pages/Cart.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Full cart page. Shows all items, quantity controls, order summary,
// and a checkout CTA. Redirects to /shop if cart is empty.
// ─────────────────────────────────────────────────────────────────────────────
import { type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}
// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyCart(): JSX.Element {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6 text-center">
      <ShoppingBag size={48} strokeWidth={1} className="text-neutral-200" />
      <div>
        <h1 className="font-bebas text-4xl tracking-wide mb-2">Your Bag is Empty</h1>
        <p className="text-sm text-neutral-400 max-w-xs">
          Looks like you haven't added anything yet. The collection is waiting.
        </p>
      </div>
      <Link
        to="/shop"
        className="h-11 px-8 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors"
      >
        Start Shopping <ArrowRight size={13} />
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Cart(): JSX.Element {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useApp();

  if (cart.length === 0) return <EmptyCart />;

  const shipping = cartTotal >= 15000 ? 0 : 599; // free over $150
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-bebas text-4xl md:text-5xl tracking-wide leading-none">
              Your Bag
            </h1>
            <p className="text-xs text-neutral-400 mt-1 tracking-wide">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={12} />
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* ── Left: Cart items ── */}
          <div className="lg:col-span-2 space-y-0">
            {/* Column headers — desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-neutral-200 mb-2">
              <span className="col-span-6 text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                Product
              </span>
              <span className="col-span-2 text-[11px] font-bold tracking-widest uppercase text-neutral-400 text-center">
                Size
              </span>
              <span className="col-span-2 text-[11px] font-bold tracking-widest uppercase text-neutral-400 text-center">
                Qty
              </span>
              <span className="col-span-2 text-[11px] font-bold tracking-widest uppercase text-neutral-400 text-right">
                Total
              </span>
            </div>

            {/* Cart items */}
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="grid grid-cols-12 gap-4 py-6 border-b border-neutral-100 items-center"
              >
                {/* Image + name */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-start">
                  {/* Image */}
                  <Link
                    to={`/product/${(item as any).slug ?? item.id}`}
                    className="flex-shrink-0 w-20 h-24 md:w-24 md:h-28 bg-neutral-100 overflow-hidden"
                  >
                    <img
                      src={item.images?.[0] ?? "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${(item as any).slug ?? item.id}`}
                      className="text-sm font-semibold tracking-wide hover:opacity-60 transition-opacity line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-neutral-400 mt-1 capitalize">{item.category}</p>
                    {/* Mobile: size + price inline */}
                    <div className="flex items-center justify-between mt-2 md:hidden">
                      <span className="text-xs text-neutral-500 tracking-widest uppercase">
                        Size: {item.size}
                      </span>
                      <span className="text-sm font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                    {/* Mobile: quantity row */}
                    <div className="flex items-center gap-3 mt-3 md:hidden">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-medium border-x border-neutral-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop remove */}
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="hidden md:flex text-neutral-300 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                    aria-label="Remove item"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Size — desktop */}
                <div className="hidden md:flex col-span-2 justify-center">
                  <span className="text-xs tracking-widest uppercase text-neutral-600 border border-neutral-200 px-3 py-1.5">
                    {item.size}
                  </span>
                </div>

                {/* Quantity — desktop */}
                <div className="hidden md:flex col-span-2 justify-center">
                  <div className="flex items-center border border-neutral-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-xs font-medium border-x border-neutral-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Line total — desktop */}
                <div className="hidden md:flex col-span-2 justify-end">
                  <span className="text-sm font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 border border-neutral-200 p-6 sticky top-24">
              <h2 className="text-xs font-bold tracking-widest uppercase mb-6">
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-neutral-400 tracking-wide">
                    Free shipping on orders over $150
                  </p>
                )}
                <div className="border-t border-neutral-200 pt-3 flex justify-between">
                  <span className="text-sm font-bold tracking-wide">Total</span>
                  <span className="text-sm font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => alert("Stripe coming soon!")}
                className="w-full h-12 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors mb-3"
              >
                Checkout <ArrowRight size={13} />
              </button>

              {/* Continue shopping */}
              <Link
                to="/shop"
                className="w-full h-11 border border-neutral-300 text-xs font-bold tracking-widest uppercase flex items-center justify-center hover:border-black transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
                {[
                  "Free returns within 30 days",
                  "Secure checkout",
                  "Free shipping over $150",
                ].map((text) => (
                  <p key={text} className="text-[11px] text-neutral-400 tracking-wide flex items-center gap-2">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full flex-shrink-0" />
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}