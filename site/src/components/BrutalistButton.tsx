"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface BrutalistButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

const variants = {
  primary: "bg-primary-container text-on-surface border-on-surface shadow-brutalist hover:bg-primary",
  secondary: "bg-surface-container-lowest text-on-surface border-on-surface shadow-brutalist hover:bg-surface-variant",
  ghost: "bg-transparent text-on-surface border-2 border-on-surface hover:bg-primary-container/10",
};

const sizes = {
  sm: "px-4 py-2 font-mono text-xs",
  md: "px-6 py-3 font-mono text-sm",
  lg: "px-8 py-4 font-mono text-base",
};

export function BrutalistButton({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon,
}: BrutalistButtonProps) {
  const baseClasses = `inline-flex items-center justify-center gap-2 uppercase font-bold tracking-wide transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (href) {
    return (
      <motion.button
        whileHover={{ scale: 1.02, x: -2, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => window.location.href = href}
        className={baseClasses}
        style={{ borderWidth: variant === "ghost" ? 2 : 3, borderColor: "#1a1c1c" }}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: -2, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={baseClasses}
      style={{ borderWidth: variant === "ghost" ? 2 : 3, borderColor: "#1a1c1c" }}
    >
      {content}
    </motion.button>
  );
}
