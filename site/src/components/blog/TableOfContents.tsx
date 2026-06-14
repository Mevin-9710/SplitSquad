"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListTree, X } from "lucide-react";
import { TOCHeading } from "@/types/blog";

interface TableOfContentsProps {
  headings: TOCHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-50 bg-primary-container border-3 border-on-surface shadow-brutalist p-3 hover:shadow-brutalist-lg transition-all"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
        aria-label="Table of contents"
      >
        <ListTree className="w-5 h-5 text-on-surface" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-50 bg-surface-container-lowest border-l-3 border-on-surface shadow-brutalist-lg overflow-y-auto"
              style={{ borderLeftWidth: 3, borderColor: "#1a1c1c" }}
            >
              <div className="p-4 border-b-3 border-on-surface flex items-center justify-between" style={{ borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
                <h3 className="font-headline text-sm uppercase tracking-tight">On this page</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-on-surface/5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block py-1.5 font-mono text-xs uppercase transition-colors ${
                      h.level === 3 ? "pl-4" : ""
                    } ${
                      activeId === h.id
                        ? "text-on-surface font-bold"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
