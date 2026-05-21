"use client";

import { motion } from "framer-motion";

export function BetaBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary-container/20 border-2 border-primary-container font-mono text-xs uppercase tracking-wider ${className}`}
    >
      <motion.span
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 bg-primary-container"
      />
      Currently in Beta
    </motion.div>
  );
}
