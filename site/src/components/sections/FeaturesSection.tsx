"use client";

import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Split,
  Smartphone,
  ShieldCheck,
  MessageCircle,
  BarChart3,
  Download,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: <Split className="w-6 h-6 text-on-surface" />,
    title: "Smart Splits",
    description: "Exact amounts, equal splits, or custom percentages. Split any bill the way your squad wants.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-on-surface" />,
    title: "UPI-First Flow",
    description: "Scan UPI QR codes, auto-detect payment details, and create splits in seconds. Built for India.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-on-surface" />,
    title: "Payment Verification",
    description: "Public verification links with single-use codes. No more fake screenshots or 'I already paid' claims.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-on-surface" />,
    title: "WhatsApp Reminders",
    description: "Automated nudges sent via WhatsApp. No one needs to install anything — it just works.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-on-surface" />,
    title: "Real-Time Balances",
    description: "See who owes what, who's settled, and the full payment history. Always up to date.",
  },
  {
    icon: <Download className="w-6 h-6 text-on-surface" />,
    title: "PWA Installable",
    description: "Add to your home screen, works offline, feels native. No app store needed.",
  },
  {
    icon: <Users className="w-6 h-6 text-on-surface" />,
    title: "Squad Management",
    description: "Save your contacts, organize by groups, and split with your favorite people instantly.",
  },
  {
    icon: <Clock className="w-6 h-6 text-on-surface" />,
    title: "Split History",
    description: "Never lose track of past splits. Full history with search, filter, and export.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          label="Features"
          title="Everything your squad needs."
          subtitle="Built for the way Indians actually split bills. No fluff, just what works."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
