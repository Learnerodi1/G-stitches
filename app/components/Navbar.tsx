"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      className={`relative text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 pb-1 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ground rounded-sm ${
        isActive ? "text-ivory" : "text-ivory/60 hover:text-ivory"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      <motion.span
        className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-antique-gold"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered || isActive ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 25 }}
        style={{ originX: 0 }}
      />
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 50));

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const instant = shouldReduceMotion ? { duration: 0 } : undefined;
  const smoothEase = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const };
  const slideIn = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <motion.div
        className="fixed top-0 w-full z-50 bg-ground text-ivory overflow-hidden"
        animate={{ height: scrolled ? 0 : 32 }}
        transition={instant || { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <div className="h-8 flex items-center justify-center text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-sans px-4">
          <span className="text-ivory/70 truncate">Free Shipping Over &#x20A6;50,000</span>
          <span className="mx-2 sm:mx-4 text-antique-gold/40 shrink-0">|</span>
          <span className="text-ivory/70 hidden sm:inline">New Arrivals Weekly</span>
          <span className="mx-4 text-antique-gold/40 hidden sm:inline">|</span>
          <Link
            href="/book-fitting"
            className="text-antique-gold hover:text-ivory transition-colors duration-300 hidden sm:inline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-antique-gold rounded-sm"
          >
            Book Your Fitting &rarr;
          </Link>
        </div>
      </motion.div>

      {/* ── MAIN NAV ── */}
      <motion.nav
        className="fixed w-full z-50"
        animate={{
          top: scrolled ? 0 : 32,
          backgroundColor: scrolled ? "rgba(26, 14, 14, 0.95)" : "rgba(26, 14, 14, 0.6)",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.3)" : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={smoothEase}
        style={{ backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(212, 175, 55, 0.1)" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <motion.div
          className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12"
          animate={{
            paddingTop: scrolled ? "0.5rem" : "0.75rem",
            paddingBottom: scrolled ? "0.5rem" : "0.75rem",
          }}
          transition={smoothEase}
        >
          {/* LEFT: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/70 hover:text-ivory transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ground rounded-md"
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link
              href="/"
              className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-ivory hover:text-antique-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ground rounded-sm"
            >
              G-STITCHES
            </Link>
          </div>

          {/* CENTER: Desktop nav links + Book Fitting */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map((l) => (
              <NavLink
                key={l.label}
                href={l.href}
                label={l.label}
                isActive={pathname === l.href}
              />
            ))}
            <Link
              href="/book-fitting"
              className="bg-signal-red text-pure-white px-5 xl:px-6 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] font-sans hover:bg-signal-red/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
            >
              Book Fitting
            </Link>
          </div>

          {/* RIGHT: Utility icons */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ground rounded-md"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
            >
              <svg className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* SEARCH OVERLAY */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="bg-ground/98"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={instant || { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
              style={{ backdropFilter: "blur(16px)", borderTop: "1px solid rgba(212, 175, 55, 0.15)" }}
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-antique-gold/50 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search collections..."
                  className="flex-1 bg-transparent text-ivory text-sm font-sans outline-none placeholder:text-ivory/30 caret-antique-gold focus:placeholder:text-ivory/50 min-h-[44px]"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/50 hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-md"
                  aria-label="Close search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.nav>

      {/* MOBILE MENU — full-screen overlay (outside nav to escape stacking context) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[200]"
            style={{ backgroundColor: '#1A0E0E' }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={slideIn}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Mobile header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-antique-gold/15">
                <span className="font-display text-lg sm:text-xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-ivory">
                  G-STITCHES
                </span>
                <button
                  onClick={closeMenu}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/70 hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-md"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center px-6 sm:px-8 gap-1" aria-label="Mobile navigation">
                {links.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, x: 40 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.06 * i, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
                  >
                    <Link
                      href={l.href}
                      className={`block font-sans text-xl sm:text-2xl font-medium py-3 sm:py-3.5 tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-sm ${
                        pathname === l.href ? "text-ivory" : "text-ivory/50 hover:text-ivory"
                      }`}
                      onClick={closeMenu}
                    >
                      {l.label}
                      {pathname === l.href && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal-red ml-2 align-middle" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA + icons */}
              <motion.div
                className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5 sm:space-y-6"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.25, duration: 0.35 }}
              >
                <Link
                  href="/book-fitting"
                  className="block text-center bg-signal-red text-pure-white px-6 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-signal-red/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground min-h-[48px] flex items-center justify-center"
                  onClick={closeMenu}
                >
                  Book Fitting
                </Link>
                <div className="flex justify-center gap-5 sm:gap-6">
                  {[
                    { href: "/account", label: "Account", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
                    { href: "/wishlist", label: "Wishlist", d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
                    { href: "/cart", label: "Cart", d: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" },
                  ].map((icon) => (
                    <Link
                      key={icon.label}
                      href={icon.href}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/40 hover:text-antique-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-md"
                      onClick={closeMenu}
                      aria-label={icon.label}
                    >
                      <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon.d} />
                      </svg>
                    </Link>
                  ))}
                </div>
                <p className="text-center text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-sans text-antique-gold/40">
                  Bespoke Fashion &middot; Lagos
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
