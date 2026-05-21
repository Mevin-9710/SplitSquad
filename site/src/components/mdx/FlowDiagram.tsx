"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FlowStep {
  label: string;
  description?: string;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  title?: string;
}

export function FlowDiagram({ steps, title }: FlowDiagramProps) {
  const safeSteps = steps || [];

  return (
    <div className="my-8 p-8 border-3 border-on-surface shadow-brutalist bg-surface-container-lowest" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      {title && (
        <h4 className="font-headline text-headline-md uppercase tracking-tight text-center mb-8">{title}</h4>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-0">
        {safeSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-4 md:gap-0 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="flex-1 md:flex-none"
            >
              <div className="flex items-center gap-4 p-4 border-2 border-on-surface bg-surface-container shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                <div className="w-10 h-10 bg-primary-container border-2 border-on-surface flex items-center justify-center font-headline text-lg font-bold flex-shrink-0" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  {i + 1}
                </div>
                <div>
                  <span className="font-headline text-sm uppercase tracking-tight block">{step.label}</span>
                  {step.description && (
                    <span className="font-mono text-[10px] uppercase text-on-surface-variant">{step.description}</span>
                  )}
                </div>
              </div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.2 + 0.2 }}
                className="hidden md:flex items-center justify-center w-12"
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6 text-primary-container" />
                </motion.div>
              </motion.div>
            )}
            {i < steps.length - 1 && (
              <div className="md:hidden w-full h-6 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 text-primary-container rotate-90" />
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
