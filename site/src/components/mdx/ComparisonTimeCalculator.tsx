"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Smartphone } from "lucide-react";

export function ComparisonTimeCalculator() {
  const [scrollTime, setScrollTime] = useState(2);
  const [feelWorse, setFeelWorse] = useState(70);

  const yearlyScroll = scrollTime * 365;
  const hoursWorse = Math.round(yearlyScroll * (feelWorse / 100));
  const hoursOkay = yearlyScroll - hoursWorse;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">The Comparison Tax Calculator</h3>
      </div>

      <p className="font-body text-body-sm text-on-surface-variant mb-6">
        Be honest with yourself. This is just for you.
      </p>

      <div className="mb-5">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-2">
          How many hours a day do you spend scrolling through social media?
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.5}
            value={scrollTime}
            onChange={(e) => setScrollTime(Number(e.target.value))}
            className="flex-1 accent-primary-container"
          />
          <span className="font-headline text-xl w-16 text-right">{scrollTime}h</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-2">
          What % of that time leaves you feeling worse than before you opened the app?
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={feelWorse}
            onChange={(e) => setFeelWorse(Number(e.target.value))}
            className="flex-1 accent-primary-container"
          />
          <span className="font-headline text-xl w-16 text-right">{feelWorse}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border-2 border-on-surface/20 p-3 text-center" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">Hours/year scrolling</p>
          <p className="font-headline text-2xl">{yearlyScroll}</p>
        </div>
        <div className="border-2 border-on-surface/20 p-3 text-center bg-red-50" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">Hours feeling worse</p>
          <p className="font-headline text-2xl">{hoursWorse}</p>
        </div>
      </div>

      <div className="bg-primary-container/10 border-2 border-on-surface/20 p-3 text-center" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
        <p className="font-mono text-[10px] uppercase text-on-surface-variant mb-1">
          That&apos;s <strong className="text-on-surface">{hoursWorse}</strong> hours a year you spend making yourself feel behind
        </p>
        <p className="font-body text-body-sm text-on-surface-variant">
          Imagine what you could build with even half that time.
        </p>
      </div>
    </motion.div>
  );
}
