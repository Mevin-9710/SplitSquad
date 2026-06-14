"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Brain } from "lucide-react";

const skillCategories = [
  {
    name: "AI & Tech",
    skills: [
      { name: "AI/ML basics", description: "Using ChatGPT, Claude, Gemini for work" },
      { name: "Prompt engineering", description: "Crafting effective AI prompts" },
      { name: "Data analysis", description: "Excel, Google Sheets, basic SQL" },
      { name: "No-code tools", description: "Webflow, Bubble, Zapier, Notion" },
      { name: "Basic coding", description: "Python or JavaScript fundamentals" },
    ],
  },
  {
    name: "Soft Skills",
    skills: [
      { name: "Written communication", description: "Clear emails, reports, documentation" },
      { name: "Presentation skills", description: "Pitching ideas, decks, public speaking" },
      { name: "Negotiation", description: "Salary, deals, conflict resolution" },
      { name: "Remote collaboration", description: "Slack, Notion, async communication" },
      { name: "Emotional intelligence", description: "Reading rooms, managing relationships" },
    ],
  },
  {
    name: "Digital & Marketing",
    skills: [
      { name: "Content creation", description: "Writing, video, social media posts" },
      { name: "SEO basics", description: "Understanding search, keywords, ranking" },
      { name: "Social media management", description: "Instagram, LinkedIn, content strategy" },
      { name: "Basic design", description: "Canva, Figma, visual communication" },
      { name: "Digital marketing", description: "Performance marketing, analytics" },
    ],
  },
];

export function SkillDemandChecker() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    const next = new Set(checked);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setChecked(next);
  };

  const totalSkills = skillCategories.reduce((s, c) => s + c.skills.length, 0);
  const score = checked.size;
  const percent = Math.round((score / totalSkills) * 100);

  const getVerdict = () => {
    if (percent >= 80) return { label: "Market Ready", color: "text-green-700" };
    if (percent >= 50) return { label: "Getting There", color: "text-primary-container" };
    return { label: "Start Building", color: "text-red-600" };
  };

  const verdict = getVerdict();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 my-8 bg-surface-container-lowest"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary-container" />
        <h3 className="font-headline text-sm uppercase tracking-tight">Skill Demand Checker</h3>
      </div>

      <p className="font-body text-body-sm text-on-surface-variant mb-4">
        Check the skills you already have or are actively learning. See how you stack up against what employers want in 2026.
      </p>

      <div className="space-y-4 mb-6">
        {skillCategories.map((cat) => (
          <div key={cat.name}>
            <h4 className="font-mono text-[10px] uppercase text-on-surface-variant mb-2">{cat.name}</h4>
            <div className="space-y-1.5">
              {cat.skills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => toggle(skill.name)}
                  className={`w-full flex items-center gap-3 p-2.5 border-2 transition-all text-left ${
                    checked.has(skill.name)
                      ? "bg-primary-container/10 border-on-surface"
                      : "border-on-surface/20 hover:border-on-surface/40"
                  }`}
                  style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
                >
                  <span className={`w-5 h-5 flex items-center justify-center border-2 border-on-surface flex-shrink-0 ${
                    checked.has(skill.name) ? "bg-primary-container" : ""
                  }`} style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                    {checked.has(skill.name) ? <Check className="w-3 h-3" /> : null}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-headline text-xs uppercase">{skill.name}</span>
                    <p className="font-body text-[11px] text-on-surface-variant truncate">{skill.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-on-surface/10 pt-4 text-center" style={{ borderTopWidth: 2 }}>
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase text-on-surface-variant">Your Score</span>
          <span className="font-headline text-2xl">{score}/{totalSkills}</span>
          <span className="font-mono text-sm">({percent}%)</span>
        </div>
        <p className={`font-headline text-lg uppercase tracking-tight ${verdict.color}`}>{verdict.label}</p>
        <p className="font-body text-body-sm text-on-surface-variant mt-2">
          {percent >= 80
            ? "You're competitive. Focus on networking and applying."
            : percent >= 50
            ? "Pick 3 missing skills and learn them this quarter."
            : "Start with one skill from each category. Consistency beats intensity."}
        </p>
      </div>
    </motion.div>
  );
}
