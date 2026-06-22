"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface CardData {
  id: string;
  content: ReactNode;
  bg?: string;
}

interface StackingCardsProps {
  cards: CardData[];
  className?: string;
}

function StackCard({ card, index, total, scrollYProgress }: {
  card: CardData;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const shouldReduceMotion = useReducedMotion();
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(scrollYProgress, [start, end], shouldReduceMotion ? [1, 1] : [1, 0.92]);
  const y = useTransform(scrollYProgress, [start, end], shouldReduceMotion ? [0, 0] : [0, -30]);

  return (
    <motion.div
      className="sticky top-24 mb-8"
      style={{ scale, y, zIndex: total - index }}
    >
      <div className={`rounded-2xl p-8 md:p-12 shadow-lg ${card.bg || "bg-white"}`}>
        {card.content}
      </div>
    </motion.div>
  );
}

export default function StackingCards({ cards, className = "" }: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ minHeight: `${(cards.length + 1) * 60}vh` }}>
      {cards.map((card, i) => (
        <StackCard key={card.id} card={card} index={i} total={cards.length} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}
