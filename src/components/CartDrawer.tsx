// src/components/CartDrawer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A slide-in cart panel built on shadcn's Sheet component.
// Displays all cart items, quantity controls, totals, and a checkout CTA.
//
// The drawer is opened by passing open={true}. The parent (Navbar) controls
// open state so the cart icon badge can trigger it from outside.
//
// Usage:
//   const [cartOpen, setCartOpen] = useState(false);
//   <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
// ─────────────────────────────────────────────────────────────────────────────

import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useApp } from "../context/AppContext";
import type { CartItem } from "../types";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useApp();

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-neutral-100"
      >
        {/* ── Header ── */}
        <SheetHeader className="px-6 py-5 border-b border-neutral-100 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <SheetTitle className="text-sm font-bold tracking-[0.15em] uppercase">
              Your Bag
              {cartCount > 0 && (
                <span className="ml-2 text-neutral-400 font-normal">
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
              )}
            </SheetTitle>
          </div>
          <button
            onClick={close}
            className="text-neutral-400 hover:text-black transition-colors p-1"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <EmptyCart onClose={close} />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {cart.map((item) => (
                <CartLineItem
                  key={`${item.id}-${item.size}`}
                  item={item}
                  onRemove={() => removeFromCart(item.id, item.size)}
                  onUpdateQty={(qty) => updateQuantity(item.id, item.size, qty)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer (only visible when cart has items) ── */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-100 px-6 py-6 space-y-4">

            {/* Order summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">
                  {cartTotal >= 150 ? "Free" : "Calculated at checkout"}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Free shipping progress */}
            {cartTotal < 150 && (
              <div className="text-xs text-neutral-400 text-center">
                Add{" "}
                <span className="font-semibold text-black">
                  ${(150 - cartTotal).toFixed(2)}
                </span>{" "}
                more for free shipping
                <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cartTotal / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Checkout CTA */}
            <Link to="/cart" onClick={close}>
              <Button className="w-full rounded-none bg-black text-white hover:bg-neutral-800 h-12 text-xs font-bold tracking-[0.2em] uppercase">
                Checkout <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>

            {/* Continue shopping */}
            <button
              onClick={close}
              className="w-full text-center text-xs text-neutral-400 hover:text-black transition-colors tracking-wider uppercase"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── CartLineItem ──────────────────────────────────────────────────────────────
// A single row in the cart. Shows image, name, size, price, and qty controls.
interface CartLineItemProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}

function CartLineItem({ item, onRemove, onUpdateQty }: CartLineItemProps) {
  const image = item.images?.[0] ?? "/placeholder.jpg";

  return (
    <li className="flex gap-4 px-6 py-5">
      {/* Thumbnail */}
      <Link to={`/product/${item.id}`} className="flex-shrink-0">
        <div className="w-20 h-24 bg-neutral-100 overflow-hidden">
          <img
            src={image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <div>
            {item.category && (
              <p className="text-[10px] text-neutral-400 tracking-widest uppercase mb-0.5">
                {item.category}
              </p>
            )}
            <Link
              to={`/product/${item.id}`}
              className="text-sm font-medium leading-tight hover:opacity-60 transition-opacity line-clamp-2"
            >
              {item.name}
            </Link>
          </div>
          <button
            onClick={onRemove}
            className="text-neutral-300 hover:text-black transition-colors flex-shrink-0 mt-0.5"
            aria-label={`Remove ${item.name}`}
          >
            <X size={14} />
          </button>
        </div>

        {/* Size */}
        <p className="text-xs text-neutral-400 mt-1">Size: {item.size}</p>

        {/* Price + qty */}
        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Quantity stepper */}
          <div className="flex items-center border border-neutral-200">
            <button
              onClick={() => onUpdateQty(item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Line total */}
          <span className="text-sm font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </li>
  );
}

// ── EmptyCart ─────────────────────────────────────────────────────────────────
// Shown inside the drawer when the cart has no items.
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
      <ShoppingBag size={48} strokeWidth={1} className="text-neutral-200 mb-4" />
      <h3 className="text-sm font-semibold tracking-wide mb-2">Your bag is empty</h3>
      <p className="text-xs text-neutral-400 mb-8 max-w-xs">
        Looks like you haven't added anything yet. Browse the collection and find something bold.
      </p>
      <Link to="/shop" onClick={onClose}>
        <Button className="rounded-none bg-black text-white hover:bg-neutral-800 text-xs font-bold tracking-[0.2em] uppercase px-8 h-11">
          Shop Now
        </Button>
      </Link>
    </div>
  );
}