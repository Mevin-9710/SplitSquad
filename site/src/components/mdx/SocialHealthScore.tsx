"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";

const questions = [
  { id: "q1", text: "How many close friends can you call at 2 AM if something goes wrong?", options: ["0", "1-2", "3-4", "5+"] },
  { id: "q2", text: "How often do you meet friends in person (not over text/call)?", options: ["Rarely once a month", "A few times a month", "Once a week", "Multiple times a week"] },
  { id: "q3", text: "Do you have a group where you feel you truly belong?", options: ["No, not really", "One group, somewhat", "One group, strongly", "Multiple groups"] },
  { id: "q4", text: "How often do you share what's actually bothering you with someone?", options: ["Almost never", "Occasionally", "Often with 1-2 people", "Freely with trusted circle"] },
  { id: "q5", text: "When was the last time you made a new friend?", options: ["6+ months ago", "3-6 months ago", "1-3 months ago", "This month"] },
];

const tiers = [
  {
    min: 0,
    label: "Needs Attention",
    color: "text-red-600",
    desc: "You're carrying more alone than anyone should. That's not weakness — it's a signal. The first step is the hardest: reach out to one person this week.",
    tip: "Send one message today to someone you haven't talked to in a while. Just 'Hey, was thinking about you.' That's it.",
  },
  {
    min: 5,
    label: "Building",
    color: "text-orange-500",
    desc: "You have some connections but they may not be deep enough. Focus on turning acquaintances into real friendships.",
    tip: "Pick one friend and schedule a call this week. Not a text — an actual conversation.",
  },
  {
    min: 10,
    label: "Connected",
    color: "text-primary-container",
    desc: "You have a solid foundation. Now focus on deepening your strongest relationships.",
    tip: "Plan a group activity this month — a trip, a meal together, something that creates shared memories.",
  },
  {
    min: 15,
    label: "Thriving",
    color: "text-green-700",
    desc: "You're doing better than most. Keep investing in your people — they're your real safety net.",
    tip: "Help someone else build their connections. Introduce two friends who'd get along.",
  },
];

export function SocialHealthScore() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (val: string) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const score = answers.reduce((sum, a) => sum + questions[answers.indexOf(a)]?.options.indexOf(a), 0);
  const tier = [...tiers].reverse().find((t) => score >= t.min) || tiers[0];

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest text-center"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
      >
        <Heart className="w-10 h-10 mx-auto mb-3 text-primary-container" />
        <p className="font-mono text-[10px] uppercase text-on-surface-variant mb-1">Your Social Health Score</p>
        <p className="font-headline text-4xl mb-1">{score}/20</p>
        <p className={`font-headline text-lg uppercase tracking-tight mb-3 ${tier.color}`}>{tier.label}</p>
        <p className="font-body text-body-md text-on-surface-variant mb-4">{tier.desc}</p>
        <div className="bg-primary-container/10 border-2 border-on-surface/20 p-3 mb-4" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase mb-1">Try this</p>
          <p className="font-body text-body-sm">{tier.tip}</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Retake
        </button>
      </motion.div>
    );
  }

  const q = questions[step];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Social Health Check</h3>
      </div>
      <div className="w-full h-1 bg-on-surface/10 mb-6">
        <div className="h-full bg-primary-container transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="font-body text-body-lg mb-5"
        >
          {q.text}
        </motion.p>
      </AnimatePresence>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="w-full text-left p-3 font-body text-body-md border-2 border-on-surface/40 hover:border-on-surface hover:shadow-brutalist-sm transition-all"
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
