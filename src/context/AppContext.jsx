import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("slut_cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("slut_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...product, size, quantity }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) return removeFromCart(id, size);
    setCart((prev) =>
      prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
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

export const useApp = () => useContext(AppContext);
export default AppContext;

//