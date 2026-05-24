"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedGrid } from "@/components/AnimatedGrid";

const sections = [
  {
    title: "1. Introduction",
    content: "Welcome to SplitSquad. SplitSquad is a bill-splitting and shared expense management platform that helps users manage group expenses, split bills, scan UPI QR codes, track settlements, and organize shared payments. This Privacy Policy explains how we collect, use, store, and protect your information when you use SplitSquad. By using SplitSquad, you agree to this Privacy Policy.",
  },
  {
    title: "2. Information We Collect",
    content: null,
    subsections: [
      {
        subtitle: "a. Account Information",
        items: [
          "Name",
          "Email address",
          "Authentication details through Google Sign-In or email login",
        ],
      },
      {
        subtitle: "b. Payment & UPI Information",
        intro: "We may collect:",
        items: [
          "UPI IDs",
          "Payment-related metadata",
          "Transaction references entered by users",
        ],
        note: "We do not collect or store UPI PINs, bank account passwords, debit/credit card numbers, or banking credentials.",
      },
      {
        subtitle: "c. Contacts Information",
        intro: "If you grant permission, SplitSquad may access and store:",
        items: [
          "Contact names",
          "Phone numbers",
          "Contact details used for expense sharing and group management",
        ],
        note: "This information may be stored securely to improve user experience across sessions and devices.",
      },
      {
        subtitle: "d. Camera Access",
        intro: "SplitSquad may request camera access solely for:",
        items: [
          "Scanning UPI QR codes",
          "Processing payment-related QR data",
        ],
        note: "We do not use your camera for background recording or unrelated purposes.",
      },
      {
        subtitle: "e. Usage & Analytics Data",
        intro: "We may automatically collect:",
        items: [
          "Device information",
          "Browser type",
          "IP address",
          "App usage activity",
          "Cookies and session data",
        ],
        note: "We currently use Google Analytics (GA4), Google Tag Manager (GTM), cookies, and similar technologies.",
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: null,
    items: [
      "Provide and operate SplitSquad",
      "Enable bill splitting and shared expense tracking",
      "Improve product functionality",
      "Maintain login sessions",
      "Detect abuse, fraud, or misuse",
      "Analyze usage trends",
      "Develop future features including community and monetization systems",
      "Communicate important updates",
    ],
  },
  {
    title: "4. Community Features",
    content: "SplitSquad may introduce public community or discussion features in the future. Any information voluntarily posted publicly may be visible to other users. Users are responsible for the content they share publicly.",
  },
  {
    title: "5. Data Storage & Security",
    content: "We take reasonable technical and organizational measures to protect user information. Some user data may be stored in databases including SQLite-based systems and future infrastructure providers as the platform scales. However, no system is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "6. Cookies & Tracking Technologies",
    content: "SplitSquad uses cookies and related technologies to maintain sessions, improve functionality, analyze traffic and usage, and measure product performance. Users may disable cookies through browser settings, though some features may not function properly.",
  },
  {
    title: "7. Third-Party Services",
    content: "We may use third-party services for authentication, analytics, hosting, infrastructure, error monitoring, payments, and future AI or automation features. These providers may process data in accordance with their own privacy policies.",
  },
  {
    title: "8. Data Retention",
    content: "We retain information as long as necessary to provide services, to comply with legal obligations, to resolve disputes, and to enforce agreements. We may retain backups or archived records for operational and legal reasons.",
  },
  {
    title: "9. User Rights",
    content: null,
    items: [
      "Access to their data",
      "Correction of inaccurate data",
      "Account deletion",
      "Removal of certain stored information",
    ],
    contact: "Requests may be sent to mevinbuilds@gmail.com.",
  },
  {
    title: "10. Children's Privacy",
    content: "SplitSquad is not specifically directed toward children. Users should use the platform only where permitted under applicable law and with appropriate supervision if required.",
  },
  {
    title: "11. International Users",
    content: "Your information may be processed and stored in jurisdictions outside your location depending on infrastructure and service providers. By using SplitSquad, you consent to such transfers where legally permitted.",
  },
  {
    title: "12. Changes to This Privacy Policy",
    content: "We may update this Privacy Policy at any time. Updated versions will be posted on SplitSquad with a revised effective date. Continued use of the service constitutes acceptance of updated terms.",
  },
  {
    title: "13. Contact",
    content: null,
    contactBlock: {
      name: "Mevin Joesph Seby",
      email: "mevinbuilds@gmail.com",
    },
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <span className="inline-block font-headline text-sm uppercase tracking-tight text-primary mb-4 px-3 py-1.5 bg-primary-container/10 border-2 border-primary/30">
              Privacy Policy
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-tight mb-4">
              Your <span className="text-primary">privacy</span> matters.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-body text-body-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
              Effective Date: May 24, 2026
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-10">
          {sections.map((section, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.04}>
              <div>
                <h2 className="font-headline text-headline-md uppercase tracking-tight mb-3">{section.title}</h2>

                {section.content && (
                  <p className="font-body text-body-md text-on-surface-variant leading-relaxed">{section.content}</p>
                )}

                {section.items && (
                  <ul className="space-y-1.5 mt-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="font-body text-body-md text-on-surface-variant flex items-start gap-2">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary-container mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.contact && (
                  <p className="font-body text-body-md text-on-surface-variant mt-2">
                    Requests may be sent to{" "}
                    <a href="mailto:mevinbuilds@gmail.com" className="text-primary hover:underline">mevinbuilds@gmail.com</a>.
                  </p>
                )}

                {section.contactBlock && (
                  <div className="mt-2 font-body text-body-md text-on-surface-variant">
                    <p>{section.contactBlock.name}</p>
                    <p>Email: <a href="mailto:mevinbuilds@gmail.com" className="text-primary hover:underline">{section.contactBlock.email}</a></p>
                  </div>
                )}

                {section.subsections && section.subsections.map((sub, j) => (
                  <div key={j} className="mt-4 ml-4">
                    <h3 className="font-headline text-base uppercase tracking-tight mb-2">{sub.subtitle}</h3>
                    {sub.intro && <p className="font-body text-body-md text-on-surface-variant mb-2">{sub.intro}</p>}
                    {sub.items && (
                      <ul className="space-y-1.5">
                        {sub.items.map((item, k) => (
                          <li key={k} className="font-body text-body-md text-on-surface-variant flex items-start gap-2">
                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary-container mt-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {sub.note && (
                      <p className="font-body text-body-md text-primary mt-2">{sub.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
