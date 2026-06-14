"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";

interface Member {
  name: string;
  meals: number;
}

export function MessExpenseSplitter({
  defaultMembers = [
    { name: "You", meals: 22 },
    { name: "Rahul", meals: 18 },
    { name: "Priya", meals: 20 },
    { name: "Amit", meals: 15 },
  ],
  defaultTotalCost = 14983,
}: {
  defaultMembers?: Member[];
  defaultTotalCost?: number;
}) {
  const [members, setMembers] = useState(defaultMembers);
  const [totalCost, setTotalCost] = useState(defaultTotalCost);
  const [newName, setNewName] = useState("");

  const totalMeals = members.reduce((s, m) => s + m.meals, 0);
  const costPerMeal = totalMeals > 0 ? totalCost / totalMeals : 0;

  const shares = members.map((m) => ({
    ...m,
    share: Math.round(costPerMeal * m.meals),
    percent: totalMeals > 0 ? ((m.meals / totalMeals) * 100).toFixed(1) : "0",
  }));

  const updateMeals = (index: number, meals: number) => {
    const updated = [...members];
    updated[index] = { ...updated[index], meals: Math.max(0, meals) };
    setMembers(updated);
  };

  const addMember = () => {
    if (!newName.trim()) return;
    setMembers([...members, { name: newName.trim(), meals: 15 }]);
    setNewName("");
  };

  const removeMember = (index: number) => {
    if (members.length <= 2) return;
    setMembers(members.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <UtensilsCrossed className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Mess Expense Splitter</h3>
      </div>

      <div className="mb-4">
        <label className="block font-mono text-[10px] uppercase text-on-surface-variant mb-1">
          Total mess cost: ₹{totalCost.toLocaleString("en-IN")}
        </label>
        <input
          type="range"
          min={3000}
          max={30000}
          step={500}
          value={totalCost}
          onChange={(e) => setTotalCost(Number(e.target.value))}
          className="w-full accent-primary-container"
        />
      </div>

      <div className="space-y-2 mb-4">
        {shares.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 border-2 border-on-surface/20"
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          >
            <span className="w-16 font-headline text-xs uppercase">{m.name}</span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={31}
                value={m.meals}
                onChange={(e) => updateMeals(i, Number(e.target.value))}
                className="flex-1 accent-primary-container"
              />
              <span className="font-mono text-xs w-8 text-right">{m.meals}</span>
            </div>
            <span className="font-mono text-xs w-20 text-right">₹{m.share.toLocaleString("en-IN")}</span>
            <span className="font-mono text-[10px] text-on-surface-variant w-10 text-right">{m.percent}%</span>
            {members.length > 2 && (
              <button onClick={() => removeMember(i)} className="p-1 hover:bg-on-surface/5">
                <Trash2 className="w-3 h-3 text-on-surface-variant" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add member"
          className="flex-1 px-2 py-1.5 font-body text-sm border-2 border-on-surface/40 bg-surface-container-lowest focus:outline-none focus:border-on-surface"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          onKeyDown={(e) => e.key === "Enter" && addMember()}
        />
        <button
          onClick={addMember}
          className="px-3 py-1.5 bg-primary-container border-2 border-on-surface"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 border-t-2 border-on-surface/10 font-mono text-xs" style={{ borderTopWidth: 2 }}>
        <span>Total meals: {totalMeals}</span>
        <span>Cost/meal: ₹{costPerMeal.toFixed(0)}</span>
      </div>

      <p className="font-body text-body-sm text-on-surface-variant mt-3 text-center">
        Pay only for the meals you actually ate. No more subsidizing your roommate&apos;s mess attendance.
      </p>
    </motion.div>
  );
}
