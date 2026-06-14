"use client";

import { useState } from "react";
import { X, MessageCircle, Link as LinkIcon, Check } from "lucide-react";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: <X className="w-4 h-4" />,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase text-on-surface-variant mr-1">Share</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border-2 border-on-surface/40 hover:border-on-surface hover:shadow-brutalist-sm transition-all text-on-surface-variant hover:text-on-surface"
          style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="p-2 border-2 border-on-surface/40 hover:border-on-surface hover:shadow-brutalist-sm transition-all text-on-surface-variant hover:text-on-surface"
        style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
