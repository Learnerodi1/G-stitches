"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FadeUp from "../components/animations/FadeUp";
import ParallaxHero from "../components/animations/ParallaxHero";
import TextReveal from "../components/animations/TextReveal";
import { useCart } from "../context/CartContext";

const steps = ["Information", "Payment", "Confirmation"];

const inputClass =
  "w-full bg-ivory/[0.06] border border-antique-gold/25 rounded-lg px-4 py-3.5 text-ivory text-sm font-sans outline-none placeholder:text-ivory/55 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/40 transition-colors duration-300";

type PayMethod = "card" | "transfer" | "paypal";

export default function CheckoutPage() {
  const { items: cartItems, updateQty } = useCart();
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [promoCode, setPromoCode] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;
  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <>

      {/* ── HERO BANNER ── */}
      <ParallaxHero
        imageSrc="/clothing-rack.jpg"
        imageAlt="G-Stitches clothing rack"
        overlayClass="bg-ground/75"
        height="min-h-[60vh] sm:min-h-[56vh]"
      >
        <div className="flex flex-col items-center justify-center text-center px-5 sm:px-8">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-antique-gold mb-3 font-sans">
              G-Stitches &mdash; Secure Checkout
            </p>
          </FadeUp>

          <TextReveal
            text="CHECKOUT"
            as="h1"
            className="font-display font-black uppercase text-pure-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none"
          />

          <FadeUp delay={0.45}>
            <p className="text-ivory/70 text-sm font-sans mt-4">
              <Link href="/" className="hover:text-ivory transition-colors duration-300">Home</Link>
              <span className="mx-2 text-antique-gold/60">/</span>
              <Link href="/gallery" className="hover:text-ivory transition-colors duration-300">Gallery</Link>
              <span className="mx-2 text-antique-gold/60">/</span>
              <span className="text-ivory/90">Checkout</span>
            </p>
          </FadeUp>
        </div>
      </ParallaxHero>

      {/* ── PROGRESS STEPPER ── */}
      <div className="bg-ground border-b border-antique-gold/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-3 sm:py-5">
          <div className="flex items-center justify-center">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                {/* Step node */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold font-sans transition-colors shrink-0 ${
                      i === 0
                        ? "bg-signal-red text-pure-white shadow-[0_0_16px_rgba(232,38,62,0.4)]"
                        : "border border-antique-gold/40 text-antique-gold/60"
                    }`}
                  >
                    {i === 0 ? (
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`hidden sm:block text-[10px] font-semibold tracking-[0.15em] uppercase font-sans ${
                    i === 0 ? "text-ivory" : "text-ivory/40"
                  }`}>
                    {step}
                  </span>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="h-px w-8 sm:w-16 md:w-24 mx-2 sm:mx-3 mb-0 sm:mb-5 bg-antique-gold/20 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE: COLLAPSIBLE ORDER SUMMARY STRIP ── */}
      <div className="lg:hidden bg-ivory/[0.04] border-b border-antique-gold/20">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 sm:px-8 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-antique-gold font-sans">
              {summaryOpen ? "Hide" : "Show"} Order Summary ({cartItems.reduce((s, i) => s + i.qty, 0)} items)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-signal-red font-bold text-sm font-sans">{fmt(total)}</span>
            <motion.svg
              animate={{ rotate: summaryOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-4 h-4 text-ivory/60"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </button>

        {/* Collapsed summary content */}
        <motion.div
          animate={{ height: summaryOpen ? "auto" : 0, opacity: summaryOpen ? 1 : 0 }}
          initial={false}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="px-5 sm:px-8 pb-4 divide-y divide-antique-gold/15">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden">
                  <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ivory text-xs font-semibold font-sans leading-tight truncate">{item.name}</p>
                  <p className="text-ivory/55 text-[10px] font-sans mt-0.5">Size: {item.size} · Qty: {item.qty}</p>
                </div>
                <p className="text-signal-red font-bold text-xs font-sans shrink-0">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
            <div className="pt-3 flex justify-between text-sm font-sans">
              <span className="text-ivory/70">Total</span>
              <span className="text-signal-red font-black">{fmt(total)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="bg-ground">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-6 pb-12 sm:py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 sm:gap-10 xl:gap-14 items-start">

          {/* ════════════════════════════════════════ */}
          {/*  LEFT — FORMS                            */}
          {/* ════════════════════════════════════════ */}
          <FadeUp className="order-2 lg:order-1">
            <div className="space-y-8 sm:space-y-10">

              {/* ── Contact Information ── */}
              <section>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold mb-1 font-sans">
                  Step 1
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-ivory tracking-tight mb-5 sm:mb-6">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                      First Name
                    </label>
                    <input type="text" placeholder="First name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                      Last Name
                    </label>
                    <input type="text" placeholder="Last name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                      Email Address
                    </label>
                    <input type="email" placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                      Phone Number
                    </label>
                    <input type="tel" placeholder="+234 000 0000 000" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-antique-gold/20" />

              {/* ── Shipping Address ── */}
              <section>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold mb-1 font-sans">
                  Delivery
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-ivory tracking-tight mb-5 sm:mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                      Street Address
                    </label>
                    <input type="text" placeholder="123 Bespoke Lane" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                        City
                      </label>
                      <input type="text" placeholder="Lagos" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                        State
                      </label>
                      <input type="text" placeholder="Lagos State" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                      Postal Code
                    </label>
                    <input type="text" placeholder="100001" className="w-full sm:w-1/2 bg-ivory/[0.06] border border-antique-gold/25 rounded-lg px-4 py-3.5 text-ivory text-sm font-sans outline-none placeholder:text-ivory/55 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/40 transition-colors duration-300" />
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-antique-gold/20" />

              {/* ── Payment Method ── */}
              <section>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold mb-1 font-sans">
                  Step 2
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-ivory tracking-tight mb-5 sm:mb-6">
                  Payment Method
                </h2>

                {/* Method tabs */}
                <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {(["card", "transfer", "paypal"] as PayMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPayMethod(method)}
                      className={`flex-1 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] font-sans border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold min-h-[44px] ${
                        payMethod === method
                          ? "bg-signal-red border-signal-red text-pure-white"
                          : "border-antique-gold/30 text-ivory/70 hover:border-antique-gold/60 hover:text-ivory"
                      }`}
                    >
                      {method === "card" ? "Card" : method === "transfer" ? "Transfer" : "PayPal"}
                    </button>
                  ))}
                </div>

                {/* ── Card form ── */}
                {payMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    {/* Card preview */}
                    <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-ground via-antique-gold/20 to-signal-red/30 border border-antique-gold/25 mb-5 sm:mb-6 p-5 sm:p-6 flex flex-col justify-between select-none">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-signal-red/10 -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-antique-gold/10 translate-y-1/2 -translate-x-1/2" />

                      <div className="relative flex justify-between items-start">
                        <span className="font-display font-bold text-ivory/80 tracking-[0.2em] text-sm uppercase">G-Stitches</span>
                        <div className="flex">
                          <div className="w-7 h-5 sm:w-8 sm:h-5 rounded-sm bg-antique-gold/60" />
                          <div className="w-7 h-5 sm:w-8 sm:h-5 rounded-sm bg-signal-red/70 -ml-3" />
                        </div>
                      </div>

                      <div className="relative">
                        <p className="text-ivory/40 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-sans mb-1">Card Number</p>
                        <p className="text-ivory/75 font-sans tracking-[0.15em] sm:tracking-[0.25em] text-xs sm:text-sm">•••• •••• •••• ••••</p>
                      </div>

                      <div className="relative flex justify-between items-end">
                        <div>
                          <p className="text-ivory/40 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-sans">Cardholder</p>
                          <p className="text-ivory/75 text-xs sm:text-sm font-sans">Your Name</p>
                        </div>
                        <div className="text-right">
                          <p className="text-ivory/40 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-sans">Expires</p>
                          <p className="text-ivory/75 text-xs sm:text-sm font-sans">MM / YY</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                        Cardholder Name
                      </label>
                      <input type="text" placeholder="Full name on card" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                        Card Number
                      </label>
                      <input type="text" placeholder="XXXX  XXXX  XXXX  XXXX" maxLength={19} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                          Expiry Date
                        </label>
                        <input type="text" placeholder="MM / YY" maxLength={5} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                          CVV
                        </label>
                        <input type="text" placeholder="•••" maxLength={3} className={inputClass} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Bank Transfer ── */}
                {payMethod === "transfer" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-ivory/[0.05] border border-antique-gold/25 rounded-xl p-5 sm:p-6 space-y-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-antique-gold font-sans">Bank Details</p>
                    {[
                      { label: "Bank Name", value: "First Bank Nigeria" },
                      { label: "Account Name", value: "G-Stitches Fashion Ltd" },
                      { label: "Account Number", value: "0123456789" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-antique-gold/15 last:border-0 gap-4">
                        <span className="text-ivory/65 text-sm font-sans shrink-0">{row.label}</span>
                        <span className="text-ivory font-semibold text-sm font-sans text-right">{row.value}</span>
                      </div>
                    ))}
                    <p className="text-ivory/55 text-xs font-sans pt-1 leading-relaxed">
                      Transfer the exact total amount and upload your receipt below.
                    </p>
                    <input type="file" accept="image/*" className="w-full text-xs text-ivory/60 font-sans file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:bg-signal-red/20 file:text-signal-red hover:file:bg-signal-red hover:file:text-pure-white file:transition-colors cursor-pointer" />
                  </motion.div>
                )}

                {/* ── PayPal ── */}
                {payMethod === "paypal" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-ivory/[0.05] border border-antique-gold/25 rounded-xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#003087]/20 border border-[#003087]/30 flex items-center justify-center">
                      <span className="font-bold text-[#009CDE] text-lg sm:text-xl">P</span>
                    </div>
                    <div>
                      <p className="text-ivory font-semibold font-sans mb-1">Pay with PayPal</p>
                      <p className="text-ivory/65 text-sm font-sans leading-relaxed max-w-xs">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                    <button type="button" className="btn-lift bg-[#009CDE] text-white px-6 sm:px-8 py-3 rounded-full text-sm font-semibold font-sans uppercase tracking-[0.1em] hover:bg-[#0085C0] transition-colors">
                      Continue with PayPal
                    </button>
                  </motion.div>
                )}
              </section>

              {/* ── Mobile Place Order CTA (bottom of form) ── */}
              <div className="lg:hidden">
                <div className="h-px bg-antique-gold/20 mb-5" />

                {/* Order total row */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div>
                    <p className="text-ivory/60 text-xs font-sans uppercase tracking-[0.15em]">Order Total</p>
                    <p className="text-signal-red font-black text-2xl font-display tabular-nums mt-0.5">{fmt(total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-ivory/60 text-xs font-sans">
                      {shipping === 0 ? (
                        <span className="text-antique-gold">Free shipping</span>
                      ) : (
                        <>Shipping: {fmt(shipping)}</>
                      )}
                    </p>
                    <p className="text-ivory/50 text-[10px] font-sans mt-0.5">{cartItems.reduce((s, i) => s + i.qty, 0)} items</p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  className="btn-lift w-full bg-signal-red text-pure-white rounded-full py-4 text-sm font-semibold uppercase tracking-[0.2em] font-sans hover:bg-signal-red/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground flex items-center justify-center gap-3 min-h-[52px]"
                  whileTap={{ scale: 0.98 }}
                >
                  Place Order
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-ivory/55 text-xs font-sans mt-3">
                  <svg className="w-3.5 h-3.5 text-antique-gold/70 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  SSL encrypted — your data is safe
                </div>
              </div>

            </div>
          </FadeUp>

          {/* ════════════════════════════════════════ */}
          {/*  RIGHT — ORDER SUMMARY (desktop only)   */}
          {/* ════════════════════════════════════════ */}
          <FadeUp delay={0.12} className="hidden lg:block order-1 lg:order-2">
            <div className="lg:sticky lg:top-28 space-y-5">

              {/* Summary card */}
              <div className="bg-ivory/[0.05] border border-antique-gold/25 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-antique-gold/20">
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold font-sans mb-0.5">
                    Your Selection
                  </p>
                  <h3 className="font-display text-xl font-black uppercase text-ivory tracking-tight">
                    Order Summary
                  </h3>
                </div>

                {/* Items */}
                <div className="divide-y divide-antique-gold/15">
                  {cartItems.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <p className="text-ivory/50 text-sm font-sans">Your cart is empty.</p>
                      <Link href="/gallery" className="text-antique-gold text-sm font-sans hover:text-ivory transition-colors mt-2 inline-block">
                        Shop Now →
                      </Link>
                    </div>
                  ) : cartItems.map((item) => (
                    <div key={item.id} className="px-5 xl:px-6 py-4 flex gap-4 items-center">
                      {/* Thumbnail */}
                      <div className="relative w-14 xl:w-16 h-18 xl:h-20 shrink-0 rounded-lg overflow-hidden bg-ground">
                        <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="64px" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-antique-gold font-sans">
                          {item.category}
                        </p>
                        <p className="text-ivory text-sm font-semibold font-sans leading-tight mt-0.5 truncate">
                          {item.name}
                        </p>
                        <p className="text-ivory/60 text-xs font-sans mt-0.5">Size: {item.size}</p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 rounded-full border border-antique-gold/30 text-ivory/70 hover:border-signal-red hover:text-signal-red transition-colors flex items-center justify-center text-base leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-antique-gold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-ivory text-sm font-semibold font-sans w-5 text-center tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 rounded-full border border-antique-gold/30 text-ivory/70 hover:border-signal-red hover:text-signal-red transition-colors flex items-center justify-center text-base leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-antique-gold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-signal-red font-bold text-sm font-sans tabular-nums">
                          {fmt(item.price * item.qty)}
                        </p>
                        {item.qty > 1 && (
                          <p className="text-ivory/45 text-[10px] font-sans mt-0.5 tabular-nums">
                            {fmt(item.price)} ea
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="px-5 xl:px-6 py-4 border-t border-antique-gold/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 min-w-0 bg-ivory/[0.06] border border-antique-gold/25 rounded-lg px-3 py-2.5 text-ivory text-xs font-sans outline-none placeholder:text-ivory/45 focus:border-antique-gold transition-colors"
                    />
                    <button
                      type="button"
                      className="px-3 xl:px-4 py-2.5 bg-antique-gold/15 border border-antique-gold/35 text-antique-gold text-xs font-semibold uppercase tracking-[0.1em] rounded-lg hover:bg-antique-gold/25 transition-colors font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="px-5 xl:px-6 py-5 border-t border-antique-gold/20 space-y-3">
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-ivory/70">Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="text-ivory font-semibold tabular-nums">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-ivory/70">Shipping</span>
                    <span className={`font-semibold tabular-nums ${shipping === 0 ? "text-antique-gold" : "text-ivory"}`}>
                      {shipping === 0 ? "Free" : fmt(shipping)}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-antique-gold/70 text-[10px] font-sans flex items-center gap-1">
                      <span>✓</span>
                      <span>Free delivery on orders over ₦50,000</span>
                    </p>
                  )}
                  <div className="h-px bg-antique-gold/25" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-ivory font-bold text-base font-sans">Total</span>
                    <span className="text-signal-red font-black text-xl font-display tabular-nums">{fmt(total)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order CTA */}
              <motion.button
                type="button"
                className="btn-lift w-full bg-signal-red text-pure-white rounded-full py-4 text-sm font-semibold uppercase tracking-[0.2em] font-sans hover:bg-signal-red/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground flex items-center justify-center gap-3 min-h-[52px]"
                whileTap={{ scale: 0.98 }}
              >
                Place Order
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-2 text-ivory/55 text-xs font-sans">
                <svg className="w-3.5 h-3.5 text-antique-gold/70 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Secured checkout — SSL encrypted
              </div>

              {/* Continue shopping */}
              <div className="text-center">
                <Link
                  href="/gallery"
                  className="text-ivory/60 hover:text-ivory text-xs font-sans uppercase tracking-[0.15em] transition-colors underline underline-offset-4 decoration-antique-gold/30 hover:decoration-ivory/60"
                >
                  ← Continue Shopping
                </Link>
              </div>

            </div>
          </FadeUp>

        </div>
      </div>
      </div>
    </>
  );
}
