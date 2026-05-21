"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  ours: string | boolean;
  theirs: string | boolean;
}

interface ComparisonTableProps {
  title: string;
  subtitle?: string;
  rows: ComparisonRow[];
  ourLabel: string;
  theirLabel: string;
}

export function ComparisonTable({
  title,
  subtitle,
  rows,
  ourLabel,
  theirLabel,
}: ComparisonTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <ScrollReveal direction="up">
        <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{title}</h3>
        {subtitle && (
          <p className="font-body text-body-md text-on-surface-variant mb-6">{subtitle}</p>
        )}
      </ScrollReveal>

      <div className="min-w-[600px]">
        <div className="grid grid-cols-3 gap-0 border-3 border-on-surface shadow-brutalist bg-surface-container-lowest" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
          <div className="p-4 bg-surface-container border-r-2 border-on-surface font-mono text-xs uppercase text-on-surface-variant" style={{ borderRightWidth: 2, borderColor: "#1a1c1c" }}>
            Feature
          </div>
          <div className="p-4 bg-primary-container border-r-2 border-on-surface font-headline text-sm uppercase tracking-tight text-on-surface text-center font-bold" style={{ borderRightWidth: 2, borderColor: "#1a1c1c" }}>
            {ourLabel}
          </div>
          <div className="p-4 bg-surface-container font-headline text-sm uppercase tracking-tight text-center">
            {theirLabel}
          </div>

          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`contents ${
                i < rows.length - 1 ? "border-b-2 border-on-surface/20" : ""
              }`}
            >
              <div className="p-4 border-r-2 border-on-surface/20 font-body text-body-md bg-surface-container-lowest" style={{ borderRightWidth: 2, borderColor: "#1a1c1c" }}>
                {row.feature}
              </div>
              <div className="p-4 border-r-2 border-on-surface/20 flex items-center justify-center bg-primary-container/5" style={{ borderRightWidth: 2, borderColor: "#1a1c1c" }}>
                {typeof row.ours === "boolean" ? (
                  row.ours ? (
                    <Check className="w-5 h-5 text-whatsapp" />
                  ) : (
                    <X className="w-5 h-5 text-error" />
                  )
                ) : (
                  <span className="font-body text-body-md text-center">{row.ours}</span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center bg-surface-container-lowest">
                {typeof row.theirs === "boolean" ? (
                  row.theirs ? (
                    <Check className="w-5 h-5 text-whatsapp" />
                  ) : (
                    <X className="w-5 h-5 text-error" />
                  )
                ) : (
                  <span className="font-body text-body-md text-center">{row.theirs}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
