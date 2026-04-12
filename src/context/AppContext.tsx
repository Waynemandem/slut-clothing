// ─────────────────────────────────────────────────────────────────────────────
// src/context/AppContext.tsx
// Global state provider: cart (localStorage-persisted) + Supabase auth session.
// Wrap the entire app in <AppProvider>. Consume with useApp() hook.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { CartItem, Product } from '@/types';
import { toast } from "sonner";

// ── Context shape ─────────────────────────────────────────────────────────────

interface AppContextValue {
  // Auth
  user: User | null;
  isAdmin: boolean;
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  // Cart mutations
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ── Helper: load cart from localStorage ──────────────────────────────────────

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem('slut_cart') ?? '[]');
  } catch {
    return [];
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

// ✅ AFTER — useCallback gives it a stable reference React can track

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // Step 1: Define checkAdmin BEFORE the effect, wrapped in useCallback.
  // useCallback means: "create this function once and reuse the same reference
  // unless its dependencies change." Since it has no deps (supabase is module-level
  // and stable), it's created exactly once — no stale closure possible.
  const checkAdmin = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    setIsAdmin(data?.is_admin ?? false);
  }, []); // ← empty deps is correct: supabase client never changes

  // Step 2: Now add checkAdmin to the useEffect dependency array.
  // Because checkAdmin is stable (useCallback with []), this effect
  // still only runs once — but ESLint is now satisfied and the closure is safe.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdmin(session?.user?.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        checkAdmin(session?.user?.id);
      }
    );

    return () => subscription.unsubscribe();
  }, [checkAdmin]); // ✅ checkAdmin is now in deps — safe, correct, lint-happy

  // ── Persist cart to localStorage whenever it changes ──
  useEffect(() => {
    localStorage.setItem('slut_cart', JSON.stringify(cart));
  }, [cart]);


  // ── Cart mutations ──

  const addToCart = useCallback(
    (product: Product, size: string, quantity = 1) => {
      setCart(prev => {
        const existing = prev.find(
          item => item.id === product.id && item.size === size
        );
        if (existing) {
          toast.success(`Updated quantity in bag`);
          return prev.map(item =>
            item.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        toast.success(`Added to bag`, {
          description: `${product.name} — ${size}`,
          });
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            category: product.category,
            size,
            quantity,
            slug: product.slug,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
    toast("Removed from bag");
  }, []);

  const updateQuantity = useCallback(
    (id: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id, size);
        return;
      }
      setCart(prev =>
        prev.map(item =>
          item.id === id && item.size === size ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  // ── Derived values ──
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────

/**
 * useApp() — access global cart and auth state from any component.
 * @example const { cart, cartCount, addToCart, user } = useApp();
 */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside <AppProvider>');
  }
  return ctx;
}