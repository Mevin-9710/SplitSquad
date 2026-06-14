"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Calendar } from "lucide-react";

export function SideHustleCalculator({
  defaultSalary = 30000,
  defaultHustle = 8000,
}: {
  defaultSalary?: number;
  defaultHustle?: number;
}) {
  const [salary, setSalary] = useState(defaultSalary);
  const [hustle, setHustle] = useState(defaultHustle);

  const yearlySalary = salary * 12;
  const yearlyHustle = hustle * 12;
  const totalYearly = yearlySalary + yearlyHustle;
  const hustlePercent = totalYearly > 0 ? Math.round((yearlyHustle / totalYearly) * 100) : 0;
  const extraMonths = salary > 0 ? Math.round((yearlyHustle / salary) * 10) / 10 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Side Hustle Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-2">
            Monthly Salary (₹)
          </label>
          <input
            type="range"
            min={5000}
            max={100000}
            step={1000}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full accent-primary-container"
          />
          <span className="font-headline text-xl">₹{salary.toLocaleString("en-IN")}</span>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-2">
            Monthly Side Hustle (₹)
          </label>
          <input
            type="range"
            min={0}
            max={80000}
            step={1000}
            value={hustle}
            onChange={(e) => setHustle(Number(e.target.value))}
            className="w-full accent-primary-container"
          />
          <span className="font-headline text-xl">₹{hustle.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border-2 border-on-surface/20 p-3 text-center" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">Total Yearly</p>
          <p className="font-headline text-lg">₹{totalYearly.toLocaleString("en-IN")}</p>
        </div>
        <div className="border-2 border-on-surface/20 p-3 text-center bg-primary-container/10" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">Hustle Share</p>
          <p className="font-headline text-lg">{hustlePercent}%</p>
        </div>
        <div className="border-2 border-on-surface/20 p-3 text-center" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase text-on-surface-variant">Extra Months</p>
          <p className="font-headline text-lg">{extraMonths}x</p>
        </div>
      </div>

      <p className="font-body text-body-sm text-on-surface-variant mt-4 text-center">
        Your side hustle adds <strong className="text-on-surface">{extraMonths}x</strong> extra months of salary every year — that&apos;s <strong className="text-on-surface">{hustlePercent}%</strong> of your total income.
      </p>
    </motion.div>
  );
}
