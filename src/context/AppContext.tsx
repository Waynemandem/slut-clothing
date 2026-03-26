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

export function AppProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // ── Auth listener ──
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdmin(session?.user?.id);
    });

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        checkAdmin(session?.user?.id);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check if the logged-in user has admin role in the profiles table
  async function checkAdmin(userId: string | undefined) {
    if (!userId) { setIsAdmin(false); return; }
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    setIsAdmin(data?.is_admin ?? false);
  }

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
          return prev.map(item =>
            item.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.images[0] ?? '',
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