"use client";

import { ScrollReveal } from "./ScrollReveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({ label, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      {label && (
        <ScrollReveal delay={0} direction="up">
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4 px-3 py-1.5 border-2 border-primary/30 bg-primary-container/10">
            {label}
          </span>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.1} direction="up">
        <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={0.2} direction="up">
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
