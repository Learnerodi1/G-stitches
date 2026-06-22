"use client";

import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import FadeUp from "./animations/FadeUp";

interface Product {
  src: string;
  alt: string;
  name: string;
  price: string;
  category?: string;
}

interface ProductGridProps {
  products: Product[];
  variant?: "asymmetric" | "uniform";
  columns?: number;
  className?: string;
  onProductQuickView?: (product: Product) => void;
  onProductWishlist?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  variant = "uniform",
  columns = 4,
  className = "",
  onProductQuickView,
  onProductWishlist,
}: ProductGridProps) {
  // Build grid classes based on variant
  const getGridClasses = () => {
    if (variant === "asymmetric") {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 auto-rows-[minmax(160px,1fr)] sm:auto-rows-[minmax(200px,1fr)]";
    }

    // Uniform grid - responsive columns
    const colMap = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    };

    return `grid ${colMap[columns as keyof typeof colMap] || colMap[4]} gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6`;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {products.map((product, index) => {
        const isFirstAsymmetric =
          variant === "asymmetric" && index === 0;

        return (
          <FadeUp
            key={`${product.src}-${index}`}
            delay={index * 0.08}
            className={isFirstAsymmetric ? "sm:row-span-2 sm:col-span-1" : ""}
          >
            <ProductCard
              product={product}
              onQuickView={onProductQuickView}
              onWishlist={onProductWishlist}
            />
          </FadeUp>
        );
      })}
    </div>
  );
}
