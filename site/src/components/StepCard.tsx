"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
  isLast?: boolean;
}

export function StepCard({ number, title, description, icon, delay = 0, isLast = false }: StepCardProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className="relative bg-surface-container-lowest border-3 border-on-surface p-4 md:p-8 shadow-brutalist"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
      >
        <div className="flex items-start gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-container border-3 border-on-surface flex items-center justify-center font-headline text-2xl md:text-3xl font-bold text-on-surface shadow-brutalist" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
              {number}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="text-primary-container flex-shrink-0">{icon}</div>
              <h3 className="font-headline text-headline-md uppercase tracking-tight break-words">{title}</h3>
            </div>
            <p className="font-body text-body-md md:text-body-lg text-on-surface-variant leading-relaxed">{description}</p>
          </div>
        </div>
      </motion.div>
      {!isLast && (
        <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
            className="w-16 h-0.5 bg-on-surface/30"
          />
        </div>
      )}
    </div>
  );
}
