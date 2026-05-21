"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

interface FeatureDetailProps {
  icon: ReactNode;
  title: string;
  description: string;
  details: string[];
  sideContent?: ReactNode;
  reversed?: boolean;
  index?: number;
}

export function FeatureDetail({
  icon,
  title,
  description,
  details,
  sideContent,
  reversed = false,
  index = 0,
}: FeatureDetailProps) {
  return (
    <div className="py-16 md:py-24 border-b-2 border-on-surface/20 last:border-b-0">
      <ScrollReveal direction="up" delay={0.05}>
        <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-start gap-8 md:gap-12`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-container/20 border-2 border-primary-container flex items-center justify-center">
                {icon}
              </div>
              <h3 className="font-headline text-headline-md uppercase tracking-tight">{title}</h3>
            </div>
            <p className="font-body text-body-lg text-on-surface-variant mb-6 leading-relaxed">{description}</p>
            <ul className="space-y-3">
              {details.map((detail, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-2 h-2 bg-primary-container mt-2" />
                  <span className="font-body text-body-md text-on-surface">{detail}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          {sideContent && (
            <div className="flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {sideContent}
              </motion.div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
