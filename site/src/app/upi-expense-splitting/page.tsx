"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQ } from "@/components/FAQ";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight, Smartphone, ShieldCheck, MessageCircle, ScanLine, CreditCard } from "lucide-react";

const steps = [
  {
    icon: <ScanLine className="w-6 h-6" />,
    title: "Scan a UPI QR Code",
    desc: "Use SplitSquad's built-in scanner to capture any UPI QR code — restaurant bills, rent payments, event fees, anything.",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Auto-Detect Payment Details",
    desc: "SplitSquad automatically reads the UPI ID, merchant name, and amount from the QR code. No manual typing needed.",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Split Among the Group",
    desc: "Choose who's paying and how to split — equally, by exact amounts, or custom percentages. SplitSquad calculates everything instantly.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Share via WhatsApp",
    desc: "Each participant gets a WhatsApp message with their share and a unique payment verification link. No app installation needed.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Verify & Settle",
    desc: "Participants click their link to verify payment. You get real-time confirmation. No more 'I already paid' arguments.",
  },
];

const faqItems = [
  {
    question: "Does SplitSquad process UPI payments?",
    answer: "SplitSquad currently handles payment verification, not processing. You pay your friends via your preferred UPI app (GPay, PhonePe, Paytm), then verify the payment through SplitSquad's verification links. This eliminates the 'did they really pay?' uncertainty.",
  },
  {
    question: "Can I scan any UPI QR code?",
    answer: "Yes! SplitSquad's QR scanner can read any UPI-compliant QR code. It extracts the UPI ID, merchant name, and amount automatically.",
  },
  {
    question: "Do my friends need SplitSquad to pay me?",
    answer: "No. They pay you via their regular UPI app. They only need to click the WhatsApp link to verify that they've paid. No account required.",
  },
  {
    question: "Is SplitSquad safe for tracking payments?",
    answer: "Absolutely. SplitSquad doesn't handle any money — it only facilitates payment verification. Your actual payments go through your bank's UPI system. Verification links are single-use and cryptographically secure.",
  },
  {
    question: "Can I use SplitSquad for recurring expenses?",
    answer: "Yes! SplitSquad is perfect for recurring expenses like monthly rent, shared subscriptions, or weekly grocery runs. Create a split once and reuse it.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "UPI Expense Splitting — SplitSquad",
  description: "Split UPI payments among your group in seconds. Scan a QR, split the bill, and send verification links via WhatsApp.",
  url: "https://splitsquad.qzz.io/upi-expense-splitting",
};

export default function UpiExpenseSplittingPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <span className="inline-block font-headline text-sm uppercase tracking-tight text-primary mb-4 px-3 py-1.5 bg-primary-container/10 border-2 border-primary/30">
              UPI Expense Splitting
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-tight mb-4">
              UPI Expense Splitting<br/>Made <span className="text-primary">Simple</span>.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-body text-body-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
              Split UPI payments among your group in seconds. Scan a QR, split the bill, and send verification links via WhatsApp. No spreadsheets, no confusion, no awkward follow-ups.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Start Splitting
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>

      {/* How UPI Splitting Works */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="How It Works"
            title="Split UPI payments in 5 steps."
            subtitle="From QR scan to settlement in under a minute."
          />

          <div className="grid gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="flex items-start gap-4 md:gap-6 p-4 md:p-6 bg-surface-container-lowest border-2 border-on-surface shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-primary-container border-2 border-on-surface flex items-center justify-center shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                    <div className="text-center">
                      <span className="font-headline text-sm md:text-lg font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <div className="text-primary flex-shrink-0">{step.icon}</div>
                      <h3 className="font-headline text-headline-md uppercase tracking-tight break-words">{step.title}</h3>
                    </div>
                    <p className="font-body text-body-md md:text-body-lg text-on-surface-variant">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why UPI Splitting Matters */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="Why It Matters"
            title="UPI changed how India pays."
            subtitle="Your expense splitting should change with it."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "India Runs on UPI",
                desc: "Over 10 billion UPI transactions happen every month. It's how India pays — and how your group should split payments too.",
              },
              {
                title: "No More Cash Hassles",
                desc: "No one carries cash anymore. UPI splitting eliminates the 'I don't have change' problem forever.",
              },
              {
                title: "Real-Time Confirmation",
                desc: "UPI payments are instant. SplitSquad's verification links give you real-time confirmation that everyone has paid.",
              },
              {
                title: "Works with Any UPI App",
                desc: "GPay, PhonePe, Paytm, Amazon Pay, CRED — SplitSquad works with all of them. Your group can use their preferred app.",
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

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="Use Cases"
            title="Perfect for every group expense."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Restaurant dinners",
              "Rent & utilities",
              "Trip expenses",
              "Event tickets",
              "Groceries",
              "Subscriptions",
              "Gifts & collections",
              "Petty cash",
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.05}>
                <div className="text-center p-4 border-2 border-on-surface bg-surface-container-lowest shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  <span className="font-mono text-xs uppercase">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading label="FAQ" title="Questions about UPI splitting?" />
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Start splitting UPI payments<br/>the <span className="text-primary">smart way</span>.
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Join thousands of users simplifying group expenses with SplitSquad.
            </p>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Try SplitSquad Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
