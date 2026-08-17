"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useSession } from "./SessionContext";

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    status: string;
  } | null;
};

type CartSnapshot = { items: CartItem[]; total: number; count: number };

type CartContextValue = CartSnapshot & {
  loading: boolean;
  error: string | null;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  const applyCart = useCallback((cart: CartSnapshot) => {
    setItems(cart.items);
    setTotal(cart.total);
    setCount(cart.count);
  }, []);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to load cart");
      const cart = await res.json();
      applyCart(cart);
    } catch {
      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  }, [applyCart]);

  const addToCart = useCallback(
    async (productId: string) => {
      const previous: CartSnapshot = { items, total, count };
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const cart = await res.json();
        if (!res.ok) throw new Error(cart.error ?? "Unable to add to cart");
        applyCart(cart);
        toast.success("Added to cart");
      } catch (err) {
        applyCart(previous);
        toast.error(err instanceof Error ? err.message : "Unable to add to cart");
      }
    },
    [items, total, count, applyCart],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const previous: CartSnapshot = { items, total, count };
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.id !== itemId)
          : prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
      );
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        const cart = await res.json();
        if (!res.ok) throw new Error(cart.error ?? "Unable to update quantity");
        applyCart(cart);
      } catch (err) {
        applyCart(previous);
        toast.error(err instanceof Error ? err.message : "Unable to update quantity");
      }
    },
    [items, total, count, applyCart],
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      const previous: CartSnapshot = { items, total, count };
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      try {
        const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
        const cart = await res.json();
        if (!res.ok) throw new Error(cart.error ?? "Unable to remove item");
        applyCart(cart);
      } catch (err) {
        applyCart(previous);
        toast.error(err instanceof Error ? err.message : "Unable to remove item");
      }
    },
    [items, total, count, applyCart],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setTotal(0);
    setCount(0);
  }, []);

  // Initial load, and on a genuine login transition (guest -> user while mounted), merge the
  // guest cart first. Not re-triggered on plain mount-while-already-logged-in, since the login
  // route itself already merges server-side at the moment of sign-in.
  useEffect(() => {
    if (sessionLoading) return;

    const currentUserId = user?.id ?? null;
    const isFreshLogin =
      previousUserIdRef.current !== undefined &&
      previousUserIdRef.current === null &&
      currentUserId !== null;

    async function run() {
      if (isFreshLogin) {
        try {
          await fetch("/api/cart/merge", { method: "POST" });
        } catch {
          // Non-fatal — refreshCart below still shows whatever the server ends up with.
        }
      }
      await refreshCart();
    }

    run();
    previousUserIdRef.current = currentUserId;
  }, [user?.id, sessionLoading, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
