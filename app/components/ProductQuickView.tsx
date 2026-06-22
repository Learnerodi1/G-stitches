"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedStars from "./AnimatedStars";

interface Product {
  src: string;
  alt: string;
  name: string;
  price: string;
  category?: string;
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!product) return null;

  // Mobile drawer variant
  const mobileVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  // Desktop modal variant
  const desktopVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: isMobile ? { y: 20, opacity: 0 } : { scale: 0.9, opacity: 0 },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
    },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ground/80 backdrop-blur-sm z-40"
          />

          {/* Modal/Drawer Container */}
          <motion.div
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={`fixed z-50 ${
              isMobile
                ? "bottom-0 left-0 right-0 rounded-t-2xl"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
            } bg-ground`}
            style={{
              width: isMobile ? "100%" : "90%",
              maxWidth: isMobile ? "100%" : "600px",
              height: isMobile ? "85vh" : "auto",
            }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className={`absolute ${
                isMobile ? "top-4 right-4" : "top-6 right-6"
              } w-11 h-11 flex items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20 transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory`}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-ivory"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>

            {/* Content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex flex-col ${isMobile ? "h-full" : ""}`}
            >
              {/* Image section */}
              <div
                className={`relative overflow-hidden bg-ground ${
                  isMobile
                    ? "h-72 sm:h-96"
                    : "w-full aspect-[3/4] max-h-96"
                }`}
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ground/40 to-transparent" />
              </div>

              {/* Product details */}
              <div
                className={`flex-1 overflow-y-auto ${
                  isMobile
                    ? "p-5 sm:p-6"
                    : "p-6 sm:p-8"
                } space-y-4 sm:space-y-6`}
              >
                {/* Category */}
                {product.category && (
                  <motion.p
                    className="text-[10px] font-semibold tracking-[0.2em] uppercase text-antique-gold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {product.category}
                  </motion.p>
                )}

                {/* Product name */}
                <motion.h2
                  className="text-2xl sm:text-3xl font-bold text-ivory leading-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {product.name}
                </motion.h2>

                {/* Rating */}
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedStars
                    count={5}
                    rating={5}
                    className="gap-1"
                  />
                  <span className="text-xs text-ivory/40 font-semibold">
                    (12 reviews)
                  </span>
                </motion.div>

                {/* Price */}
                <motion.div
                  className="flex items-baseline gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <span className="text-3xl sm:text-4xl font-black text-signal-red">
                    {product.price}
                  </span>
                  <span className="text-sm text-ivory/50 line-through">
                    ₦55,000
                  </span>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="text-sm sm:text-base text-ivory/60 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Premium African fashion piece crafted with attention to detail.
                  Perfect for any occasion. Handmade with high-quality fabrics
                  and traditional tailoring techniques.
                </motion.p>

                {/* Size/Options */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-antique-gold">
                    Available Sizes
                  </p>
                  <div className="flex gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <motion.button
                        key={size}
                        className="w-11 h-11 flex items-center justify-center border border-ivory/30 rounded text-ivory text-sm font-semibold hover:border-signal-red hover:text-signal-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex gap-3 border-t border-ivory/10 ${
                  isMobile
                    ? "p-5 sm:p-6"
                    : "p-6 sm:p-8"
                }`}
              >
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-3 sm:py-4 border border-ivory/30 text-ivory rounded-lg hover:bg-ivory/10 transition-colors font-semibold uppercase text-xs sm:text-sm tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  className="flex-1 py-3 sm:py-4 bg-signal-red text-pure-white rounded-lg hover:bg-signal-red/90 transition-colors font-semibold uppercase text-xs sm:text-sm tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
