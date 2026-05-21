"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQ({ items, title, subtitle }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      {title && (
        <ScrollReveal direction="up">
          <h3 className="font-headline text-headline-md uppercase tracking-tight text-center mb-2">{title}</h3>
        </ScrollReveal>
      )}
      {subtitle && (
        <ScrollReveal direction="up" delay={0.1}>
          <p className="font-body text-body-lg text-on-surface-variant text-center mb-8">{subtitle}</p>
        </ScrollReveal>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <ScrollReveal key={i} direction="up" delay={i * 0.05}>
            <div
              className={`border-2 border-on-surface bg-surface-container-lowest transition-all ${
                openIndex === i ? "shadow-brutalist-sm" : ""
              }`}
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-body text-body-md text-on-surface font-semibold">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t-2 border-on-surface/10 pt-3">
                      <p className="font-body text-body-md text-on-surface-variant">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
