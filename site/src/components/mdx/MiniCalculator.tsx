"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalistButton } from "../BrutalistButton";

interface MiniCalculatorProps {
  defaultAmount?: number;
  defaultPeople?: number;
}

export function MiniCalculator({ defaultAmount = 2400, defaultPeople = 4 }: MiniCalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [people, setPeople] = useState(defaultPeople);
  const [calculated, setCalculated] = useState(false);

  const perPerson = amount / people;

  return (
    <div className="my-8 p-6 md:p-8 border-3 border-on-surface shadow-brutalist bg-surface-container-lowest" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      <h4 className="font-headline text-headline-md uppercase tracking-tight text-center mb-6">
        Split Calculator
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-mono text-xs uppercase text-on-surface-variant mb-2 block">Total Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(Number(e.target.value)); setCalculated(false); }}
            className="w-full p-3 bg-surface border-2 border-on-surface font-headline text-2xl uppercase tracking-tight focus:outline-none focus:border-3 focus:border-primary-container transition-all"
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase text-on-surface-variant mb-2 block">Number of People</label>
          <input
            type="number"
            value={people}
            onChange={(e) => { setPeople(Math.max(1, Number(e.target.value))); setCalculated(false); }}
            min={1}
            className="w-full p-3 bg-surface border-2 border-on-surface font-headline text-2xl uppercase tracking-tight focus:outline-none focus:border-3 focus:border-primary-container transition-all"
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          />
        </div>
      </div>

      <div className="text-center">
        <BrutalistButton variant="primary" size="md" onClick={() => setCalculated(true)}>
          Calculate
        </BrutalistButton>
      </div>

      <AnimatePresence>
        {calculated && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="border-t-3 border-on-surface pt-6" style={{ borderTopWidth: 3, borderColor: "#1a1c1c" }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-4 border-2 border-on-surface bg-primary-container/10 shadow-brutalist-sm"
                  style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
                >
                  <span className="font-mono text-xs uppercase text-on-surface-variant block mb-1">Total</span>
                  <span className="font-headline text-3xl tracking-tighter text-on-surface">₹{amount.toLocaleString()}</span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-4 border-2 border-on-surface bg-primary-container shadow-brutalist-sm"
                  style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
                >
                  <span className="font-mono text-xs uppercase text-on-surface block mb-1">Each Pays</span>
                  <span className="font-headline text-3xl tracking-tighter text-on-surface">₹{perPerson.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-4 border-2 border-on-surface bg-surface-container shadow-brutalist-sm"
                  style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
                >
                  <span className="font-mono text-xs uppercase text-on-surface-variant block mb-1">People</span>
                  <span className="font-headline text-3xl tracking-tighter">{people}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
