"use client";

import { PricingCard } from "@/components/PricingCard";
import { FAQ } from "@/components/FAQ";
import { SectionHeading } from "@/components/SectionHeading";
import { BrutalistButton } from "@/components/BrutalistButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BetaBadge } from "@/components/BetaBadge";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight } from "lucide-react";

const earlyBirdPerks = [
  "Full access to all features during beta",
  "Unlimited splits and participants",
  "Unlimited payment verification links",
  "WhatsApp reminders and notifications",
  "Real-time balance tracking",
  "Squad contact management",
  "Priority early access to new features",
  "Direct influence on product roadmap",
  "No credit card required",
  "No time limit during beta period",
];

const faqItems = [
  {
    question: "Is SplitSquad really free during beta?",
    answer: "Yes! SplitSquad is completely free during the beta period. No credit card required, no hidden costs, no time limits. We want you to experience everything we're building.",
  },
  {
    question: "How long will the beta last?",
    answer: "The beta period will last several weeks as we continue to add features and refine the platform. You'll get plenty of advance notice before any pricing changes.",
  },
  {
    question: "What happens after the beta ends?",
    answer: "Early Bird members will get priority exclusive access and discounts on any future plans. Your splits and data will be preserved.",
  },
  {
    question: "Do I need to install anything?",
    answer: "No! SplitSquad works entirely in your browser. You can also install it as a PWA on your phone for a native-like experience.",
  },
  {
    question: "Can I invite my friends?",
    answer: "Absolutely! Your friends don't need to create accounts to receive payment links via WhatsApp. They just need to click the link to verify payments.",
  },
];

export default function PricingPage() {
  return (
    <div>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <BetaBadge className="mb-6" />
          </ScrollReveal>
          <SectionHeading
            title="Free while we build."
            subtitle="SplitSquad is currently in beta, which means you get full access to everything — for free. No tricks, no time limits."
          />
          <ScrollReveal delay={0.3}>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Get Started Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-lg mx-auto px-4 md:px-8">
          <PricingCard
            title="Early Bird"
            price="Free"
            description="Full access during beta. No credit card needed."
            perks={earlyBirdPerks}
            cta="Join the Beta"
            href="/app"
            highlighted
            badge="Current Plan"
          />
        </div>
      </section>

      <section className="py-16 md:py-24 border-y-3 border-on-surface bg-surface-container-lowest" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="FAQ"
            title="Got questions?"
            subtitle="Everything you need to know about SplitSquad's beta pricing."
          />
          <FAQ items={faqItems} />
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Ready to simplify group payments?
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Join thousands of users who are already splitting smarter.
            </p>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Start Splitting Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
