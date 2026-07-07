"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

export interface CartItem {
  id: string;
  src: string;
  alt: string;
  name: string;
  price: number;
  category?: string;
  size: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; delta: number }
  | {type: "CLEAR" }              // ← add this
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.max(1, i.qty + action.delta) } : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  addItem: (
    product: { src: string; alt: string; name: string; price: string; category?: string },
    size: string
  ) => void;
   clearCart: () => void;   
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const parsePrice = (price: string) =>
  parseInt(price.replace(/[₦,\s]/g, ""), 10) || 0;

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gstitches-cart");
      if (stored) dispatch({ type: "HYDRATE", items: JSON.parse(stored) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("gstitches-cart", JSON.stringify(state.items));
  }, [state.items]);

  const value: CartContextValue = {
    items: state.items,
    cartCount: state.items.reduce((sum, i) => sum + i.qty, 0),
    cartTotal: state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    isOpen: state.isOpen,
    addItem: (product, size) => {
      const id = `${product.src}_${size}`;
      dispatch({
        type: "ADD",
        item: {
          id,
          src: product.src,
          alt: product.alt,
          name: product.name,
          price: parsePrice(product.price),
          category: product.category,
          size,
          qty: 1,
        },
      });
    },
     clearCart: () => dispatch({ type: "CLEAR" }),
    removeItem: (id) => dispatch({ type: "REMOVE", id }),
    updateQty: (id, delta) => dispatch({ type: "UPDATE_QTY", id, delta }),
    openCart: () => dispatch({ type: "OPEN" }),
    closeCart: () => dispatch({ type: "CLOSE" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
