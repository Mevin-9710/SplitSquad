import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "UPI Splitting", href: "/upi-expense-splitting" },
    { label: "Splitwise Alternative", href: "/splitwise-alternative" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t-3 border-on-surface bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-container border-3 border-on-surface flex items-center justify-center font-headline text-lg font-bold" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                S
              </div>
              <span className="font-headline text-xl tracking-tighter uppercase">SplitSquad</span>
            </Link>
            <p className="font-body text-sm text-on-surface-variant mb-4">
              UPI-first expense splitting for the way Indians actually pay.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/20 border-2 border-primary-container font-mono text-xs uppercase">
              <span className="w-2 h-2 bg-primary-container animate-pulse" />
              Currently in Beta
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-sm uppercase text-on-surface mb-4 tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-on-surface/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-on-surface-variant uppercase">
            © {new Date().getFullYear()} SplitSquad. All rights reserved.
          </p>
          <p className="font-mono text-xs text-on-surface-variant uppercase">
            Built for the squad, by the squad.
          </p>
        </div>
      </div>
    </footer>
  );
}
