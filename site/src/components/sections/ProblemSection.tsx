"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MessageSquare, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const problems = [
  { text: "Bro, who paid for dinner?", icon: MessageSquare, type: "chaos" },
  { text: "Send me the screenshot", icon: AlertCircle, type: "chaos" },
  { text: "I already paid you last week", icon: XCircle, type: "chaos" },
  { text: "Wait, was that UPI or cash?", icon: AlertCircle, type: "chaos" },
  { text: "Let me check my bank app...", icon: MessageSquare, type: "chaos" },
  { text: "Bro I already paid.", icon: XCircle, type: "chaos" },
];

const solutions = [
  { text: "Split created. Everyone notified.", icon: CheckCircle2, type: "clean" },
  { text: "Payment link shared via WhatsApp.", icon: CheckCircle2, type: "clean" },
  { text: "Verified. No more confusion.", icon: CheckCircle2, type: "clean" },
  { text: "UPI tracked automatically.", icon: CheckCircle2, type: "clean" },
  { text: "Balances updated in real-time.", icon: CheckCircle2, type: "clean" },
  { text: "Settled. Squad happy.", icon: CheckCircle2, type: "clean" },
];

export function ProblemSection() {
  const [phase, setPhase] = useState<"chaos" | "transition" | "clean">("chaos");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-200px" });

  useEffect(() => {
    if (isInView) {
      const t1 = setTimeout(() => setPhase("transition"), 1500);
      const t2 = setTimeout(() => setPhase("clean"), 2500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <SectionHeading
          label="The Problem"
          title="Group payments are a mess."
          subtitle="Sound familiar? You're not alone. Every group payment turns into a WhatsApp detective story."
        />

        <div className="grid gap-3 md:gap-4 max-w-2xl mx-auto">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              animate={
                phase === "transition"
                  ? { opacity: [1, 0.3, 0], scale: [1, 0.95, 0.9], x: -50 }
                  : phase === "clean"
                  ? { opacity: 0, scale: 0.9, x: -50 }
                  : {}
              }
              className="flex items-center gap-4 p-4 bg-surface-container-lowest border-2 border-on-surface/20 shadow-brutalist-sm"
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              <problem.icon className="w-5 h-5 text-error flex-shrink-0" />
              <span className="font-body text-body-md text-on-surface">{problem.text}</span>
            </motion.div>
          ))}

          {phase === "clean" &&
            solutions.map((solution, i) => (
              <motion.div
                key={`sol-${i}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-primary-container/10 border-2 border-primary-container shadow-brutalist-sm"
                style={{ borderWidth: 2, borderColor: "#f4bd31" }}
              >
                <solution.icon className="w-5 h-5 text-on-surface flex-shrink-0" />
                <span className="font-body text-body-md text-on-surface">{solution.text}</span>
              </motion.div>
            ))}
        </div>

        <ScrollReveal delay={0.3} direction="up">
          <div className="mt-12 text-center">
            <p className="font-headline text-headline-md uppercase tracking-tight text-on-surface-variant">
              There's a <span className="text-primary-container">better way</span>.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
