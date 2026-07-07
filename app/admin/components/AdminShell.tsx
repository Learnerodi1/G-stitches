"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Designs",
    href: "/admin/designs",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const sectionMeta: Record<string, string> = {
  products: "Products",
  orders: "Orders",
  appointments: "Appointments",
  messages: "Messages",
  designs: "Custom Designs",
  reviews: "Reviews",
  customers: "Customers",
};

function AdminNavLink({
  href,
  label,
  icon,
  isActive,
  onClick,
  large = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex items-center gap-3 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ground
        ${large
          ? "px-4 py-3.5 font-sans text-base font-medium tracking-wide"
          : "px-3 py-2.5 font-sans text-[11px] font-medium tracking-[0.2em] uppercase"}
        ${isActive ? "text-ivory" : "text-ivory/70 hover:text-ivory"}
      `}
    >
      <span className={`shrink-0 transition-colors duration-300 ${isActive ? "text-antique-gold" : "text-ivory/40"}`}>
        {icon}
      </span>
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-signal-red shrink-0" />
      )}
      {/* Animated underline */}
      <motion.span
        className="absolute left-3 right-3 bottom-1 h-[1px] bg-antique-gold/35"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: (hovered && !isActive) ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 25 }}
        style={{ originX: 0 }}
      />
    </Link>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  if (pathname === "/admin") return null;
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1];
  const third = parts[2];
  const fourth = parts[3];
  if (!section || !sectionMeta[section]) return null;

  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/admin" },
  ];
  if (third) {
    crumbs.push({ label: sectionMeta[section], href: `/admin/${section}` });
    if (third === "new") crumbs.push({ label: "Add New" });
    else if (fourth === "edit") crumbs.push({ label: "Edit" });
    else crumbs.push({ label: "Detail" });
  } else {
    crumbs.push({ label: sectionMeta[section] });
  }

  return (
    <nav className="flex items-center gap-2 mb-6 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-antique-gold/30 text-xs">/</span>}
          {c.href ? (
            <Link
              href={c.href}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/40 hover:text-antique-gold transition-colors duration-300 font-sans"
            >
              {c.label}
            </Link>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/75 font-sans">
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const reduce = useReducedMotion();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) { setChecking(false); return; }
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/admin/login"); return; }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", session.user.id).single();
      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }
      setUserEmail(session.user.email || "");
      setChecking(false);
    }
    checkAuth();
  }, [router, isLoginPage]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const slideTransition = reduce
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const };
  const fadeTransition = reduce
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const };

  if (!isLoginPage && checking) {
    return (
      <div className="min-h-screen bg-ground flex flex-col items-center justify-center gap-3">
        <p className="font-display text-xl font-bold tracking-[0.2em] text-ivory">G-STITCHES</p>
        <div className="h-px w-12 bg-antique-gold/40" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-ivory/40 font-sans mt-1">Loading…</p>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-ground text-ivory">

      {/* ── MOBILE BACKDROP ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ backgroundColor: "rgba(74, 10, 10, 0.85)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── DESKTOP SIDEBAR (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 w-64 border-r border-antique-gold/15"
        style={{ backgroundColor: "#4A0A0A" }}>
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          userEmail={userEmail}
          onNav={() => {}}
          onSignOut={signOut}
          large={false}
        />
      </aside>

      {/* ── MOBILE SIDEBAR (slide in from left) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="lg:hidden fixed inset-y-0 left-0 z-40 w-72 flex flex-col border-r border-antique-gold/15"
            style={{ backgroundColor: "#4A0A0A" }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={slideTransition}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            <SidebarContent
              navItems={navItems}
              pathname={pathname}
              userEmail={userEmail}
              onNav={() => setSidebarOpen(false)}
              onSignOut={signOut}
              onClose={() => setSidebarOpen(false)}
              large={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">

        {/* ── MOBILE TOP BAR ── */}
        <motion.div
          className="sticky top-0 z-20 lg:hidden border-b border-antique-gold/10"
          style={{
            backgroundColor: "rgba(74, 10, 10, 0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/80 hover:text-ivory transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-md"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/admin" className="font-display text-lg font-bold tracking-[0.2em] text-ivory hover:text-antique-gold transition-colors duration-300">
                G-STITCHES
              </Link>
            </div>

            {pathname !== "/admin" && (
              <Link
                href="/admin"
                className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/45 hover:text-antique-gold transition-colors duration-300 font-sans"
              >
                Dashboard
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── PAGE CONTENT ── */}
        <div className="flex-1 section-px py-8 lg:py-10">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs pathname={pathname} />
            {children}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 py-4 border-t border-antique-gold/10">
          <p className="text-[9px] tracking-[0.25em] uppercase font-sans text-antique-gold/40 text-center">
            G-Stitches Admin &middot; Restricted Access
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sidebar content ── */
function SidebarContent({
  navItems,
  pathname,
  userEmail,
  onNav,
  onSignOut,
  onClose,
  large,
}: {
  navItems: { label: string; href: string; icon: React.ReactNode }[];
  pathname: string;
  userEmail: string;
  onNav: () => void;
  onSignOut: () => void;
  onClose?: () => void;
  large: boolean;
}) {
  return (
    <>
      {/* Brand header */}
      <div className={`flex items-center justify-between border-b border-antique-gold/15 ${large ? "px-5 py-5" : "px-5 py-5"}`}>
        <Link href="/admin" onClick={onNav} className="group">
          <p className="text-[9px] font-semibold tracking-[0.35em] uppercase text-antique-gold font-sans">
            G-Stitches
          </p>
          <p className="font-display text-xl font-bold tracking-[0.2em] text-ivory group-hover:text-antique-gold transition-colors duration-300 mt-0.5">
            ADMIN
          </p>
        </Link>

        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold rounded-md"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className={`flex-1 overflow-y-auto py-3 px-2 ${large ? "space-y-0.5" : "space-y-0.5"}`}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <AdminNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              onClick={onNav}
              large={large}
            />
          );
        })}
      </nav>

      {/* View store link */}
      <div className="px-2 pb-1">
        <Link
          href="/"
          target="_blank"
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-medium tracking-[0.15em] uppercase font-sans text-ivory/30 hover:text-ivory/60 transition-colors duration-300"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Store
        </Link>
      </div>

      {/* User + sign out */}
      <div className="px-5 py-4 border-t border-antique-gold/15">
        <p className="text-[10px] font-sans text-ivory/30 truncate mb-3 tracking-wide">{userEmail}</p>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/40 hover:text-signal-red transition-colors duration-300 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red rounded-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </>
  );
}
