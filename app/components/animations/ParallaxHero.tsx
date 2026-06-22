"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

interface ParallaxHeroProps {
  imageSrc: string;
  imageAlt?: string;
  overlayClass?: string;
  height?: string;
  children: ReactNode;
}

export default function ParallaxHero({
  imageSrc,
  imageAlt = "",
  overlayClass = "bg-maroon-dark/60",
  height = "min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh]",
  children,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], shouldReduceMotion ? [1, 1] : [1, 0]);

  return (
    <section ref={ref} className={`relative ${height} overflow-hidden flex items-center justify-center`}>
      <motion.div className="absolute inset-0 -top-[10%] -bottom-[10%]" style={{ y }}>
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
      </motion.div>
      <div className={`absolute inset-0 ${overlayClass}`} />
      <motion.div className="relative z-10 w-full" style={{ opacity }}>
        {children}
      </motion.div>
    </section>
  );
}
