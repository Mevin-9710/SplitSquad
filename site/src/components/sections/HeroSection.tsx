"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { BetaBadge } from "@/components/BetaBadge";
import { BrutalistButton } from "@/components/BrutalistButton";
import { FloatingElements } from "@/components/FloatingElements";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const words = ["Split", "expenses", "without", "the", "chaos."];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <AnimatedGrid />
      <FloatingElements />

      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <BetaBadge />
        </motion.div>

        <div className="mb-8">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="inline-block mr-3 md:mr-4"
            >
              <span
                className={`font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-none ${
                  i === words.length - 1
                    ? "text-primary-container"
                    : "text-on-surface"
                }`}
              >
                {word}
              </span>
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="font-body text-body-lg md:text-xl text-on-surface-variant max-w-xl mx-auto mb-10"
        >
          UPI-first expense splitting for trips, roommates, and group payments.
          Track, verify, and settle — instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <BrutalistButton
            variant="primary"
            size="lg"
            href="/app"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Start Splitting
          </BrutalistButton>
          <BrutalistButton
            variant="secondary"
            size="lg"
            href="#features"
            icon={<Zap className="w-5 h-5" />}
          >
            See How It Works
          </BrutalistButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-16 flex items-center justify-center gap-6 text-on-surface-variant"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-whatsapp" />
            <span className="font-mono text-xs uppercase">WhatsApp Integration</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-on-surface/20" />
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-container" />
            <span className="font-mono text-xs uppercase">UPI-First</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-on-surface/20" />
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-on-surface" />
            <span className="font-mono text-xs uppercase">Free in Beta</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-on-surface/30 flex items-start justify-center pt-2"
          style={{ borderWidth: 2 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-on-surface/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
