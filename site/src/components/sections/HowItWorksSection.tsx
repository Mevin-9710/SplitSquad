"use client";

import { StepCard } from "@/components/StepCard";
import { SectionHeading } from "@/components/SectionHeading";
import { PlusCircle, Send, CheckCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Create a Split",
    description: "Add the bill amount, description, and who's involved. Split equally or set custom amounts for each person.",
    icon: <PlusCircle className="w-6 h-6" />,
  },
  {
    number: 2,
    title: "Share Payment Links",
    description: "Everyone gets a WhatsApp message with their amount and a unique payment verification link. No app install needed.",
    icon: <Send className="w-6 h-6" />,
  },
  {
    number: 3,
    title: "Verify & Settle",
    description: "Participants verify their payment via the link. Balances update in real-time. No more 'I already paid' chaos.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 relative bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <SectionHeading
          label="How It Works"
          title="Three steps. Zero chaos."
          subtitle="From bill to settled in under a minute. Here's how SplitSquad handles the heavy lifting."
        />

        <div className="grid gap-8 md:gap-12">
          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              delay={i * 0.15}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
