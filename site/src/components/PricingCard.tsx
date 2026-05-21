"use client";

import { motion } from "framer-motion";
import { BrutalistButton } from "./BrutalistButton";
import { Check, Sparkles } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  perks: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

export function PricingCard({
  title,
  price,
  description,
  perks,
  cta,
  href,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`relative bg-surface-container-lowest border-3 shadow-brutalist-lg p-8 md:p-10 ${
        highlighted ? "border-primary-container" : "border-on-surface"
      }`}
      style={{ borderWidth: 3, borderColor: highlighted ? "#f4bd31" : "#1a1c1c" }}
    >
      {badge && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-container border-2 border-on-surface shadow-brutalist-sm font-mono text-xs uppercase"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {badge}
        </motion.div>
      )}

      <div className="text-center mb-8 pt-2">
        <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{title}</h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="font-headline text-5xl md:text-6xl tracking-tighter">{price}</span>
        </div>
        <p className="font-body text-body-md text-on-surface-variant">{description}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {perks.map((perk, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-primary-container/20 border border-primary-container flex items-center justify-center mt-0.5">
              <Check className="w-3.5 h-3.5 text-on-surface" />
            </div>
            <span className="font-body text-body-md text-on-surface">{perk}</span>
          </motion.li>
        ))}
      </ul>

      <BrutalistButton
        variant={highlighted ? "primary" : "secondary"}
        size="md"
        href={href}
        className="w-full"
      >
        {cta}
      </BrutalistButton>
    </motion.div>
  );
}
