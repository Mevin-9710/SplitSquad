import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { BetaSection } from "@/components/sections/BetaSection";
import { CTASection } from "@/components/sections/CTASection";
import { Marquee } from "@/components/Marquee";

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

export default function Home() {
  return (
    <>
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
