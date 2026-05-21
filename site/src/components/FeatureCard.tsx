"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-surface-container-lowest border-3 border-on-surface p-6 shadow-brutalist hover:shadow-brutalist-lg transition-shadow duration-300"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/5 transition-colors duration-300" />
      <div className="relative">
        <div className="w-12 h-12 bg-primary-container/20 border-2 border-primary-container flex items-center justify-center mb-4 group-hover:bg-primary-container/30 transition-colors">
          {icon}
        </div>
        <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{title}</h3>
        <p className="font-body text-body-md text-on-surface-variant leading-relaxed">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary-container group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}
