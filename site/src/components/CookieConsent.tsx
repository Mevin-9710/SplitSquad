"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "splitsquad-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setShow(false);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
      });
    }
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setShow(false);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 z-50 bg-surface-container-lowest border-3 border-on-surface p-4 shadow-brutalist"
          style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
        >
          <p className="font-body text-body-sm text-on-surface mb-3">
            We use cookies for analytics. No tracking unless you accept.
          </p>
          <div className="flex gap-2">
            <button
              onClick={accept}
              className="flex-1 px-3 py-2 bg-primary-container border-2 border-on-surface font-headline text-xs uppercase tracking-tight shadow-brutalist-sm hover:shadow-brutalist transition-shadow"
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              Accept
            </button>
            <button
              onClick={decline}
              className="flex-1 px-3 py-2 bg-surface border-2 border-on-surface font-headline text-xs uppercase tracking-tight hover:bg-surface-container transition-colors"
              style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
