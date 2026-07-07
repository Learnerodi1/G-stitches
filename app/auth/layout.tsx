import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account — G-Stitches",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide root-layout Navbar, reset main padding, hide Footer */}
      <style>{`
        div[class*="fixed"][class*="z-50"],
        div[class*="fixed"][class*="z-[100]"] { display: none !important; }
        nav { display: none !important; }
        main { padding-top: 0 !important; }
        main ~ * { display: none !important; }
      `}</style>

      <div className="min-h-screen bg-ground flex flex-col">
        {/* Minimal brand header */}
        <div className="px-6 py-5 flex items-center gap-4 max-w-7xl mx-auto w-full">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-[0.2em] text-ivory hover:text-antique-gold transition-colors duration-300"
          >
            G-STITCHES
          </Link>
          <div className="h-px flex-1 bg-antique-gold/15" />
          <p className="text-[10px] font-sans text-ivory/30 tracking-[0.25em] uppercase hidden sm:block">
            Secure Account
          </p>
        </div>

        {/* Page content */}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          {children}
        </div>

        <div className="py-5 text-center">
          <p className="text-[10px] font-sans text-ivory/25 tracking-[0.15em]">
            © {new Date().getFullYear()} G-Stitches. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
