"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import FadeUp from "./animations/FadeUp";

const pagesLinks = [
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "New Arrivals", href: "/gallery" },
  { label: "Shop", href: "/gallery" },
  { label: "All Collections", href: "/gallery" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Cart", href: "/gallery" },
  { label: "Policies", href: "/about" },
  { label: "FAQ", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Tiktok", href: "#" },
];

const linkClass =
  "text-[13px] text-ivory/70 hover:text-ivory transition-colors duration-300 font-sans focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-antique-gold rounded-sm";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <motion.div
        className="divider-draw w-full max-w-4xl mx-auto"
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }
        }
      />

      <footer className="bg-ground text-ivory mt-auto overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-12 sm:pt-14 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6 lg:gap-10">
            {/* Column 1: Logo */}
            <FadeUp delay={0}>
              <div className="col-span-2 sm:col-span-1">
                <Link
                  href="/"
                  className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-sm"
                >
                  <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.15em] text-ivory uppercase">
                    G-STITCHES
                  </span>
                </Link>
                <p className="text-[10px] text-ivory/60 mt-2 font-sans">
                  2025 G-STITCHES all right reserved
                </p>
              </div>
            </FadeUp>

            {/* Column 2: Contact */}
            <FadeUp delay={0.06}>
              <div>
                <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-antique-gold mb-4 sm:mb-5 font-sans">
                  Contact
                </h4>
                <ul className="space-y-2.5">
                  <li className="text-[13px] text-ivory/70 font-sans">
                    +234 8012345678
                  </li>
                  <li className="text-[13px] text-ivory/70 font-sans">
                    info@gstitches.com
                  </li>
                  <li className="text-[13px] text-ivory/70 font-sans">
                    Lagos, Nigeria
                  </li>
                </ul>
              </div>
            </FadeUp>

            {/* Column 3: Pages */}
            <FadeUp delay={0.12}>
              <div>
                <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-antique-gold mb-4 sm:mb-5 font-sans">
                  Pages
                </h4>
                <ul className="space-y-2.5">
                  {pagesLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Column 4: Help & Support */}
            <FadeUp delay={0.18}>
              <div>
                <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-antique-gold mb-4 sm:mb-5 font-sans">
                  Help & Support
                </h4>
                <ul className="space-y-2.5">
                  {supportLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Column 5: Follow Us */}
            <FadeUp delay={0.24}>
              <div>
                <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-antique-gold mb-4 sm:mb-5 font-sans">
                  Follow Us
                </h4>
                <ul className="space-y-2.5">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Newsletter bar */}
        <div className="border-t border-ivory/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <p className="text-[11px] text-ivory/70 tracking-wide font-sans whitespace-nowrap">
                Subscribe for our newsletter
              </p>
              <div className="flex w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Your email"
                  aria-label="Email for newsletter"
                  className="flex-1 sm:w-56 min-w-0 bg-transparent border border-ivory/35 border-r-0 focus:border-antique-gold px-3 py-2.5 text-[13px] text-ivory outline-none focus-visible:ring-2 focus-visible:ring-antique-gold transition-colors duration-300 rounded-l-sm placeholder:text-ivory/55 font-sans"
                />
                <button className="bg-signal-red hover:bg-signal-red/90 text-pure-white px-4 py-2.5 text-xs font-semibold tracking-wide rounded-r-sm transition-colors duration-300 shrink-0 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red min-h-[44px]">
                  &rarr;
                </button>
              </div>
            </div>

            <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.15em] text-ivory/10 uppercase select-none">
              G-STITCHES
            </span>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-ivory/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] sm:text-[11px] text-ivory/60 tracking-wide font-sans">
              &copy; 2026 G-Stitches. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/privacy"
                className="text-[10px] sm:text-[11px] text-ivory/60 hover:text-ivory/85 transition-colors duration-300 font-sans focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ivory/50 rounded-sm"
              >
                Privacy Policy
              </Link>
              <span className="w-px h-2.5 bg-ivory/25" />
              <Link
                href="/terms"
                className="text-[10px] sm:text-[11px] text-ivory/60 hover:text-ivory/85 transition-colors duration-300 font-sans focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ivory/50 rounded-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
