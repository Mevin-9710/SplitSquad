"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Sparkles } from "lucide-react";

const days = [
  {
    day: 1,
    title: "Text someone you miss",
    desc: "Pick one person you haven't talked to in a while. Send a simple message: 'Hey, was just thinking about you. How've you been?' No agenda. No ask.",
  },
  {
    day: 2,
    title: "Replace a scroll with a call",
    desc: "Instead of 30 minutes of Instagram browsing, call one friend. Even 5 minutes of real conversation beats an hour of passive scrolling.",
  },
  {
    day: 3,
    title: "Share something real",
    desc: "Tell someone about something that's actually bothering you. Vulnerability is how shallow friendships become deep ones.",
  },
  {
    day: 4,
    title: "Do a group activity",
    desc: "Suggest a shared experience — a meal, a walk, a movie night. Shared experiences build bonds that texts never can.",
  },
  {
    day: 5,
    title: "Introduce two friends",
    desc: "Connect two people from different parts of your life who'd get along. Being a connector strengthens your whole network.",
  },
  {
    day: 6,
    title: "Listen without fixing",
    desc: "When someone shares something, just listen. Don't offer solutions. Don't relate it back to you. Just be present.",
  },
  {
    day: 7,
    title: "Plan the next thing",
    desc: "Lock in a recurring plan with your closest people — weekly dinner, monthly trip, whatever. Consistency > intensity.",
  },
];

export function ReconnectChallenge() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [currentDay, setCurrentDay] = useState(1);

  const toggleDay = (day: number) => {
    const next = new Set(completed);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setCompleted(next);
    if (day < 7) setCurrentDay(day + 1);
  };

  const progress = Math.round((completed.size / 7) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">7-Day Reconnect Challenge</h3>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-on-surface/10">
          <div className="h-full bg-primary-container transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-xs tabular-nums">{completed.size}/7</span>
      </div>

      <div className="space-y-2 mb-6">
        <AnimatePresence>
          {days.map((d) => (
            <motion.div
              key={d.day}
              initial={false}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`border-2 transition-all ${
                currentDay === d.day && !completed.has(d.day)
                  ? "border-on-surface shadow-brutalist-sm"
                  : completed.has(d.day)
                  ? "border-green-500/30 bg-green-50"
                  : "border-on-surface/20"
              }`}
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              <button
                onClick={() => toggleDay(d.day)}
                className="w-full flex items-start gap-3 p-3 text-left"
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center border-2 flex-shrink-0 mt-0.5 ${
                    completed.has(d.day)
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-on-surface"
                  }`}
                  style={{ borderWidth: 2, borderColor: completed.has(d.day) ? undefined : "#1a1c1c" }}
                >
                  {completed.has(d.day) ? <Check className="w-3 h-3" /> : <span className="font-mono text-[10px]">{d.day}</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`font-headline text-xs uppercase ${completed.has(d.day) ? "line-through text-green-700" : ""}`}>
                    {d.title}
                  </span>
                  {currentDay === d.day && !completed.has(d.day) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="font-body text-body-sm text-on-surface-variant mt-1"
                    >
                      {d.desc}
                    </motion.p>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 text-on-surface-variant transition-transform ${
                  currentDay === d.day ? "rotate-90" : ""
                }`} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary-container/10 border-2 border-on-surface/20 p-4 text-center"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        >
          <p className="font-headline text-lg uppercase tracking-tight mb-1">You did it!</p>
          <p className="font-body text-body-sm text-on-surface-variant">
            Small consistent actions rebuild connection. Keep going — your people need you.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
