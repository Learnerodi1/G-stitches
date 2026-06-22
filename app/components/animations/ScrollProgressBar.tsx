"use client";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, shouldReduceMotion ? { stiffness: 1000, damping: 100, mass: 0.1 } : { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-signal-red origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}
