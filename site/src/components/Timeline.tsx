"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-on-surface/20" />
      <div className="space-y-10">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative pl-14"
          >
            <div className="absolute left-0 top-1 w-10 h-10 bg-primary-container border-2 border-on-surface flex items-center justify-center font-mono text-xs uppercase shadow-brutalist-sm z-10">
              {event.icon || (
                <span className="font-headline text-sm">{event.year.slice(-2)}</span>
              )}
            </div>
            <div>
              <span className="font-mono text-xs uppercase text-on-surface-variant">{event.year}</span>
              <h4 className="font-headline text-lg uppercase tracking-tight mt-1">{event.title}</h4>
              <p className="font-body text-body-md text-on-surface-variant mt-1">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
