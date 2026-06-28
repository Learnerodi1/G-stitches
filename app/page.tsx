"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import TrustBadges from "./components/TrustBadges";
import FadeUp from "./components/animations/FadeUp";
import TextReveal from "./components/animations/TextReveal";
import NumberCounter from "./components/animations/NumberCounter";
import AnimatedStars from "./components/AnimatedStars";
import ProductGrid from "./components/ProductGrid";
import ProductQuickView from "./components/ProductQuickView";

const newArrivals = [
  { src: "/women-maroon-african-dress.jpg", alt: "Maroon African dress", name: "Maroon African Dress", price: "₦45,000" },
  { src: "/men-maroon-stripe.jpg", alt: "Maroon stripe set", name: "Maroon Stripe Set", price: "₦38,000" },
  { src: "/men-pink-agbada.jpg", alt: "Pink agbada", name: "Classic Pink Agbada", price: "₦52,000" },
  { src: "/women-ankara-teal-gown.jpg", alt: "Ankara teal gown", name: "Ankara Teal Gown", price: "₦42,000" },
];

const categories = [
  { src: "/women-maroon-beaded-gown.jpg", alt: "Maroon beaded gown", label: "Evening Wear", count: "12 pieces" },
  { src: "/men-black-top.jpg", alt: "Men's black top", label: "Men’s Collection", count: "18 pieces" },
  { src: "/hero-woman-brown-outfit.jpg", alt: "Brown outfit", label: "Casual Chic", count: "9 pieces" },
];

const testimonials = [
  {
    name: "Amara O.",
    role: "Bride",
    review: "G-Stitches made me feel like a queen on my wedding day. The attention to detail is unmatched!",
  },
  {
    name: "Chidinma E.",
    role: "Loyal Customer",
    review: "I love how every outfit fits perfectly. Their tailoring is truly world-class.",
  },
  {
    name: "Blessing A.",
    role: "Fashion Enthusiast",
    review: "From fabric selection to final fitting, the experience was seamless. Highly recommend!",
  },
];

const collections = [
  { label: "Date Night", src: "/women-red-lace-dress.jpg" },
  { label: "Weekend Vibes", src: "/hero-woman-brown-outfit.jpg" },
  { label: "Weddings", src: "/women-maroon-beaded-gown.jpg" },
  { label: "Everyday Wear", src: "/men-maroon-casual.jpg" },
  { label: "Outings", src: "/women-black-gown.jpg" },
];

const marqueeItems = [
  "Free Shipping Over ₦50,000",
  "New Arrivals Weekly",
  "Handcrafted with Love",
  "Book Your Fitting",
  "Premium African Fashion",
  "100% Secure Checkout",
];

function HeroParallaxImage() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "20%"]);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 z-10"
      style={{ y }}
    >
      <Image
        src="/tailor-sewing-machine.jpg"
        alt="Woman in stylish outfit"
        fill
        className="object-cover object-top"
        priority
      />
      {/* Bottom gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      {/* Subtle top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <FadeUp>
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold mb-3 font-sans">
        {children}
      </p>
    </FadeUp>
  );
}

interface Product {
  src: string;
  alt: string;
  name: string;
  price: string;
  category?: string;
}

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/*  1. HERO -- Magazine Cover Treatment                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] lg:min-h-screen overflow-hidden bg-ground -mt-[88px]">
        {/* Layer 1 (z-0): MASSIVE background watermark text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.h1
            className="font-display font-black uppercase leading-none text-pure-white/[0.06] text-center"
            style={{
              fontSize: "clamp(5rem, 15vw, 28rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
            }}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            CONFI
            <br />
            DENCE
          </motion.h1>
        </div>

        {/* Layer 2 (z-10): Hero parallax image */}
        <HeroParallaxImage />

        {/* Layer 3 (z-20): Overlay editorial content */}
        <div className="relative z-20 min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] lg:min-h-screen flex flex-col justify-end pb-16 sm:pb-20 md:pb-28 pt-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full">
            {/* Small label above headline */}
            <motion.p
              className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase text-antique-gold mb-4 sm:mb-5"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            >
              G-Stitches &mdash; Premium African Fashion
            </motion.p>

            {/* Main headline -- magazine cover style */}
            <div className="mb-6 sm:mb-8">
              <TextReveal
                text="WEAR YOUR"
                as="h1"
                className="font-sans text-lg sm:text-xl md:text-2xl font-medium tracking-[0.2em] uppercase text-ivory/80 leading-none mb-2 sm:mb-3"
                delay={0.4}
              />
              <motion.div
                className="overflow-visible"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <h2
                  className="font-display font-black uppercase text-ivory leading-[0.85] tracking-tight"
                  style={{
                    fontSize: "clamp(2.5rem, 10vw, 11rem)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  CONFIDENCE
                </h2>
              </motion.div>
            </div>

            {/* Tagline + CTA row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-8">
              <FadeUp delay={0.8}>
                <p className="text-ivory/80 max-w-md leading-relaxed text-sm sm:text-[15px] font-sans">
                  Trendy pieces. Timeless styles. G-Stitches has everything you
                  need to rock and feel your best. Premium African fashion,
                  tailored for you.
                </p>
              </FadeUp>

              <FadeUp delay={1.0}>
                <div className="flex flex-wrap gap-3 sm:gap-4 shrink-0">
                  <Link
                    href="/gallery"
                    className="btn-lift bg-signal-red text-pure-white rounded-full px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-signal-red/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
                  >
                    Shop Now
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3 }}
                    >
                      &rarr;
                    </motion.span>
                  </Link>
                  <Link
                    href="/gallery"
                    className="btn-lift border border-ivory/55 text-ivory rounded-full px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] hover:bg-ivory hover:text-ground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
                  >
                    Explore
                  </Link>
                </div>
                
              </FadeUp>
            </div>
          </div>
        </div>

        {/* Decorative gold line at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-antique-gold/30 z-30"
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] as const }}
          style={{ transformOrigin: "left" }}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  2. MARQUEE STRIP                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-ground border-y border-antique-gold/10 py-3.5 overflow-hidden">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-antique-gold/90 whitespace-nowrap px-6 sm:px-8 font-sans">
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-antique-gold/30 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  3. TRUST BADGES                                                    */}
      {/* ------------------------------------------------------------------ */}
      <TrustBadges variant="dark" />

      {/* ------------------------------------------------------------------ */}
      {/*  4. NEW ARRIVALS -- Asymmetric Editorial Grid                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-ground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* Section header -- left aligned, editorial */}
          <div className="mb-12 md:mb-16">
            <SectionLabel>Just Dropped</SectionLabel>
            <TextReveal
              text="New Arrivals"
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-ivory tracking-tight"
            />
            <motion.div
              className="w-16 h-px bg-antique-gold/40 mt-5"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {/* Asymmetric grid: first item large (2 rows), other 3 smaller */}
          <ProductGrid
            products={newArrivals}
            variant="asymmetric"
            onProductQuickView={handleQuickView}
            className="mb-12"
          />

          <FadeUp>
            <div className="flex justify-center mt-12">
              <Link
                href="/gallery"
                className="btn-lift border border-ivory/55 text-ivory rounded-full px-6 sm:px-10 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-ivory hover:text-ground transition-all duration-300 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
              >
                View All Products
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/*  5. SHOP BY CATEGORY -- Ivory section, editorial tall cards         */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-12 md:mb-16">
            <SectionLabel>Categories</SectionLabel>
            <TextReveal
              text="Shop by Category"
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-ground tracking-tight"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 xl:gap-8">
            {categories.map((cat, i) => (
              <FadeUp key={cat.label} delay={i * 0.12}>
                <Link href="/gallery" className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-sm">
                  <div className="relative overflow-visible">
                    {/* Tall image container */}
                    <div className="relative overflow-hidden aspect-[3/5]">
                      <Image
                        src={cat.src}
                        alt={cat.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Overlapping label -- positioned to break out of the image */}
                    <div className="relative -mt-6 sm:-mt-8 md:-mt-10 px-4 sm:px-5 z-10">
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-ground leading-[0.95] tracking-tight">
                        {cat.label}
                      </h3>
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-antique-gold mt-2 font-sans">
                        {cat.count}
                      </p>
                      <motion.span
                        className="inline-block text-xs text-ground/75 mt-2 font-semibold uppercase tracking-[0.15em] font-sans"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
                      >
                        Shop Now &rarr;
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/*  6. PROMO CARDS -- Editorial Asymmetric Layout                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24 bg-ground">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1 -- Large feature card spanning 2 columns */}
            <FadeUp delay={0} className="md:col-span-2">
              <motion.div
                className="bg-ivory/[0.06] border border-antique-gold/25 overflow-hidden group card-modern h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                  <div className="h-56 sm:h-auto relative overflow-hidden">
                    <Image
                      src="/women-ankara-mermaid.jpg"
                      alt="Ankara mermaid dress"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-4">
                    <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-antique-gold font-sans">
                      Trending
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-ivory leading-[0.95] tracking-tight">
                      New Look
                    </h3>
                    <p className="text-sm text-ivory/75 leading-relaxed font-sans">
                      Explore the latest trends in African fashion. Bold silhouettes, rich textures, and masterful tailoring.
                    </p>
                    <Link
                      href="/gallery"
                      className="btn-lift inline-block bg-signal-red text-pure-white rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-signal-red/90 transition-colors duration-300 mt-2 w-fit font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            </FadeUp>

            {/* Card 2 -- Tall referral discount card */}
            <FadeUp delay={0.12}>
              <motion.div
                className="bg-ivory text-ground overflow-hidden group card-modern h-full flex flex-col"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="h-48 sm:h-56 relative overflow-hidden">
                  <Image
                    src="/men-maroon-sunglasses.jpg"
                    alt="Man in maroon outfit"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6 md:p-7 space-y-3 flex-1 flex flex-col justify-center">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-antique-gold font-sans">
                    Limited Offer
                  </p>
                  <NumberCounter
                    target={10}
                    suffix="% OFF"
                    label=""
                    duration={1.5}
                    className="!text-left [&_span]:!text-4xl [&_span]:!font-black [&_span]:!text-ground [&_p]:hidden"
                  />
                  <p className="text-sm text-ground/75 leading-relaxed font-sans">
                    Refer your friends and get a discount on your next order
                  </p>
                  <Link
                    href="/gallery"
                    className="btn-lift inline-block border border-ground/30 text-ground rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-ground hover:text-ivory transition-all duration-300 mt-1 w-fit font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ground focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                  >
                    Get Discount
                  </Link>
                </div>
              </motion.div>
            </FadeUp>
          </div>

          {/* Third promo -- full width strip below */}
          <FadeUp delay={0.24} className="mt-4 sm:mt-5">
            <motion.div
              className="bg-ivory/[0.06] border border-antique-gold/25 overflow-hidden group card-modern"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center">
                <div className="h-48 sm:h-56 relative overflow-hidden">
                  <Image
                    src="/women-brown-ankara-set.jpg"
                    alt="Woman in ankara set"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-8 col-span-2 space-y-3">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-antique-gold font-sans">
                    Experience
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black uppercase text-ivory leading-[0.95] tracking-tight">
                    Visit Us In Store
                  </h3>
                  <p className="text-sm text-ivory/75 leading-relaxed max-w-md font-sans">
                    Experience our collection up close. Feel the fabrics, see the craftsmanship, and find your perfect fit.
                  </p>
                  <Link
                    href="/contact"
                    className="btn-lift inline-block border border-ivory/55 text-ivory rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-ivory hover:text-ground transition-all duration-300 mt-1 w-fit font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
                  >
                    Find a Store
                  </Link>
                </div>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  7. TESTIMONIALS                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24 bg-ground">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* Gold divider */}
          <motion.div
            className="w-full h-px bg-antique-gold/20 mb-14 md:mb-18"
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
            style={{ transformOrigin: "center" }}
          />

          <div className="text-center mb-12 md:mb-16">
            <SectionLabel>Testimonials</SectionLabel>
            <TextReveal
              text="What Our Clients Say"
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-ivory tracking-tight"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="relative bg-ivory/[0.07] border border-antique-gold/25 p-5 sm:p-6 md:p-8 hover:border-antique-gold/50 transition-all duration-500 h-full card-elevated">
                  {/* Large decorative quote mark */}
                  <span className="absolute top-4 right-5 font-display text-6xl text-antique-gold/30 leading-none select-none">
                    &rdquo;
                  </span>

                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="w-11 h-11 rounded-full bg-signal-red/30 ring-1 ring-antique-gold/30 flex items-center justify-center text-ivory font-bold text-sm shrink-0 font-display"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: i * 0.1,
                      }}
                    >
                      {t.name.charAt(0)}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-ivory text-sm font-sans">
                        {t.name}
                      </p>
                      <p className="text-xs text-ivory/65 font-sans">{t.role}</p>
                    </div>
                  </div>

                  <AnimatedStars className="!justify-start mb-4" />

                  <p className="text-sm text-ivory/85 leading-relaxed font-sans">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/*  8. EXPLORE COLLECTIONS -- Ivory section, creative sizing           */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-12 md:mb-16">
            <SectionLabel>Curated For You</SectionLabel>
            <TextReveal
              text="Explore Collections"
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-ground tracking-tight"
            />
          </div>

          {/* Creative asymmetric grid: varied heights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 xl:gap-5">
            {collections.map((cat, i) => (
              <FadeUp
                key={cat.label}
                delay={i * 0.07}
                className={
                  i === 0
                    ? "sm:row-span-2 sm:col-span-1"
                    : i === 3
                    ? "sm:col-span-2 md:col-span-1"
                    : ""
                }
              >
                <Link href="/gallery" className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-sm">
                  <motion.div
                    className={`overflow-hidden relative ${
                      i === 0 ? "min-h-[300px] sm:min-h-[400px] md:min-h-[500px]" : "aspect-[3/5]"
                    }`}
                    whileHover="hover"
                  >
                    <motion.div
                      className="absolute inset-0 -top-[10%] -bottom-[10%]"
                      variants={{ hover: { y: -16, scale: 1.03 } }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <Image
                        src={cat.src}
                        alt={cat.label}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                  {/* Label below image */}
                  <div className="pt-2.5 px-1">
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-ground/75 font-sans">
                      {cat.label}
                    </span>
                  </div>
                </Link>
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
    </>
  );
}
