import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { BetaSection } from "@/components/sections/BetaSection";
import { CTASection } from "@/components/sections/CTASection";
import { Marquee } from "@/components/Marquee";
import { JsonLd } from "@/lib/json-ld";

const marqueeItems = [
  "Split Expenses",
  "UPI First",
  "WhatsApp Reminders",
  "Payment Verification",
  "No App Needed",
  "Free in Beta",
  "Built for India",
  "Real-Time Balances",
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SplitSquad",
  url: "https://splitsquad.qzz.io",
  logo: "https://splitsquad.qzz.io/og-image.png",
  description: "UPI-first expense splitting for trips, roommates, and group payments.",
  foundingDate: "2026",
  founder: { "@type": "Person", name: "Mevin Joseph Seby" },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SplitSquad",
  url: "https://splitsquad.qzz.io",
  description: "UPI-first expense splitting for trips, roommates, and group payments.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SplitSquad",
  operatingSystem: "Web",
  applicationCategory: "FinanceApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  description: "UPI-first expense splitting for trips, roommates, and group payments.",
};

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <HeroSection />
      <Marquee items={marqueeItems} speed={40} />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BetaSection />
      <CTASection />
    </>
  );
}
