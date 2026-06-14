"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-3 border-on-surface shadow-brutalist p-6 md:p-8 my-12 bg-primary-container/10"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
    >
      <div className="max-w-md mx-auto text-center">
        <h3 className="font-headline text-headline-md uppercase tracking-tight mb-2">
          Get splitting tips
        </h3>
        <p className="font-body text-body-md text-on-surface-variant mb-6">
          No spam. Just practical guides on managing group expenses.
        </p>
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 font-mono text-sm uppercase text-green-700 bg-green-100 border-2 border-green-700 p-3"
          >
            <Check className="w-4 h-4" />
            You&apos;re in!
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 font-body text-sm border-2 border-on-surface bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:shadow-brutalist-sm transition-shadow"
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            />
            <button
              type="submit"
              className="px-5 py-3 bg-primary-container border-3 border-on-surface shadow-brutalist-sm font-mono text-xs uppercase font-bold hover:shadow-brutalist transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
