"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight } from "lucide-react";

interface Expense {
  name: string;
  amount: number;
  paidBy: number;
}

export function ExpenseSplitSimulator() {
  const [people, setPeople] = useState(3);
  const [expenses, setExpenses] = useState<Expense[]>([
    { name: "Zomato", amount: 720, paidBy: 0 },
    { name: "Electricity bill", amount: 2400, paidBy: 1 },
    { name: "Weekend trip fuel", amount: 1500, paidBy: 2 },
  ]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const addExpense = () => {
    if (!newName || !newAmount) return;
    setExpenses([...expenses, { name: newName, amount: Number(newAmount), paidBy: expenses.length % people }]);
    setNewName("");
    setNewAmount("");
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = total / people;

  const balances = Array.from({ length: people }, (_, i) => {
    const paid = expenses.filter((e) => e.paidBy === i).reduce((s, e) => s + e.amount, 0);
    return { person: i, paid, owes: paid - perPerson };
  });

  const settlements: { from: number; to: number; amount: number }[] = [];
  const debtors = balances.filter((b) => b.owes < 0).map((b) => ({ ...b, owes: Math.abs(b.owes) }));
  const creditors = balances.filter((b) => b.owes > 0).sort((a, b) => b.owes - a.owes);

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].owes, creditors[j].owes);
    if (amt > 1) settlements.push({ from: debtors[i].person, to: creditors[j].person, amount: Math.round(amt) });
    debtors[i].owes -= amt;
    creditors[j].owes -= amt;
    if (debtors[i].owes < 1) i++;
    if (creditors[j].owes < 1) j++;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-headline text-sm uppercase tracking-tight">Expense Split Simulator</h3>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-[10px] uppercase text-on-surface-variant">People:</span>
        {[2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setPeople(n)}
            className={`px-3 py-1 font-mono text-xs border-2 transition-all ${
              people === n
                ? "bg-primary-container border-on-surface text-on-surface shadow-brutalist-sm"
                : "border-on-surface/40 text-on-surface-variant hover:border-on-surface"
            }`}
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        <AnimatePresence>
          {expenses.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 p-2 border-2 border-on-surface/20"
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              <span className="flex-1 font-body text-body-sm">{exp.name}</span>
              <span className="font-mono text-xs">₹{exp.amount}</span>
              <span className="font-mono text-[10px] text-on-surface-variant">P{exp.paidBy + 1}</span>
              <button onClick={() => removeExpense(i)} className="p-1 hover:bg-on-surface/5">
                <Trash2 className="w-3 h-3 text-on-surface-variant" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Expense name"
          className="flex-1 px-2 py-1.5 font-body text-sm border-2 border-on-surface/40 bg-surface-container-lowest focus:outline-none focus:border-on-surface"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        />
        <input
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          className="w-24 px-2 py-1.5 font-mono text-sm border-2 border-on-surface/40 bg-surface-container-lowest focus:outline-none focus:border-on-surface"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        />
        <button
          onClick={addExpense}
          className="px-3 py-1.5 bg-primary-container border-2 border-on-surface font-mono text-xs uppercase"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="border-t-2 border-on-surface/10 pt-4" style={{ borderTopWidth: 2 }}>
        <div className="flex justify-between mb-3">
          <span className="font-mono text-xs uppercase">Total: ₹{total.toLocaleString("en-IN")}</span>
          <span className="font-mono text-xs uppercase">Per person: ₹{perPerson.toFixed(0)}</span>
        </div>

        {settlements.length > 0 && (
          <div className="bg-primary-container/10 border-2 border-on-surface/20 p-3" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
            <p className="font-mono text-[10px] uppercase mb-2">Settlements</p>
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center gap-2 font-body text-body-sm">
                <span>P{s.from + 1}</span>
                <ArrowRight className="w-3 h-3" />
                <span>P{s.to + 1}</span>
                <span className="font-mono text-xs ml-auto">₹{s.amount.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
