"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  once?: boolean;
}

const variants = {
  up: (d: number) => ({ hidden: { y: d, opacity: 0 }, visible: { y: 0, opacity: 1 } }),
  down: (d: number) => ({ hidden: { y: -d, opacity: 0 }, visible: { y: 0, opacity: 1 } }),
  left: (d: number) => ({ hidden: { x: d, opacity: 0 }, visible: { x: 0, opacity: 1 } }),
  right: (d: number) => ({ hidden: { x: -d, opacity: 0 }, visible: { x: 0, opacity: 1 } }),
  none: () => ({ hidden: { opacity: 0 }, visible: { opacity: 1 } }),
};

const easeOut: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 40,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });
  const v = variants[direction](distance);

  return (
    <motion.div
      ref={ref}
      variants={v}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: easeOut }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
