"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverRevealCardProps {
  front: ReactNode;
  back: ReactNode;
  title?: string;
}

export function HoverRevealCard({ front, back, title }: HoverRevealCardProps) {
  return (
    <div className="my-8">
      {title && (
        <h4 className="font-mono text-xs uppercase text-on-surface-variant mb-3">{title}</h4>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative border-3 border-on-surface shadow-brutalist bg-surface-container-lowest overflow-hidden cursor-default"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
      >
        <div className="p-6 transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
          {front}
        </div>
        <div className="absolute inset-0 p-6 bg-primary-container/10 opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 flex items-center">
          {back}
        </div>
      </motion.div>
    </div>
  );
}
