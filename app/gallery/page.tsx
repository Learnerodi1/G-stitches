"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ParallaxHero from "../components/animations/ParallaxHero";
import FadeUp from "../components/animations/FadeUp";
import TextReveal from "../components/animations/TextReveal";
import ProductGrid from "../components/ProductGrid";
import ProductQuickView from "../components/ProductQuickView";

interface Product {
  src: string;
  alt: string;
  name: string;
  price: string;
  category?: string;
}

const products: Product[] = [
  { src: "/women-maroon-african-dress.jpg", alt: "Maroon African Dress", name: "Maroon African Dress", price: "₦55,000", category: "Women" },
  { src: "/women-red-lace-dress.jpg", alt: "Red Lace Evening Dress", name: "Red Lace Evening Dress", price: "₦65,000", category: "Women" },
  { src: "/men-black-top.jpg", alt: "Black Casual Top", name: "Black Casual Top", price: "₦30,000", category: "Men" },
  { src: "/women-brown-ankara-set.jpg", alt: "Brown Ankara Set", name: "Brown Ankara Set", price: "₦48,000", category: "Women" },
  { src: "/women-ankara-mermaid.jpg", alt: "Ankara Mermaid Gown", name: "Ankara Mermaid Gown", price: "₦62,000", category: "Women" },
  { src: "/hero-woman-brown-outfit.jpg", alt: "Embroidered Brown Outfit", name: "Embroidered Brown Outfit", price: "₦45,000", category: "Women" },
  { src: "/men-maroon-stripe.jpg", alt: "Maroon Stripe Ensemble", name: "Maroon Stripe Ensemble", price: "₦70,000", category: "Men" },
  { src: "/men-maroon-sunglasses.jpg", alt: "Maroon Casual Look", name: "Maroon Casual Look", price: "₦35,000", category: "Men" },
  { src: "/women-maroon-beaded-gown.jpg", alt: "Beaded Maroon Gown", name: "Beaded Maroon Gown", price: "₦68,000", category: "Women" },
  { src: "/hero-woman-jumpsuit.jpg", alt: "Chic Jumpsuit", name: "Chic Jumpsuit", price: "₦42,000", category: "Women" },
  { src: "/men-pink-agbada.jpg", alt: "Pink Agbada Set", name: "Pink Agbada Set", price: "₦58,000", category: "Men" },
  { src: "/women-ankara-teal-gown.jpg", alt: "Teal Ankara Gown", name: "Teal Ankara Gown", price: "₦52,000", category: "Women" },
  { src: "/women-black-velvet-gown.jpg", alt: "Black Velvet Evening Gown", name: "Black Velvet Evening Gown", price: "₦85,000", category: "Women" },
  { src: "/women-maroon-cape-gown.jpg", alt: "Maroon Cape Gown", name: "Maroon Cape Gown", price: "₦78,000", category: "Women" },
  { src: "/women-ankara-sculpture-gown.jpg", alt: "Ankara Sculpture Gown", name: "Ankara Sculpture Gown", price: "₦72,000", category: "Women" },
  { src: "/women-red-xo-jumpsuit.jpg", alt: "Red XO Print Jumpsuit", name: "Red XO Print Jumpsuit", price: "₦46,000", category: "Women" },
  { src: "/men-maroon-kaftan-set.jpg", alt: "Maroon Kaftan Set", name: "Maroon Kaftan Set", price: "₦40,000", category: "Men" },
  { src: "/men-maroon-asymmetric-top.jpg", alt: "Maroon Asymmetric Top", name: "Maroon Asymmetric Top", price: "₦38,000", category: "Men" },
  { src: "/women-red-lace-aso-oke.jpg", alt: "Red Lace Aso Oke", name: "Red Lace Aso Oke", price: "₦92,000", category: "Women" },
  { src: "/women-maroon-tribal-gown.jpg", alt: "Maroon Tribal Gown", name: "Maroon Tribal Gown", price: "₦75,000", category: "Women" },
  { src: "/women-purple-ankara-gown.jpg", alt: "Purple Ankara Gown", name: "Purple Ankara Gown", price: "₦68,000", category: "Women" },
  { src: "/men-black-designer-top.jpg", alt: "Black Designer Top", name: "Black Designer Top", price: "₦32,000", category: "Men" },
  { src: "/women-brown-palazzo-set.jpg", alt: "Brown Palazzo Set", name: "Brown Palazzo Set", price: "₦44,000", category: "Women" },
  { src: "/men-pink-agbada-fila.jpg", alt: "Pink Agbada with Fila", name: "Pink Agbada with Fila", price: "₦62,000", category: "Men" },
  { src: "/men-maroon-senator.jpg", alt: "Maroon Senator Style", name: "Maroon Senator Style", price: "₦48,000", category: "Men" },
];

const filters = [
  { label: "Outfits", active: false },
  { label: "All", active: true },
  { label: "Accessories", active: false },
  { label: "Women", active: false },
  { label: "Men", active: false },
];

const collections = [
  { name: "Date Night", image: "/women-red-lace-dress.jpg" },
  { name: "Night Vibes", image: "/women-black-gown.jpg" },
  { name: "Weddings", image: "/women-maroon-beaded-gown.jpg" },
  { name: "Everyday wears", image: "/men-maroon-casual.jpg" },
  { name: "Outings", image: "/hero-woman-brown-outfit.jpg" },
];

export default function GalleryPage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div>
      {/* ── PARALLAX HERO ── */}
      <ParallaxHero
        imageSrc="/clothing-rack.jpg"
        overlayClass="bg-ground/85"
        height="min-h-[65vh] sm:min-h-[60vh]"
      >
        <div className="flex flex-col items-center justify-center text-center px-4">
          <FadeUp>
            <p className="font-sans uppercase tracking-[0.3em] text-antique-gold text-sm">
              Gallery
            </p>
          </FadeUp>

          <TextReveal
            text="Discover Your Style"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-pure-white mt-2"
          />

          <FadeUp delay={0.5}>
            <Link
              href="#products"
              className="bg-signal-red text-pure-white px-8 py-3 rounded-full mt-6 inline-block hover:shadow-lg hover:shadow-signal-red/30 transition-all duration-300 font-sans text-sm uppercase tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
            >
              Start Shopping
            </Link>
          </FadeUp>

          <FadeUp delay={0.6}>
            <div className="relative w-full max-w-md mt-4">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/75"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                aria-label="Search products"
                className="bg-ivory/10 border border-ivory/40 rounded-full px-5 py-3 pl-10 w-full text-sm text-ivory placeholder:text-ivory/70 outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus:border-ivory/60 transition-colors duration-300"
              />
            </div>
          </FadeUp>
        </div>
      </ParallaxHero>

      {/* ── FILTER TABS ── */}
      <section className="py-8 px-4 bg-ivory">
        <FadeUp>
          <div className="flex gap-3 justify-center flex-wrap">
            {filters.map((tab) => (
              <button
                key={tab.label}
                className={`px-6 py-2.5 rounded-full text-sm font-sans font-medium cursor-pointer transition-all duration-300 uppercase tracking-[0.1em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red ${
                  tab.active
                    ? "bg-signal-red text-pure-white shadow-lg"
                    : "bg-ivory text-ground hover:bg-ground/5 border border-ground/25"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section id="products" className="bg-ivory py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-sans uppercase tracking-[0.3em] text-antique-gold text-xs mb-3">
              Curated Selection
            </p>
            <TextReveal
              text="All Products"
              as="h2"
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-ground"
            />
          </div>

          <ProductGrid
            products={products}
            variant="uniform"
            columns={4}
            onProductQuickView={handleQuickView}
          />
        </div>
      </section>

      {/* ── SALE BANNER ── */}
      <FadeUp>
        <section className="bg-ground py-20 text-center">
          <p className="font-sans text-xs text-antique-gold uppercase tracking-[0.3em] mb-4">
            End of Season
          </p>
          <TextReveal
            text="40% OFF"
            as="h2"
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black text-antique-gold italic"
          />
          <FadeUp delay={0.3}>
            <p className="text-ivory/85 font-sans text-sm mt-4 max-w-md mx-auto px-5">
              Limited time only. Shop our curated selection of statement pieces at
              unprecedented prices.
            </p>
          </FadeUp>
          <FadeUp delay={0.5}>
            <Link
              href="#products"
              className="inline-block mt-8 bg-signal-red text-pure-white px-10 py-3 rounded-full font-sans text-sm uppercase tracking-[0.15em] hover:shadow-lg hover:shadow-signal-red/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
            >
              Shop the Sale
            </Link>
          </FadeUp>
        </section>
      </FadeUp>

      {/* ── EXPLORE COLLECTIONS ── */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-sans uppercase tracking-[0.3em] text-antique-gold text-xs mb-3">
              Browse By Mood
            </p>
            <TextReveal
              text="Explore Collections"
              as="h2"
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-ground"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
            {collections.map((col, i) => (
              <FadeUp key={col.name} delay={i * 0.1}>
                <div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden relative group cursor-pointer">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="font-sans text-ground/75 text-xs font-semibold uppercase tracking-[0.2em] mt-2 px-1">
                    {col.name}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ProductQuickView Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
