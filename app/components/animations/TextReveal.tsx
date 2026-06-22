"use client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({ text, className = "", delay = 0, stagger = 0.04, as: Tag = "h1" }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={`${className} overflow-hidden`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={shouldReduceMotion ? false : { y: "110%" }}
            animate={isInView ? { y: 0 } : shouldReduceMotion ? {} : { y: "110%" }}
            transition={shouldReduceMotion ? { duration: 0 } : {
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
