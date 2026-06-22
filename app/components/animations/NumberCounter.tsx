"use client";
import { useInView, useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface NumberCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export default function NumberCounter({
  target,
  suffix = "",
  prefix = "",
  label,
  duration = 2,
  className = "",
}: NumberCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, shouldReduceMotion ? { duration: 0, bounce: 0 } : { duration: duration * 1000, bounce: 0 });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix]);

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      <span ref={displayRef} className="text-4xl md:text-5xl font-bold text-maroon-dark">
        {prefix}0{suffix}
      </span>
      <p className="text-sm text-gray-500 mt-2 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}
