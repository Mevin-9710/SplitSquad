"use client";

import { FeatureDetail } from "@/components/FeatureDetail";
import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight, Split, Smartphone, ShieldCheck, MessageCircle, BarChart3, Download, Users, Clock } from "lucide-react";
import { ReactNode } from "react";

function MockCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-lowest border-3 border-on-surface shadow-brutalist p-6 ${className}`} style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      {children}
    </div>
  );
}

function MockSplitRow({ name, amount, color }: { name: string; amount: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b-2 border-on-surface/10 last:border-b-0">
      <span className="font-body text-sm text-on-surface">{name}</span>
      <span className="font-mono text-sm uppercase" style={{ color: color || "#1a1c1c" }}>{amount}</span>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <SectionHeading
            label="Features"
            title="Everything your squad needs."
            subtitle="Built for the way Indians actually split bills. No fluff, just what works."
          />
          <ScrollReveal delay={0.3}>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Start Splitting
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* 1. Smart Splits */}
          <FeatureDetail
            icon={<Split className="w-6 h-6 text-on-surface" />}
            title="Smart Splits"
            description="Split any bill the way your squad wants. Equal splits, exact amounts, or custom percentages — it's all there."
            details={[
              "Equal split: Divide evenly among all participants",
              "Exact amounts: Set how much each person pays",
              "Custom percentages: Split by %, like rent by room size",
              "Auto-calculate totals and per-person amounts instantly",
              "Support for multiple currencies and formats",
            ]}
            sideContent={
              <MockCard>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-headline text-sm uppercase tracking-tight">Dinner at The Pizza Place</span>
                  <span className="font-mono text-lg uppercase font-bold">₹2,400</span>
                </div>
                <MockSplitRow name="You" amount="₹600" color="#785a00" />
                <MockSplitRow name="Priya" amount="₹600" />
                <MockSplitRow name="Rahul" amount="₹600" />
                <MockSplitRow name="Ananya" amount="₹600" />
                <div className="mt-3 pt-3 border-t-3 border-on-surface flex justify-between">
                  <span className="font-mono text-xs uppercase">Each pays</span>
                  <span className="font-mono text-sm uppercase font-bold">₹600</span>
                </div>
              </MockCard>
            }
          />

          {/* 2. UPI-First Flow */}
          <FeatureDetail
            icon={<Smartphone className="w-6 h-6 text-on-surface" />}
            title="UPI-First Flow"
            description="Scan UPI QR codes, auto-detect payment details, and create splits in seconds. Built for India's payment ecosystem."
            details={[
              "Scan any UPI QR code to start a split",
              "Auto-detect UPI ID and merchant name",
              "Parse transaction amounts from the QR",
              "Works with PhonePe, GPay, Paytm, and all UPI apps",
              "No manual typing of payment details",
            ]}
            reversed
            sideContent={
              <MockCard className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface-container border-2 border-on-surface flex items-center justify-center mb-4">
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array(25).fill(0).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-on-surface/30" />
                    ))}
                  </div>
                </div>
                <span className="font-mono text-xs uppercase mb-1">QR Code Detected</span>
                  <span className="font-headline text-sm uppercase tracking-tight text-primary">UPay Merchant</span>
                <span className="font-mono text-lg uppercase font-bold mt-1">₹450</span>
                <div className="mt-3 w-full pt-3 border-t-2 border-on-surface/20 grid grid-cols-2 gap-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant">UPI ID</span>
                  <span className="font-mono text-[10px] uppercase">merchant@upi</span>
                </div>
              </MockCard>
            }
          />

          {/* 3. Payment Verification */}
          <FeatureDetail
            icon={<ShieldCheck className="w-6 h-6 text-on-surface" />}
            title="Payment Verification"
            description="Public verification links with single-use codes. No more fake screenshots or 'I already paid' claims."
            details={[
              "Each participant gets a unique verification link",
              "Links are single-use — once verified, they expire",
              "Public pages — no account needed to verify",
              "Real-time status: Paid, Pending, or Overdue",
              "Audit trail of who paid and when",
            ]}
            sideContent={
              <MockCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 bg-whatsapp" />
                  <span className="font-mono text-xs uppercase">Payment Verification</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary-container border-3 border-on-surface">
                    <span className="font-mono text-xs uppercase">You</span>
                    <span className="font-mono text-xs uppercase text-whatsapp font-bold">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container border-2 border-on-surface">
                    <span className="font-mono text-xs uppercase">Priya</span>
                    <span className="font-mono text-xs uppercase text-on-surface-variant">Pending</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container border-2 border-on-surface">
                    <span className="font-mono text-xs uppercase">Rahul</span>
                    <span className="font-mono text-xs uppercase text-on-surface-variant">Pending</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container border-2 border-on-surface">
                    <span className="font-mono text-xs uppercase">Ananya</span>
                    <span className="font-mono text-xs lowercase text-whatsapp font-bold">✓ Verified</span>
                  </div>
                </div>
              </MockCard>
            }
          />

          {/* 4. WhatsApp Reminders */}
          <FeatureDetail
            icon={<MessageCircle className="w-6 h-6 text-on-surface" />}
            title="WhatsApp Reminders"
            description="Automated nudges sent via WhatsApp. No one needs to install anything — it just works."
            details={[
              "Automatic WhatsApp messages when a split is created",
              "Each participant gets their personalized payment link",
              "Follow-up reminders for pending payments",
              "Works without any app installation",
              "Messages work with any phone number",
            ]}
            reversed
            sideContent={
              <MockCard className="bg-whatsappLight/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-whatsapp border-2 border-on-surface flex items-center justify-center rounded-none">
                    <span className="text-white font-headline text-xs">W</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase block">SplitSquad Bot</span>
                    <span className="font-mono text-[10px] uppercase text-on-surface-variant">Just now</span>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-lowest border-2 border-on-surface">
                  <p className="font-body text-sm text-on-surface mb-2">
                    Hey! You owe <strong>₹600</strong> for "Dinner at The Pizza Place"
                  </p>
                  <div className="inline-block bg-primary-container border-2 border-on-surface px-4 py-2 font-mono text-xs uppercase font-bold shadow-brutalist-sm">
                    Verify Payment
                  </div>
                  <p className="font-mono text-[10px] uppercase text-on-surface-variant mt-2">
                    Tap to verify via SplitSquad
                  </p>
                </div>
              </MockCard>
            }
          />

          {/* 5. Real-Time Balances */}
          <FeatureDetail
            icon={<BarChart3 className="w-6 h-6 text-on-surface" />}
            title="Real-Time Balances"
            description="See who owes what, who's settled, and the full payment history. Always up to date."
            details={[
              "Live dashboard showing all active splits",
              "Per-person balance summaries",
              "Payment history with timestamps",
              "Settlement status at a glance",
              "Exportable reports for shared expenses",
            ]}
            sideContent={
              <MockCard>
                <span className="font-headline text-sm uppercase tracking-tight mb-4 block">Trip to Goa</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm">Total Spent</span>
                    <span className="font-mono text-sm font-bold">₹24,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm">Settled</span>
                    <span className="font-mono text-sm text-whatsapp font-bold">₹18,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm">Pending</span>
                    <span className="font-mono text-sm text-error font-bold">₹6,000</span>
                  </div>
                  <div className="mt-3 pt-3 border-t-2 border-on-surface/20">
                    <div className="flex justify-between items-center py-1">
                      <span className="font-body text-sm">You</span>
                      <span className="font-mono text-xs text-whatsapp">✓ Settled</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-body text-sm">Priya</span>
                      <span className="font-mono text-xs text-whatsapp">✓ Settled</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-body text-sm">Rahul</span>
                      <span className="font-mono text-xs text-error">₹3,000</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-body text-sm">Ananya</span>
                      <span className="font-mono text-xs text-error">₹3,000</span>
                    </div>
                  </div>
                </div>
              </MockCard>
            }
          />

          {/* 6. PWA Installable */}
          <FeatureDetail
            icon={<Download className="w-6 h-6 text-on-surface" />}
            title="PWA Installable"
            description="Add to your home screen, works offline, feels native. No app store needed."
            details={[
              "Install directly from your browser — no Play Store",
              "Works offline — access your splits without internet",
              "Native-feeling experience with full-screen mode",
              "Automatic updates when you're online",
              "Lightweight — under 1MB total",
            ]}
            reversed
            sideContent={
              <MockCard className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary-container border-3 border-on-surface flex items-center justify-center shadow-brutalist-sm" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                  <span className="font-headline text-2xl font-bold">S</span>
                </div>
                <span className="font-headline text-lg uppercase tracking-tight block">SplitSquad</span>
                <span className="font-mono text-xs text-on-surface-variant block mb-4">splitsquad.qzz.io</span>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container border-2 border-on-surface shadow-brutalist-sm font-mono text-xs uppercase font-bold">
                  <Download className="w-4 h-4" />
                  Add to Home Screen
                </div>
                <div className="mt-3 flex justify-center gap-1">
                  <span className="w-2 h-2 bg-whatsapp" />
                  <span className="w-2 h-2 bg-primary-container" />
                  <span className="w-2 h-2 bg-on-surface" />
                </div>
              </MockCard>
            }
          />

          {/* 7. Squad Management */}
          <FeatureDetail
            icon={<Users className="w-6 h-6 text-on-surface" />}
            title="Squad Management"
            description="Save your contacts, organize by groups, and split with your favorite people instantly."
            details={[
              "Save frequently split contacts",
              "Organize into groups: Roommates, Travel, Events",
              "Quick-select participants when creating splits",
              "Import contacts from your phone",
              "See split history per contact",
            ]}
            sideContent={
              <MockCard>
                <span className="font-headline text-sm uppercase tracking-tight mb-4 block">Your Squad</span>
                <div className="space-y-2">
                  {[
                    { name: "Priya Sharma", group: "Roommates" },
                    { name: "Rahul Kapoor", group: "Travel" },
                    { name: "Ananya Patel", group: "Roommates" },
                    { name: "Vikram Singh", group: "Events" },
                    { name: "Neha Gupta", group: "Travel" },
                  ].map((person, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 bg-surface-container border border-on-surface">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-container border-2 border-on-surface flex items-center justify-center font-mono text-xs uppercase">
                          {person.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-body text-sm">{person.name}</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-on-surface-variant border border-on-surface/30 px-1.5 py-0.5">{person.group}</span>
                    </div>
                  ))}
                </div>
              </MockCard>
            }
          />

          {/* 8. Split History */}
          <FeatureDetail
            icon={<Clock className="w-6 h-6 text-on-surface" />}
            title="Split History"
            description="Never lose track of past splits. Full history with search, filter, and export."
            details={[
              "Complete history of all your splits",
              "Search by description, amount, or participant",
              "Filter by date range, status, or group",
              "View details of any past split",
              "Export data for your records",
            ]}
            reversed
            sideContent={
              <MockCard>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-headline text-sm uppercase tracking-tight">Recent Splits</span>
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant">View all →</span>
                </div>
                <div className="space-y-2">
                  {[
                    { desc: "Dinner at The Pizza Place", amount: "₹2,400", date: "Today" },
                    { desc: "Trip to Goa - Fuel", amount: "₹6,000", date: "Yesterday" },
                    { desc: "Monthly Rent", amount: "₹45,000", date: "3 days ago" },
                    { desc: "Movie Night", amount: "₹1,200", date: "1 week ago" },
                    { desc: "Groceries", amount: "₹3,600", date: "2 weeks ago" },
                  ].map((split, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b-2 border-on-surface/10 last:border-b-0">
                      <div>
                        <span className="font-body text-sm block">{split.desc}</span>
                        <span className="font-mono text-[10px] uppercase text-on-surface-variant">{split.date}</span>
                      </div>
                      <span className="font-mono text-sm font-bold">{split.amount}</span>
                    </div>
                  ))}
                </div>
              </MockCard>
            }
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Ready to try all features?
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Start splitting with your squad in under 30 seconds. No signup walls, no credit card.
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
