"use client";
import { motion, useReducedMotion } from "framer-motion";

interface AnimatedStarsProps {
  count?: number;
  rating?: number;
  className?: string;
}

export default function AnimatedStars({
  count = 5,
  rating = 5,
  className = "",
}: AnimatedStarsProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className={`flex gap-1 justify-center ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 20"
          className="w-4 h-4"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0, rotate: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : {
            delay: 0.1 * i,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1] as const,
          }}
        >
          <path
            d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.47l-4.94 2.64.94-5.5-4-3.9 5.61-.87z"
            fill={i < rating ? "#D4AF37" : "rgba(212,175,55,0.2)"}
          />
        </motion.svg>
      ))}
    </div>
  );
}
