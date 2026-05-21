"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { SectionHeading } from "@/components/SectionHeading";
import { Timeline } from "@/components/Timeline";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight, Quote, Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Simplicity",
    desc: "Complex payment coordination should feel easy.",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Transparency",
    desc: "Everyone deserves clear visibility into shared expenses.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Community",
    desc: "Built for squads, roommates, travelers, teams, and friends.",
  },
];

const audiences = [
  "Friend groups",
  "College students",
  "Roommates",
  "Travel groups",
  "Event organizers",
  "Clubs & communities",
  "Small teams",
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4 px-3 py-1.5 border-2 border-on-surface/20">
              About SplitSquad
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1} direction="up">
            <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-tight mb-4">
              Built for groups.<br/>Designed for <span className="text-primary-container">real life</span>.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2} direction="up">
            <p className="font-body text-body-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
              SplitSquad makes splitting expenses, tracking payments, and settling up effortless — without awkward reminders, messy screenshots, or confusing spreadsheets.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Join the Free Beta
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="Our Story"
            title="Group payments are still unnecessarily messy."
            subtitle="SplitSquad started with a simple frustration."
            align="left"
          />
          <div className="space-y-6 font-body text-body-lg text-on-surface-variant leading-relaxed">
            <ScrollReveal direction="up" delay={0.1}>
              <p>
                Whether it's trips, dinners, rent, events, or shared subscriptions, people constantly switch between chats, payment apps, screenshots, and notes just to figure out who owes what.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.15}>
              <p>
                So SplitSquad was built to change that.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <p>
                Created by <strong className="text-on-surface">Mevin Joseph Seby</strong>, SplitSquad is designed to make shared payments feel fast, transparent, and stress-free — with modern workflows built around how people actually coordinate money today.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.25}>
              <p>
                The goal was simple: remove friction from group expenses and make settling up effortless for everyone involved.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What is SplitSquad */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SectionHeading
            label="What is SplitSquad"
            title="A modern expense-sharing platform."
            align="left"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Split expenses instantly",
              "Track payments clearly",
              "Verify transactions easily",
              "Share payment links",
              "Manage participants",
              "Reduce confusion in group spending",
              "Coordinate without everyone needing accounts",
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.05}>
                <div className="flex items-center gap-3 p-4 bg-surface-container-lowest border-2 border-on-surface shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-container border border-on-surface flex items-center justify-center font-mono text-xs">{i + 1}</span>
                  <span className="font-body text-body-md text-on-surface">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="font-body text-body-lg text-on-surface-variant mt-8">
              Built with a social-first approach, SplitSquad focuses on <strong className="text-on-surface">speed, clarity, and simplicity</strong>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Why SplitSquad */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading label="Why SplitSquad" title="Built different. Built better." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Fast by Design", desc: "No complicated setup. Create splits and track payments in seconds." },
              { title: "Transparent", desc: "Everyone sees the same information, reducing misunderstandings and awkward follow-ups." },
              { title: "Built for Modern Groups", desc: "Designed around how people actually communicate today — chats, links, and shared groups." },
              { title: "Mobile-First Experience", desc: "Clean, responsive interfaces optimized for both web and mobile users." },
              { title: "Beta & Community Driven", desc: "SplitSquad is currently in beta, and user feedback actively shapes the platform's future." },
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08}>
                <div className="p-6 border-2 border-on-surface bg-surface-container-lowest shadow-brutalist-sm hover:shadow-brutalist transition-shadow" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="font-body text-body-md text-on-surface-variant">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission + Vision + Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <ScrollReveal direction="up">
              <div className="p-6 border-3 border-on-surface bg-primary-container/5 shadow-brutalist text-center" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">Mission</h3>
                <p className="font-headline text-headline-md uppercase tracking-tight">To make shared payments effortless, transparent, and stress-free for groups everywhere.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="p-6 border-3 border-on-surface bg-primary-container/5 shadow-brutalist text-center" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">Vision</h3>
                <p className="font-headline text-headline-md uppercase tracking-tight">To become the default social payment coordination platform for groups worldwide.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="p-6 border-3 border-on-surface bg-primary-container/5 shadow-brutalist text-center" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">Built For</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {audiences.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-surface-container border border-on-surface font-mono text-xs uppercase">{a}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Values */}
          <SectionHeading label="Core Values" title="What we stand for." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="text-center p-6 border-2 border-on-surface bg-surface-container-lowest shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary-container/20 border-2 border-primary-container flex items-center justify-center">{v.icon}</div>
                  <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">{v.title}</h3>
                  <p className="font-body text-body-md text-on-surface-variant">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <Quote className="w-12 h-12 mx-auto mb-6 text-primary-container" />
            <blockquote className="font-headline text-headline-md md:text-3xl uppercase tracking-tight leading-tight mb-6">
              I wanted to create something that removes the awkwardness and friction around splitting expenses with friends and groups. SplitSquad is built to make that experience feel simple, modern, and effortless.
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-primary-container border-2 border-on-surface flex items-center justify-center font-headline text-lg font-bold">
                M
              </div>
              <div className="text-left">
                <p className="font-headline text-lg uppercase tracking-tight">Mevin Joseph Seby</p>
                <p className="font-mono text-xs uppercase text-on-surface-variant">Founder & Creator</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Shared expenses,<br/>finally <span className="text-primary-container">simplified</span>.
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Spend less time tracking payments and more time enjoying experiences together.
            </p>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Start Using SplitSquad Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
