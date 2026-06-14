"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, PiggyBank } from "lucide-react";

export function StudentBudgetTool({
  defaultIncome = 10000,
}: {
  defaultIncome?: number;
}) {
  const [income, setIncome] = useState(defaultIncome);

  const needs = Math.round(income * 0.5);
  const wants = Math.round(income * 0.3);
  const savings = Math.round(income * 0.2);

  const breakdown = [
    { label: "Needs (50%)", amount: needs, color: "bg-primary-container", items: ["Mess fees", "Rent/hostel", "Phone recharge", "Travel (local)"] },
    { label: "Wants (30%)", amount: wants, color: "bg-orange-400", items: ["Zomato/Swiggy", "Movies & outings", "Weekend trips", "Chai & snacks"] },
    { label: "Savings (20%)", amount: savings, color: "bg-green-500", items: ["Emergency fund", "SIP / RD", "Laptop fund", "Trip savings"] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Student Budget Builder</h3>
      </div>

      <div className="mb-6">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-2">
          Your monthly income/allowance: ₹{income.toLocaleString("en-IN")}
        </label>
        <input
          type="range"
          min={3000}
          max={30000}
          step={500}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="w-full accent-primary-container"
        />
      </div>

      <div className="space-y-3 mb-6">
        {breakdown.map((b) => (
          <div
            key={b.label}
            className="border-2 border-on-surface/20 p-3"
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline text-xs uppercase">{b.label}</span>
              <span className="font-mono text-sm">₹{b.amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="w-full h-2 bg-on-surface/10 mb-2">
              <div className={`h-full ${b.color} transition-all`} style={{ width: `${(b.amount / income) * 100}%` }} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {b.items.map((item) => (
                <span key={item} className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-on-surface/20 text-on-surface-variant">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 bg-primary-container/10 border-2 border-on-surface/20 p-3" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
        <PiggyBank className="w-6 h-6 text-primary-container flex-shrink-0" />
        <div>
          <p className="font-headline text-xs uppercase">The 50/30/20 Rule</p>
          <p className="font-body text-body-sm text-on-surface-variant">
            Even ₹{savings.toLocaleString("en-IN")}/month saved is infinitely better than zero. Start today, not &quot;when you earn more.&quot;
          </p>
        </div>
      </div>
    </motion.div>
  );
}
