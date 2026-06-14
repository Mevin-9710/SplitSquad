"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";

const questions = [
  {
    q: "What's your current situation?",
    options: [
      { label: "College student", value: "student", scores: { creator: 2, freelancer: 3, teacher: 1, builder: 2 } },
      { label: "New grad with a job", value: "job", scores: { creator: 3, freelancer: 2, teacher: 1, builder: 3 } },
      { label: "Unemployed / looking", value: "unemployed", scores: { creator: 2, freelancer: 3, teacher: 2, builder: 2 } },
      { label: "Working professional 2+ yrs", value: "pro", scores: { creator: 1, freelancer: 2, teacher: 3, builder: 3 } },
    ],
  },
  {
    q: "What do you enjoy most?",
    options: [
      { label: "Creating videos / content", value: "content", scores: { creator: 5, freelancer: 1, teacher: 1, builder: 0 } },
      { label: "Building things / coding", value: "build", scores: { creator: 1, freelancer: 2, teacher: 0, builder: 5 } },
      { label: "Teaching / mentoring", value: "teach", scores: { creator: 1, freelancer: 1, teacher: 5, builder: 1 } },
      { label: "Flexible gig work", value: "gig", scores: { creator: 1, freelancer: 5, teacher: 1, builder: 2 } },
    ],
  },
  {
    q: "How much time can you commit weekly?",
    options: [
      { label: "2-5 hours (casual)", value: "casual", scores: { creator: 2, freelancer: 3, teacher: 2, builder: 1 } },
      { label: "5-10 hours (consistent)", value: "consistent", scores: { creator: 3, freelancer: 3, teacher: 3, builder: 3 } },
      { label: "10-20 hours (serious)", value: "serious", scores: { creator: 4, freelancer: 4, teacher: 4, builder: 4 } },
      { label: "Full-time commitment", value: "full", scores: { creator: 5, freelancer: 5, teacher: 5, builder: 5 } },
    ],
  },
  {
    q: "What's your primary goal?",
    options: [
      { label: "Extra ₹5-10K/month", value: "extra", scores: { creator: 3, freelancer: 4, teacher: 3, builder: 2 } },
      { label: "Replace my salary eventually", value: "replace", scores: { creator: 4, freelancer: 4, teacher: 3, builder: 4 } },
      { label: "Build a long-term business", value: "business", scores: { creator: 5, freelancer: 3, teacher: 2, builder: 5 } },
      { label: "Learn new skills first", value: "learn", scores: { creator: 2, freelancer: 3, teacher: 4, builder: 3 } },
    ],
  },
];

const results = {
  creator: {
    title: "Content Creator",
    desc: "You thrive on attention and influence. Start a YouTube channel, Instagram page, or newsletter. Your audience is your asset.",
    examples: ["Tech review channel", "Finance Instagram page", "LinkedIn thought leadership", "Newsletter on a niche topic"],
    starter: "Post 3x/week for 30 days. Don't optimize — just create.",
  },
  freelancer: {
    title: "Freelancer",
    desc: "You value flexibility and variety. Platforms like Upwork, Fiverr, and Internshala are your playground.",
    examples: ["UI/UX design", "Content writing", "Video editing", "Social media management"],
    starter: "Build a 3-service portfolio and apply to 5 gigs a day.",
  },
  teacher: {
    title: "Teacher / Coach",
    desc: "You love helping others level up. Online tutoring, course creation, or coaching is your path.",
    examples: ["Subject tutoring (JEE/NEET)", "Spoken English classes", "Music lessons", "Career coaching"],
    starter: "Teach one free workshop to 10 people and collect testimonials.",
  },
  builder: {
    title: "Builder / Maker",
    desc: "You ship things. Build tools, products, or micro-SaaS. Your superpower is execution.",
    examples: ["Small productivity tool", "Notion templates", "Chrome extension", "No-code MVP"],
    starter: "Ship one tiny thing this week. Imperfect is better than invisible.",
  },
};

export function PortfolioCareerQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ creator: 0, freelancer: 0, teacher: 0, builder: 0 });
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (option: (typeof questions)[0]["options"][0]) => {
    const newScores = { ...scores };
    for (const [key, val] of Object.entries(option.scores)) {
      newScores[key] += val;
    }
    setScores(newScores);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    }
  };

  const reset = () => {
    setStep(0);
    setScores({ creator: 0, freelancer: 0, teacher: 0, builder: 0 });
    setResult(null);
  };

  if (result) {
    const r = results[result as keyof typeof results];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
      >
        <h3 className="font-headline text-lg uppercase tracking-tight mb-1">Your Side Hustle Match</h3>
        <p className="font-headline text-2xl text-primary-container uppercase mb-3">{r.title}</p>
        <p className="font-body text-body-md text-on-surface-variant mb-4">{r.desc}</p>
        <div className="mb-4">
          <p className="font-mono text-[10px] uppercase text-on-surface-variant mb-2">Ideas to try:</p>
          <ul className="space-y-1">
            {r.examples.map((ex, i) => (
              <li key={i} className="font-body text-body-sm flex items-center gap-2 before:content-['→'] before:text-primary-container">
                {ex}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-primary-container/10 border-2 border-on-surface/20 p-3 mb-4" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
          <p className="font-mono text-[10px] uppercase">First step</p>
          <p className="font-body text-body-sm">{r.starter}</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 font-mono text-xs uppercase text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Retake quiz
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-sm uppercase tracking-tight">Find Your Side Hustle</h3>
        <span className="font-mono text-[10px] uppercase text-on-surface-variant">
          {step + 1} / {questions.length}
        </span>
      </div>
      <div className="w-full h-1 bg-on-surface/10 mb-6">
        <div
          className="h-full bg-primary-container transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="font-headline text-lg uppercase tracking-tight mb-4"
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
            <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-colors" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
