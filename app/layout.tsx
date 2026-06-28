import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/animations/ScrollProgressBar";
import Providers from "./components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "G-Stitches | Wear Your Confidence",
  description: "Trendy pieces. Timeless styles. G-Stitches has everything you need to rock and feel your best.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between font-sans">
        <Providers>
          <ScrollProgressBar />
          <Navbar />
          <main className="flex-1 pt-[72px] sm:pt-[80px] md:pt-[88px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
