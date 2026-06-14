"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { trackClick } from "@/lib/analytics";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-sm border-b-3 border-on-surface shadow-brutalist-sm"
          : "bg-transparent border-b-0"
      }`}
      style={{ borderWidth: scrolled ? "3px" : "0", borderColor: scrolled ? "#1a1c1c" : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className="w-8 h-8 bg-primary-container border-3 border-on-surface flex items-center justify-center font-headline text-lg font-bold"
            style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
          >
            S
          </motion.div>
          <span className="font-headline text-xl tracking-tighter uppercase text-on-surface group-hover:text-primary-container transition-colors">
            SplitSquad
          </span>
          <span className="hidden md:inline-flex ml-2 px-2 py-0.5 bg-primary-container/20 border border-primary-container text-on-surface-variant font-mono text-[10px] uppercase tracking-wider">
            Beta
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => trackClick(`nav-${link.label.toLowerCase()}`)}
              className="font-mono text-sm uppercase text-on-surface-variant hover:text-on-surface transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <Link href="/app">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-4 bg-primary-container border-3 border-on-surface px-5 py-2 font-mono text-sm uppercase text-on-surface font-bold hover:bg-primary transition-colors flex items-center gap-2 shadow-brutalist active:translate-x-1 active:translate-y-1 active:shadow-none"
              style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
            >
              Launch App
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-3 border-2 border-on-surface hover:bg-primary-container transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t-3 border-on-surface bg-surface overflow-hidden"
            style={{ borderTopWidth: 3, borderTopColor: "#1a1c1c" }}
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 font-mono text-sm uppercase text-on-surface-variant hover:text-on-surface hover:bg-primary-container/10 border-2 border-transparent hover:border-on-surface transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link href="/app" onClick={() => setIsOpen(false)}>
                  <button className="w-full mt-2 bg-primary-container border-3 border-on-surface px-5 py-3 font-mono text-sm uppercase text-on-surface font-bold shadow-brutalist">
                    Launch App →
                  </button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
