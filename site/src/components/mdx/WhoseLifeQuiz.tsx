"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowRight } from "lucide-react";

const questions = [
  {
    q: "When you see a classmate's achievement post, what's your first automatic reaction?",
    options: [
      { label: "Happy for them, briefly", value: "a", scores: { yours: 2, theirs: 0 } },
      { label: "A small pang of 'why not me'", value: "b", scores: { yours: 1, theirs: 2 } },
      { label: "I feel behind and anxious", value: "c", scores: { yours: 0, theirs: 4 } },
      { label: "I immediately think about what I should be doing differently", value: "d", scores: { yours: 0, theirs: 3 } },
    ],
  },
  {
    q: "Who are you actually trying to impress with your life choices?",
    options: [
      { label: "My past self — I just want to be better than I was", value: "a", scores: { yours: 4, theirs: 0 } },
      { label: "My parents / family expectations", value: "b", scores: { yours: 1, theirs: 3 } },
      { label: "My peers / batchmates", value: "c", scores: { yours: 0, theirs: 4 } },
      { label: "Society's idea of a 'successful' person", value: "d", scores: { yours: 0, theirs: 4 } },
    ],
  },
  {
    q: "When you imagine your ideal life in 5 years, whose version of success shows up?",
    options: [
      { label: "My own — I know what I want", value: "a", scores: { yours: 4, theirs: 0 } },
      { label: "A mix of what I want and what others expect", value: "b", scores: { yours: 2, theirs: 2 } },
      { label: "Honestly, someone else's life that I admire", value: "c", scores: { yours: 0, theirs: 4 } },
      { label: "I can't clearly picture it", value: "d", scores: { yours: 1, theirs: 1 } },
    ],
  },
  {
    q: "How often do you check someone's profile/feed specifically to see how they're doing compared to you?",
    options: [
      { label: "Almost never", value: "a", scores: { yours: 4, theirs: 0 } },
      { label: "Occasionally, when it pops up on my feed", value: "b", scores: { yours: 3, theirs: 1 } },
      { label: "Regularly — I keep tabs on certain people", value: "c", scores: { yours: 1, theirs: 3 } },
      { label: "Multiple times a day", value: "d", scores: { yours: 0, theirs: 4 } },
    ],
  },
];

export function WhoseLifeQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ yours: 0, theirs: 0 });
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option: (typeof questions)[0]["options"][0]) => {
    const newScores = {
      yours: scores.yours + option.scores.yours,
      theirs: scores.theirs + option.scores.theirs,
    };
    setScores(newScores);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setStep(0);
    setScores({ yours: 0, theirs: 0 });
    setFinished(false);
  };

  const total = scores.yours + scores.theirs;
  const yourPercent = total > 0 ? Math.round((scores.yours / total) * 100) : 50;
  const theirPercent = 100 - yourPercent;

  const getResult = () => {
    if (yourPercent >= 75) return {
      label: "You're running your own race",
      desc: "You've mostly escaped the comparison trap. Keep guarding your attention — the algorithm hasn't given up on you yet.",
      color: "text-green-700",
    };
    if (yourPercent >= 50) return {
      label: "Somewhere in between",
      desc: "You're aware of the trap but still get pulled in sometimes. That's okay — awareness is the first step. The next time you catch yourself comparing, ask: 'Is this useful information about MY life?'",
      color: "text-primary-container",
    };
    return {
      label: "Living by someone else's scoreboard",
      desc: "You've been measuring yourself against standards that were never yours. The good news? You can stop anytime. Not by achieving more — by opting out of the game entirely.",
      color: "text-orange-500",
    };
  };

  if (finished) {
    const result = getResult();
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
      >
        <h3 className="font-headline text-sm uppercase tracking-tight mb-4">Your Result</h3>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-3 bg-green-200" style={{ width: `${yourPercent}%` }}>
            <div className="h-full bg-green-500" style={{ width: `${yourPercent}%` }} />
          </div>
          <div className="flex-1 h-3 bg-red-200" style={{ width: `${theirPercent}%` }}>
            <div className="h-full bg-red-400" style={{ width: `${theirPercent}%` }} />
          </div>
        </div>
        <div className="flex justify-between font-mono text-[10px] uppercase mb-4">
          <span className="text-green-700">Your life: {yourPercent}%</span>
          <span className="text-red-500">Their life: {theirPercent}%</span>
        </div>

        <p className={`font-headline text-lg uppercase tracking-tight mb-2 ${result.color}`}>{result.label}</p>
        <p className="font-body text-body-md text-on-surface-variant mb-4">{result.desc}</p>

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
      <h3 className="font-headline text-sm uppercase tracking-tight mb-4">Whose Life Are You Building?</h3>
      <div className="w-full h-1 bg-on-surface/10 mb-4">
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
          {q.q}
        </motion.p>
      </AnimatePresence>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(opt)}
            className="w-full text-left p-3 font-body text-body-md border-2 border-on-surface/40 hover:border-on-surface hover:shadow-brutalist-sm transition-all flex items-center justify-between group"
            style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          >
            {opt.label}
            <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
