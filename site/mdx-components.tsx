import { MDXComponents } from "mdx/types";
import { ReactNode } from "react";
import { AnimatedCounter } from "@/components/mdx/AnimatedCounter";
import { InteractiveComparison } from "@/components/mdx/InteractiveComparison";
import { AnimatedStatCard } from "@/components/mdx/AnimatedStatCard";
import { FlowDiagram } from "@/components/mdx/FlowDiagram";
import { MiniCalculator } from "@/components/mdx/MiniCalculator";
import { HighlightBox } from "@/components/mdx/HighlightBox";
import { HoverRevealCard } from "@/components/mdx/HoverRevealCard";
import { BlogFAQ } from "@/components/mdx/BlogFAQ";

function H2({ children, ...props }: { children?: ReactNode }) {
  return (
    <h2
      className="font-headline text-3xl md:text-4xl uppercase tracking-tighter leading-tight mt-16 mb-6 text-on-surface border-b-2 border-on-surface/10 pb-3"
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ children, ...props }: { children?: ReactNode }) {
  return (
    <h3
      className="font-headline text-2xl md:text-3xl uppercase tracking-tight leading-tight mt-12 mb-4 text-on-surface"
      {...props}
    >
      {children}
    </h3>
  );
}

function P({ children, ...props }: { children?: ReactNode }) {
  return (
    <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-6" {...props}>
      {children}
    </p>
  );
}

function Ul({ children, ...props }: { children?: ReactNode }) {
  return <ul className="space-y-3 mb-6 font-body text-body-lg text-on-surface-variant" {...props}>{children}</ul>;
}

function Ol({ children, ...props }: { children?: ReactNode }) {
  return <ol className="space-y-3 mb-6 font-body text-body-lg text-on-surface-variant list-decimal pl-6" {...props}>{children}</ol>;
}

function Li({ children, ...props }: { children?: ReactNode }) {
  return (
    <li className="flex items-start gap-3 before:content-[''] before:block before:w-2 before:h-2 before:bg-primary-container before:mt-2.5 before:flex-shrink-0" {...props}>
      <span>{children}</span>
    </li>
  );
}

function Blockquote({ children, ...props }: { children?: ReactNode }) {
  return (
    <blockquote
      className="border-l-3 border-primary-container pl-6 py-4 my-8 font-body text-body-lg italic text-on-surface bg-primary-container/5"
      style={{ borderLeftWidth: 3, borderColor: "#f4bd31" }}
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Strong({ children, ...props }: { children?: ReactNode }) {
  return <strong className="font-bold text-on-surface" {...props}>{children}</strong>;
}

function A({ children, href, ...props }: { children?: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="font-bold text-on-surface underline decoration-primary-container/50 hover:decoration-primary-container underline-offset-2 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function Hr() {
  return <hr className="border-t-3 border-on-surface/10 my-12" style={{ borderTopWidth: 3 }} />;
}

function Code({ children, ...props }: { children?: ReactNode }) {
  return (
    <code
      className="font-mono text-sm bg-on-surface/5 border border-on-surface/20 px-1.5 py-0.5 text-on-surface"
      {...props}
    >
      {children}
    </code>
  );
}

function Pre({ children, ...props }: { children?: ReactNode }) {
  return (
    <pre
      className="bg-on-surface text-surface p-6 border-3 border-on-surface shadow-brutalist overflow-x-auto mb-8 font-mono text-sm leading-relaxed"
      style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
      {...props}
    >
      {children}
    </pre>
  );
}

export const mdxComponents: MDXComponents = {
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  strong: Strong,
  a: A,
  hr: Hr,
  code: Code,
  pre: Pre,
  AnimatedCounter,
  InteractiveComparison,
  AnimatedStatCard,
  FlowDiagram,
  MiniCalculator,
  HighlightBox,
  HoverRevealCard,
  BlogFAQ,
};
