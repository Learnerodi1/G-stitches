"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface StickySectionProps {
  panels: { id: string; content: ReactNode }[];
  stickyContent: ReactNode;
  stickyPosition?: "left" | "right";
  className?: string;
}

export default function StickySection({
  panels,
  stickyContent,
  stickyPosition = "left",
  className = "",
}: StickySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], shouldReduceMotion ? [1, 1, 1, 1] : [0, 1, 1, 0]);

  const stickyEl = (
    <div className="md:sticky md:top-24 md:self-start">
      <motion.div style={{ opacity: bgOpacity }}>
        {stickyContent}
      </motion.div>
    </div>
  );

  const scrollEl = (
    <div className="space-y-[40vh] py-[20vh]">
      {panels.map((panel, i) => (
        <PanelItem key={panel.id}>
          {panel.content}
        </PanelItem>
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {stickyPosition === "left" ? (
          <>{stickyEl}{scrollEl}</>
        ) : (
          <>{scrollEl}{stickyEl}</>
        )}
      </div>
    </div>
  );
}

function PanelItem({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [60, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="min-h-[40vh] flex items-center">
      <div>{children}</div>
    </motion.div>
  );
}
