"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface BlogFAQProps {
  items: FAQItem[];
  title?: string;
}

export function BlogFAQ({ items, title }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const safeItems = items || [];

  return (
    <div className="my-8">
      {title && (
        <h3 className="font-headline text-2xl uppercase tracking-tight mb-6">{title}</h3>
      )}
      <div className="space-y-3">
        {safeItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`border-2 border-on-surface bg-surface-container-lowest transition-shadow ${
              openIndex === i ? "shadow-brutalist-sm" : ""
            }`}
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-headline text-sm uppercase tracking-tight flex-1 pr-4">{item.q}</span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-on-surface-variant" />
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
                    <p className="font-body text-body-md text-on-surface-variant">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
