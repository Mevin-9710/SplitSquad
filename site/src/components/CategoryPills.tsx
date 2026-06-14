"use client";

import { motion } from "framer-motion";

interface CategoryPillsProps {
  active: string;
  onSelect: (category: string) => void;
  categories: string[];
}

export function CategoryPills({ active, onSelect, categories }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat, i) => (
        <motion.button
          key={cat}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
            active === cat
              ? "bg-primary-container border-2 border-on-surface text-on-surface shadow-brutalist-sm"
              : "bg-surface-container-lowest border-2 border-on-surface/40 text-on-surface-variant hover:border-on-surface hover:shadow-brutalist-sm"
          }`}
          style={{ borderWidth: 2 }}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}
