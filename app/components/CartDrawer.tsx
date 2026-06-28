"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

export default function CartDrawer() {
  const { items, cartTotal, cartCount, isOpen, closeCart, removeItem, updateQty } = useCart();
  const shipping = cartTotal >= 50000 ? 0 : 3000;
  const total = cartTotal + shipping;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-ground/70 backdrop-blur-sm z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
          />

          {/* Drawer — full width on mobile, capped on larger screens */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[360px] md:w-[400px] bg-ground border-l border-antique-gold/20 z-[301] flex flex-col shadow-2xl overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-antique-gold/20 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-ivory text-base sm:text-lg tracking-wide">
                  Your Cart
                </h2>
                {cartCount > 0 && (
                  <span className="bg-signal-red text-pure-white text-[10px] font-bold font-sans rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-full text-ivory/70 hover:text-ivory hover:bg-ivory/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3 px-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-10">
                  <svg className="w-14 h-14 text-ivory/15" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <div>
                    <p className="text-ivory/60 font-sans text-sm mb-1">Your cart is empty</p>
                    <p className="text-ivory/35 font-sans text-xs">Add items to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="text-antique-gold text-sm font-sans hover:text-ivory transition-colors"
                  >
                    Continue Shopping →
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border-b border-antique-gold/10 pb-3"
                    >
                      {/* Row: image + stacked content */}
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-ivory/5">
                          <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="64px" />
                        </div>

                        {/* Stacked content */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">

                          {/* Name + remove × */}
                          <div className="flex items-start gap-1">
                            <p className="text-ivory text-xs sm:text-sm font-semibold font-sans leading-snug flex-1 min-w-0">
                              {item.name}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 w-6 h-6 flex items-center justify-center text-ivory/30 hover:text-ivory transition-colors rounded mt-0.5"
                              aria-label="Remove item"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Size */}
                          <p className="text-antique-gold text-[10px] font-sans uppercase tracking-wider">
                            Size: {item.size}
                          </p>

                          {/* Unit price */}
                          <p className="text-antique-gold font-bold font-sans text-xs sm:text-sm">
                            {fmt(item.price)}
                          </p>

                          {/* Qty controls + line total */}
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center border border-antique-gold/25 rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-7 h-7 flex items-center justify-center text-ivory/70 hover:text-ivory hover:bg-ivory/10 transition-colors text-base leading-none"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="text-ivory text-xs font-sans w-5 text-center tabular-nums select-none">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-7 h-7 flex items-center justify-center text-ivory/70 hover:text-ivory hover:bg-ivory/10 transition-colors"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            {item.qty > 1 && (
                              <span className="text-ivory/50 text-[11px] font-sans tabular-nums">
                                {fmt(item.price * item.qty)}
                              </span>
                            )}
                          </div>

                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-antique-gold/20 px-4 py-4 space-y-3 shrink-0">
                {/* Totals */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-sans">
                    <span className="text-ivory/60">Subtotal</span>
                    <span className="text-ivory tabular-nums">{fmt(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-sans">
                    <span className="text-ivory/60">Shipping</span>
                    <span className={shipping === 0 ? "text-antique-gold" : "text-ivory"}>
                      {shipping === 0 ? "Free" : fmt(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-ivory/30 text-[10px] font-sans">
                      Free shipping on orders over ₦50,000
                    </p>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-antique-gold/15">
                    <span className="text-ivory font-sans text-xs sm:text-sm font-semibold">Total</span>
                    <span className="text-antique-gold font-display font-black text-base sm:text-lg tabular-nums">{fmt(total)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-signal-red text-pure-white py-3 rounded-full font-sans font-semibold text-[11px] sm:text-sm uppercase tracking-[0.08em] sm:tracking-[0.12em] hover:bg-signal-red/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red"
                >
                  Proceed to Checkout
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <button
                  onClick={closeCart}
                  className="block w-full text-center text-ivory/40 hover:text-ivory font-sans text-[11px] tracking-wide transition-colors py-0.5"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
