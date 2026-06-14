"use client";

import { useState, useRef, ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const copyCode = async () => {
    const pre = containerRef.current?.querySelector("pre");
    const text = pre?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 z-10 p-1.5 bg-surface/10 border border-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface/20 cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-surface" />
        )}
      </button>
      <div ref={containerRef}>
        {children}
      </div>
    </div>
  );
}
