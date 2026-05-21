"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, Info, Star } from "lucide-react";

interface HighlightBoxProps {
  children: ReactNode;
  variant?: "tip" | "warning" | "info" | "feature";
  title?: string;
}

const icons = {
  tip: Lightbulb,
  warning: AlertTriangle,
  info: Info,
  feature: Star,
};

const styles = {
  tip: "bg-whatsappLight/10 border-whatsapp",
  warning: "bg-error-container/10 border-error",
  info: "bg-primary-container/10 border-primary-container",
  feature: "bg-surface-container border-on-surface",
};

export function HighlightBox({ children, variant = "info", title }: HighlightBoxProps) {
  const Icon = icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`my-8 p-6 border-3 shadow-brutalist ${styles[variant]}`}
      style={{ borderWidth: 3, borderColor: variant === "tip" ? "#25D366" : variant === "warning" ? "#ba1a1a" : variant === "info" ? "#f4bd31" : "#1a1c1c" }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 border-2 border-on-surface flex items-center justify-center bg-surface-container-lowest" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <Icon className="w-5 h-5 text-on-surface" />
        </div>
        <div>
          {title && (
            <h5 className="font-headline text-sm uppercase tracking-tight mb-2 text-on-surface">{title}</h5>
          )}
          <div className="font-body text-body-md text-on-surface-variant [&>p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
