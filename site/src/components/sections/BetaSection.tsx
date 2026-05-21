"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { Star, Gift, Rocket, Heart } from "lucide-react";

const perks = [
  { icon: <Gift className="w-5 h-5" />, text: "Free during beta — no hidden costs" },
  { icon: <Rocket className="w-5 h-5" />, text: "Early access to all upcoming features" },
  { icon: <Heart className="w-5 h-5" />, text: "Help shape the platform — your feedback matters" },
  { icon: <Star className="w-5 h-5" />, text: "Unlimited core usage during beta period" },
];

export function BetaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 animated-grid opacity-30" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container border-3 border-on-surface shadow-brutalist mb-6 font-mono text-sm uppercase"
              style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 bg-on-surface"
              />
              Early Access Beta
            </motion.div>

            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Be part of the <span className="text-primary-container">squad</span>.
            </h2>

            <p className="font-body text-body-lg text-on-surface-variant max-w-xl mx-auto">
              SplitSquad is currently in beta. That means you get full access to everything we're building — for free.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="up">
          <div className="bg-surface-container-lowest border-3 border-on-surface shadow-brutalist-lg p-8 md:p-12 mb-10" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-container/20 border-2 border-primary-container flex items-center justify-center text-primary-container">
                    {perk.icon}
                  </div>
                  <span className="font-body text-body-md text-on-surface pt-1.5">{perk.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4} direction="up">
          <div className="text-center">
            <p className="font-mono text-sm text-on-surface-variant uppercase mb-4">
              No credit card. No signup walls. Just split.
            </p>
            <BrutalistButton variant="primary" size="lg" href="/app">
              Join the Beta
            </BrutalistButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
