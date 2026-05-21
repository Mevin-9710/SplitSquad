"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  color?: string;
}

interface AnimatedStatCardProps {
  stats: StatItem[];
  title?: string;
}

export function AnimatedStatCard({ stats, title }: AnimatedStatCardProps) {
  const safeStats = stats || [];

  return (
    <div className="my-8">
      {title && (
        <h4 className="font-mono text-xs uppercase text-on-surface-variant mb-4 text-center">{title}</h4>
      )}
      <div className="grid grid-cols-3 gap-4">
        {safeStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative overflow-hidden"
          >
            <div
              className="relative p-5 border-3 border-on-surface shadow-brutalist text-center"
              style={{
                borderWidth: 3,
                borderColor: "#1a1c1c",
                background: `linear-gradient(135deg, #f4bd31 0%, #f4bd31 100%)`,
                opacity: 0.9,
              }}
            >
              <AnimatedCounter
                to={stat.value}
                suffix={stat.suffix || ""}
                prefix={stat.prefix || ""}
                label={stat.label}
                duration={1.5}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
