"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
}

export function Marquee({ items, speed = 30, className = "" }: MarqueeProps) {
  const duplicated = [...items, ...items];

  return (
    <div className={`overflow-hidden border-y-2 border-on-surface/20 py-4 ${className}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="font-headline text-2xl md:text-3xl uppercase tracking-tighter text-on-surface/20 flex items-center gap-8"
          >
            {item}
            <span className="w-3 h-3 bg-primary-container/30" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
