"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { SectionHeading } from "@/components/SectionHeading";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQ } from "@/components/FAQ";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight, Check, X } from "lucide-react";

const comparisonRows = [
  { feature: "UPI-first payments", ours: true, theirs: false },
  { feature: "Indian payment behavior focus", ours: true, theirs: false },
  { feature: "Payment verification links", ours: true, theirs: false },
  { feature: "WhatsApp integration", ours: true, theirs: false },
  { feature: "Public verification pages", ours: true, theirs: false },
  { feature: "No account needed for participants", ours: true, theirs: false },
  { feature: "PWA installable", ours: true, theirs: false },
  { feature: "Free during beta", ours: true, theirs: false },
  { feature: "Expense splitting", ours: true, theirs: true },
  { feature: "Group bills management", ours: true, theirs: true },
  { feature: "Mobile app", ours: "PWA (no install)", theirs: "Native app" },
  { feature: "Payment processing", ours: "Verification only", theirs: "Not included" },
  { feature: "Indian audience", ours: true, theirs: "Via localization only" },
  { feature: "Real-time balance tracking", ours: true, theirs: true },
];

const faqItems = [
  {
    question: "What makes SplitSquad different from Splitwise?",
    answer: "SplitSquad is built specifically for the Indian market with UPI-first workflows. Unlike Splitwise, SplitSquad includes payment verification links that let participants confirm their payments without anyone needing an account. Plus, WhatsApp integration means everyone gets notified without installing another app.",
  },
  {
    question: "Can I import my Splitwise data?",
    answer: "Not yet, but we're working on it! For now, you can easily recreate your active splits in SplitSquad. The beta period is the perfect time to try it out.",
  },
  {
    question: "Does everyone need to create an account?",
    answer: "No! Only you need an account to create and manage splits. Participants receive WhatsApp messages with payment links — they just click to verify. No signup needed.",
  },
  {
    question: "Is SplitSquad free?",
    answer: "Yes! SplitSquad is completely free during the beta period. No credit card required, no hidden costs.",
  },
  {
    question: "Does SplitSquad work with UPI apps?",
    answer: "Absolutely. SplitSquad is built around UPI. You can scan UPI QR codes to start splits, and payment verification works with all UPI apps including GPay, PhonePe, and Paytm.",
  },
];

export default function SplitwiseAlternativePage() {
  return (
    <div>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <span className="inline-block font-headline text-sm uppercase tracking-tight text-primary mb-4 px-3 py-1.5 bg-primary-container/10 border-2 border-primary/30">
              Splitwise Alternative
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-tight mb-4">
              The Splitwise Alternative<br/>Built for <span className="text-primary">India</span>.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-body text-body-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
              SplitSquad is the modern alternative to Splitwise — built specifically for how Indians handle group payments. UPI-first, WhatsApp-native, with real payment verification. No more fake screenshots.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Try SplitSquad Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="Why Switch"
            title="Splitwise is great. But it wasn't built for UPI."
            subtitle="SplitSquad fills the gaps that Splitwise leaves open for Indian users."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "UPI Payments",
                desc: "Splitwise tracks debts. SplitSquad helps you actually settle them with UPI payment verification.",
              },
              {
                title: "WhatsApp Native",
                desc: "No more email notifications. SplitSquad sends payment reminders via WhatsApp — where Indians actually chat.",
              },
              {
                title: "No App Needed",
                desc: "Participants don't need to install anything. They just click a WhatsApp link to verify payments.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="p-6 border-2 border-on-surface bg-surface-container-lowest shadow-brutalist-sm h-full" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="font-body text-body-md text-on-surface-variant">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ComparisonTable
            title="SplitSquad vs Splitwise"
            subtitle="A side-by-side comparison of features that matter for Indian users."
            rows={comparisonRows}
            ourLabel="SplitSquad"
            theirLabel="Splitwise"
          />
        </div>
      </section>

      {/* Why SplitSquad Wins */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="Built for Indian Groups"
            title="Why users are switching."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Payment Verification",
                desc: "The biggest pain point Splitwise doesn't solve — verifying that someone actually paid. SplitSquad's verification links eliminate the 'I already paid' debate forever.",
              },
              {
                title: "WhatsApp Integration",
                desc: "Splitwise notifies via email. SplitSquad reaches your group where they actually are — WhatsApp. Higher engagement, faster settlements.",
              },
              {
                title: "No Signup for Friends",
                desc: "Everyone needs a Splitwise account to participate. With SplitSquad, only you need an account. Your friends just click a link.",
              },
              {
                title: "UPI-Native Design",
                desc: "Splitwise was built for credit cards and bank transfers. SplitSquad was built from the ground up for UPI — India's preferred payment method.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08}>
                <div className="p-6 border-3 border-on-surface bg-surface-container-lowest shadow-brutalist" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                  <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="font-body text-body-md text-on-surface-variant">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="FAQ"
            title="Common questions about switching."
          />
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Ready to try the better way?
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Join users who've switched from Splitwise to SplitSquad. Free during beta.
            </p>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Switch to SplitSquad Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
