"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  ours: string | boolean;
  theirs: string | boolean;
}

interface InteractiveComparisonProps {
  rows: ComparisonRow[];
  ourLabel: string;
  theirLabel: string;
}

export function InteractiveComparison({
  rows,
  ourLabel,
  theirLabel,
}: InteractiveComparisonProps) {
  const safeRows = rows || [];

  return (
    <div className="my-8 border-3 border-on-surface shadow-brutalist overflow-hidden bg-surface-container-lowest" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      <div className="grid grid-cols-3 border-b-3 border-on-surface" style={{ borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="p-4 font-mono text-xs uppercase text-on-surface-variant bg-surface-container">Feature</div>
        <div className="p-4 font-headline text-sm uppercase tracking-tight text-center bg-primary-container/10 border-x-2 border-on-surface" style={{ borderLeftWidth: 2, borderRightWidth: 2, borderColor: "#1a1c1c" }}>
          {ourLabel}
        </div>
        <div className="p-4 font-headline text-sm uppercase tracking-tight text-center bg-surface-container">
          {theirLabel}
        </div>
      </div>

      {safeRows.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="grid grid-cols-3 hover:bg-primary-container/5 transition-colors"
        >
          <div className="p-4 border-b border-on-surface/10 font-body text-body-md">{row.feature}</div>
          <div className="p-4 border-x border-on-surface/10 flex items-center justify-center" style={{ borderLeftWidth: 1, borderRightWidth: 1 }}>
            {typeof row.ours === "boolean" ? (
              row.ours ? <Check className="w-5 h-5 text-whatsapp" /> : <X className="w-5 h-5 text-error" />
            ) : (
              <span className="font-body text-body-md text-center">{row.ours}</span>
            )}
          </div>
          <div className="p-4 border-b border-on-surface/10 flex items-center justify-center">
            {typeof row.theirs === "boolean" ? (
              row.theirs ? <Check className="w-5 h-5 text-whatsapp" /> : <X className="w-5 h-5 text-error" />
            ) : (
              <span className="font-body text-body-md text-center">{row.theirs}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
