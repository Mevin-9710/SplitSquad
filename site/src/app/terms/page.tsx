"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedGrid } from "@/components/AnimatedGrid";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using SplitSquad (\"Service\"), you agree to these Terms of Service (\"Terms\"). If you do not agree, you must not use the Service.",
  },
  {
    title: "2. Description of Service",
    content: null,
    items: [
      "Bill splitting",
      "Shared expense tracking",
      "UPI QR code scanning",
      "Payment coordination",
      "Group expense management",
      "Community and social features (current or future)",
    ],
    note: "Features may change, expand, or be removed at any time.",
  },
  {
    title: "3. Eligibility",
    content: "You must comply with all applicable laws while using SplitSquad. You are responsible for ensuring your use of the Service is lawful in your jurisdiction.",
  },
  {
    title: "4. User Accounts",
    content: null,
    items: [
      "Email authentication",
      "Google Sign-In",
      "Other future authentication systems",
    ],
    note: "You are responsible for maintaining account security, activity under your account, and accuracy of provided information.",
  },
  {
    title: "5. Acceptable Use",
    content: "You agree not to:",
    items: [
      "Violate laws or regulations",
      "Commit fraud or impersonation",
      "Upload malicious software",
      "Harass or abuse others",
      "Spam users",
      "Share illegal, abusive, or NSFW content",
      "Infringe intellectual property rights",
      "Attempt unauthorized access to systems",
    ],
    note: "We reserve the right to investigate and take action against violations.",
  },
  {
    title: "6. Payments & Financial Disclaimer",
    content: "SplitSquad is a coordination and tracking platform and is not a bank, financial institution, or payment processor. We do not store UPI PINs, process banking credentials, or guarantee payment completion between users. Users are solely responsible for verifying transactions and payment accuracy.",
  },
  {
    title: "7. QR Code Scanning",
    content: "Camera access is used exclusively for scanning UPI and payment-related QR codes. Users are responsible for verifying scanned payment information before making transactions.",
  },
  {
    title: "8. User Content",
    content: "Users retain ownership of content they submit. By submitting content to SplitSquad, you grant us a worldwide, non-exclusive license to host, store, process, display, and distribute such content for operating and improving the Service. Public community content may be visible to other users.",
  },
  {
    title: "9. Termination",
    content: "We reserve the right to suspend or terminate accounts, remove content, restrict access, and investigate misuse. This may occur with or without notice.",
  },
  {
    title: "10. Intellectual Property",
    content: "All SplitSquad branding, software, design, and platform content are owned by SplitSquad unless otherwise stated. Users may not copy, reverse engineer, distribute, or exploit the Service without permission.",
  },
  {
    title: "11. Future Features",
    content: null,
    items: [
      "Paid subscriptions",
      "Advertising",
      "APIs",
      "Community systems",
      "AI-powered tools",
      "Integrations",
      "Monetization systems",
    ],
    note: "Additional terms may apply to specific features.",
  },
  {
    title: "12. Disclaimer of Warranties",
    content: "The Service is provided \"AS IS\" and \"AS AVAILABLE.\" We do not guarantee uninterrupted availability, accuracy, reliability, error-free operation, or financial outcomes. Use the Service at your own risk.",
  },
  {
    title: "13. Limitation of Liability",
    content: "To the maximum extent permitted by law, SplitSquad and its operators shall not be liable for indirect damages, financial losses, data loss, payment disputes, missed transactions, or service interruptions.",
  },
  {
    title: "14. Indemnification",
    content: "You agree to indemnify and hold harmless SplitSquad and its operators from claims arising from your use of the Service, your content, your violations of these Terms, and your interactions with other users.",
  },
  {
    title: "15. Governing Law",
    content: "These Terms shall be governed by the laws of India, with jurisdiction in Telangana, India.",
  },
  {
    title: "16. Changes to Terms",
    content: "We may modify these Terms at any time. Continued use of SplitSquad after updates constitutes acceptance of revised Terms.",
  },
  {
    title: "17. Contact",
    content: null,
    contactBlock: {
      name: "Mevin Joesph Seby",
      email: "mevinbuilds@gmail.com",
    },
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal direction="up">
            <span className="inline-block font-headline text-sm uppercase tracking-tight text-primary mb-4 px-3 py-1.5 bg-primary-container/10 border-2 border-primary/30">
              Terms of Service
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[72px] tracking-tighter uppercase leading-tight mb-4">
              Know the <span className="text-primary">rules</span>.
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
                  <>
                    <ul className="space-y-1.5 mt-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="font-body text-body-md text-on-surface-variant flex items-start gap-2">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary-container mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {section.note && (
                  <p className="font-body text-body-md text-primary mt-2">{section.note}</p>
                )}

                {section.contactBlock && (
                  <div className="mt-2 font-body text-body-md text-on-surface-variant">
                    <p>{section.contactBlock.name}</p>
                    <p>Email: <a href="mailto:mevinbuilds@gmail.com" className="text-primary hover:underline">{section.contactBlock.email}</a></p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
