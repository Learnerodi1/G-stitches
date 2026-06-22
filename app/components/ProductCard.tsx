"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface Product {
  src: string;
  alt: string;
  name: string;
  price: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  href?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  onWishlist,
  href = "/gallery",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlist?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <Link href={href} className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-sm">
      <motion.div
        className="relative overflow-hidden h-full bg-ground rounded-lg transition-shadow duration-400 hover:shadow-[0_20px_40px_rgba(26,14,14,0.2),0_8px_16px_rgba(196,30,58,0.08)]"
        initial={shouldReduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true }}
        transition={shouldReduceMotion ? { duration: 0 } : {
          duration: 0.7,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
        whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
      >
        {/* Image container with zoom on hover */}
        <div className="relative overflow-hidden aspect-[3/4] bg-ground">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <Image
              src={product.src}
              alt={product.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ground/80 via-ground/20 to-transparent" />

          {/* Wishlist button - top right */}
          <motion.button
            onClick={handleWishlist}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
            initial={shouldReduceMotion ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : {
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 sm:w-5 sm:h-5 text-signal-red"
              animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
          </motion.button>

          {/* Quick View overlay - centered */}
          <div className="absolute inset-0 bg-ground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.button
              onClick={handleQuickView}
              className="bg-signal-red text-pure-white text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] px-5 sm:px-6 py-3 sm:py-3 rounded-full hover:bg-signal-red/90 transition-colors min-h-11 sm:min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 18, delay: 0.05 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            >
              Quick View
            </motion.button>
          </div>
        </div>

        {/* Product info section */}
        <div className="p-4 sm:p-4 md:p-5 space-y-2 overflow-hidden">
          {/* Category label */}
          {product.category && (
            <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-antique-gold">
              {product.category}
            </p>
          )}

          {/* Product name */}
          <h3 className="text-sm sm:text-base font-semibold text-ivory leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <motion.p
            className="text-base sm:text-lg font-bold text-signal-red"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {product.price}
          </motion.p>

          {/* Add to Cart button - Mobile CTA */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full mt-3 py-3 sm:py-3 min-h-11 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] bg-signal-red/10 text-signal-red rounded-md hover:bg-signal-red hover:text-pure-white transition-all duration-300 border border-signal-red/30 hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red"
            whileHover={shouldReduceMotion ? undefined : { backgroundColor: "rgb(196, 30, 58)" }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
