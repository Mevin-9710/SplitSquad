"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, TrendingDown } from "lucide-react";

const degreeData: Record<string, { avg: number; expectation: number; label: string }> = {
  engineering: { avg: 450000, expectation: 700000, label: "B.Tech / BE" },
  mba: { avg: 800000, expectation: 1200000, label: "MBA" },
  bba: { avg: 350000, expectation: 550000, label: "BBA" },
  bcom: { avg: 300000, expectation: 500000, label: "B.Com" },
  ba: { avg: 280000, expectation: 450000, label: "BA / B.Sc" },
  arts: { avg: 250000, expectation: 400000, label: "Arts / Design" },
  other: { avg: 320000, expectation: 500000, label: "Other Degree" },
};

export function SalaryGapCalculator() {
  const [degree, setDegree] = useState("engineering");
  const [actualSalary, setActualSalary] = useState(0);

  const data = degreeData[degree];
  const gap = data.expectation - data.avg;
  const gapPercent = Math.round((gap / data.expectation) * 100);

  const yearsToExpectation = actualSalary > 0
    ? Math.ceil((data.expectation - actualSalary) / (actualSalary * 0.08))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Salary Reality Check</h3>
      </div>

      <div className="mb-4">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-2">
          Select your degree
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(degreeData).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setDegree(key)}
              className={`px-3 py-1.5 font-mono text-xs uppercase border-2 transition-all ${
                degree === key
                  ? "bg-primary-container border-on-surface text-on-surface shadow-brutalist-sm"
                  : "border-on-surface/40 text-on-surface-variant hover:border-on-surface"
              }`}
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border-2 border-on-surface/20 p-3 text-center" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">What you expect</p>
          <p className="font-headline text-xl">₹{(data.expectation / 100000).toFixed(1)}L</p>
        </div>
        <div className="border-2 border-on-surface/20 p-3 text-center bg-red-50" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">Market reality</p>
          <p className="font-headline text-xl">₹{(data.avg / 100000).toFixed(1)}L</p>
        </div>
      </div>

      <div className="bg-primary-container/10 border-2 border-on-surface/20 p-3 mb-4 text-center" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
        <p className="font-mono text-[10px] uppercase text-on-surface-variant flex items-center justify-center gap-1">
          <TrendingDown className="w-3 h-3" /> Expectation Gap
        </p>
        <p className="font-headline text-xl">₹{gap.toLocaleString("en-IN")}/yr ({gapPercent}%)</p>
      </div>

      <div className="mb-2">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-1">
          Your actual/expected first salary (₹/yr)
        </label>
        <input
          type="range"
          min={150000}
          max={1500000}
          step={50000}
          value={actualSalary || data.avg}
          onChange={(e) => setActualSalary(Number(e.target.value))}
          className="w-full accent-primary-container"
        />
        <div className="flex justify-between font-mono text-xs">
          <span>₹{(actualSalary || data.avg).toLocaleString("en-IN")}/yr</span>
          {actualSalary > 0 && (
            <span className="text-on-surface">
              ~{yearsToExpectation} yrs to close the gap
            </span>
          )}
        </div>
      </div>

      <p className="font-body text-body-sm text-on-surface-variant mt-3 text-center">
        {gapPercent > 40
          ? "That gap won't close with a degree alone. You need skills the market actually pays for."
          : "The gap is manageable — but skills (not your degree) will close it faster."}
      </p>
    </motion.div>
  );
}
