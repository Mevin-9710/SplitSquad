"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  label,
  decimals = 0,
  duration = 2,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, from, to, duration]);

  return (
    <div ref={ref} className="text-center p-6 border-3 border-on-surface bg-surface-container-lowest shadow-brutalist" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      <div className="font-headline text-4xl md:text-5xl tracking-tighter uppercase text-primary-container mb-2">
        {prefix}{count.toFixed(decimals)}{suffix}
      </div>
      <div className="font-mono text-xs uppercase text-on-surface-variant">{label}</div>
    </div>
  );
}
