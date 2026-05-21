"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrutalistButton } from "@/components/BrutalistButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden bg-surface-container-lowest border-t-3 border-on-surface" style={{ borderTopWidth: 3, borderColor: "#1a1c1c" }}>
      <motion.div
        style={{ scale, opacity }}
        className="relative max-w-3xl mx-auto px-4 md:px-8 text-center"
      >
        <ScrollReveal direction="up">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-12 h-12 text-primary-container mx-auto" />
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} direction="up">
          <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-tight mb-6">
            Ready to <span className="text-primary">split</span>?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="up">
          <p className="font-body text-body-lg md:text-xl text-on-surface-variant max-w-lg mx-auto mb-10">
            Your squad is waiting. Create your first split and see why group payments don't have to be a headache.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} direction="up">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BrutalistButton
              variant="primary"
              size="lg"
              href="/app"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your First Split
            </BrutalistButton>
            <BrutalistButton
              variant="ghost"
              size="lg"
              href="/features"
            >
              Explore Features
            </BrutalistButton>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5} direction="up">
          <div className="mt-16 flex items-center justify-center gap-3 text-on-surface-variant">
            <div className="w-8 h-px bg-on-surface/20" />
            <span className="font-mono text-xs uppercase">Free during beta • No signup walls • UPI-first</span>
            <div className="w-8 h-px bg-on-surface/20" />
          </div>
        </ScrollReveal>
      </motion.div>
    </section>
  );
}
